import { useUiState } from '../../store/hooks.js';
import { useEffect } from 'react';
import Modal from '../ui/Modal.jsx';
import {usePage} from '../../pages/runtime/PageContext.js';

export default function DeliveryReview(){
 const ui=usePage(),target=ui.state.deliveryReview;
 const [detail,setDetail]=useUiState(null),[error,setError]=useUiState(''),[busy,setBusy]=useUiState(false),[confirmed,setConfirmed]=useUiState(false),[conflictConfirmed,setConflictConfirmed]=useUiState(false),[accepted,setAccepted]=useUiState(false),[revision,setRevision]=useUiState(0);
 const collection=target?.collection,id=target?.id;
 useEffect(()=>{
  if(!id)return;
  const controller=new AbortController();
  ui.requests.get(`/${collection==='replacements'?'replacements':'fulfillment/deliveries'}/${id}/brief`,{signal:controller.signal}).then(data=>{setDetail(data);setError('');setConfirmed(false);setConflictConfirmed(false);setAccepted(false);}).catch(problem=>{if(!controller.signal.aborted){setError(problem.message);setDetail(null);}});
  return ()=>controller.abort();
 },[ui.requests,collection,id,revision,setAccepted,setConfirmed,setConflictConfirmed,setDetail,setError]);
 if(!target)return null;
 const current=detail?.id===id?detail:null;
 const preferenceIssues=(current?.eligibility?.reasons||[]).filter(reason=>!current?.blockers?.includes(reason)&&!reason.startsWith('Conflicts with'));
 async function accept(){
  if(busy||!current?.available||!confirmed||current.conflicts?.length&&!conflictConfirmed)return;
  setBusy(true);setError('');
  try{await ui.requests.patch(`/${collection==='replacements'?'replacements':'fulfillment/deliveries'}/${id}/action`,{action:'accept',confirmAvailability:true,...(current.conflicts?.length?{confirmConflict:true}:{}),reviewedVersion:current.reviewedVersion});setAccepted(true);}
  catch(problem){setError(problem.message);ui.refresh();}finally{setBusy(false);}
 }
 return <Modal open title="Review delivery details" busy={busy} onClose={()=>ui.update({deliveryReview:null})}>
  {accepted?<><p role="status">You are assigned. The responsible seller or organization admin has been notified. Report pickup, progress and completion from your volunteer dashboard.</p><a className="btn-primary-sm" href="/volunteer-dashboard#resource-deliveries">Open My Deliveries</a></>:<>
   {!current&&!error&&<p role="status">Loading full delivery details...</p>}
   {current&&<>
    <h4>{current.title}</h4><p>{current.sellerName||current.orgName}</p>
    <dl className="page-record-detail"><div><dt>Pickup date and time</dt><dd>{current.scheduledDate} · {current.shiftStart}–{current.shiftEnd} · Asia/Kolkata</dd></div><div><dt>{current.kind==='replacement'?'Collect returned item from buyer':'Full pickup address'}</dt><dd>{current.pickupAddress}</dd></div><div><dt>{current.kind==='replacement'?'Seller exchange address':'Full delivery address'}</dt><dd>{current.address}</dd></div>{current.finalAddress&&<div><dt>Deliver replacement back to buyer</dt><dd>{current.finalAddress}</dd></div>}{current.contact&&<div><dt>Recipient contact</dt><dd>{current.contact}</dd></div>}</dl>
    <h4>Items and quantities</h4><ul>{current.items?.map((item,index)=><li key={index}>{item.name} — {item.quantity} {item.unit||'item(s)'}{item.condition?` · ${item.condition}`:''}</li>)}</ul>
    <p><strong>Work instructions:</strong> {current.requirements||'Collect the listed items, follow the route, report progress and upload completion proof.'}</p>{current.issue&&<p><strong>Replacement issue:</strong> {current.issue}</p>}
    {preferenceIssues.length>0&&<div className="workflow-error"><p>Your saved availability or travel preferences differ from this job:</p><ul>{preferenceIssues.map(reason=><li key={reason}>{reason}</li>)}</ul><p>You may confirm this specific job below if you can attend. Your saved preferences will stay unchanged. Any overlapping assignments are listed separately for acknowledgement.</p><a href="/volunteer-dashboard">Edit saved availability</a></div>}
    {current.conflicts?.length>0&&<div className="schedule-conflict-notice" role="note"><strong>Scheduling conflict</strong><p>This job overlaps with:</p><ul>{current.conflicts.map((title,index)=><li key={index}>{title}</li>)}</ul><label><input type="checkbox" checked={conflictConfirmed} disabled={busy||!current.available} onChange={event=>setConflictConfirmed(event.target.checked)}/> I understand this conflict and choose to take this job as well.</label></div>}
    {current.blockers?.length>0&&<div role="alert"><strong>This job cannot be accepted right now.</strong><ul>{current.blockers.map(reason=><li key={reason}>{reason}</li>)}</ul></div>}
    {!current.available&&!current.blockers?.length&&<p role="alert">This job has already been assigned or is no longer open.</p>}
    <label><input type="checkbox" checked={confirmed} disabled={!current.available||busy} onChange={event=>setConfirmed(event.target.checked)}/> I reviewed the full route and items, and I can attend this pickup window and travel for this job.</label>
    <div className="page-record-actions"><button type="button" className="btn-outline-sm" disabled={busy} onClick={()=>ui.update({deliveryReview:null})}>Back</button><button type="button" className="btn-primary-sm" disabled={busy||!current.available||!confirmed||!!current.conflicts?.length&&!conflictConfirmed} onClick={accept}>{busy?'Accepting...':current.kind==='replacement'?'Accept Replacement':'Accept Delivery'}</button></div>
   </>}
   {error&&<div role="alert"><p>{error}</p><button type="button" className="btn-outline-sm" disabled={busy} onClick={()=>{setDetail(null);setError('');setRevision(value=>value+1);}}>Reload Latest Details</button></div>}
  </>}
 </Modal>;
}
