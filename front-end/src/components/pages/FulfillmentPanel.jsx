import { useUiState } from '../../store/hooks.js';
import ShopDeliveryPosting from './ShopDeliveryPosting.jsx';
import CollectionAllocator from './CollectionAllocator.jsx';
import DeliveryPlanner from './DeliveryPlanner.jsx';
import { useEffect } from 'react';
import { usePage } from '../../pages/runtime/PageContext.js';
import Modal from '../ui/Modal.jsx';
import { writeStored } from '../../services/storage.js';
import { validatePhone } from '../../services/validation.js';

const words = value => String(value || '').replaceAll('_',' ');
const closed = ['delivered','cancelled','rejected'];
function Field({label,value,onChange,options,type='text',required=true,min}) {
 return <label className="fulfillment-field">{label}{options ? <select aria-label={label} value={value || ''} onChange={e=>onChange(e.target.value)} required={required}>{options.map(([id,text])=><option key={id} value={id}>{text}</option>)}</select> : type==='textarea' ? <textarea aria-label={label} value={value || ''} onChange={e=>onChange(e.target.value)} required={required} /> : <input aria-label={label} type={type} value={value ?? ''} min={min} onChange={e=>onChange(e.target.value)} required={required} />}</label>;
}
export default function FulfillmentPanel() {
 const ui=usePage(),role=ui.session.role,admin=['admin','superuser'].includes(role),volunteer=role==='volunteer',seller=role==='seller',beneficiary=role==='beneficiary';
 const [editor,setEditor]=useUiState(null),[form,setForm]=useUiState({}),[busy,setBusy]=useUiState(false),[error,setError]=useUiState('');
 const shopArea=seller||volunteer;
 const requests=ui.data('resourceRequests'),inventory=ui.data('inventory'),deliveries=ui.data('deliveries').filter(d=>{
  if(d.kind!=='order')return true;
  if(!shopArea)return false;
  const sameEmail=value=>!!value&&value.toLowerCase()===ui.session.email.toLowerCase();
  if(role==='superuser')return true;
  if(admin)return !!ui.session.org&&d.orgName===ui.session.org;
  if(seller)return sameEmail(d.sellerEmail);
  return volunteer&&(sameEmail(d.volunteerEmail)||d.status==='awaiting_acceptance'&&(d.mode==='broadcast'||sameEmail(d.invitedEmail)));
 });
 const shopOrders=(admin||seller)&&shopArea?ui.data('orders').filter(o=>o.deliveryStatus==='awaiting_admin_assignment'):[];
 const loadKeys=['deliveries',...(['admin','superuser'].includes(role)?['inventory','resourceRequests']:beneficiary?['resourceRequests']:[])];
 const unavailable=loadKeys.some(key=>ui.collections[key]?.error);
 const initialLoading=loadKeys.some(key=>ui.collections[key]?.loading&&!ui.collections[key]?.scope);
 const available=!unavailable&&!initialLoading;
 const totals=inventory.reduce((sum,item)=>({available:sum.available+item.available,reserved:sum.reserved+item.reserved,distributed:sum.distributed+item.distributed}),{available:0,reserved:0,distributed:0});
 const open=(type,record={},defaults={})=>{setError('');setForm(defaults);setEditor({type,record});};
 const change=(key,value)=>setForm(previous=>({...previous,[key]:value}));
 const execute=async(fn)=>{if(busy)return;setBusy(true);setError('');try {await fn();setEditor(null);}catch(e){setError(e.message);ui.refresh();}finally{setBusy(false);}};
 const sourceDelivery=(kind,id)=>[...deliveries].reverse().find(d=>d.kind===kind&&d.sourceId===id&&!['cancelled','verified'].includes(d.status));
 const offer=async(kind,record,reassign=false)=>{
  const defaults={...(reassign?record:{}),mode:admin&&kind==='collection'?'direct':'broadcast',volunteerEmail:'',collectionAddress:reassign?(kind==='collection'?record.address:record.pickupAddress):''};
  if(kind==='collection'){
   setBusy(true);setError('');
   try{defaults.collectionPlan=await ui.requests.get(`/fulfillment/collections/${reassign?record.sourceId:record.id}/plan`);}
   catch(e){setError(e.message);return;}finally{setBusy(false);}
  }
  if(kind==='order'){
   setBusy(true);setError('');
   try{const addresses=await ui.requests.get(`/fulfillment/orders/${reassign?record.sourceId:record.id}/addresses`);Object.assign(defaults,{collectionAddress:addresses.pickupAddress,sellerPickupAddress:reassign?record.pickupAddress||addresses.pickupAddress:addresses.pickupAddress,buyerAddress:addresses.address,address:addresses.address});}
   catch(e){setError(e.message);return;}finally{setBusy(false);}
  }
  open(reassign?'reoffer':'offer',reassign?record:{kind,sourceId:record.id,title:record.resource||record.productTitle||record.category},defaults);
 };
 useEffect(()=>{
  const handle=event=>{const target=event.detail;const record=ui.data(target.kind==='order'?'orders':'resources').find(r=>r.id===target.id);if(record)offer(target.kind,record);};
  window.addEventListener('kindred-arrange-delivery',handle);
  return ()=>window.removeEventListener('kindred-arrange-delivery',handle);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[ui]);
 const requestProgram=r=>{writeStored('kindred_resource_program_request',r);ui.navigate(`/create-program?request=${encodeURIComponent(r.id)}`);};
 const showResources=admin&&(/resources/.test(ui.path)||['resources','overview'].includes(ui.activeTab));
 const showRequests=beneficiary||(admin&&(/incoming/.test(ui.path)||['requests','overview','resources'].includes(ui.activeTab)));
 const collectionRecords=ui.data('resources').filter(r=>r.category!=='Shop Delivery'&&!inventory.some(s=>s.donationId===r.id));
 const programs=ui.data('programs').filter(p=>!editor?.record.orgName||p.org===editor.record.orgName);
 async function save(e) {
  e.preventDefault();await execute(async()=>{
   const r=editor.record,type=editor.type;
   if(type==='help'){await ui.requests.post(`/fulfillment/orders/${r.id}/request-help`,{message:form.message});ui.toast({type:'success',title:'Your organization admin has been notified'});}
   if(type==='request') {
    validatePhone(form.phone || '');
    const body={orgName:form.orgName,resource:form.resource,quantity:Number(form.quantity),unit:form.unit||'unit',reason:form.reason,address:form.address,phone:form.phone,name:form.name};
    if(form.photo){const file=new FormData();file.append('file',form.photo);body.photoUrl=(await ui.requests.post('/fulfillment/request-image',file)).url;}
    await ui.requests.post('/fulfillment/requests',body);
   }
   if(type==='respond') await ui.requests.patch(`/fulfillment/requests/${r.id}/respond`,{decision:form.decision,message:form.message,programId:form.programId||undefined,allocations:form.decision==='approve'?inventory.filter(s=>s.orgName===r.orgName&&Number(form[s.id])>0).map(s=>({stockId:s.id,quantity:Number(form[s.id])})):[]});
   if(type==='message'||type==='receipt'||type==='issueResponse') await ui.requests.patch(`/fulfillment/requests/${r.id}/${type==='issueResponse'?'receipt':type}`,{message:form.message,programId:form.programId||undefined,action:form.action||undefined});
   if(type==='receive') await ui.requests.post(`/fulfillment/receipts/${r.id}`,{items:r.items.map((_,index)=>({index,quantity:Number(form[index])}))});
   if(type==='offer'||type==='reoffer') {
    const body={kind:r.kind,sourceId:r.sourceId,mode:form.mode,volunteerEmail:form.mode==='direct'?form.volunteerEmail:undefined,pickupAddress:r.kind==='order'?form.sellerPickupAddress:undefined,collectionAddress:form.collectionAddress||undefined,scheduledDate:form.scheduledDate,shiftStart:form.shiftStart,shiftEnd:form.shiftEnd,pickupArea:form.pickupArea,destinationArea:form.destinationArea,requirements:form.requirements};
    if(r.kind==='order'&&!form.sellerPickupAddress?.trim())throw new Error('Enter a seller pickup address or use your saved address');
    if(r.kind!=='collection'&&(!form.scheduledDate||!form.shiftStart||!form.shiftEnd))throw new Error('Choose a date and time window');
    if(type==='reoffer')await ui.requests.patch(`/fulfillment/deliveries/${r.id}/offer`,body);else await ui.requests.post('/fulfillment/deliveries',body);
   }
   if(type==='deliveryAction') await ui.requests.patch(`/fulfillment/deliveries/${r.id}/action`,{action:form.action,reason:form.reason});
   if(type==='rejectProof')await ui.requests.patch(`/proofs/${r.id}/reject`,{reason:form.reason});
  });
 }
 const action=(d,action)=>execute(()=>ui.requests.patch(`/fulfillment/deliveries/${d.id}/action`,{action}));
 return <section id="resource-deliveries" className="workflow-section fulfillment-panel" aria-label="Resources and deliveries">
  <header className="fulfillment-header"><div><span className="fulfillment-eyebrow">{admin?'Resource management':volunteer?'Volunteer deliveries':seller?'Order fulfillment':'Community support'}</span><h2>{beneficiary?'Resource Requests':volunteer?'Delivery Offers & My Deliveries':seller?'Shop Deliveries':role==='donor'?'Resource Donations & Collections':'Resource Inventory & Deliveries'}</h2><p>Track supplies, requests and deliveries. Volunteers accept invitations and upload proof for verification.</p></div><span className="fulfillment-header-icon" aria-hidden="true">{volunteer?'↗':'▦'}</span></header>
  {unavailable&&<div className="fulfillment-load-error" role="alert"><div><strong>Resources and deliveries could not be loaded</strong><p>Please try again. Your existing records have not been changed.</p></div><button type="button" onClick={ui.refresh}>Retry</button></div>}
  {initialLoading&&!unavailable&&<p className="fulfillment-empty" role="status">Loading resources and deliveries…</p>}
  {available&&<>
  <div className="fulfillment-summary" aria-label="Resource and delivery summary">{(admin?[[totals.available,'Available units','teal'],[totals.reserved,'Reserved units','amber'],[totals.distributed,'Distributed units','blue'],[deliveries.filter(d=>!['verified','cancelled'].includes(d.status)).length,'Active deliveries','purple']]:[[requests.length,'Resource requests','teal'],[deliveries.filter(d=>d.status==='awaiting_acceptance').length,'Awaiting acceptance','amber'],[deliveries.filter(d=>!['verified','cancelled','awaiting_acceptance'].includes(d.status)).length,'In progress','blue'],[deliveries.filter(d=>d.status==='verified').length,'Verified deliveries','purple']]).filter(([,label])=>admin||beneficiary||label!=='Resource requests').map(([value,label,tone])=><div className={`fulfillment-metric tone-${tone}`} key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
  {!editor&&error&&<p role="alert">{error}</p>}
  {beneficiary&&<button className="btn-primary-sm" onClick={()=>open('request',{}, {name:ui.session.name,quantity:1,phone:ui.session.phone||''})}>Request Resources</button>}
  {showResources&&<>
   <h3>Organization Inventory</h3>{role==='admin'&&<button type="button" className="btn-outline-sm" onClick={()=>ui.action('openResourceNeeds')}>Publish Resource Needs</button>}<p>Only confirmed usable receipts enter stock. Approval reserves stock until delivery is verified or the request is cancelled.</p>
   <div className="inventory-table-wrap"><table className="inventory-table"><thead><tr><th>Resource</th><th>Received</th><th>Available</th><th>Reserved</th><th>Distributed</th></tr></thead><tbody>{inventory.map(s=><tr key={s.id}><td>{s.name}<small>{s.orgName} · {s.condition} · {s.programName||'Unallocated'}</small></td><td>{s.received}</td><td>{s.available}</td><td>{s.reserved}</td><td>{s.distributed}</td></tr>)}</tbody></table></div>
   {!inventory.length&&<p>No confirmed donated stock yet.</p>}
   <h3>Donations Awaiting Receipt</h3>{collectionRecords.map(r=>{const d=sourceDelivery('collection',r.id);return <article className="page-record-card" key={r.id} data-resource-id={r.id}><h4>{r.category} — {r.donorName}</h4><p>{r.items.map(i=>`${i.name} × ${i.quantity}`).join(', ')}</p><p>{r.orgName} · {d?words(d.status):words(r.status)}</p><div className="page-record-actions">{!d&&!['delivered','completed'].includes(r.status)&&<button className="btn-primary-sm" onClick={()=>offer('collection',r)}>Allocate Volunteer</button>}{(!d||d.status==='verified')&&<button className="btn-primary-sm" onClick={()=>open('receive',r,Object.fromEntries(r.items.map((i,n)=>[n,i.quantity])))}>Confirm Usable Receipt</button>}<button className="btn-outline-sm" onClick={()=>ui.action('allocateResource',[r.id])}>Allocate to Program</button></div></article>;})}
  </>}
  {showRequests&&<><h3>{beneficiary?'My Resource Requests':'Beneficiary Resource Requests'}</h3>{requests.map(r=>{
   const d=sourceDelivery('resource',r.id);
   return <article className="page-record-card" key={r.id} data-resource-request-id={r.id}><div className="page-record-heading"><h4>{r.resource} × {r.quantity}</h4><span className="status-badge">{words(r.status)}</span></div><p>{r.orgName} · {r.name}</p><p>{r.reason}</p><p>Delivered: {r.deliveredQuantity||0} {r.unit||'unit'} - Remaining need: {r.remainingQuantity??r.quantity} - Reserved for next delivery: {r.approvedQuantity} · {r.message}</p>{r.issue&&<div className="delivery-issue"><h4>Delivery issue: {words(r.issue.status)}</h4><p>{r.issue.message}</p>{r.issue.resolution&&<p>Proposed resolution: {r.issue.resolution}</p>}{r.issue.history?.map((h,i)=><p key={i}>{h.action}: {h.message}</p>)}</div>}{r.photoUrl&&<a href={r.photoUrl} target="_blank" rel="noreferrer">View supporting photo</a>}{r.programId&&<p>Program: {ui.data('programs').find(p=>p.id===r.programId)?.name||r.programId}</p>}{d&&<p>Delivery: {words(d.status)} {d.history?.length>0&&<details><summary>Delivery history</summary>{d.history.map((h,i)=><p key={i}>{words(h.status)} - {new Date(h.at).toLocaleString()} - {h.note}</p>)}</details>}{d.volunteerName&&`· ${d.volunteerName}`}</p>}
   {admin&&r.issue&&!['closed'].includes(r.issue.status)&&<button className="btn-outline-sm" onClick={()=>open('issueResponse',r,{action:r.issue.status==='open'?'investigate':'resolve',message:''})}>Investigate / resolve delivery issue</button>}{beneficiary&&r.issue?.status==='resolved'&&<button className="btn-outline-sm" onClick={()=>open('receipt',r,{action:'close',message:''})}>Accept resolution / reopen issue</button>}{!!r.history?.length&&<details><summary>Responses and updates</summary>{r.history.map((h,n)=><p key={n}>{h.message} <small>{h.at.slice(0,10)}</small></p>)}</details>}
   <div className="page-record-actions">{admin&&!closed.includes(r.status)&&<><button className="btn-primary-sm" disabled={!!d} onClick={()=>open('respond',r,{decision:'approve',message:'',programId:r.programId||'',...Object.fromEntries(r.allocations.map(a=>[a.stockId,a.quantity]))})}>Respond to Request</button><button className="btn-outline-sm" onClick={()=>requestProgram(r)}>Create Collection Program</button><button className="btn-outline-sm" onClick={()=>open('message',r,{message:'',programId:r.programId||''})}>Link Program / Send Update</button>{['approved','partially_approved'].includes(r.status)&&!d&&<button className="btn-primary-sm" onClick={()=>offer('resource',r)}>Arrange Resource Delivery</button>}</>}{beneficiary&&!closed.includes(r.status)&&<button className="btn-outline-sm" onClick={()=>open('message',r,{message:''})}>Send More Information</button>}{beneficiary&&(r.deliveredQuantity>0||r.status==='delivered')&&<><button className="btn-outline-sm" onClick={()=>open('receipt',r,{message:'Received, thank you.',action:'received'})}>Confirm Receipt / Report Issue</button>{r.receipt&&<p>Your response: {r.receipt}</p>}</>}</div></article>;
  })}{!requests.length&&<p>No resource requests yet.</p>}</>}
  {(seller||shopOrders.length>0)&&shopArea&&<><h3>Shop Orders Awaiting Delivery</h3>{shopOrders.filter(o=>!sourceDelivery('order',o.id)).map(o=><article className="page-record-card" key={o.id}><h4>{o.productTitle} × {o.quantity}</h4><p>{o.id}</p><div className="page-record-actions"><button className="btn-primary-sm" disabled={busy} onClick={()=>offer('order',o)}>Post Delivery to Portal</button></div></article>)}</>}
  <h3>{volunteer?'Available Invitations and Accepted Deliveries':'Delivery Tracking'}</h3>
  {deliveries.map(d=>{
   const manager=admin||(seller&&d.kind==='order'),mine=d.volunteerEmail?.toLowerCase()===ui.session.email.toLowerCase();
   const proof=ui.data('proofs').filter(p=>p.collection==='deliveries'&&p.recordId===d.id).at(-1);
   const canVerify=role==='superuser'||(d.kind==='order'?seller:admin);
   return <article className="page-record-card delivery-workflow-card" key={d.id} data-delivery-id={d.id}><div className="page-record-heading"><h4>{d.title}</h4><span className="status-badge">{proof?.status==='pending'?'Proof submitted':words(d.status)}</span></div><p>{d.orgName||'Shop delivery'} · {d.mode==='broadcast'?'Posted to volunteer portal':'Direct invitation'}</p><p>{d.pickupArea&&`Pickup area: ${d.pickupArea}. `}{d.destinationArea&&`Destination area: ${d.destinationArea}. `}{d.scheduledDate&&`${d.scheduledDate}, ${d.shiftStart}-${d.shiftEnd} India time. `}{d.pickupAddress} → {d.address}</p>{d.scheduleConflicts?.length>0&&<p className="schedule-conflict-notice">Scheduling conflict acknowledged: {d.scheduleConflicts.join(', ')}</p>}{d.requirements&&<p>Work / transport: {d.requirements}</p>}{d.contact&&<p>Contact: {d.contact}</p>}{d.history?.length>0&&<details><summary>Delivery history</summary>{d.history.map((h,i)=><p key={i}>{words(h.status)} - {new Date(h.at).toLocaleString()} - {h.note}</p>)}</details>}{d.volunteerName&&<p>Volunteer: {d.volunteerName}</p>}{d.reason&&<p>Issue: {d.reason}</p>}{proof&&<><p>Proof: {proof.status}{proof.rejectionReason&&` — ${proof.rejectionReason}`}</p><a href={proof.image} target="_blank" rel="noreferrer"><img className="work-proof-image" src={proof.image} alt={`Delivery proof for ${d.title}`} /></a></>}
    <div className="page-record-actions">{volunteer&&<button type="button" className="btn-outline-sm" onClick={()=>ui.update({deliveryReview:{collection:'deliveries',id:d.id}})}>View Full Details</button>}{volunteer&&d.status==='awaiting_acceptance'&&<><button className="btn-primary-sm" disabled={busy} onClick={()=>ui.update({deliveryReview:{collection:'deliveries',id:d.id}})}>{d.mode==='broadcast'?'Apply & Accept Delivery':'Accept Delivery'}</button><button className="btn-outline-sm" disabled={busy} onClick={()=>action(d,'decline')}>Decline Delivery</button></>}{mine&&d.status==='accepted'&&<><button className="btn-primary-sm" disabled={busy} onClick={()=>action(d,'picked_up')}>Confirm Pickup</button><button className="btn-outline-sm" onClick={()=>open('deliveryAction',d,{action:'withdraw',reason:''})}>Withdraw Before Pickup</button></>}{mine&&['accepted','picked_up','in_transit'].includes(d.status)&&(!proof||proof.status==='rejected')&&<button className="btn-outline-sm" onClick={()=>open('deliveryAction',d,{action:'report',reason:''})}>{d.kind==='collection'?'Report Collection':'Report Delivery Progress'}</button>}{mine&&d.status==='picked_up'&&<button className="btn-primary-sm" disabled={busy} onClick={()=>action(d,'in_transit')}>Start Delivery</button>}{mine&&d.status==='in_transit'&&(!proof||proof.status==='rejected')&&<button className="btn-primary-sm" onClick={()=>ui.action('openWorkProof',['deliveries',d.id])}>Upload Delivery Proof</button>}{mine&&['accepted','picked_up','in_transit'].includes(d.status)&&(!proof||proof.status==='rejected')&&<button className="btn-outline-sm" onClick={()=>open('deliveryAction',d,{action:'failed',reason:''})}>Report Failed Delivery</button>}{manager&&['awaiting_acceptance','declined','withdrawn','returned'].includes(d.status)&&<button className="btn-outline-sm" onClick={()=>offer(d.kind,d,true)}>Reassign / Broadcast</button>}{manager&&['awaiting_acceptance','declined','withdrawn','returned','accepted'].includes(d.status)&&<button className="btn-outline-sm" onClick={()=>open('deliveryAction',d,{action:'cancel',reason:''})}>Cancel Delivery</button>}{manager&&d.status==='failed'&&<button className="btn-outline-sm" onClick={()=>open('deliveryAction',d,{action:'return',reason:''})}>{d.kind==='collection'?'Resolve Collection Failure / Retry':'Confirm Return / Retry'}</button>}{canVerify&&proof?.status==='pending'&&<><a className="btn-outline-sm" href={proof.image} target="_blank" rel="noreferrer">View Delivery Proof</a><button className="btn-approve" disabled={busy} onClick={()=>execute(()=>ui.requests.patch(`/proofs/${proof.id}/approve`,{}))}>Verify Delivery Proof</button><button className="btn-reject" onClick={()=>open('rejectProof',proof,{reason:''})}>Reject Delivery Proof</button></>}</div>
   </article>;
  })}
  {!deliveries.length&&<p>No delivery offers or deliveries yet.</p>}
  </>}
  <Modal open={!!editor} title={editor?.record.kind==='collection'&&['offer','reoffer'].includes(editor?.type)?'Allocate Resource Collection':{request:'Request Resources',respond:'Respond to Resource Request',receive:'Confirm Usable Receipt',offer:'Arrange Delivery',reoffer:'Reassign Delivery',message:'Request Update',receipt:'Delivery Response',issueResponse:'Resolve delivery issue',help:'Request delivery help from organization admin',deliveryAction:words(form.action),rejectProof:'Reject Delivery Proof'}[editor?.type]||'Resources'} busy={busy} onClose={()=>{if(!busy)setEditor(null);}}>
   {editor&&<form className="fulfillment-form" onSubmit={save}>
    {editor.type==='help'&&<><p>Your partner organization admin will receive this request and can invite an available volunteer for this order.</p><Field label="Message to organization admin" type="textarea" value={form.message} onChange={v=>change('message',v)}/></>}
    {editor.type==='request'&&<><Field label="Organization" value={form.orgName} onChange={v=>change('orgName',v)} options={ [['','Select organization'],...ui.data('organizations').map(o=>[o.name,o.name])] }/><Field label="Resource Needed" value={form.resource} onChange={v=>change('resource',v)}/><p>Use the exact resource name and unit. Available item names: {ui.data('resourceCatalog').filter(s=>s.orgName===form.orgName).map(s=>`${s.name} (${s.unit})`).join(', ')||'No received stock yet. You can still request help.'}</p><Field label="Unit" value={form.unit||'unit'} onChange={v=>change('unit',v)}/><Field label="Quantity Needed" type="number" min="1" value={form.quantity} onChange={v=>change('quantity',v)}/><Field label="Reason for Request" type="textarea" value={form.reason} onChange={v=>change('reason',v)}/><Field label="Recipient Name" value={form.name} onChange={v=>change('name',v)}/><Field label="Delivery Address" type="textarea" value={form.address} onChange={v=>change('address',v)}/><Field label="Contact Phone" type="tel" value={form.phone} onChange={v=>change('phone',v)}/><label>Supporting photo (optional)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>change('photo',e.target.files?.[0])}/></label></>}
    {editor.type==='respond'&&<><Field label="Response" value={form.decision} onChange={v=>change('decision',v)} options={ [['approve','Approve / Partially Approve'],['information','Ask for More Information'],['waiting_stock','Waiting for Stock'],['reject','Reject'],['cancel','Cancel and Release Stock']] }/>{form.decision==='approve'&&<><p>Still needed: {editor.record.remainingQuantity??editor.record.quantity}. Enter the quantity to reserve from each suitable item.</p>{inventory.filter(s=>s.orgName===editor.record.orgName&&s.name.trim().toLowerCase()===editor.record.resource.trim().toLowerCase()&&(s.unit||'unit')===(editor.record.unit||'unit')).map(s=><Field key={s.id} label={`${s.name} (available ${s.available})`} type="number" min="0" value={form[s.id]||0} onChange={v=>change(s.id,v)}/>)}</>}</>}
    {['respond','message'].includes(editor.type)&&admin&&<Field label="Related Program (optional)" value={form.programId} onChange={v=>change('programId',v)} required={false} options={ [['','No program'],...programs.map(p=>[p.id,p.name])] }/>}
    {['respond','message','receipt','issueResponse'].includes(editor.type)&&<Field label="Message" type="textarea" value={form.message} onChange={v=>change('message',v)}/>}
    {editor.type==='receive'&&<><p>Confirm only the usable quantity actually received. This receipt cannot be submitted twice.</p>{editor.record.items.map((item,index)=><Field key={index} label={`${item.name} (donated ${item.quantity})`} type="number" min="0" value={form[index]} onChange={v=>change(index,v)}/>)}</>}
    {['offer','reoffer'].includes(editor.type)&&editor.record.kind==='collection'&&<CollectionAllocator form={form} change={change}/>}
    {['offer','reoffer'].includes(editor.type)&&editor.record.kind==='order'&&<ShopDeliveryPosting form={form} change={change}/>}
    {['offer','reoffer'].includes(editor.type)&&editor.record.kind==='resource'&&<><DeliveryPlanner form={form} change={change}/>{editor.record.kind==='order'?<><label className="fulfillment-field">Exact seller pickup address<textarea aria-label="Exact seller pickup address" readOnly value={form.collectionAddress||''}/></label><label className="fulfillment-field">Exact buyer delivery address<textarea aria-label="Exact buyer delivery address" readOnly value={form.address||''}/></label><p>{form.collectionAddress?'Addresses are filled from the seller pickup address and the buyer checkout address.':'The seller must save their full pickup address in Seller Dashboard before you can arrange delivery.'}</p></>:<Field label="Exact Organization Collection Address" value={form.collectionAddress} onChange={v=>change('collectionAddress',v)}/>}<p>The volunteer must review the route, dates and work before accepting. Portal applications immediately assign the first suitable volunteer who applies and accepts. The seller and responsible organization admin are notified.</p></>}
    {editor.type==='receipt'&&<Field label="Response type" value={form.action} onChange={v=>change('action',v)} options={editor.record.issue?.status==='resolved'?[['close','Accept resolution and close'],['reopen','Resolution did not solve the issue']]:[['received','Confirm received'],['issue','Report missing, damaged or wrong items']]}/>}
    {editor.type==='issueResponse'&&<Field label="Issue action" value={form.action} onChange={v=>change('action',v)} options={editor.record.issue?.status==='open'?[['investigate','Begin investigation']]:[['investigate','Add investigation update'],['resolve','Propose resolution for recipient confirmation']]}/>}
    {['deliveryAction','rejectProof'].includes(editor.type)&&<Field label={form.action==='report'?(editor.record.kind==='collection'?'Collection report':'Delivery progress report'):'Reason'} type="textarea" value={form.reason} onChange={v=>change('reason',v)}/>}
    {error&&<p role="alert">{error}</p>}
    <div className="page-record-actions"><button type="button" className="btn-outline-sm" disabled={busy} onClick={()=>setEditor(null)}>Cancel</button><button type="submit" className="btn-primary-sm" disabled={busy}>{busy?'Saving...':['offer','reoffer'].includes(editor.type)?editor.record.kind==='collection'?'Allocate Volunteer':editor.record.kind==='order'?'Post to Portal':'Submit':'Submit'}</button></div>
   </form>}
  </Modal>
 </section>;
}
