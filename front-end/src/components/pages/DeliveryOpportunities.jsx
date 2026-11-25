import {usePage} from '../../pages/runtime/PageContext.js';

export default function DeliveryOpportunities(){
  const ui=usePage();
  if(ui.session?.role!=='volunteer')return null;
  const deliveries=ui.data('deliveries').filter(d=>d.mode==='broadcast'&&d.status==='awaiting_acceptance');
  const replacements=ui.data('replacements').filter(r=>r.mode==='broadcast'&&r.status==='portal_open');
  const failed=ui.collections.deliveries?.error||ui.collections.replacements?.error;
  return <section className="workflow-section" id="resource-deliveries" aria-label="Delivery and replacement opportunities">
    <h2>Delivery &amp; replacement opportunities</h2>
    <p>Review both areas, the date and the work before applying. Apply &amp; Accept opens the full details for review. Confirming acceptance assigns you if the job is still open and you have no conflicting assignments. One volunteer handles each job. Open View Full Details to review exact addresses, items and instructions before accepting.</p>
    {failed&&<p role="alert">Delivery opportunities could not be loaded. <button type="button" onClick={ui.refresh}>Retry</button></p>}

    {deliveries.map(d=><article className="page-record-card" key={d.id} data-portal-delivery-id={d.id}>
      <h3>{d.title}</h3><p>{d.orgName||'Shop delivery'} · {d.kind==='order'?'Shop delivery':d.kind==='collection'?'Donor resource collection':'Resource delivery'}</p>
      <p>{d.pickupArea} → {d.destinationArea}</p><p>{d.scheduledDate} · {d.shiftStart}–{d.shiftEnd} India time</p>
      {d.requirements&&<p>{d.requirements}</p>}
      <button type="button" className="btn-outline-sm" onClick={()=>ui.update({deliveryReview:{collection:'deliveries',id:d.id}})}>View Full Details</button>
      <button type="button" className="btn-primary-sm" onClick={()=>ui.update({deliveryReview:{collection:'deliveries',id:d.id}})}>Apply &amp; Accept Delivery</button>
    </article>)}
    <div id="replacement-opportunities">{replacements.map(r=><article className="page-record-card" key={r.id} data-portal-replacement-id={r.id}>
      <h3>Replacement: {r.productTitle}</h3><p>{r.organizationName} · {r.sellerName} · {r.quantity||1} item(s)</p>
      <p>{r.schedule?.location}</p><p>{r.schedule?.startDate} · {r.schedule?.shiftStart}–{r.schedule?.shiftEnd} India time</p>
      <p>Collect the buyer’s returned item, return it to the seller and deliver the replacement to the buyer.</p>{r.requirements&&<p>{r.requirements}</p>}
      <button type="button" className="btn-outline-sm" onClick={()=>ui.update({deliveryReview:{collection:'replacements',id:r.id}})}>View Full Details</button>
      <button type="button" className="btn-primary-sm" onClick={()=>ui.update({deliveryReview:{collection:'replacements',id:r.id}})}>Apply &amp; Accept Replacement</button>
    </article>)}</div>
    {!failed&&!deliveries.length&&!replacements.length&&<p>No open delivery or replacement opportunities right now.</p>}
  </section>;
}
