import { useEffect, useState } from 'react';
import { usePage } from '../../pages/runtime/PageContext.js';

export default function DeliveryPlanner({form,change, replacement=false}) {
  const ui=usePage(),[candidates,setCandidates]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(false);
  const {scheduledDate,shiftStart,shiftEnd,pickupArea,destinationArea}=form;
  useEffect(()=>{
    if(!scheduledDate||!shiftStart||!shiftEnd||!pickupArea||!destinationArea)return;
    const controller=new AbortController();
    const timer=setTimeout(()=>{setLoading(true);setError('');const q=new URLSearchParams({startDate:scheduledDate,endDate:scheduledDate,shiftStart,shiftEnd,location:`${pickupArea} -> ${destinationArea}`});ui.api.get('/participation/candidates?'+q,{signal:controller.signal}).then(setCandidates).catch(e=>{if(!controller.signal.aborted)setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});},250);
    return ()=>{clearTimeout(timer);controller.abort();};
  },[ui.api,scheduledDate,shiftStart,shiftEnd,pickupArea,destinationArea]);
  const selected=candidates.find(v=>v.email===form.volunteerEmail);
  return <section className="workflow-form-section"><h3>Schedule and suitability</h3><p>Times use Asia/Kolkata. Volunteers see both general areas before accepting. Exact addresses are shared after acceptance.</p><div className="workflow-field-grid">{[['scheduledDate','Delivery date','date'],['shiftStart','Window starts','time'],['shiftEnd','Window ends','time'],['pickupArea','Pickup area / city','text'],['destinationArea','Destination area / city','text']].map(([key,label,type])=><label key={key}>{label}<input required type={type} value={form[key]||''} onChange={e=>change(key,e.target.value)}/></label>)}</div><label>Load, transport and work instructions<textarea value={form.requirements||''} onChange={e=>change('requirements',e.target.value)} placeholder="What must be collected, handling instructions, vehicle needed"/></label>
    {!replacement&&<label>Assignment method<select aria-label="Assignment method" value={form.mode||'broadcast'} onChange={e=>change('mode',e.target.value)}><option value="broadcast">Broadcast offer</option><option value="direct">Invite a particular volunteer</option></select></label>}
    {(replacement||form.mode==='direct')&&<><label>Volunteer<select aria-label="Volunteer" required disabled={loading||!scheduledDate||!shiftStart||!shiftEnd||!pickupArea} value={form.volunteerEmail||''} onChange={e=>change('volunteerEmail',e.target.value)}><option value="">Select a suitable volunteer</option>{candidates.map(v=><option key={v.id} value={v.email} disabled={!v.eligible}>{v.name} · {v.availableNow?'Available now':'Not available now'} · {v.currentLocation||'Location unknown'}{!v.eligible?' · '+v.reasons.join('; '):''}</option>)}</select></label>{selected&&<div className="candidate-card"><div><strong>{selected.name}</strong><p>Location: {selected.currentLocation||'Not shared'} · {selected.locationUpdatedAt?new Date(selected.locationUpdatedAt).toLocaleString():'Update time unknown'}</p><p>Available: {selected.availableFrom||'Not set'} to {selected.availableUntil||'Not set'} · {(selected.availabilityDays||[]).join(', ')}</p><p>Travel: {selected.willingToTravel===true?'Willing':selected.willingToTravel===false?'Local only':'Not confirmed'} · Service areas: {selected.serviceAreas||'Not provided'}</p>{selected.reasons?.map(r=><p className="workflow-error" key={r}>{r}</p>)}{selected.warnings?.map(w=><p key={w}>{w}</p>)}</div></div>}</>}
    {loading&&<p role="status">Checking volunteer commitments…</p>}{error&&<p role="alert">{error}</p>}
  </section>;
}
