import { useState } from 'react';
import { usePage } from '../../pages/runtime/PageContext.js';
import Modal from '../ui/Modal.jsx';
import { writeStored } from '../../services/storage.js';

const words = value => String(value || '').replaceAll('_',' ');
const closed = ['delivered','cancelled','rejected'];
function Field({label,value,onChange,options,type='text',required=true,min}) {
 return <label className="fulfillment-field">{label}{options ? <select aria-label={label} value={value || ''} onChange={e=>onChange(e.target.value)} required={required}>{options.map(([id,text])=><option key={id} value={id}>{text}</option>)}</select> : type==='textarea' ? <textarea aria-label={label} value={value || ''} onChange={e=>onChange(e.target.value)} required={required} /> : <input aria-label={label} type={type} value={value ?? ''} min={min} onChange={e=>onChange(e.target.value)} required={required} />}</label>;
}
export default function FulfillmentPanel() {
 const ui=usePage(),role=ui.session.role,admin=['admin','superuser'].includes(role),volunteer=role==='volunteer',seller=role==='seller',beneficiary=role==='beneficiary';
 const [editor,setEditor]=useState(null),[form,setForm]=useState({}),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const requests=ui.data('resourceRequests'),inventory=ui.data('inventory'),deliveries=ui.data('deliveries');
 const loadKeys=['deliveries',...(['admin','superuser'].includes(role)?['inventory','resourceRequests']:beneficiary?['resourceRequests']:[])];
 const unavailable=loadKeys.some(key=>ui.collections[key]?.error);
 const initialLoading=loadKeys.some(key=>ui.collections[key]?.loading&&!ui.collections[key]?.scope);
 const available=!unavailable&&!initialLoading;
 const totals=inventory.reduce((sum,item)=>({available:sum.available+item.available,reserved:sum.reserved+item.reserved,distributed:sum.distributed+item.distributed}),{available:0,reserved:0,distributed:0});
 const open=(type,record={},defaults={})=>{setError('');setForm(defaults);setEditor({type,record});};
 const change=(key,value)=>setForm(previous=>({...previous,[key]:value}));
 const execute=async(fn)=>{if(busy)return;setBusy(true);setError('');try {await fn();setEditor(null);ui.refresh();}catch(e){setError(e.message);ui.refresh();}finally{setBusy(false);}};
 const sourceDelivery=(kind,id)=>deliveries.find(d=>d.kind===kind&&d.sourceId===id&&d.status!=='cancelled');
 const offer=(kind,record)=>open('offer',{kind,sourceId:record.id,title:record.resource||record.productTitle||record.category},{mode:'broadcast',volunteerEmail:''});
 const requestProgram=r=>{writeStored('kindred_resource_program_request',r);ui.navigate(`/create-program?request=${encodeURIComponent(r.id)}`);};
 const showResources=admin&&(/resources/.test(ui.path)||['resources','overview'].includes(ui.activeTab));
 const showRequests=beneficiary||(admin&&(/incoming/.test(ui.path)||['requests','overview','resources'].includes(ui.activeTab)));
 const collectionRecords=ui.data('resources').filter(r=>r.category!=='Shop Delivery'&&!inventory.some(s=>s.donationId===r.id));
 const programs=ui.data('programs').filter(p=>!editor?.record.orgName||p.org===editor.record.orgName);
 async function save(e) {
  e.preventDefault();await execute(async()=>{
   const r=editor.record,type=editor.type;
   if(type==='request') {
    const body={orgName:form.orgName,resource:form.resource,quantity:Number(form.quantity),reason:form.reason,address:form.address,phone:form.phone,name:form.name};
    if(form.photo){const file=new FormData();file.append('file',form.photo);body.photoUrl=(await ui.api.post('/fulfillment/request-image',file)).url;}
    await ui.api.post('/fulfillment/requests',body);
   }
   if(type==='respond') await ui.api.patch(`/fulfillment/requests/${r.id}/respond`,{decision:form.decision,message:form.message,programId:form.programId||undefined,allocations:form.decision==='approve'?inventory.filter(s=>s.orgName===r.orgName&&Number(form[s.id])>0).map(s=>({stockId:s.id,quantity:Number(form[s.id])})):[]});
   if(type==='message'||type==='receipt') await ui.api.patch(`/fulfillment/requests/${r.id}/${type}`,{message:form.message,programId:form.programId||undefined});
   if(type==='receive') await ui.api.post(`/fulfillment/receipts/${r.id}`,{items:r.items.map((_,index)=>({index,quantity:Number(form[index])}))});
   if(type==='offer'||type==='reoffer') {
    const body={kind:r.kind,sourceId:r.sourceId,mode:form.mode,volunteerEmail:form.mode==='direct'?form.volunteerEmail:undefined,collectionAddress:form.collectionAddress||undefined};
    if(type==='reoffer')await ui.api.patch(`/fulfillment/deliveries/${r.id}/offer`,body);else await ui.api.post('/fulfillment/deliveries',body);
   }
   if(type==='deliveryAction') await ui.api.patch(`/fulfillment/deliveries/${r.id}/action`,{action:form.action,reason:form.reason});
   if(type==='rejectProof')await ui.api.patch(`/proofs/${r.id}/reject`,{reason:form.reason});
  });
 }
 const action=(d,action)=>execute(()=>ui.api.patch(`/fulfillment/deliveries/${d.id}/action`,{action}));
 return <section id="resource-deliveries" className="workflow-section fulfillment-panel" aria-label="Resources and deliveries">
  <header className="fulfillment-header"><div><span className="fulfillment-eyebrow">{admin?'Resource management':volunteer?'Volunteer deliveries':seller?'Order fulfillment':'Community support'}</span><h2>{beneficiary?'Resource Requests':volunteer?'Delivery Offers & My Deliveries':seller?'Shop Deliveries':'Resource Inventory & Deliveries'}</h2><p>Track supplies, requests and deliveries. Volunteers accept invitations and upload proof for verification.</p></div><span className="fulfillment-header-icon" aria-hidden="true">{volunteer?'↗':'▦'}</span></header>
  {unavailable&&<div className="fulfillment-load-error" role="alert"><div><strong>Resources and deliveries could not be loaded</strong><p>Please try again. Your existing records have not been changed.</p></div><button type="button" onClick={ui.refresh}>Retry</button></div>}
  {initialLoading&&!unavailable&&<p className="fulfillment-empty" role="status">Loading resources and deliveries…</p>}
  {available&&<>
  <div className="fulfillment-summary" aria-label="Resource and delivery summary">{(admin?[[totals.available,'Available units','teal'],[totals.reserved,'Reserved units','amber'],[totals.distributed,'Distributed units','blue'],[deliveries.filter(d=>!['verified','cancelled'].includes(d.status)).length,'Active deliveries','purple']]:[[requests.length,'Resource requests','teal'],[deliveries.filter(d=>d.status==='awaiting_acceptance').length,'Awaiting acceptance','amber'],[deliveries.filter(d=>!['verified','cancelled','awaiting_acceptance'].includes(d.status)).length,'In progress','blue'],[deliveries.filter(d=>d.status==='verified').length,'Verified deliveries','purple']]).filter(([,label])=>admin||beneficiary||label!=='Resource requests').map(([value,label,tone])=><div className={`fulfillment-metric tone-${tone}`} key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
  {!editor&&error&&<p role="alert">{error}</p>}
  {beneficiary&&<button className="btn-primary-sm" onClick={()=>open('request',{}, {name:ui.session.name,quantity:1,phone:ui.session.phone||''})}>Request Resources</button>}
  {showResources&&<>
   <h3>Organization Inventory</h3><p>Only confirmed usable receipts enter stock. Approval reserves stock until delivery is verified or the request is cancelled.</p>
   <div className="inventory-table-wrap"><table className="inventory-table"><thead><tr><th>Resource</th><th>Received</th><th>Available</th><th>Reserved</th><th>Distributed</th></tr></thead><tbody>{inventory.map(s=><tr key={s.id}><td>{s.name}<small>{s.orgName} · {s.condition} · {s.programName||'Unallocated'}</small></td><td>{s.received}</td><td>{s.available}</td><td>{s.reserved}</td><td>{s.distributed}</td></tr>)}</tbody></table></div>
   {!inventory.length&&<p>No confirmed donated stock yet.</p>}
   <h3>Donations Awaiting Receipt</h3>{collectionRecords.map(r=>{const d=sourceDelivery('collection',r.id);return <article className="page-record-card" key={r.id} data-resource-id={r.id}><h4>{r.category} — {r.donorName}</h4><p>{r.items.map(i=>`${i.name} × ${i.quantity}`).join(', ')}</p><p>{r.orgName} · {d?words(d.status):words(r.status)}</p><div className="page-record-actions">{!d&&!['delivered','completed'].includes(r.status)&&<button className="btn-primary-sm" onClick={()=>offer('collection',r)}>Arrange Collection</button>}{(!d||d.status==='verified')&&<button className="btn-primary-sm" onClick={()=>open('receive',r,Object.fromEntries(r.items.map((i,n)=>[n,i.quantity])))}>Confirm Usable Receipt</button>}<button className="btn-outline-sm" onClick={()=>ui.action('allocateResource',[r.id])}>Allocate to Program</button></div></article>;})}
  </>}
  {showRequests&&<><h3>{beneficiary?'My Resource Requests':'Beneficiary Resource Requests'}</h3>{requests.map(r=>{
   const d=sourceDelivery('resource',r.id);
   return <article className="page-record-card" key={r.id} data-resource-request-id={r.id}><div className="page-record-heading"><h4>{r.resource} × {r.quantity}</h4><span className="status-badge">{words(r.status)}</span></div><p>{r.orgName} · {r.name}</p><p>{r.reason}</p><p>Approved quantity: {r.approvedQuantity} · {r.message}</p>{r.photoUrl&&<a href={r.photoUrl} target="_blank" rel="noreferrer">View supporting photo</a>}{r.programId&&<p>Program: {ui.data('programs').find(p=>p.id===r.programId)?.name||r.programId}</p>}{d&&<p>Delivery: {words(d.status)} {d.volunteerName&&`· ${d.volunteerName}`}</p>}
   {!!r.history.length&&<details><summary>Responses and updates</summary>{r.history.map((h,n)=><p key={n}>{h.message} <small>{h.at.slice(0,10)}</small></p>)}</details>}
   <div className="page-record-actions">{admin&&!closed.includes(r.status)&&<><button className="btn-primary-sm" disabled={!!d} onClick={()=>open('respond',r,{decision:'approve',message:'',programId:r.programId||'',...Object.fromEntries(r.allocations.map(a=>[a.stockId,a.quantity]))})}>Respond to Request</button><button className="btn-outline-sm" onClick={()=>requestProgram(r)}>Create Collection Program</button><button className="btn-outline-sm" onClick={()=>open('message',r,{message:'',programId:r.programId||''})}>Link Program / Send Update</button>{['approved','partially_approved'].includes(r.status)&&!d&&<button className="btn-primary-sm" onClick={()=>offer('resource',r)}>Arrange Resource Delivery</button>}</>}{beneficiary&&!closed.includes(r.status)&&<button className="btn-outline-sm" onClick={()=>open('message',r,{message:''})}>Send More Information</button>}{beneficiary&&r.status==='delivered'&&<><button className="btn-outline-sm" onClick={()=>open('receipt',r,{message:'Received, thank you.'})}>Confirm Receipt / Report Issue</button>{r.receipt&&<p>Your response: {r.receipt}</p>}</>}</div></article>;
  })}{!requests.length&&<p>No resource requests yet.</p>}</>}
  {(admin||seller)&&<><h3>Shop Orders Awaiting Delivery</h3>{ui.data('orders').filter(o=>o.deliveryStatus==='awaiting_admin_assignment'&&!sourceDelivery('order',o.id)).map(o=><article className="page-record-card" key={o.id}><h4>{o.productTitle} × {o.quantity}</h4><p>{o.id}</p><button className="btn-primary-sm" onClick={()=>offer('order',o)}>Arrange Shop Delivery</button></article>)}</>}
  <h3>{volunteer?'Available Invitations and Accepted Deliveries':'Delivery Tracking'}</h3>
  {deliveries.map(d=>{
   const manager=admin||(seller&&d.kind==='order'),mine=d.volunteerEmail?.toLowerCase()===ui.session.email.toLowerCase();
   const proof=ui.data('proofs').filter(p=>p.collection==='deliveries'&&p.recordId===d.id).at(-1);
   const canVerify=role==='superuser'||(d.kind==='order'?seller:admin);
   return <article className="page-record-card delivery-workflow-card" key={d.id} data-delivery-id={d.id}><div className="page-record-heading"><h4>{d.title}</h4><span className="status-badge">{proof?.status==='pending'?'Proof submitted':words(d.status)}</span></div><p>{d.orgName||'Shop delivery'} · {d.mode==='broadcast'?'Offered to all active volunteers':'Direct invitation'}</p><p>{d.pickupAddress} → {d.address}</p>{d.contact&&<p>Contact: {d.contact}</p>}{d.volunteerName&&<p>Volunteer: {d.volunteerName}</p>}{d.reason&&<p>Issue: {d.reason}</p>}{proof&&<p>Proof: {proof.status}{proof.rejectionReason&&` — ${proof.rejectionReason}`}</p>}
    <div className="page-record-actions">{volunteer&&d.status==='awaiting_acceptance'&&<><button className="btn-primary-sm" disabled={busy} onClick={()=>action(d,'accept')}>Accept Delivery</button><button className="btn-outline-sm" disabled={busy} onClick={()=>action(d,'decline')}>Decline Delivery</button></>}{mine&&d.status==='accepted'&&<><button className="btn-primary-sm" disabled={busy} onClick={()=>action(d,'picked_up')}>Confirm Pickup</button><button className="btn-outline-sm" onClick={()=>open('deliveryAction',d,{action:'withdraw',reason:''})}>Withdraw Before Pickup</button></>}{mine&&d.status==='picked_up'&&<button className="btn-primary-sm" disabled={busy} onClick={()=>action(d,'in_transit')}>Start Delivery</button>}{mine&&d.status==='in_transit'&&(!proof||proof.status==='rejected')&&<button className="btn-primary-sm" onClick={()=>ui.action('openWorkProof',['deliveries',d.id])}>Upload Delivery Proof</button>}{mine&&['accepted','picked_up','in_transit'].includes(d.status)&&(!proof||proof.status==='rejected')&&<button className="btn-outline-sm" onClick={()=>open('deliveryAction',d,{action:'failed',reason:''})}>Report Failed Delivery</button>}{manager&&['awaiting_acceptance','declined','withdrawn','returned'].includes(d.status)&&<button className="btn-outline-sm" onClick={()=>open('reoffer',d,{mode:'broadcast',volunteerEmail:''})}>Reassign / Broadcast</button>}{manager&&['awaiting_acceptance','declined','withdrawn','returned','accepted'].includes(d.status)&&<button className="btn-outline-sm" onClick={()=>open('deliveryAction',d,{action:'cancel',reason:''})}>Cancel Delivery</button>}{manager&&d.status==='failed'&&<button className="btn-outline-sm" onClick={()=>open('deliveryAction',d,{action:'return',reason:''})}>Confirm Return / Retry</button>}{canVerify&&proof?.status==='pending'&&<><a className="btn-outline-sm" href={proof.image} target="_blank" rel="noreferrer">View Delivery Proof</a><button className="btn-approve" disabled={busy} onClick={()=>execute(()=>ui.api.patch(`/proofs/${proof.id}/approve`,{}))}>Verify Delivery Proof</button><button className="btn-reject" onClick={()=>open('rejectProof',proof,{reason:''})}>Reject Delivery Proof</button></>}</div>
   </article>;
  })}
  {!deliveries.length&&<p>No delivery offers or deliveries yet.</p>}
  </>}
  <Modal open={!!editor} title={{request:'Request Resources',respond:'Respond to Resource Request',receive:'Confirm Usable Receipt',offer:'Arrange Delivery',reoffer:'Reassign Delivery',message:'Request Update',receipt:'Delivery Response',deliveryAction:words(form.action),rejectProof:'Reject Delivery Proof'}[editor?.type]||'Resources'} busy={busy} onClose={()=>{if(!busy)setEditor(null);}}>
   {editor&&<form className="fulfillment-form" onSubmit={save}>
    {editor.type==='request'&&<><Field label="Organization" value={form.orgName} onChange={v=>change('orgName',v)} options={ [['','Select organization'],...ui.data('organizations').map(o=>[o.name,o.name])] }/><Field label="Resource Needed" value={form.resource} onChange={v=>change('resource',v)}/><Field label="Quantity Needed" type="number" min="1" value={form.quantity} onChange={v=>change('quantity',v)}/><Field label="Reason for Request" type="textarea" value={form.reason} onChange={v=>change('reason',v)}/><Field label="Recipient Name" value={form.name} onChange={v=>change('name',v)}/><Field label="Delivery Address" type="textarea" value={form.address} onChange={v=>change('address',v)}/><Field label="Contact Phone" type="tel" value={form.phone} onChange={v=>change('phone',v)}/><label>Supporting photo (optional)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>change('photo',e.target.files?.[0])}/></label></>}
    {editor.type==='respond'&&<><Field label="Response" value={form.decision} onChange={v=>change('decision',v)} options={ [['approve','Approve / Partially Approve'],['information','Ask for More Information'],['waiting_stock','Waiting for Stock'],['reject','Reject'],['cancel','Cancel and Release Stock']] }/>{form.decision==='approve'&&<><p>Requested: {editor.record.quantity}. Enter the quantity to reserve from each suitable item.</p>{inventory.filter(s=>s.orgName===editor.record.orgName).map(s=><Field key={s.id} label={`${s.name} (available ${s.available})`} type="number" min="0" value={form[s.id]||0} onChange={v=>change(s.id,v)}/>)}</>}</>}
    {['respond','message'].includes(editor.type)&&admin&&<Field label="Related Program (optional)" value={form.programId} onChange={v=>change('programId',v)} required={false} options={ [['','No program'],...programs.map(p=>[p.id,p.name])] }/>}
    {['respond','message','receipt'].includes(editor.type)&&<Field label="Message" type="textarea" value={form.message} onChange={v=>change('message',v)}/>}
    {editor.type==='receive'&&<><p>Confirm only the usable quantity actually received. This receipt cannot be submitted twice.</p>{editor.record.items.map((item,index)=><Field key={index} label={`${item.name} (donated ${item.quantity})`} type="number" min="0" value={form[index]} onChange={v=>change(index,v)}/>)}</>}
    {['offer','reoffer'].includes(editor.type)&&<><Field label="Assignment Method" value={form.mode} onChange={v=>change('mode',v)} options={ [['broadcast','Offer to all active volunteers'],['direct','Invite a particular volunteer']] }/>{editor.record.kind!=='order'&&<Field label="Organization Collection Address (optional)" value={form.collectionAddress} onChange={v=>change('collectionAddress',v)} required={false}/>}
{form.mode==='direct'&&<Field label="Volunteer Email" value={form.volunteerEmail} onChange={v=>change('volunteerEmail',v)} options={[['','Select active volunteer'],...ui.data('deliveryVolunteers').map(v=>[v.email,`${v.name} (${v.email})`])]}/>}<p>The volunteer must accept. Broadcast deliveries go to the first volunteer who accepts.</p></>}
    {['deliveryAction','rejectProof'].includes(editor.type)&&<Field label="Reason" type="textarea" value={form.reason} onChange={v=>change('reason',v)}/>}
    {error&&<p role="alert">{error}</p>}
    <div className="page-record-actions"><button type="button" className="btn-outline-sm" disabled={busy} onClick={()=>setEditor(null)}>Cancel</button><button type="submit" className="btn-primary-sm" disabled={busy}>{busy?'Saving...':'Submit'}</button></div>
   </form>}
  </Modal>
 </section>;
}
