export default function ShopDeliveryPosting({form,change,replacement=false}){
 return <section className="workflow-form-section">
  <h3>{replacement?'Post replacement pickup':'Post delivery to volunteer portal'}</h3>
  <p>The first eligible volunteer who chooses Apply &amp; Accept gets this job. The volunteer reports pickup, delivery progress and completion proof to you.</p>
  <label>Seller pickup / exchange address<textarea aria-label="Seller pickup / exchange address" required rows={3} value={form.sellerPickupAddress||''} onChange={event=>change('sellerPickupAddress',event.target.value)}/></label>
  <p>Your saved pickup address is filled in when available. You can enter a different address for this job.</p>
  <label>{replacement?'Buyer return pickup address':'Buyer delivery address'}<textarea aria-label={replacement?'Buyer return pickup address':'Buyer delivery address'} readOnly rows={3} value={form.buyerAddress||''}/></label>
  <p>The buyer address comes from checkout.</p>
  <div className="workflow-field-grid">{[['scheduledDate','Pickup date','date'],['shiftStart','Pickup window starts','time'],['shiftEnd','Pickup window ends','time']].map(([key,label,type])=><label key={key}>{label}<input required type={type} value={form[key]||''} onChange={event=>change(key,event.target.value)}/></label>)}</div>
  <label>Handling and delivery instructions (optional)<textarea value={form.requirements||''} onChange={event=>change('requirements',event.target.value)}/></label>
 </section>;
}
