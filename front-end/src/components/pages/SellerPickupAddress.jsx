import { useUiState } from '../../store/hooks.js';

import { usePage } from '../../pages/runtime/PageContext.js';

export default function SellerPickupAddress() {
  const ui=usePage();
  const seller=ui.data('sellers').find(record=>record.email?.toLowerCase()===ui.session.email?.toLowerCase());
  const [draft,setDraft]=useUiState(null),[busy,setBusy]=useUiState(false),[message,setMessage]=useUiState(''),[error,setError]=useUiState('');
  async function save(event) {
    event.preventDefault();
    if(!seller||busy)return;
    const pickupAddress=(draft??seller.pickupAddress??'').trim();
    if(!pickupAddress){setError('Enter your full pickup address.');return;}
    setBusy(true);setError('');setMessage('');
    try{await ui.requests.patch(`/sellers/${seller.id}`,{pickupAddress});setMessage('Pickup address saved. It will fill automatically when delivery is arranged.');}
    catch(e){setError(e.message);}finally{setBusy(false);}
  }
  return <section className="section-card" style={{marginBottom:24,padding:20}} aria-label="Seller pickup address">
    <h2>Pickup address</h2>
    <p>Save the exact address where volunteers should collect your shop orders. Include building or shop number, street, area, city, state and PIN code.</p>
    <form className="fulfillment-form" onSubmit={save}>
      <label className="fulfillment-field">Full seller pickup address<textarea required aria-label="Full seller pickup address" autoComplete="street-address" rows={3} value={draft??seller?.pickupAddress??''} onChange={event=>{setDraft(event.target.value);setMessage('');}} /></label>
      {error&&<p role="alert">{error}</p>}{message&&<p role="status">{message}</p>}
      <div><button className="btn-primary-sm" type="submit" disabled={busy||!seller}>{busy?'Saving...':'Save Pickup Address'}</button></div>
    </form>
  </section>;
}
