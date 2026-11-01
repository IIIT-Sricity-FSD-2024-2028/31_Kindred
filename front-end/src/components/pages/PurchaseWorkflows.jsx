import { useState } from 'react';
import { usePage } from '../../pages/runtime/PageContext.js';
import Modal from '../ui/Modal.jsx';
import DeliveryPlanner from './DeliveryPlanner.jsx';

export default function PurchaseWorkflows() {
  const ui=usePage(),[editor,setEditor]=useState(null),[form,setForm]=useState({}),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const role=ui.session?.role,admin=['admin','superuser'].includes(role),seller=role==='seller',volunteer=role==='volunteer';
  if(!ui.session)return null;
  const purchases=ui.data('buyerOrders'),claims=[...new Map([...ui.data('replacements'),...ui.data('buyerReplacements')].map(r=>[r.id,r])).values()];
  const open=(type,record,defaults={})=>{setError('');setForm({reason:'',...defaults});setEditor({type,record});};
  const change=(key,value)=>setForm(prev=>({...prev,[key]:value}));
  async function execute(fn){setBusy(true);setError('');try{await fn();ui.refresh();setEditor(null);}catch(e){setError(e.message);}finally{setBusy(false);}}
  async function submit(event){event.preventDefault();await execute(async()=>{
    const r=editor.record;
    if(editor.type==='cancelOrder')await ui.api.patch(`/orders/${r.id}/cancel`,{reason:form.reason});
    else if(editor.type==='claim') {if(!form.photo)throw new Error('Upload a photo of the issue');const upload=new FormData();upload.append('file',form.photo);const image=await ui.api.post('/replacements/upload-image',upload);await ui.api.post('/replacements',{orderId:r.id,buyerEmail:ui.session.email,buyerName:ui.session.name,quantity:Number(form.quantity),reason:form.reason,description:form.description,imageUrl:image.url});}
    else if(editor.type==='invite'){if(!form.volunteerEmail)throw new Error('Select a volunteer');const v=ui.data('deliveryVolunteers').find(v=>v.email===form.volunteerEmail);await ui.api.patch(`/replacements/${r.id}/assign-volunteer`,{volunteerEmail:form.volunteerEmail,volunteerName:v?.name||form.volunteerEmail,schedule:{startDate:form.scheduledDate,endDate:form.scheduledDate,shiftStart:form.shiftStart,shiftEnd:form.shiftEnd,location:form.pickupArea,timeZone:'Asia/Kolkata'},pickupArea:form.pickupArea,destinationArea:form.destinationArea,requirements:form.requirements});}
    else if(editor.type==='reject')await ui.api.patch(`/replacements/${r.id}/reject`,{reason:form.reason});
    else await ui.api.patch(`/replacements/${r.id}/action`,{action:editor.type,reason:form.reason});
  });}
  return <section className="workflow-section purchase-workflows" aria-label="Purchases and replacements"><h2>My Purchases</h2><p>Orders and balances use the payment demonstration. Cancelling before pickup restores stock and reverses the recorded sale; no bank refund is performed.</p>
    {ui.collections.buyerOrders?.error&&<p role="alert">{ui.collections.buyerOrders.error} <button onClick={ui.refresh}>Retry</button></p>}
    {!purchases.length&&<p>No purchases yet.</p>}{purchases.map(o=><article className="page-record-card" key={o.id}><h3>{o.productTitle}</h3><p>{o.id} · {o.quantity} item(s) · INR {o.total}</p><p>{o.deliveryStatus.replaceAll('_',' ')} · Payment: {o.paymentStatus}</p><p>{o.address}</p>{o.cancellationReason&&<p>Cancelled: {o.cancellationReason}</p>}<div className="page-record-actions">{['awaiting_admin_assignment','assigned'].includes(o.deliveryStatus)&&<button className="action-btn" onClick={()=>open('cancelOrder',o)}>Cancel purchase</button>}{o.deliveryStatus==='delivered'&&!claims.some(r=>r.orderId===o.id&&!['rejected','cancelled'].includes(r.status))&&<button className="action-btn" onClick={()=>open('claim',o,{quantity:o.quantity,description:''})}>Request Replacement</button>}</div></article>)}
    {(admin||seller)&&ui.data('orders').filter(o=>['awaiting_admin_assignment','assigned'].includes(o.deliveryStatus)&&!purchases.some(p=>p.id===o.id)).map(o=><article className="page-record-card" key={`managed-${o.id}`}><h3>Order to fulfill: {o.productTitle}</h3><p>{o.id} · {o.deliveryStatus.replaceAll('_',' ')}</p><button className="action-btn" onClick={()=>open('cancelOrder',o)}>Cancel order &amp; reverse demo sale</button></article>)}
    <h2>Replacement Requests</h2>{!editor&&error&&<p role="alert">{error}</p>}{claims.map(r=>{
      const mine=r.assignedVolunteerEmail?.toLowerCase()===ui.session.email.toLowerCase();
      const manager=admin||seller&&ui.data('sellers').some(s=>s.id===r.sellerId&&s.email?.toLowerCase()===ui.session.email.toLowerCase());
      return <article className="page-record-card replacement-record-card" data-replacement-id={r.id} key={r.id}><h3>{r.productTitle}</h3><p>{r.status.replaceAll('_',' ')} · {r.quantity||1} replacement item(s)</p><p>{r.reason}: {r.description}</p>{r.imageUrl&&<a href={r.imageUrl} target="_blank" rel="noreferrer">View issue photo</a>}<p>{r.reasonForStatus}</p>{r.schedule&&<p>Pickup area: {r.schedule.location} · {r.schedule.startDate} · {r.schedule.shiftStart}–{r.schedule.shiftEnd} India time · Destination area: {r.destinationArea||'Confirm with seller'}</p>}{r.requirements&&<p>{r.requirements}</p>}{r.status!=='volunteer_invited'&&<p>Buyer pickup: {r.pickupAddress||'Confirm with coordinator'} · Seller return point: {r.returnAddress||'Confirm with coordinator'}</p>}<div className="page-record-actions">
        {manager&&r.status==='requested'&&<><button className="btn-approve" disabled={busy} onClick={()=>execute(()=>ui.api.patch(`/replacements/${r.id}/approve`,{}))}>Approve &amp; reserve stock</button><button className="btn-reject" onClick={()=>open('reject',r)}>Reject claim</button></>}
        {manager&&r.status==='approved'&&<button className="action-btn" onClick={()=>open('invite',r)}>Invite pickup volunteer</button>}
        {manager&&['requested','approved','volunteer_invited','volunteer_assigned'].includes(r.status)&&<button className="action-btn" onClick={()=>open('cancel',r)}>Cancel replacement</button>}
        {manager&&r.status==='failed'&&<button className="action-btn" onClick={()=>open('return',r)}>Confirm all goods returned / retry</button>}
        {volunteer&&mine&&r.status==='volunteer_invited'&&<><p>Review the schedule and instructions. Accept only if you can attend and travel to both areas.</p><button className="btn-approve" disabled={busy} onClick={()=>execute(()=>ui.api.patch(`/replacements/${r.id}/action`,{action:'accept'}))}>Accept replacement pickup</button><button className="btn-reject" onClick={()=>open('decline',r)}>Decline pickup</button></>}
        {volunteer&&mine&&r.status==='volunteer_assigned'&&<><button className="action-btn" disabled={busy} onClick={()=>execute(()=>ui.api.patch(`/replacements/${r.id}/status`,{status:'return_pickup'}))}>Confirm return pickup</button><button className="action-btn" onClick={()=>open('withdraw',r)}>Withdraw before pickup</button></>}
        {volunteer&&mine&&r.status==='return_pickup'&&<button className="action-btn" disabled={busy} onClick={()=>execute(()=>ui.api.patch(`/replacements/${r.id}/status`,{status:'replacement_in_transit'}))}>Replacement out for delivery</button>}
        {volunteer&&mine&&r.status==='replacement_in_transit'&&<button className="action-btn" onClick={()=>ui.action('openWorkProof',['replacements',r.id])}>Upload replacement delivery proof</button>}
        {volunteer&&mine&&['volunteer_assigned','return_pickup','replacement_in_transit'].includes(r.status)&&<button className="action-btn" onClick={()=>open('failed',r)}>Report replacement failure</button>}
      </div>{r.history?.length>0&&<details><summary>Replacement history</summary>{r.history.map((h,i)=><p key={i}>{h.action} · {new Date(h.at).toLocaleString()} · {h.reason}</p>)}</details>}</article>;
    })}
    <Modal open={!!editor} title={editor?.type==='claim'?'Request replacement':editor?.type==='invite'?'Arrange replacement pickup':editor?.type==='cancelOrder'?'Cancel purchase':`${editor?.type||''} replacement`} busy={busy} onClose={()=>setEditor(null)}>
      <form onSubmit={submit}>{editor?.type==='invite'?<DeliveryPlanner form={form} change={change} replacement/>:<label>Reason<textarea required value={form.reason||''} onChange={e=>change('reason',e.target.value)}/></label>}{editor?.type==='claim'&&<><label>Quantity<input required type="number" min="1" max={editor.record.quantity} value={form.quantity} onChange={e=>change('quantity',e.target.value)}/></label><label>Issue details<textarea required value={form.description||''} onChange={e=>change('description',e.target.value)}/></label><label>Issue photo<input required type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>change('photo',e.target.files?.[0])}/></label></>}{error&&<p role="alert">{error}</p>}<button className="btn-primary-sm" type="submit" disabled={busy}>{busy?'Saving…':'Confirm'}</button></form>
    </Modal>
  </section>;
}
