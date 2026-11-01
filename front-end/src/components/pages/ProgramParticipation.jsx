import { useEffect, useState } from 'react';
import { usePage } from '../../pages/runtime/PageContext.js';
import Modal from '../ui/Modal.jsx';
import { workProgress } from '../../services/progress.js';

export function ProgramScheduleFields() {
  const ui=usePage();
  const fields=[['programStartDate','Start date','date'],['programShiftStart','Shift starts','time'],['programShiftEnd','Shift ends','time'],['programReportingTime','Reporting time','time'],['programInvitationDeadline','Invitation deadline','date'],['programMeetingPoint','Meeting point','text'],['programContactName','Coordinator name','text'],['programContactPhone','Coordinator phone','tel']];
  return <section className="workflow-form-section"><h3>Schedule &amp; volunteer brief</h3><p>All times are India time (Asia/Kolkata). Changes to dates, location or work require accepted members to reconfirm.</p><div className="workflow-field-grid">{fields.map(([key,label,type])=><label key={key}>{label}<input type={type} value={ui.values[key]||''} onChange={e=>ui.change(key,e.target.value)} required /></label>)}</div><label>Shift days<select multiple aria-label="Shift days" value={ui.values.programShiftDays||[]} onChange={e=>ui.change('programShiftDays',[...e.target.selectedOptions].map(o=>o.value))}>{['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day=><option key={day}>{day}</option>)}</select></label><p>Select the weekdays on which volunteers will work.</p><label>Work to be done, expected hours, equipment and support<textarea value={ui.values.programWorkBrief||''} onChange={e=>ui.change('programWorkBrief',e.target.value)} required /></label></section>;
}

export function VolunteerCandidates() {
  const ui=usePage(), [records,setRecords]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(false);
  const {programStartDate,programEndDate,programShiftStart,programShiftEnd,programShiftDays,programLocation}=ui.values;
  useEffect(()=>{
    if(!programStartDate||!programEndDate||!programShiftStart||!programShiftEnd||!programLocation)return;
    const controller=new AbortController();
    const timer=setTimeout(()=>{
      setLoading(true);setError('');
      const q=new URLSearchParams({startDate:programStartDate,endDate:programEndDate,shiftStart:programShiftStart,shiftEnd:programShiftEnd,shiftDays:(programShiftDays||[]).join(','),location:programLocation});
      ui.api.get('/participation/candidates?'+q,{signal:controller.signal}).then(setRecords).catch(e=>{if(!controller.signal.aborted)setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    },300);
    return ()=>{clearTimeout(timer);controller.abort();};
  },[ui.api,programStartDate,programEndDate,programShiftStart,programShiftEnd,programShiftDays,programLocation]);
  if(!programStartDate||!programEndDate||!programShiftStart||!programShiftEnd||!programLocation)return <p>Enter the location, dates and shift times to check volunteer suitability.</p>;
  return <div className="volunteer-candidates">{loading&&<p role="status">Checking dates, location and commitments…</p>}{error&&<p role="alert">{error}</p>}{records.filter(v=>!ui.state.searches.volunteers||[v.name,v.email,v.currentLocation,v.skills].join(' ').toLowerCase().includes(ui.state.searches.volunteers.toLowerCase())).map(v=>{
    const existing=ui.data('assignments').find(a=>a.programId===ui.state.editingProgram&&a.volunteerEmail===v.email&&['active','withdrawal_requested'].includes(a.status));
    const blocked=!v.eligible&&!existing;
    return <label className="candidate-card" key={v.id}><input type="checkbox" aria-label={v.name} checked={ui.state.selectedVolunteers.includes(v.email)} disabled={loading||ui.state.busy||blocked||!!existing} onChange={e=>ui.update({selectedVolunteers:e.target.checked?[...ui.state.selectedVolunteers,v.email]:ui.state.selectedVolunteers.filter(email=>email!==v.email)})}/><div><strong>{v.name}</strong><p>{v.email} · {(v.skills||[]).join(', ')}</p><p>{v.availableNow?'Available now':'Not available now'} · {v.currentLocation||'Location not shared'} · {v.locationUpdatedAt?new Date(v.locationUpdatedAt).toLocaleString():'No location update'}</p><p>Planned: {v.availableFrom||'not set'} to {v.availableUntil||'not set'} · {(v.availabilityDays||[]).join(', ')||'Days not set'}</p><p>Service areas: {v.serviceAreas||'not set'} · Travel: {v.willingToTravel===true?'Willing':v.willingToTravel===false?'Local areas only':'Not confirmed'}</p>{existing?<p>Accepted member. Use withdrawal/handover to remove; schedule changes require reconfirmation.</p>:<>{v.reasons?.map(reason=><p className="workflow-error" key={reason}>{reason}</p>)}{v.warnings?.map(warning=><small key={warning}>{warning}. </small>)}</>}</div></label>;
  })}</div>;
}

export default function ProgramParticipation({ showList=true }) {
  const ui=usePage(),admin=['admin','superuser'].includes(ui.session?.role);
  const [brief,setBrief]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[confirmed,setConfirmed]=useState(false),[editor,setEditor]=useState(null),[reason,setReason]=useState(''),[replacement,setReplacement]=useState('');
  const briefId=ui.state.programBriefId;
  useEffect(()=>{
    if(!briefId)return;
    const controller=new AbortController();
    ui.api.get(`/participation/programs/${encodeURIComponent(briefId)}/brief`,{signal:controller.signal}).then(data=>{setBrief(data);setConfirmed(false);setError('');}).catch(e=>{if(!controller.signal.aborted)setError(e.message);});
    return ()=>controller.abort();
  },[briefId,ui.api]);
  const execute=async(fn)=>{setBusy(true);setError('');try{await fn();ui.refresh();setEditor(null);ui.update({programBriefId:null});setBrief(null);}catch(e){setError(e.message);}finally{setBusy(false);}};
  const open=(type,record)=>{setEditor({type,record});setReason('');setReplacement('');setError('');};
  const assignments=ui.data('assignments').filter(a=>!admin||ui.data('programs').some(p=>p.id===a.programId&&p.org===ui.session.org)||ui.session.role==='superuser');
  return <>
    {showList&&<section className="workflow-section" aria-label="Program participation"><h2>{admin?'Participation & handovers':'My programs & applications'}</h2>
      {assignments.filter(a=>admin?a.status==='withdrawal_requested':true).map(a=>{
        const mine=t=>t.programId===a.programId&&t.assignedToEmail?.toLowerCase()===a.volunteerEmail?.toLowerCase();
        const tasks=ui.data('tasks').filter(mine),subtasks=ui.data('subtasks').filter(mine),progress=workProgress(tasks,subtasks);
        return <article className="page-record-card" key={a.id}><h3>{a.programName}</h3><p>{a.volunteerName} · {a.status.replaceAll('_',' ')}{a.needsReconfirmation?' · Schedule/work changed: reconfirmation required':''}</p><p>{progress.completed} of {progress.total} work items verified · {progress.percent}%</p><progress value={progress.percent} max="100" />{[...tasks,...subtasks].map(t=><p key={t.id}>{t.title}: {t.status}{t.progress!==undefined?` (${t.progress}% reported)`:''}</p>)}{a.withdrawalReason&&<p>Withdrawal: {a.withdrawalReason}</p>}{a.handoverNote&&<p>Handover: {a.handoverNote}</p>}<div className="page-record-actions">
          {!admin&&<button className="action-btn" onClick={()=>{setBrief(null);setError('');ui.update({programBriefId:a.programId});}}>Review program &amp; organization details</button>}
          {!admin&&['pending','active'].includes(a.status)&&<button className="action-btn" onClick={()=>open('withdraw',a)}>Withdraw from program</button>}
          {!admin&&a.status==='active'&&!a.needsReconfirmation&&subtasks.some(t=>!['completed','cancelled'].includes(t.status))&&<button className="action-btn" onClick={()=>ui.action('openProgressReport',[a.programId])}>Report Progress</button>}
          {!admin&&a.status==='active'&&progress.eligible&&!a.needsReconfirmation&&<button className="action-btn" onClick={()=>ui.action('downloadCertificate',[a.programId])}>Download Certificate</button>}
          {admin&&a.status==='withdrawal_requested'&&<button className="btn-primary-sm" onClick={()=>open('handover',a)}>Review &amp; complete handover</button>}
        </div>{a.history?.length>0&&<details><summary>Participation history</summary>{a.history.map((h,i)=><p key={i}>{h.action} · {new Date(h.at).toLocaleString()} · {h.note}</p>)}</details>}</article>;
      })}
      {!admin&&ui.data('applications').map(a=><article className="page-record-card" key={a.id}><h3>{a.programName}</h3><p>Application: {a.status}</p>{a.status==='pending'&&<button className="action-btn" onClick={()=>open('application',a)}>Withdraw application</button>}</article>)}
    </section>}
    <Modal open={!!briefId} title="Program brief — review before accepting" busy={busy} onClose={()=>{ui.update({programBriefId:null});setBrief(null);setError('');}}>
      {error&&<p role="alert">{error}</p>}{!brief&&!error&&<p role="status">Loading full program brief…</p>}{brief&&<><h3>{brief.program.name}</h3><p>{brief.program.description}</p><h4>Organization</h4><p>{brief.organization?.name||brief.program.org} · {brief.organization?.focus} · {brief.organization?.city}</p><p>{brief.organization?.email} · {brief.organization?.phone}</p><h4>Your work &amp; schedule</h4><p>{brief.program.workBrief||brief.program.description}</p><p>{brief.program.startDate} to {brief.program.endDate} · {(brief.program.shiftDays||[]).join(', ')||'Confirm work days with coordinator'}</p><p>Shift: {brief.program.shiftStart||'Not provided'}–{brief.program.shiftEnd||'Not provided'} · Reporting: {brief.program.reportingTime||'Confirm with coordinator'} · India time</p><p>Location: {brief.program.location} · Meeting point: {brief.program.meetingPoint||'Confirm with coordinator'}</p><p>Coordinator: {brief.program.contactName||brief.organization?.name} · {brief.program.contactPhone||brief.organization?.phone}</p><p>Skills: {(brief.program.requiredSkills||[]).join(', ')} · Respond by: {brief.program.invitationDeadline||'Contact coordinator'}</p><p>Work can be withdrawn before starting. After work starts, request withdrawal and agree a handover; verified work and hours remain recorded.</p>{brief.eligibility?.reasons?.map(r=><p className="workflow-error" key={r}>{r}</p>)}{brief.eligibility?.warnings?.map(r=><p key={r}>{r}</p>)}
      {brief.membership&&(['pending'].includes(brief.membership.status)||brief.membership.needsReconfirmation)&&<><label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> I reviewed the work and organization details and confirm I can attend these dates, times and location, including any travel.</label><div className="page-record-actions"><button className="btn-approve" disabled={busy||!confirmed||brief.eligibility?.eligible===false} onClick={()=>execute(()=>ui.api.patch(`/program-assignments/${brief.membership.id}/respond`,{action:'accepted',version:brief.program.version||1,attendanceConfirmed:true}))}>{brief.membership.needsReconfirmation?'Reconfirm revised program':'Accept Invitation'}</button>{brief.membership.status==='pending'&&<button className="btn-reject" disabled={busy} onClick={()=>execute(()=>ui.api.patch(`/program-assignments/${brief.membership.id}/respond`,{action:'declined'}))}>Decline Invitation</button>}</div></>}
      </>}
    </Modal>
    <Modal open={!!editor} title={editor?.type==='handover'?'Handover unfinished work':editor?.type==='application'?'Withdraw pending application':'Withdraw from program'} busy={busy} onClose={()=>setEditor(null)}>
      <form onSubmit={e=>{e.preventDefault();execute(()=>ui.api.patch(editor.type==='application'?`/program-applications/${editor.record.id}/withdraw`:`/participation/memberships/${editor.record.id}/${editor.type==='handover'?'handover':'withdraw'}`,{reason,...(editor.type==='handover'?{replacementEmail:replacement||undefined}:{})}));}}>
        <p>{editor?.type==='handover'?'Review pending evidence first. Completed work and approved hours stay with the original volunteer. Transfer unfinished work to another accepted member, or cancel the remainder with this note.':'If work has started, your organization must complete the handover. Completed work and approved hours will be retained.'}</p>
        <label>Reason / handover note<textarea required value={reason} onChange={e=>setReason(e.target.value)}/></label>
        {editor?.type==='handover'&&<label>Transfer unfinished work to<select value={replacement} onChange={e=>setReplacement(e.target.value)}><option value="">Cancel remaining work with this note</option>{assignments.filter(a=>a.programId===editor.record.programId&&a.id!==editor.record.id&&a.status==='active'&&!a.needsReconfirmation).map(a=><option key={a.id} value={a.volunteerEmail}>{a.volunteerName}</option>)}</select></label>}
        {error&&<p role="alert">{error}</p>}<button className="btn-primary-sm" disabled={busy} type="submit">{busy?'Saving…':'Confirm'}</button>
      </form>
    </Modal>
  </>;
}
