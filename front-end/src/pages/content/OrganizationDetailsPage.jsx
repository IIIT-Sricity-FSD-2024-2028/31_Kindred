import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageModal } from '../runtime/PageElements.jsx';

export default function OrganizationDetailsPage() {
  const ui = usePage();
  return <>
   <header {...ui.props("organization-details-1", {"className": "details-hero"})}>
     <div {...ui.props("organization-details-2", {"className": "container"})}>
       <Link {...ui.props("organization-details-3", {"className": "back-link", "actionLabel": "← Back to Directory", "to": "/organizations.html"})}>
         {"← Back to Directory"}
       </Link>
       <h1 {...ui.props("org-name-title", {"id": "org-name-title"})}>
         {ui.content("org-name-title", <>
         {"Organization Name"}
         </>)}
       </h1>
       <p {...ui.props("org-focus-title", {"id": "org-focus-title"})}>
         {ui.content("org-focus-title", <>
         {"Focus Area"}
         </>)}
       </p>
     </div>
   </header>
   <main {...ui.props("organization-details-6", {"className": "details-grid", "data-react-page": "/organization-details.html"})}>
     <div {...ui.props("organization-details-7", {"className": "content-side"})}>
       <div {...ui.props("organization-details-8", {"className": "details-card"})}>
         <div {...ui.props("org-banner-container", {"id": "org-banner-container"})}>
           {ui.content("org-banner-container", <>
           <img {...ui.props("org-banner", {"id": "org-banner", "src": "", "alt": "Organization Banner", "className": "details-banner-img"})} />
           </>)}
         </div>
         <h2 {...ui.props("organization-details-11", {})}>
           {"About our Mission"}
         </h2>
         <div {...ui.props("org-description", {"id": "org-description", "className": "org-long-desc"})}>
           {ui.content("org-description", <>
           {" Loading description... "}
           </>)}
         </div>
         <div {...ui.props("organization-details-13", {"className": "stats-row"})}>
           <div {...ui.props("organization-details-14", {"className": "stat-item"})}>
             <div {...ui.props("organization-details-15", {"className": "stat-label"})}>
               {"Volunteers"}
             </div>
             <div {...ui.props("stat-volunteers", {"id": "stat-volunteers", "className": "stat-value"})}>
               {ui.content("stat-volunteers", <>
               {"0"}
               </>)}
             </div>
           </div>
           <div {...ui.props("organization-details-17", {"className": "stat-item"})}>
             <div {...ui.props("organization-details-18", {"className": "stat-label"})}>
               {"Impacted"}
             </div>
             <div {...ui.props("stat-beneficiaries", {"id": "stat-beneficiaries", "className": "stat-value"})}>
               {ui.content("stat-beneficiaries", <>
               {"0"}
               </>)}
             </div>
           </div>
           <div {...ui.props("organization-details-20", {"className": "stat-item"})}>
             <div {...ui.props("organization-details-21", {"className": "stat-label"})}>
               {"Rating"}
             </div>
             <div {...ui.props("stat-rating", {"id": "stat-rating", "className": "stat-value"})}>
               {ui.content("stat-rating", <>
               {"0.0"}
               </>)}
             </div>
           </div>
         </div>
         <h3 {...ui.props("organization-details-23", {})}>
           {"Focus Areas"}
         </h3>
         <p {...ui.props("org-focus-detail", {"id": "org-focus-detail"})}>
           {ui.content("org-focus-detail", <>
           {"Detailed focus areas will appear here."}
           </>)}
         </p>
       </div>
     </div>
     <div {...ui.props("organization-details-25", {"className": "sidebar"})}>
       <div {...ui.props("organization-details-26", {"className": "sidebar-card"})}>
         <h3 {...ui.props("organization-details-27", {})}>
           {"Contact Information"}
         </h3>
         <ul {...ui.props("contact-info", {"className": "contact-info-list", "id": "contact-info"})}>
           {ui.content("contact-info", <>
           <li {...ui.props("organization-details-29", {})}>
             <span {...ui.props("organization-details-30", {})}>
               {"📍"}
             </span>
             {" "}
             <span {...ui.props("org-city", {"id": "org-city"})}>
               {ui.content("org-city", <>
               {"City, State"}
               </>)}
             </span>
           </li>
           <li {...ui.props("organization-details-32", {})}>
             <span {...ui.props("organization-details-33", {})}>
               {"✉"}
             </span>
             {" "}
             <span {...ui.props("org-email", {"id": "org-email"})}>
               {ui.content("org-email", <>
               {"email@org.com"}
               </>)}
             </span>
           </li>
           <li {...ui.props("organization-details-35", {})}>
             <span {...ui.props("organization-details-36", {})}>
               {"📞"}
             </span>
             {" "}
             <span {...ui.props("org-phone", {"id": "org-phone"})}>
               {ui.content("org-phone", <>
               {"+91 00000 00000"}
               </>)}
             </span>
           </li>
           </>)}
         </ul>
         <div {...ui.props("organization-details-38", {"className": "small-org-card", "style": {"boxShadow": "none", "padding": "0", "border": "none", "display": "block", "background": "transparent"}})}>
           <h4 {...ui.props("hidden-org-name-for-donate", {"style": {"display": "none"}, "id": "hidden-org-name-for-donate"})}>
             {ui.content("hidden-org-name-for-donate", <>
             {"Organization Name"}
             </>)}
           </h4>
           <a {...ui.props("organization-details-40", {"href": "#", "className": "btn-donate-now btn-outline-sm", "actionLabel": "Donate to this Organization"})}>
             {"Donate to this Organization"}
           </a>
         </div>
       </div>
       <div {...ui.props("organization-details-41", {"className": "sidebar-card"})}>
         <h3 {...ui.props("organization-details-42", {})}>
           {"Verification Status"}
         </h3>
         <div {...ui.props("organization-details-43", {"style": {"display": "flex", "alignItems": "center", "gap": "10px", "color": "#059669", "fontWeight": "700"}})}>
           <span {...ui.props("organization-details-44", {"style": {"fontSize": "20px"}})}>
             {"✓"}
           </span>
           {" Verified Partner NGO "}
         </div>
         <p {...ui.props("organization-details-45", {"style": {"fontSize": "13px", "color": "#64748b", "marginTop": "10px"}})}>
           {" This organization has been thoroughly vetted by Kindred for transparency and impact efficiency. "}
         </p>
       </div>
     </div>
     <PageExtras />
   </main>
   <PageModal name="donation-modal-overlay">
     <div {...ui.props("organization-details-47", {"className": "modal-box donation-box", "style": {"maxWidth": "520px"}})}>
       <button {...ui.props("close-donate-modal", {"className": "modal-close", "id": "close-donate-modal", "type": "button", "actionLabel": "✕"})}>
         {ui.content("close-donate-modal", <>
         {"✕"}
         </>)}
       </button>
       <div {...ui.props("donate-step-1", {"id": "donate-step-1"})}>
         {ui.content("donate-step-1", <>
         <h2 {...ui.props("organization-details-50", {"className": "modal-title"})}>
           {"Donate to "}
           <span {...ui.props("donate-org-name", {"id": "donate-org-name"})}>
             {ui.content("donate-org-name", <>
             {"Organization"}
             </>)}
           </span>
         </h2>
         <p {...ui.props("organization-details-52", {"className": "modal-subtitle"})}>
           {"Your generous contribution creates a lasting impact."}
         </p>
         <div {...ui.props("organization-details-53", {"className": "donate-frequency"})}>
           <button {...ui.props("organization-details-54", {"className": "freq-btn active", "data-freq": "one-time", "type": "button", "actionLabel": "One-Time"})}>
             {"One-Time"}
           </button>
           <button {...ui.props("organization-details-55", {"className": "freq-btn", "data-freq": "monthly", "type": "button", "actionLabel": "Monthly"})}>
             {"Monthly"}
           </button>
         </div>
         <label {...ui.props("organization-details-56", {"className": "input-label"})}>
           {"Select Amount"}
         </label>
         <div {...ui.props("organization-details-57", {"className": "amount-options"})}>
           <button {...ui.props("organization-details-58", {"className": "amount-btn active", "data-amount": "500", "type": "button", "actionLabel": "₹500"})}>
             {"₹500"}
           </button>
           <button {...ui.props("organization-details-59", {"className": "amount-btn", "data-amount": "1000", "type": "button", "actionLabel": "₹1,000"})}>
             {"₹1,000"}
           </button>
           <button {...ui.props("organization-details-60", {"className": "amount-btn", "data-amount": "2500", "type": "button", "actionLabel": "₹2,500"})}>
             {"₹2,500"}
           </button>
           <button {...ui.props("organization-details-61", {"className": "amount-btn", "data-amount": "5000", "type": "button", "actionLabel": "₹5,000"})}>
             {"₹5,000"}
           </button>
         </div>
         <label {...ui.props("organization-details-62", {"className": "input-label mt-3"})}>
           {"Or Enter Custom Amount"}
         </label>
         <div {...ui.props("organization-details-63", {"className": "custom-amount-wrapper"})}>
           <span {...ui.props("organization-details-64", {"className": "currency-symbol"})}>
             {"₹"}
           </span>
           <PageField as="input" field="custom-amount" spec={{"type": "number", "id": "custom-amount", "className": "custom-amount-input", "placeholder": "e.g. 1500", "min": "100"}} />
         </div>
         <div {...ui.props("organization-details-66", {"className": "donor-details"})}>
           <div {...ui.props("organization-details-67", {"className": "input-group"})}>
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
         <p {...ui.props("organization-details-73", {"className": "secure-text"})}>
           {"🔒 100% Secure & Encrypted Payment"}
         </p>
         </>)}
       </div>
       <div {...ui.props("donate-step-2", {"id": "donate-step-2", "style": {"display": "none"}})}>
         {ui.content("donate-step-2", <>
         <p className="page-payment-note">Payment demonstration: no card is charged.</p>
         <div {...ui.props("organization-details-75", {"style": {"display": "flex", "alignItems": "center", "gap": "10px", "marginBottom": "18px"}})}>
           <button {...ui.props("back-to-step1", {"id": "back-to-step1", "style": {"background": "none", "border": "none", "cursor": "pointer", "fontSize": "1.1rem", "color": "#6366f1"}, "type": "button", "actionLabel": "← Back"})}>
             {ui.content("back-to-step1", <>
             {"← Back"}
             </>)}
           </button>
           <h2 {...ui.props("organization-details-77", {"className": "modal-title", "style": {"margin": "0"}})}>
             {"Card Details"}
           </h2>
         </div>
         <div {...ui.props("organization-details-78", {"className": "card-scene"})}>
           <div {...ui.props("card-3d", {"className": "card-3d", "id": "card-3d"})}>
             {ui.content("card-3d", <>
             <div {...ui.props("organization-details-80", {"className": "card-face card-front"})}>
               <div {...ui.props("organization-details-81", {"className": "card-front-top"})}>
                 <span {...ui.props("organization-details-82", {"className": "card-chip"})}>
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
               <div {...ui.props("organization-details-85", {"className": "card-front-bottom"})}>
                 <div {...ui.props("organization-details-86", {})}>
                   <div {...ui.props("organization-details-87", {"className": "card-label-sm"})}>
                     {"CARDHOLDER"}
                   </div>
                   <div {...ui.props("card-holdername-display", {"className": "card-holdername", "id": "card-holdername-display"})}>
                     {ui.content("card-holdername-display", <>
                     {"YOUR NAME"}
                     </>)}
                   </div>
                 </div>
                 <div {...ui.props("organization-details-89", {})}>
                   <div {...ui.props("organization-details-90", {"className": "card-label-sm"})}>
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
             <div {...ui.props("organization-details-92", {"className": "card-face card-back"})}>
               <div {...ui.props("organization-details-93", {"className": "card-stripe"})}>
               </div>
               <div {...ui.props("organization-details-94", {"className": "card-cvv-area"})}>
                 <div {...ui.props("organization-details-95", {"className": "card-label-sm", "style": {"color": "#aaa"}})}>
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
         <div {...ui.props("organization-details-97", {"className": "card-form"})}>
           <div {...ui.props("organization-details-98", {"className": "card-field-group"})}>
             <label {...ui.props("organization-details-99", {"className": "card-field-label"})}>
               {"Card Number "}
               <span {...ui.props("organization-details-100", {"style": {"color": "#ef4444"}})}>
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
             <div {...ui.props("organization-details-106", {"style": {"fontSize": ".72rem", "color": "#94a3b8", "marginTop": "2px"}})}>
               {"We accept Visa (starts with 4) and Mastercard (starts with 51 or 52)"}
             </div>
           </div>
           <div {...ui.props("organization-details-107", {"className": "card-field-group"})}>
             <label {...ui.props("organization-details-108", {"className": "card-field-label"})}>
               {"Cardholder Name "}
               <span {...ui.props("organization-details-109", {"style": {"color": "#ef4444"}})}>
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
           <div {...ui.props("organization-details-113", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "14px"}})}>
             <div {...ui.props("organization-details-114", {"className": "card-field-group"})}>
               <label {...ui.props("organization-details-115", {"className": "card-field-label"})}>
                 {"Expiry Date "}
                 <span {...ui.props("organization-details-116", {"style": {"color": "#ef4444"}})}>
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
             <div {...ui.props("organization-details-120", {"className": "card-field-group"})}>
               <label {...ui.props("organization-details-121", {"className": "card-field-label"})}>
                 {"CVV "}
                 <span {...ui.props("organization-details-122", {"style": {"color": "#ef4444"}})}>
                   {"*"}
                 </span>
               </label>
               <div {...ui.props("card-cvv-wrap", {"className": "card-field-wrap", "id": "card-cvv-wrap"})}>
                 {ui.content("card-cvv-wrap", <>
                 <PageField as="input" field="card-cvv" spec={{"type": "password", "id": "card-cvv", "className": "card-field-input", "placeholder": "•••", "maxLength": "4", "autoComplete": "cc-csc", "inputMode": "numeric"}} />
                 <span {...ui.props("organization-details-125", {"className": "card-field-icon"})}>
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
           <label {...ui.props("organization-details-127", {"className": "save-card-label"})}>
             <PageField as="input" field="save-card-check" spec={{"type": "checkbox", "id": "save-card-check"}} />
             <span {...ui.props("organization-details-129", {})}>
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
           <p {...ui.props("organization-details-132", {"style": {"textAlign": "center", "fontSize": ".78rem", "color": "#94a3b8", "marginTop": "10px"}})}>
             {"🏦 256-bit SSL encrypted · PCI DSS Compliant"}
           </p>
         </div>
         </>)}
       </div>
       <div {...ui.props("donate-step-loading", {"id": "donate-step-loading", "style": {"display": "none"}, "className": "text-center py-4"})}>
         {ui.content("donate-step-loading", <>
         <div {...ui.props("organization-details-134", {"className": "spinner"})}>
         </div>
         <p {...ui.props("organization-details-135", {"className": "mt-3"})}>
           {"Processing payment securely..."}
         </p>
         <p {...ui.props("organization-details-136", {"style": {"fontSize": ".8rem", "color": "#94a3b8"}})}>
           {"Please do not close or refresh this window."}
         </p>
         </>)}
       </div>
       <div {...ui.props("donate-step-success", {"id": "donate-step-success", "style": {"display": "none"}, "className": "text-center"})}>
         {ui.content("donate-step-success", <>
         <div {...ui.props("organization-details-138", {"className": "success-icon-large", "style": {"background": "linear-gradient(135deg,#22c55e,#16a34a)"}})}>
           {"✓"}
         </div>
         <h2 {...ui.props("organization-details-139", {})}>
           {"Payment Successful!"}
         </h2>
         <p {...ui.props("organization-details-140", {})}>
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
           {" was successful."}
         </p>
         <div {...ui.props("organization-details-143", {"style": {"background": "#f0fdf4", "border": "1px solid #bbf7d0", "borderRadius": "10px", "padding": "14px", "margin": "16px 0", "textAlign": "left"}})}>
           <div {...ui.props("organization-details-144", {"style": {"fontSize": ".8rem", "color": "#15803d", "fontWeight": "600", "marginBottom": "6px"}})}>
             {"📧 Receipt Details"}
           </div>
           <div {...ui.props("organization-details-145", {"style": {"fontSize": ".82rem", "color": "#166534"}})}>
             {"Transaction ID: "}
             <strong {...ui.props("success-txn-id", {"id": "success-txn-id"})}>
               {ui.content("success-txn-id", <>
               </>)}
             </strong>
           </div>
           <div {...ui.props("organization-details-147", {"style": {"fontSize": ".82rem", "color": "#166534"}})}>
             {"Card: "}
             <strong {...ui.props("success-card-mask", {"id": "success-card-mask"})}>
               {ui.content("success-card-mask", <>
               </>)}
             </strong>
           </div>
         </div>
         <p {...ui.props("organization-details-149", {"className": "receipt-text"})}>
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
  </>;
}
