import { usePage } from '../../pages/runtime/PageContext.js';

export default function PublicOrganizationFunding() {
  const ui = usePage();
  if (ui.path !== '/organization-details.html' || !ui.organization) return null;
  const result = ui.collections.organizationTotals;
  const totals = ui.data('organizationTotals').find((o) => o.orgId === ui.organization.id);
  return <section className="organization-funding-summary" aria-label="Organization donation totals"><h2>Donations to {ui.organization.name}</h2>
    {result?.error ? <p role="alert">{result.error} <button onClick={ui.refresh}>Retry</button></p> : result?.loading ? <p role="status">Loading donation totals…</p> : <><p className="organization-funding-amount">INR {Number(totals?.total || 0).toLocaleString('en-IN')}</p><p>{totals?.count || 0} recorded donation(s) to this organization.</p></>}
    <p className="field-hint">Card demo totals. No money has been charged or transferred.</p><button className="program-donate-button" onClick={() => ui.action('openDonation',[ui.organization.name])}>Donate to {ui.organization.name}</button>
  </section>;
}
