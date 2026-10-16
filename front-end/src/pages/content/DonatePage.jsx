import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageModal, PageRegion } from '../runtime/PageElements.jsx';

export default function DonatePage() {
  const ui = usePage();
  return <>
   <main data-react-page="/donate.html">
   {ui.session && new URLSearchParams(ui.location.search).get('org') && <section className="selected-donation-org page-record-card"><h2>Donate to {new URLSearchParams(ui.location.search).get('org')}</h2><button className="btn-primary-sm" onClick={() => ui.action('openDonation',[new URLSearchParams(ui.location.search).get('org')])}>Donate by Card</button></section>}
   <section {...ui.props("donate-hero", {"className": "page-hero donate-hero", "id": "donate-hero"})}>
     {ui.content("donate-hero", <>
     <h1 {...ui.props("donate-hero-title", {"id": "donate-hero-title"})}>
       {ui.content("donate-hero-title", <>
       {"Make a Donation"}
       </>)}
     </h1>
     <p {...ui.props("donate-hero-subtitle", {"id": "donate-hero-subtitle"})}>
       {ui.content("donate-hero-subtitle", <>
       {"Sign in as a Donor to make a direct impact. 100% of your donation goes to the cause. "}
       </>)}
     </p>
     <div {...ui.props("donate-hero-actions", {"className": "hero-actions", "id": "donate-hero-actions"})}>
       {ui.content("donate-hero-actions", <>
       <Link {...ui.props("hero-signin-btn", {"className": "btn-primary btn-green", "id": "hero-signin-btn", "actionLabel": "🔒 Sign In to\n        Donate", "to": "/signin.html?redirect=donate.html"})}>
         {ui.content("hero-signin-btn", <>
         {"🔒 Sign In to Donate"}
         </>)}
       </Link>
       {" "}
       <a {...ui.props("donate-6", {"href": "#browse-orgs", "className": "btn-secondary btn-ghost-white", "actionLabel": "♡ Browse Campaigns as Guest"})}>
         {"♡ Browse Campaigns as Guest"}
       </a>
       </>)}
     </div>
     </>)}
   </section>
   <section {...ui.props("donate-7", {"className": "donate-section"})}>
     <div {...ui.props("donate-8", {"className": "donate-container"})}>
       <div {...ui.props("donate-9", {"className": "donate-options-grid"})}>
         <div {...ui.props("signin-donate-card", {"className": "donate-option-card", "id": "signin-donate-card"})}>
           {ui.content("signin-donate-card", <>
           {ui.session?.role === "donor" ? <PageRegion name="donorWelcome" /> : <>
           <div {...ui.props("donate-11", {"className": "option-icon dark-icon"})}>
             {"🔒"}
           </div>
           <h3 {...ui.props("donate-12", {})}>
             {"Sign In & Donate"}
           </h3>
           <p {...ui.props("donate-13", {"className": "option-desc"})}>
             {"Create a Donor account or sign in to track your donations, receive tax receipts (80G), view impact metrics, and manage recurring contributions."}
           </p>
           <ul {...ui.props("donate-14", {"className": "feature-list"})}>
             <li {...ui.props("donate-15", {})}>
               {"✔ 80G tax-compliant receipts"}
             </li>
             <li {...ui.props("donate-16", {})}>
               {"✔ Track all donation history"}
             </li>
             <li {...ui.props("donate-17", {})}>
               {"✔ Set up recurring donations"}
             </li>
             <li {...ui.props("donate-18", {})}>
               {"✔ View your personal impact"}
             </li>
             <li {...ui.props("donate-19", {})}>
               {"✔ Exclusive donor updates"}
             </li>
           </ul>
           <Link {...ui.props("donate-20", {"className": "btn-primary block-btn", "actionLabel": "🔒 Sign In to Donate", "to": "/signin.html?redirect=donate.html"})}>
             {"🔒 Sign In to Donate"}
           </Link>
           <p {...ui.props("donate-21", {"className": "new-donor-text"})}>
             {"New donor? "}
             <Link {...ui.props("donate-22", {"actionLabel": "Create a free account", "to": "/signup.html"})}>
               {"Create a free account"}
             </Link>
           </p>
           </>}
           </>)}
         </div>
         <div {...ui.props("donate-23", {"className": "donate-option-card"})}>
           <div {...ui.props("donate-24", {"className": "option-icon green-icon"})}>
             {"♡"}
           </div>
           <h3 {...ui.props("donate-25", {})}>
             {"Donate as Guest"}
           </h3>
           <p {...ui.props("donate-26", {"className": "option-desc"})}>
             {"No account needed. Browse active fundraising campaigns and donate directly using UPI, card, or bank transfer — quickly and securely."}
           </p>
           <ul {...ui.props("donate-27", {"className": "feature-list"})}>
             <li {...ui.props("donate-28", {})}>
               {"✔ No sign-up required"}
             </li>
             <li {...ui.props("donate-29", {})}>
               {"✔ UPI / GPay / PhonePe"}
             </li>
             <li {...ui.props("donate-30", {})}>
               {"✔ Credit & debit cards"}
             </li>
             <li {...ui.props("donate-31", {})}>
               {"✔ Net banking"}
             </li>
             <li {...ui.props("donate-32", {})}>
               {"✔ Instant confirmation"}
             </li>
           </ul>
           <a {...ui.props("donate-33", {"href": "#browse-orgs", "className": "btn-primary block-btn", "style": {"background": "#0f766e", "borderColor": "#0f766e"}, "actionLabel": "Browse\n            Organizations"})}>
             {"Browse Organizations"}
           </a>
         </div>
         <div {...ui.props("donate-34", {"className": "donate-option-card"})}>
           <div {...ui.props("donate-35", {"className": "option-icon", "style": {"color": "#f59e0b", "background": "#fef3c7"}})}>
             {"📦"}
           </div>
           <h3 {...ui.props("donate-36", {})}>
             {"Donate Resources"}
           </h3>
           <p {...ui.props("donate-37", {"className": "option-desc"})}>
             {"Give back by donating food, clothing, medical supplies, and other essential items directly to NGOs."}
           </p>
           <ul {...ui.props("donate-38", {"className": "feature-list"})}>
             <li {...ui.props("donate-39", {})}>
               {"✔ Verified pick-up"}
             </li>
             <li {...ui.props("donate-40", {})}>
               {"✔ Direct to beneficiaries"}
             </li>
             <li {...ui.props("donate-41", {})}>
               {"✔ Various categories"}
             </li>
             <li {...ui.props("donate-42", {})}>
               {"✔ Zero monetary cost"}
             </li>
             <li {...ui.props("donate-43", {})}>
               {"✔ Real-time tracking"}
             </li>
           </ul>
           <button {...ui.props("donate-44", {"className": "btn-primary block-btn", "style": {"background": "#f59e0b", "borderColor": "#f59e0b"}, "type": "button", "actionLabel": "📦 Donate In-Kind"}, {"click": {"name": "openResourceDonateModal", "args": []}})}>
             {"📦 Donate In-Kind"}
           </button>
         </div>
       </div>
       <div {...ui.props("browse-orgs", {"className": "partner-orgs-list", "id": "browse-orgs"})}>
         {ui.content("browse-orgs", <>
         <h2 {...ui.props("donate-46", {})}>
           {"Partner Organizations"}
         </h2>
         <p {...ui.props("donate-47", {})}>
           {"Choose any approved organization. You can donate money or send resources directly to that organization."}
         </p>
         <div {...ui.props("donate-org-grid", {"className": "small-org-grid", "id": "donate-org-grid"})}>
           <PageRegion name="donate-org-grid" />
         </div>
         <div {...ui.props("donate-49", {"className": "trust-badge"})}>
           {" 🔒 Secure, encrypted payment processing · 80G Tax Benefits Available "}
         </div>
         </>)}
       </div>
     </div>
   </section>
   <PageModal name="donation-modal-overlay">
     <div {...ui.props("donate-51", {"className": "modal-box donation-box", "style": {"maxWidth": "520px"}})}>
       <button {...ui.props("close-donate-modal", {"className": "modal-close", "id": "close-donate-modal", "type": "button", "actionLabel": "✕"})}>
         {ui.content("close-donate-modal", <>
         {"✕"}
         </>)}
       </button>
       <div {...ui.props("donate-step-1", {"id": "donate-step-1"})}>
         {ui.content("donate-step-1", <>
         <h2 {...ui.props("donate-54", {"className": "modal-title"})}>
           {"Donate to "}
           <span {...ui.props("donate-org-name", {"id": "donate-org-name"})}>
             {ui.content("donate-org-name", <>
             {"Organization"}
             </>)}
           </span>
         </h2>
         <p {...ui.props("donate-56", {"className": "modal-subtitle"})}>
           {"Your generous contribution creates a lasting impact."}
         </p>
         <div {...ui.props("donate-57", {"className": "donate-frequency"})}>
           <button {...ui.props("donate-58", {"className": "freq-btn active", "data-freq": "one-time", "type": "button", "actionLabel": "One-Time"})}>
             {"One-Time"}
           </button>
           <button {...ui.props("donate-59", {"className": "freq-btn", "data-freq": "monthly", "type": "button", "actionLabel": "Monthly"})}>
             {"Monthly"}
           </button>
         </div>
         <label {...ui.props("donate-60", {"className": "input-label"})}>
           {"Select Amount"}
         </label>
         <div {...ui.props("donate-61", {"className": "amount-options"})}>
           <button {...ui.props("donate-62", {"className": "amount-btn active", "data-amount": "500", "type": "button", "actionLabel": "₹500"})}>
             {"₹500"}
           </button>
           <button {...ui.props("donate-63", {"className": "amount-btn", "data-amount": "1000", "type": "button", "actionLabel": "₹1,000"})}>
             {"₹1,000"}
           </button>
           <button {...ui.props("donate-64", {"className": "amount-btn", "data-amount": "2500", "type": "button", "actionLabel": "₹2,500"})}>
             {"₹2,500"}
           </button>
           <button {...ui.props("donate-65", {"className": "amount-btn", "data-amount": "5000", "type": "button", "actionLabel": "₹5,000"})}>
             {"₹5,000"}
           </button>
         </div>
         <label {...ui.props("donate-66", {"className": "input-label mt-3"})}>
           {"Or Enter Custom Amount"}
         </label>
         <div {...ui.props("donate-67", {"className": "custom-amount-wrapper"})}>
           <span {...ui.props("donate-68", {"className": "currency-symbol"})}>
             {"₹"}
           </span>
           <PageField as="input" field="custom-amount" spec={{"type": "number", "id": "custom-amount", "className": "custom-amount-input", "placeholder": "e.g. 1500", "min": "100"}} />
         </div>
         <div {...ui.props("donate-70", {"className": "donor-details"})}>
           <div {...ui.props("donate-71", {"className": "input-group"})}>
             <PageField as="input" field="donor-name" spec={{"type": "text", "id": "donor-name", "placeholder": "Full Name", "className": "std-input", "required": true}} />
             <PageField as="input" field="donor-email" spec={{"type": "email", "id": "donor-email", "placeholder": "Email Address", "className": "std-input", "required": true}} />
           </div>
           <PageField as="input" field="donor-pan" spec={{"type": "text", "id": "donor-pan", "placeholder": "PAN Card (Optional, for 80G Tax Exemption)", "className": "std-input full-width mt-2"}} />
         </div>
         <button {...ui.props("proceed-donate-btn", {"className": "btn-primary full-width mt-4", "id": "proceed-donate-btn", "type": "button", "actionLabel": "💳 Proceed to Pay ₹500"})}>
           {ui.content("proceed-donate-btn", <>
           {" 💳 Proceed to Pay "}
           <span {...ui.props("display-total", {"id": "display-total"})}>
             {ui.content("display-total", <>
             {"₹500"}
             </>)}
           </span>
           </>)}
         </button>
         <p {...ui.props("donate-77", {"className": "secure-text"})}>
           {"🔒 100% Secure & Encrypted Payment"}
         </p>
         </>)}
       </div>
       <div {...ui.props("donate-step-2", {"id": "donate-step-2", "style": {"display": "none"}})}>
         {ui.content("donate-step-2", <>
         <p className="page-payment-note">Payment demonstration: no card is charged.</p>
         <div {...ui.props("donate-79", {"style": {"display": "flex", "alignItems": "center", "gap": "10px", "marginBottom": "18px"}})}>
           <button {...ui.props("back-to-step1", {"id": "back-to-step1", "style": {"background": "none", "border": "none", "cursor": "pointer", "fontSize": "1.1rem", "color": "#6366f1"}, "type": "button", "actionLabel": "← Back"})}>
             {ui.content("back-to-step1", <>
             {"← Back"}
             </>)}
           </button>
           <h2 {...ui.props("donate-81", {"className": "modal-title", "style": {"margin": "0"}})}>
             {"Card Details"}
           </h2>
         </div>
         <div {...ui.props("donate-82", {"className": "card-scene"})}>
           <div {...ui.props("card-3d", {"className": "card-3d", "id": "card-3d"})}>
             {ui.content("card-3d", <>
             <div {...ui.props("donate-84", {"className": "card-face card-front"})}>
               <div {...ui.props("donate-85", {"className": "card-front-top"})}>
                 <span {...ui.props("donate-86", {"className": "card-chip"})}>
                   {"💳"}
                 </span>
                 {" "}
                 <span {...ui.props("card-network-logo", {"className": "card-network-logo", "id": "card-network-logo"})}>
                   {ui.content("card-network-logo", <>
                   </>)}
                 </span>
               </div>
               <div {...ui.props("card-number-display", {"className": "card-number-display", "id": "card-number-display"})}>
                 {ui.content("card-number-display", <>
                 {"•••• •••• •••• ••••"}
                 </>)}
               </div>
               <div {...ui.props("donate-89", {"className": "card-front-bottom"})}>
                 <div {...ui.props("donate-90", {})}>
                   <div {...ui.props("donate-91", {"className": "card-label-sm"})}>
                     {"CARDHOLDER"}
                   </div>
                   <div {...ui.props("card-holdername-display", {"className": "card-holdername", "id": "card-holdername-display"})}>
                     {ui.content("card-holdername-display", <>
                     {"YOUR NAME"}
                     </>)}
                   </div>
                 </div>
                 <div {...ui.props("donate-93", {})}>
                   <div {...ui.props("donate-94", {"className": "card-label-sm"})}>
                     {"EXPIRES"}
                   </div>
                   <div {...ui.props("card-expiry-display", {"className": "card-expiry-display", "id": "card-expiry-display"})}>
                     {ui.content("card-expiry-display", <>
                     {"MM/YY"}
                     </>)}
                   </div>
                 </div>
               </div>
             </div>
             <div {...ui.props("donate-96", {"className": "card-face card-back"})}>
               <div {...ui.props("donate-97", {"className": "card-stripe"})}>
               </div>
               <div {...ui.props("donate-98", {"className": "card-cvv-area"})}>
                 <div {...ui.props("donate-99", {"className": "card-label-sm", "style": {"color": "#aaa"}})}>
                   {"CVV"}
                 </div>
                 <div {...ui.props("card-cvv-display", {"className": "card-cvv-display", "id": "card-cvv-display"})}>
                   {ui.content("card-cvv-display", <>
                   {"•••"}
                   </>)}
                 </div>
               </div>
             </div>
             </>)}
           </div>
         </div>
         <div {...ui.props("donate-101", {"className": "card-form"})}>
           <div {...ui.props("donate-102", {"className": "card-field-group"})}>
             <label {...ui.props("donate-103", {"className": "card-field-label"})}>
               {"Card Number "}
               <span {...ui.props("donate-104", {"style": {"color": "#ef4444"}})}>
                 {"*"}
               </span>
             </label>
             <div {...ui.props("card-num-wrap", {"className": "card-field-wrap", "id": "card-num-wrap"})}>
               {ui.content("card-num-wrap", <>
               <PageField as="input" field="card-number" spec={{"type": "text", "id": "card-number", "className": "card-field-input", "placeholder": "1234 5678 9012 3456", "maxLength": "19", "autoComplete": "cc-number", "inputMode": "numeric"}} />
               <span {...ui.props("card-type-icon", {"className": "card-field-icon", "id": "card-type-icon"})}>
                 {ui.content("card-type-icon", <>
                 {"💳"}
                 </>)}
               </span>
               </>)}
             </div>
             <span {...ui.props("card-num-error", {"className": "card-field-error", "id": "card-num-error"})}>
               {ui.content("card-num-error", <>
               </>)}
             </span>
             <div {...ui.props("card-prefix-indicator", {"id": "card-prefix-indicator", "style": {"fontSize": ".78rem", "marginTop": "2px", "minHeight": "18px", "fontWeight": "600"}})}>
               {ui.content("card-prefix-indicator", <>
               </>)}
             </div>
             <div {...ui.props("donate-110", {"style": {"fontSize": ".72rem", "color": "#94a3b8", "marginTop": "2px"}})}>
               {"We accept Visa (starts with 4) and Mastercard (starts with 51 or 52)"}
             </div>
           </div>
           <div {...ui.props("donate-111", {"className": "card-field-group"})}>
             <label {...ui.props("donate-112", {"className": "card-field-label"})}>
               {"Cardholder Name "}
               <span {...ui.props("donate-113", {"style": {"color": "#ef4444"}})}>
                 {"*"}
               </span>
             </label>
             <div {...ui.props("card-name-wrap", {"className": "card-field-wrap", "id": "card-name-wrap"})}>
               {ui.content("card-name-wrap", <>
               <PageField as="input" field="card-holder-name" spec={{"type": "text", "id": "card-holder-name", "className": "card-field-input", "placeholder": "As printed on card", "autoComplete": "cc-name"}} />
               </>)}
             </div>
             <span {...ui.props("card-name-error", {"className": "card-field-error", "id": "card-name-error"})}>
               {ui.content("card-name-error", <>
               </>)}
             </span>
           </div>
           <div {...ui.props("donate-117", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "14px"}})}>
             <div {...ui.props("donate-118", {"className": "card-field-group"})}>
               <label {...ui.props("donate-119", {"className": "card-field-label"})}>
                 {"Expiry Date "}
                 <span {...ui.props("donate-120", {"style": {"color": "#ef4444"}})}>
                   {"*"}
                 </span>
               </label>
               <div {...ui.props("card-exp-wrap", {"className": "card-field-wrap", "id": "card-exp-wrap"})}>
                 {ui.content("card-exp-wrap", <>
                 <PageField as="input" field="card-expiry" spec={{"type": "text", "id": "card-expiry", "className": "card-field-input", "placeholder": "MM/YY", "maxLength": "5", "autoComplete": "cc-exp", "inputMode": "numeric"}} />
                 </>)}
               </div>
               <span {...ui.props("card-exp-error", {"className": "card-field-error", "id": "card-exp-error"})}>
                 {ui.content("card-exp-error", <>
                 </>)}
               </span>
             </div>
             <div {...ui.props("donate-124", {"className": "card-field-group"})}>
               <label {...ui.props("donate-125", {"className": "card-field-label"})}>
                 {"CVV "}
                 <span {...ui.props("donate-126", {"style": {"color": "#ef4444"}})}>
                   {"*"}
                 </span>
               </label>
               <div {...ui.props("card-cvv-wrap", {"className": "card-field-wrap", "id": "card-cvv-wrap"})}>
                 {ui.content("card-cvv-wrap", <>
                 <PageField as="input" field="card-cvv" spec={{"type": "password", "id": "card-cvv", "className": "card-field-input", "placeholder": "•••", "maxLength": "4", "autoComplete": "cc-csc", "inputMode": "numeric"}} />
                 <span {...ui.props("donate-129", {"className": "card-field-icon"})}>
                   {"🔒"}
                 </span>
                 </>)}
               </div>
               <span {...ui.props("card-cvv-error", {"className": "card-field-error", "id": "card-cvv-error"})}>
                 {ui.content("card-cvv-error", <>
                 </>)}
               </span>
             </div>
           </div>
           <label {...ui.props("donate-131", {"className": "save-card-label"})}>
             <PageField as="input" field="save-card-check" spec={{"type": "checkbox", "id": "save-card-check"}} />
             <span {...ui.props("donate-133", {})}>
               {"Save card for future donations"}
             </span>
           </label>
           <button {...ui.props("pay-now-btn", {"className": "btn-pay-now", "id": "pay-now-btn", "type": "button", "actionLabel": "🔒 Pay Securely ₹500"})}>
             {ui.content("pay-now-btn", <>
             {" 🔒 Pay Securely "}
             <span {...ui.props("pay-amount-display", {"id": "pay-amount-display"})}>
               {ui.content("pay-amount-display", <>
               {"₹500"}
               </>)}
             </span>
             </>)}
           </button>
           <p {...ui.props("donate-136", {"style": {"textAlign": "center", "fontSize": ".78rem", "color": "#94a3b8", "marginTop": "10px"}})}>
             {"🏦 256-bit SSL encrypted · PCI DSS Compliant"}
           </p>
         </div>
         </>)}
       </div>
       <div {...ui.props("donate-step-loading", {"id": "donate-step-loading", "style": {"display": "none"}, "className": "text-center py-4"})}>
         {ui.content("donate-step-loading", <>
         <div {...ui.props("donate-138", {"className": "spinner"})}>
         </div>
         <p {...ui.props("donate-139", {"className": "mt-3"})}>
           {"Processing payment securely..."}
         </p>
         <p {...ui.props("donate-140", {"style": {"fontSize": ".8rem", "color": "#94a3b8"}})}>
           {"Please do not close or refresh this window."}
         </p>
         </>)}
       </div>
       <div {...ui.props("donate-step-success", {"id": "donate-step-success", "style": {"display": "none"}, "className": "text-center"})}>
         {ui.content("donate-step-success", <>
         <div {...ui.props("donate-142", {"className": "success-icon-large", "style": {"background": "linear-gradient(135deg,#22c55e,#16a34a)"}})}>
           {"✓"}
         </div>
         <h2 {...ui.props("donate-143", {})}>
           {"Payment Successful!"}
         </h2>
         <p {...ui.props("donate-144", {})}>
           {"Your donation of "}
           <strong {...ui.props("success-amount", {"id": "success-amount"})}>
             {ui.content("success-amount", <>
             </>)}
           </strong>
           {" to "}
           <strong {...ui.props("success-org", {"id": "success-org"})}>
             {ui.content("success-org", <>
             </>)}
           </strong>
           {" was successful. "}
         </p>
         <div {...ui.props("donate-147", {"style": {"background": "#f0fdf4", "border": "1px solid #bbf7d0", "borderRadius": "10px", "padding": "14px", "margin": "16px 0", "textAlign": "left"}})}>
           <div {...ui.props("donate-148", {"style": {"fontSize": ".8rem", "color": "#15803d", "fontWeight": "600", "marginBottom": "6px"}})}>
             {"📧 Receipt Details"}
           </div>
           <div {...ui.props("donate-149", {"style": {"fontSize": ".82rem", "color": "#166534"}})}>
             {"Transaction ID: "}
             <strong {...ui.props("success-txn-id", {"id": "success-txn-id"})}>
               {ui.content("success-txn-id", <>
               </>)}
             </strong>
           </div>
           <div {...ui.props("donate-151", {"style": {"fontSize": ".82rem", "color": "#166534"}})}>
             {"Card: "}
             <strong {...ui.props("success-card-mask", {"id": "success-card-mask"})}>
               {ui.content("success-card-mask", <>
               </>)}
             </strong>
           </div>
           {ui.state.receipt?.receiptNumber && <div style={{fontSize: '.82rem', color: '#166534', marginTop: '4px'}}>
             80G Receipt: <strong>{ui.state.receipt.receiptNumber}</strong> ({ui.state.receipt.panMasked})
           </div>}
         </div>
         <p {...ui.props("donate-153", {"className": "receipt-text"})}>
           {"Your donation record has been saved. Keep the transaction ID for reference."}
         </p>
         <button {...ui.props("close-success-btn", {"className": "btn-outline full-width mt-4", "id": "close-success-btn", "type": "button", "actionLabel": "Return to Campaigns"})}>
           {ui.content("close-success-btn", <>
           {"Return to Campaigns"}
           </>)}
         </button>
         </>)}
       </div>
     </div>
   </PageModal>
   <PageModal name="resource-donate-modal">
     <div {...ui.props("donate-156", {"className": "modal-box", "style": {"background": "#fff", "borderRadius": "16px", "width": "500px", "maxWidth": "90vw", "maxHeight": "90vh", "overflowY": "auto", "boxShadow": "0 10px 25px rgba(0,0,0,0.1)"}})}>
       <div {...ui.props("donate-157", {"className": "modal-header", "style": {"padding": "20px", "borderBottom": "1px solid #e2e8f0", "display": "flex", "justifyContent": "space-between", "alignItems": "center"}})}>
         <h3 {...ui.props("donate-158", {"style": {"margin": "0", "fontSize": "1.25rem", "color": "#1e293b"}})}>
           {"📦 Donate Resources (In-Kind)"}
         </h3>
         <button {...ui.props("donate-159", {"style": {"background": "none", "border": "none", "fontSize": "1.5rem", "cursor": "pointer", "color": "#64748b"}, "type": "button", "actionLabel": "×"}, {"click": {"name": "closeResourceDonateModal", "args": []}})}>
           {"×"}
         </button>
       </div>
       <div {...ui.props("donate-160", {"className": "modal-body", "style": {"padding": "20px"}})}>
         <div {...ui.props("donate-161", {"style": {"marginBottom": "16px"}})}>
           <label {...ui.props("donate-162", {"style": {"display": "block", "fontSize": ".85rem", "fontWeight": "600", "color": "#475569", "marginBottom": "6px"}})}>
             {"Your Name "}
             <span {...ui.props("donate-163", {"style": {"color": "#ef4444"}})}>
               {"*"}
             </span>
           </label>
           <PageField as="input" field="res-donor-name" spec={{"type": "text", "id": "res-donor-name", "style": {"width": "100%", "padding": "10px", "border": "1px solid #cbd5e1", "borderRadius": "8px"}, "placeholder": "Full Name"}} />
         </div>
         <div {...ui.props("donate-165", {"style": {"marginBottom": "16px", "display": "flex", "gap": "16px"}})}>
           <div {...ui.props("donate-166", {"style": {"flex": "1"}})}>
             <label {...ui.props("donate-167", {"style": {"display": "block", "fontSize": ".85rem", "fontWeight": "600", "color": "#475569", "marginBottom": "6px"}})}>
               {"Email "}
               <span {...ui.props("donate-168", {"style": {"color": "#ef4444"}})}>
                 {"*"}
               </span>
             </label>
             <PageField as="input" field="res-donor-email" spec={{"type": "email", "id": "res-donor-email", "style": {"width": "100%", "padding": "10px", "border": "1px solid #cbd5e1", "borderRadius": "8px"}, "placeholder": "Email"}} />
           </div>
           <div {...ui.props("donate-170", {"style": {"flex": "1"}})}>
             <label {...ui.props("donate-171", {"style": {"display": "block", "fontSize": ".85rem", "fontWeight": "600", "color": "#475569", "marginBottom": "6px"}})}>
               {"Phone "}
               <span {...ui.props("donate-172", {"style": {"color": "#ef4444"}})}>
                 {"*"}
               </span>
             </label>
             <PageField as="input" field="res-donor-phone" spec={{"type": "tel", "id": "res-donor-phone", "style": {"width": "100%", "padding": "10px", "border": "1px solid #cbd5e1", "borderRadius": "8px"}, "placeholder": "Mobile Number"}} />
           </div>
         </div>
         <div {...ui.props("donate-174", {"style": {"marginBottom": "16px"}})}>
           <label {...ui.props("donate-175", {"style": {"display": "block", "fontSize": ".85rem", "fontWeight": "600", "color": "#475569", "marginBottom": "6px"}})}>
             {"Donate Resources To "}
             <span {...ui.props("donate-176", {"style": {"color": "#ef4444"}})}>
               {"*"}
             </span>
           </label>
            <label className="fulfillment-field">Resource Photo (optional)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>ui.selectFile('resource-photo',e.target.files?.[0])}/></label>
            <PageField as="select" field="res-org" spec={{"id": "res-org", "className": "donate-v2-select"}}>
             <option {...ui.props("donate-178", {"value": ""})}>
               {"Loading approved organizations…"}
             </option>
           </PageField>
         </div>
         <div {...ui.props("donate-179", {"style": {"marginBottom": "16px"}})}>
           <label {...ui.props("donate-180", {"style": {"display": "block", "fontSize": ".85rem", "fontWeight": "600", "color": "#475569", "marginBottom": "6px"}})}>
             {"Category "}
             <span {...ui.props("donate-181", {"style": {"color": "#ef4444"}})}>
               {"*"}
             </span>
           </label>
           <PageField as="select" field="res-category" spec={{"id": "res-category", "style": {"width": "100%", "padding": "10px", "border": "1px solid #cbd5e1", "borderRadius": "8px"}}}>
             <option {...ui.props("donate-183", {"value": "Food"})}>
               {"Food & Rations"}
             </option>
             <option {...ui.props("donate-184", {"value": "Clothing"})}>
               {"Clothing"}
             </option>
             <option {...ui.props("donate-185", {"value": "Medical Supplies"})}>
               {"Medical Supplies"}
             </option>
             <option {...ui.props("donate-186", {"value": "Books & Stationery"})}>
               {"Books & Stationery"}
             </option>
             <option {...ui.props("donate-187", {"value": "Blankets & Bedding"})}>
               {"Blankets & Bedding"}
             </option>
             <option {...ui.props("donate-188", {"value": "Other"})}>
               {"Other"}
             </option>
           </PageField>
         </div>
         <div {...ui.props("donate-189", {"style": {"marginBottom": "16px"}})}>
           <label {...ui.props("donate-190", {"style": {"display": "block", "fontSize": ".85rem", "fontWeight": "600", "color": "#475569", "marginBottom": "6px"}})}>
             {"Items & Quantities "}
             <span {...ui.props("donate-191", {"style": {"color": "#ef4444"}})}>
               {"*"}
             </span>
           </label>
           <PageField as="textarea" field="res-items" spec={{"id": "res-items", "style": {"width": "100%", "padding": "10px", "border": "1px solid #cbd5e1", "borderRadius": "8px"}, "rows": "3", "placeholder": "e.g. 50 Blankets, 20 Rice Bags..."}}>
           </PageField>
         </div>
         <div {...ui.props("donate-193", {"style": {"marginBottom": "16px"}})}>
           <label {...ui.props("donate-194", {"style": {"display": "block", "fontSize": ".85rem", "fontWeight": "600", "color": "#475569", "marginBottom": "6px"}})}>
             {"Pickup Address "}
             <span {...ui.props("donate-195", {"style": {"color": "#ef4444"}})}>
               {"*"}
             </span>
           </label>
           <PageField as="textarea" field="res-address" spec={{"id": "res-address", "style": {"width": "100%", "padding": "10px", "border": "1px solid #cbd5e1", "borderRadius": "8px"}, "rows": "2", "placeholder": "Full pickup address"}}>
           </PageField>
         </div>
         <div {...ui.props("donate-197", {"style": {"marginBottom": "16px", "display": "flex", "gap": "16px"}})}>
           <div {...ui.props("donate-198", {"style": {"flex": "1"}})}>
             <label {...ui.props("donate-199", {"style": {"display": "block", "fontSize": ".85rem", "fontWeight": "600", "color": "#475569", "marginBottom": "6px"}})}>
               {"Preferred Pickup Date"}
             </label>
             <PageField as="input" field="res-date" spec={{"type": "date", "id": "res-date", "style": {"width": "100%", "padding": "10px", "border": "1px solid #cbd5e1", "borderRadius": "8px"}}} />
           </div>
           <div {...ui.props("donate-201", {"style": {"flex": "1"}})}>
             <label {...ui.props("donate-202", {"style": {"display": "block", "fontSize": ".85rem", "fontWeight": "600", "color": "#475569", "marginBottom": "6px"}})}>
               {"Time Slot"}
             </label>
             <PageField as="select" field="res-timeslot" spec={{"id": "res-timeslot", "style": {"width": "100%", "padding": "10px", "border": "1px solid #cbd5e1", "borderRadius": "8px"}}}>
               <option {...ui.props("donate-204", {"value": "Morning (9AM-12PM)"})}>
                 {"Morning (9AM-12PM)"}
               </option>
               <option {...ui.props("donate-205", {"value": "Afternoon (12PM-4PM)"})}>
                 {"Afternoon (12PM-4PM)"}
               </option>
               <option {...ui.props("donate-206", {"value": "Evening (4PM-7PM)"})}>
                 {"Evening (4PM-7PM)"}
               </option>
             </PageField>
           </div>
         </div>
         <button {...ui.props("donate-207", {"className": "btn-primary block-btn", "style": {"background": "#f59e0b", "borderColor": "#f59e0b", "width": "100%", "padding": "12px", "marginTop": "10px"}, "type": "button", "actionLabel": "Submit Resource\n          Donation"}, {"click": {"name": "submitResourceDonation", "args": []}})}>
           {"Submit Resource Donation"}
         </button>
       </div>
     </div>
   </PageModal>
     <PageExtras />
   </main>
  </>;
}
