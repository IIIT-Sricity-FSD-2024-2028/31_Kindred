import { usePage } from '../../pages/runtime/PageContext.js';
import PageField from '../../pages/runtime/PageField.jsx';

export default function ResourceDonationTarget() {
  const ui=usePage(),options=ui.data('resourceOptions')[0];
  const organizations=options?.organizations || [],programs=options?.programs || [];
  const selected=organizations.find(org=>org.id===ui.values['res-org']);
  const matching=programs.filter(program=>program.org===selected?.name&&program.status==='active');
  return <section className="resource-donation-target" aria-label="Resource donation recipient">
    {ui.collections.resourceOptions?.error&&<p role="alert">Could not load recipient organizations. <button type="button" onClick={ui.refresh}>Retry</button></p>}
    <label>Recipient Organization <span aria-hidden="true">*</span><PageField as="select" field="res-org" spec={{id:'res-org',required:true,'aria-label':'Recipient Organization',disabled:!options}}><option value="">{options?'Select organization':'Loading organizations…'}</option>{organizations.map(org=><option key={org.id} value={org.id}>{org.name}</option>)}</PageField></label>
    {selected&&<div className="resource-needs-note"><strong>{selected.name} needs</strong><p>{selected.neededResources || 'No resource needs published yet. Contact the organization before donating.'}</p></div>}
    <label>Program (optional)<PageField as="select" field="rd-program" spec={{id:'rd-program','aria-label':'Program',disabled:!selected}}><option value="">{selected?'Organization-wide donation':'Select an organization first'}</option>{matching.map(program=><option key={program.id} value={program.id}>{program.name}</option>)}</PageField></label>
    {selected&&!matching.length&&<p className="field-hint">No active programs are available for this organization. Your donation will go directly to the organization.</p>}
    <details className="resource-needs-directory"><summary>See what organizations need</summary>{organizations.map(org=><article key={org.id}><strong>{org.name}</strong><p>{org.neededResources || 'No resource needs published yet.'}</p><button type="button" onClick={()=>{ui.change('res-org',org.id);ui.setValues({'rd-program':''});}}>Choose {org.name}</button></article>)}</details>
  </section>;
}
