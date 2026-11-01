import { useState } from 'react';
import { usePage } from '../../pages/runtime/PageContext.js';

export default function VolunteerPresence() {
  const ui = usePage();
  const volunteer = ui.data('volunteer')[0];
  const [location, setLocation] = useState(null);
  const [draft,setDraft]=useState({});
  const planned=key=>draft[key]??volunteer?.[key]??'';
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function save(patch) {
    setSaving(true); setMessage(''); setError('');
    try {
      const saved = await ui.api.patch('/volunteers/me/presence', patch);
      ui.replaceCollection('volunteer', saved);
      if ('currentLocation' in patch) setLocation(null);
      setMessage('Saved. Organization admins can see your availability and location.');
    } catch (problem) { setError(problem.message); }
    finally { setSaving(false); }
  }
  const ready = Boolean(volunteer) && !saving;
  return <section className="volunteer-presence" aria-labelledby="volunteer-presence-title">
    <div className="volunteer-presence-heading"><div><h2 id="volunteer-presence-title">Availability &amp; current location</h2><p>Let your organization know when and where you can help.</p></div>
      <button type="button" role="switch" aria-checked={Boolean(volunteer?.availableNow)} aria-label="Available now" disabled={!ready} className={`presence-toggle ${volunteer?.availableNow ? 'is-available' : ''}`} onClick={() => save({ availableNow: !volunteer.availableNow })}><span className="presence-toggle-track"><span /></span>{volunteer?.availableNow ? 'Available now' : 'Not available now'}</button>
    </div>
    <form className="volunteer-location-form" onSubmit={(event) => { event.preventDefault(); if (ready) save({ currentLocation: (location ?? volunteer.currentLocation ?? '').trim() }); }}>
      <div><label htmlFor="volunteer-current-location">Current location</label><input id="volunteer-current-location" maxLength={200} placeholder="e.g. Andheri East, Mumbai" value={location ?? volunteer?.currentLocation ?? ''} disabled={!ready} onChange={(event) => setLocation(event.target.value)} /></div>
      <button type="submit" className="btn-primary-sm" disabled={!ready}>{saving ? 'Saving…' : 'Save location'}</button>
    </form>
    <p className="presence-location-note">Share your current area or meeting point. Clear and save to remove it.{volunteer?.locationUpdatedAt && <> Last updated: {new Date(volunteer.locationUpdatedAt).toLocaleString()}.</>}</p>
    <form className="workflow-form-section" onSubmit={e=>{e.preventDefault();save({availableFrom:planned('availableFrom'),availableUntil:planned('availableUntil'),serviceAreas:planned('serviceAreas'),willingToTravel:!!(draft.willingToTravel??volunteer?.willingToTravel),availabilityDays:draft.availabilityDays??volunteer?.availabilityDays??[]});}}>
      <h3>Planned availability &amp; travel</h3><p>These preferences are checked against proposed program shifts and deliveries. Available now does not reserve a future shift.</p>
      <div className="workflow-field-grid">{[['availableFrom','Available from','date'],['availableUntil','Available until','date'],['serviceAreas','Service areas (comma separated)','text']].map(([key,label,type])=><label key={key}>{label}<input disabled={!ready} type={type} value={planned(key)} onChange={e=>setDraft({...draft,[key]:e.target.value})}/></label>)}</div>
      <label>Available weekdays<select multiple aria-label="Available weekdays" disabled={!ready} value={draft.availabilityDays??volunteer?.availabilityDays??[]} onChange={e=>setDraft({...draft,availabilityDays:[...e.target.selectedOptions].map(o=>o.value)})}>{['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d=><option key={d}>{d}</option>)}</select></label>
      <label><input type="checkbox" disabled={!ready} checked={!!(draft.willingToTravel??volunteer?.willingToTravel)} onChange={e=>setDraft({...draft,willingToTravel:e.target.checked})}/> Willing to travel outside my service areas</label>
      <button type="submit" className="btn-primary-sm" disabled={!ready}>Save planned availability</button>
    </form>
    {ui.collections.volunteer?.error && <p role="alert">{ui.collections.volunteer.error} <button type="button" onClick={ui.refresh}>Retry</button></p>}
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
  </section>;
}
