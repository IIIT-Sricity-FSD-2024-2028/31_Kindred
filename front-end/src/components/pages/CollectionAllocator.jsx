export default function CollectionAllocator({form,change}){
  const plan=form.collectionPlan;
  return <section className="workflow-form-section">
    <h3>Donor pickup details</h3>
    <p><strong>Pickup address:</strong> {plan.pickupAddress}</p>
    <p><strong>Pickup:</strong> {plan.pickupDate} · {plan.pickupTimeSlot} (India time)</p>
    <p><strong>Recipient:</strong> {plan.address}</p>{plan.programName&&<p><strong>Program:</strong> {plan.programName}</p>}
    <p>The donor already supplied these details. Allocate one available volunteer based on their current location and the donor pickup slot. The volunteer confirms pickup, reports the collection and submits proof for organization verification.</p>
    <label>Volunteer<select aria-label="Volunteer" required value={form.volunteerEmail||''} onChange={event=>change('volunteerEmail',event.target.value)}><option value="">Select an available volunteer</option>{plan.candidates.map(v=><option key={v.id} value={v.email} disabled={!v.eligible}>{v.name} ? {v.currentLocation||'Location not set'}{!v.eligible?' ? '+v.reasons.join('; '):''}{v.conflicts?.length?' ? Conflict: '+v.conflicts.join(', '):''}</option>)}</select></label>
    <label>Collection instructions (optional)<textarea value={form.requirements||''} onChange={event=>change('requirements',event.target.value)} placeholder="Items to collect, handling instructions or handover contact"/></label>
  </section>;
}
