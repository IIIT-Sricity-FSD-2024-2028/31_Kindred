import { useEffect, useState } from 'react';
import { usePage } from '../../pages/runtime/PageContext.js';
import Modal from '../ui/Modal.jsx';

function RatingForm({ member, busy, save }) {
  const [score,setScore]=useState(String(member.rating?.score || ''));
  const [feedback,setFeedback]=useState(member.rating?.feedback || '');
  return <article className="program-rating-card"><h4>{member.name}</h4>
    {member.rating && <p>Rating: <strong>{member.rating.score}/5</strong>{member.rating.feedback && ` — ${member.rating.feedback}`}</p>}
    {member.canRate ? <form onSubmit={event=>{event.preventDefault();save({volunteerEmail:member.email,score:Number(score),feedback});}}>
      <label>Rating out of 5<select aria-label="Rating out of 5" required value={score} disabled={busy} onChange={event=>setScore(event.target.value)}><option value="">Choose rating</option>{[1,2,3,4,5].map(value=><option key={value} value={value}>{value}/5</option>)}</select></label>
      <label>Feedback (optional)<textarea maxLength={1000} value={feedback} disabled={busy} onChange={event=>setFeedback(event.target.value)}/></label>
      <button type="submit" className="btn-modal-save" disabled={busy}>{member.rating?'Update rating':'Save rating'}</button>
    </form> : <p>Ratings become available after all assigned tasks and subtasks are verified complete.</p>}
  </article>;
}

export default function ProgramWorkspace() {
  const ui=usePage();
  // Donation pages use ?program to choose a recipient, not a conversation.
  const communicationPage=['/org-admin.html','/org-admin-programs.html','/volunteer-dashboard.html','/volunteer-portal.html','/donor-dashboard.html','/beneficiary-dashboard.html','/seller-dashboard.html'].includes(ui.path);
  const queryProgram=communicationPage ? new URLSearchParams(ui.location.search).get('program') : null;
  const id=ui.state.programWorkspaceId || queryProgram;
  const [result,setResult]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[recipient,setRecipient]=useState(''),[message,setMessage]=useState('');
  useEffect(()=>{
    if(!id)return;
    const controller=new AbortController();
    const load=()=>ui.api.get(`/participation/programs/${encodeURIComponent(id)}/workspace`,{signal:controller.signal}).then(data=>{setResult({...data,id});setError('');}).catch(problem=>{if(!controller.signal.aborted)setError(problem.message);});
    load();const timer=setInterval(load,5000);
    return()=>{controller.abort();clearInterval(timer);};
  },[id,ui.api]);
  const data=result?.id===id?result:null;
  async function save(endpoint,body) {
    setBusy(true);setError('');
    try {
      await ui.api.post(`/participation/programs/${encodeURIComponent(id)}/${endpoint}`,body);
      if(endpoint==='messages')setMessage('');
      const next=await ui.api.get(`/participation/programs/${encodeURIComponent(id)}/workspace`);
      setResult({...next,id});ui.refresh();
    }catch(problem){setError(problem.message);}finally{setBusy(false);}
  }
  function close() {
    ui.update({programWorkspaceId:null});
    // Consume the notification link so tab changes and reloads cannot reopen it.
    if(queryProgram) {
      const search=new URLSearchParams(ui.location.search);
      search.delete('program');
      ui.navigate({pathname:ui.location.pathname,search:search.toString() ? `?${search}` : '',hash:ui.location.hash},{replace:true});
    }
    setResult(null);setError('');setMessage('');setRecipient('');
  }
  return <Modal open={Boolean(id)} title={data?.program?.name ? `${data.program.name} — Messages & ratings` : 'Program messages & ratings'} className="program-workspace-dialog" busy={busy} onClose={close}>
    {error&&<p role="alert">{error}</p>}{!data&&!error&&<p role="status">Loading program conversation…</p>}
    {data&&<div className="program-workspace"><p>Program status: <strong>{data.program.status==='paused'?'Delisted / paused':data.program.status}</strong></p>
      <section aria-label="Program messages"><h4>Messages</h4><p>Group messages reach accepted program members and organization admins. Direct messages are visible only to the sender and recipient.</p>
        <div className="program-message-history" aria-label="Message history">{!data.messages.length&&<p>No messages yet.</p>}{data.messages.map(item=><article className="program-message" key={item.id}><strong>{item.senderName}</strong><small>{item.recipientEmail ? `Direct to ${data.people.find(person=>person.email.toLowerCase()===item.recipientEmail.toLowerCase())?.name || item.recipientEmail}`:'Program group'} · {new Date(item.createdAt).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</small><p>{item.message}</p></article>)}</div>
        <form onSubmit={event=>{event.preventDefault();save('messages',{message,...(recipient?{recipientEmail:recipient}:{})});}}>
          <label>Send to<select aria-label="Send to" value={recipient} disabled={busy} onChange={event=>setRecipient(event.target.value)}><option value="">Program group</option>{data.people.filter(person=>person.email.toLowerCase()!==ui.session.email.toLowerCase()).map(person=><option key={person.email} value={person.email}>{person.name} — {person.role}</option>)}</select></label>
          <label>Message<textarea required maxLength={2000} value={message} disabled={busy} onChange={event=>setMessage(event.target.value)} placeholder="Write to your program group or selected person"/></label>
          <button type="submit" className="btn-modal-save" disabled={busy||!message.trim()}>{busy?'Saving…':'Send message'}</button>
        </form>
      </section>
      <section aria-label="Volunteer ratings"><h4>{data.canRate?'Volunteer completion ratings':'My completion rating'}</h4>{data.canRate ? data.members.map(member=><RatingForm key={member.email} member={member} busy={busy} save={body=>save('ratings',body)}/>) : data.members.filter(member=>member.email.toLowerCase()===ui.session.email.toLowerCase()).map(member=><p key={member.email}>{member.rating?`${member.rating.score}/5 — ${member.rating.feedback || 'No written feedback'}`:'No rating yet. Your organization can rate your work after verified completion.'}</p>)}</section>
    </div>}
  </Modal>;
}
