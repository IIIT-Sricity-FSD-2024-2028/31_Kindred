import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageModal, PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function DonorDashboardPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("donor-dashboard-1", {"className": "page-wrapper", "data-react-page": "/donor-dashboard.html"})}>
     <div {...ui.props("donor-dashboard-2", {"className": "page-header"})}>
       <div {...ui.props("donor-dashboard-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("donor-welcome", {"id": "donor-welcome"})}>
           {ui.content("donor-welcome", <>
           {"Welcome, Donor"}
           </>)}
         </h1>
         <p {...ui.props("donor-dashboard-5", {})}>
           {"Track your donation history and manage your saved payment cards."}
         </p>
       </div>
       <div {...ui.props("donor-dashboard-6", {"style": {"display": "flex", "gap": "10px", "alignItems": "center", "flexWrap": "wrap"}})}>
         <Link {...ui.props("donor-dashboard-7", {"style": {"display": "inline-flex", "alignItems": "center", "gap": "7px", "padding": "10px 18px", "background": "#f1f5f9", "color": "#374151", "border": "1px solid #e2e8f0", "borderRadius": "10px", "fontSize": ".85rem", "fontWeight": "600", "textDecoration": "none", "transition": "all .15s"}, "data-page-node": "donor-dashboard-7", "actionLabel": "👤 Edit Profile", "to": "/profile.html"})}>
           {" 👤 Edit Profile "}
         </Link>
         {" "}
         <Link {...ui.props("donor-dashboard-8", {"className": "btn-new-request", "style": {"textDecoration": "none"}, "actionLabel": "New Donation", "to": "/donate.html"})}>
           <svg {...ui.props("donor-dashboard-9", {"width": "14", "height": "14", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5"})}>
             <line {...ui.props("donor-dashboard-10", {"x1": "12", "y1": "5", "x2": "12", "y2": "19"})}>
             </line>
             <line {...ui.props("donor-dashboard-11", {"x1": "5", "y1": "12", "x2": "19", "y2": "12"})}>
             </line>
           </svg>
           {" New Donation "}
         </Link>
       </div>
     </div>
     <PageTabs />
     <div {...ui.props("payment-stats", {"className": "stats-grid", "id": "payment-stats"})}>
       <PageRegion name="payment-stats" />
     </div>
     <div {...ui.props("tab-payments", {"id": "tab-payments"})}>
       {ui.content("tab-payments", <>
       <div {...ui.props("donor-dashboard-14", {"className": "section-title"})}>
         {"Donation History"}
       </div>
       <div {...ui.props("payments-list", {"className": "payments-list", "id": "payments-list"})}>
         <PageRegion name="payments-list" />
       </div>
       </>)}
     </div>
     <div {...ui.props("new-donor-onboarding", {"id": "new-donor-onboarding", "style": {"display": "none", "marginTop": "20px"}})}>
       {ui.content("new-donor-onboarding", <>
       <div {...ui.props("donor-dashboard-17", {"style": {"background": "linear-gradient(135deg,#fdf4ff,#fae8ff)", "border": "1px solid #e9d5ff", "borderRadius": "16px", "padding": "32px 28px"}})}>
         <h3 {...ui.props("donor-dashboard-18", {"style": {"fontSize": "1.1rem", "fontWeight": "700", "color": "#581c87", "marginBottom": "6px"}})}>
           {"🎉 Welcome to Kindred!"}
         </h3>
         <p {...ui.props("donor-dashboard-19", {"style": {"color": "#7c3aed", "fontSize": ".88rem", "marginBottom": "20px"}})}>
           {"You haven't made a donation yet. Here's how you can make an impact:"}
         </p>
         <div {...ui.props("donor-dashboard-20", {"style": {"display": "grid", "gridTemplateColumns": "repeat(auto-fill,minmax(160px,1fr))", "gap": "12px"}})}>
           <div {...ui.props("donor-dashboard-21", {"style": {"background": "#fff", "border": "1px solid #e9d5ff", "borderRadius": "12px", "padding": "16px", "textAlign": "center", "cursor": "pointer", "transition": "all .2s"}, "data-page-node": "donor-dashboard-21", "actionLabel": "💝\n            Make a Donation\n            Support a verified NGO"}, {"click": {"name": "navigate", "args": ["donate.html"]}})}>
             <div {...ui.props("donor-dashboard-22", {"style": {"fontSize": "1.8rem", "marginBottom": "8px"}})}>
               {"💝"}
             </div>
             <div {...ui.props("donor-dashboard-23", {"style": {"fontSize": ".82rem", "fontWeight": "700", "color": "#581c87"}})}>
               {"Make a Donation"}
             </div>
             <div {...ui.props("donor-dashboard-24", {"style": {"fontSize": ".74rem", "color": "#64748b", "marginTop": "4px"}})}>
               {"Support a verified NGO"}
             </div>
           </div>
           <div {...ui.props("donor-dashboard-25", {"style": {"background": "#fff", "border": "1px solid #e9d5ff", "borderRadius": "12px", "padding": "16px", "textAlign": "center", "cursor": "pointer", "transition": "all .2s"}, "data-page-node": "donor-dashboard-25", "actionLabel": "📋\n            Browse Programs\n            Explore active campaigns"}, {"click": {"name": "navigate", "args": ["programs.html"]}})}>
             <div {...ui.props("donor-dashboard-26", {"style": {"fontSize": "1.8rem", "marginBottom": "8px"}})}>
               {"📋"}
             </div>
             <div {...ui.props("donor-dashboard-27", {"style": {"fontSize": ".82rem", "fontWeight": "700", "color": "#581c87"}})}>
               {"Browse Programs"}
             </div>
             <div {...ui.props("donor-dashboard-28", {"style": {"fontSize": ".74rem", "color": "#64748b", "marginTop": "4px"}})}>
               {"Explore active campaigns"}
             </div>
           </div>
           <div {...ui.props("donor-dashboard-29", {"style": {"background": "#fff", "border": "1px solid #e9d5ff", "borderRadius": "12px", "padding": "16px", "textAlign": "center", "cursor": "pointer", "transition": "all .2s"}, "data-page-node": "donor-dashboard-29", "actionLabel": "🏢\n            Explore NGOs\n            Find organisations to support"}, {"click": {"name": "navigate", "args": ["organizations.html"]}})}>
             <div {...ui.props("donor-dashboard-30", {"style": {"fontSize": "1.8rem", "marginBottom": "8px"}})}>
               {"🏢"}
             </div>
             <div {...ui.props("donor-dashboard-31", {"style": {"fontSize": ".82rem", "fontWeight": "700", "color": "#581c87"}})}>
               {"Explore NGOs"}
             </div>
             <div {...ui.props("donor-dashboard-32", {"style": {"fontSize": ".74rem", "color": "#64748b", "marginTop": "4px"}})}>
               {"Find organisations to support"}
             </div>
           </div>
         </div>
       </div>
       </>)}
     </div>
     <div {...ui.props("tab-overview", {"id": "tab-overview", "style": {"display": "none"}})}>
       {ui.content("tab-overview", <>
       <div {...ui.props("donor-dashboard-34", {"className": "section-title"})}>
         {"Donation Overview"}
       </div>
       <div {...ui.props("overview-content", {"id": "overview-content"})}>
         <PageRegion name="overview-content" />
       </div>
       </>)}
     </div>
     <div {...ui.props("tab-cards", {"id": "tab-cards", "style": {"display": "none"}})}>
       {ui.content("tab-cards", <>
       <div {...ui.props("donor-dashboard-37", {"className": "saved-cards-section"})}>
         <div {...ui.props("donor-dashboard-38", {"className": "section-title"})}>
           {"Saved Cards"}
         </div>
         <div {...ui.props("saved-cards-grid", {"className": "saved-cards-grid", "id": "saved-cards-grid"})}>
           <PageRegion name="saved-cards-grid" />
         </div>
       </div>
       </>)}
     </div>
     <div {...ui.props("tab-programs", {"id": "tab-programs", "style": {"display": "none"}})}>
       {ui.content("tab-programs", <>
       <div {...ui.props("new-programs-highlight", {"id": "new-programs-highlight"})}>
         {ui.content("new-programs-highlight", <>
         </>)}
       </div>
       <div {...ui.props("donor-dashboard-42", {"className": "section-title", "style": {"display": "flex", "justifyContent": "space-between", "alignItems": "center"}})}>
         <span {...ui.props("donor-dashboard-43", {})}>
           {"🏢 Active Programs"}
         </span>
         {" "}
         <Link {...ui.props("donor-dashboard-44", {"style": {"fontSize": ".82rem", "fontWeight": "600", "color": "#6366f1", "textDecoration": "none"}, "actionLabel": "View All →", "to": "/programs.html"})}>
           {"View All →"}
         </Link>
       </div>
       <div {...ui.props("donor-programs-grid", {"className": "donor-programs-grid", "id": "donor-programs-grid"})}>
         <PageRegion name="donor-programs-grid" />
       </div>
       </>)}
     </div>
     <div {...ui.props("tab-resources", {"id": "tab-resources", "style": {"display": "none"}})}>
       {ui.content("tab-resources", <>
       <div {...ui.props("donor-dashboard-47", {"style": {"display": "flex", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "18px"}})}>
         <div {...ui.props("donor-dashboard-48", {"className": "section-title"})}>
           {"📦 My Resource Donations"}
         </div>
         <button {...ui.props("donor-dashboard-49", {"style": {"background": "linear-gradient(135deg,#10b981,#059669)", "color": "#fff", "border": "none", "padding": "10px 20px", "borderRadius": "10px", "fontSize": ".88rem", "fontWeight": "700", "cursor": "pointer", "display": "flex", "alignItems": "center", "gap": "6px", "boxShadow": "0 4px 14px rgba(16,185,129,.3)", "transition": "all .15s"}, "data-page-node": "donor-dashboard-49", "type": "button", "actionLabel": "📦 Donate Resources"}, {"click": {"name": "openResourceDonationModal", "args": []}})}>
           {"📦 Donate Resources"}
         </button>
       </div>
       <div {...ui.props("donor-resource-list", {"id": "donor-resource-list"})}>
         <PageRegion name="donor-resource-list" />
       </div>
       </>)}
     </div>
     <PageExtras />
   </main>
   <PageModal name="resourceDonationModal">
     <div {...ui.props("donor-dashboard-52", {"className": "modal-box", "style": {"width": "620px", "maxWidth": "95vw", "maxHeight": "90vh", "overflowY": "auto"}})}>
       <div {...ui.props("donor-dashboard-53", {"className": "modal-header"})}>
         <h3 {...ui.props("donor-dashboard-54", {})}>
           {"📦 Donate Resources"}
         </h3>
         <button {...ui.props("donor-dashboard-55", {"className": "modal-close-btn", "type": "button", "actionLabel": "×"}, {"click": {"name": "closeResourceDonationModal", "args": []}})}>
           {"×"}
         </button>
       </div>
       <div {...ui.props("donor-dashboard-56", {"className": "modal-body"})}>
         <form {...ui.props("resourceDonationForm", {"id": "resourceDonationForm", "noValidate": true, "pageForm": true}, {"submit": {"name": "submitResourceDonation", "args": []}})}>
           {ui.content("resourceDonationForm", <>
           <div {...ui.props("donor-dashboard-58", {"style": {"background": "#f0fdf4", "border": "1px solid #a7f3d0", "borderRadius": "10px", "padding": "14px 16px", "marginBottom": "16px"}})}>
             <div {...ui.props("donor-dashboard-59", {"style": {"fontSize": ".78rem", "fontWeight": "600", "color": "#065f46", "marginBottom": "6px"}})}>
               {"🙋 Donor Information"}
             </div>
             <div {...ui.props("donor-dashboard-60", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "12px"}})}>
               <div {...ui.props("donor-dashboard-61", {"className": "field"})}>
                 <label {...ui.props("donor-dashboard-62", {})}>
                   {"Full Name "}
                   <span {...ui.props("donor-dashboard-63", {"className": "req"})}>
                     {"*"}
                   </span>
                 </label>
                 <PageField as="input" field="rd-name" spec={{"type": "text", "id": "rd-name", "placeholder": "Your full name"}} />
                 <p {...ui.props("rd-name-err", {"className": "field-error", "id": "rd-name-err"})}>
                   {ui.content("rd-name-err", <>
                   </>)}
                 </p>
               </div>
               <div {...ui.props("donor-dashboard-66", {"className": "field"})}>
                 <label {...ui.props("donor-dashboard-67", {})}>
                   {"Phone "}
                   <span {...ui.props("donor-dashboard-68", {"className": "req"})}>
                     {"*"}
                   </span>
                 </label>
                 <PageField as="input" field="rd-phone" spec={{"type": "text", "id": "rd-phone", "placeholder": "10-digit number", "maxLength": "15"}} />
                 <p {...ui.props("rd-phone-err", {"className": "field-error", "id": "rd-phone-err"})}>
                   {ui.content("rd-phone-err", <>
                   </>)}
                 </p>
               </div>
             </div>
           </div>
           <div {...ui.props("donor-dashboard-71", {"className": "field"})}>
             <label {...ui.props("donor-dashboard-72", {})}>
               {"Category "}
               <span {...ui.props("donor-dashboard-73", {"className": "req"})}>
                 {"*"}
               </span>
             </label>
             <PageField as="select" field="rd-category" spec={{"id": "rd-category"}}>
               <option {...ui.props("donor-dashboard-75", {"value": ""})}>
                 {"— Select Category —"}
               </option>
             </PageField>
             <p {...ui.props("rd-category-err", {"className": "field-error", "id": "rd-category-err"})}>
               {ui.content("rd-category-err", <>
               </>)}
             </p>
           </div>
           <div {...ui.props("donor-dashboard-77", {"className": "field"})}>
             <label {...ui.props("donor-dashboard-78", {"style": {"display": "flex", "justifyContent": "space-between", "alignItems": "center"}})}>
               {"Items to Donate "}
               <span {...ui.props("donor-dashboard-79", {"className": "req"})}>
                 {"*"}
               </span>
               <button {...ui.props("donor-dashboard-80", {"type": "button", "style": {"background": "#6366f1", "color": "#fff", "border": "none", "padding": "4px 12px", "borderRadius": "6px", "fontSize": ".78rem", "fontWeight": "600", "cursor": "pointer"}, "actionLabel": "+ Add Item"}, {"click": {"name": "addDonationItem", "args": []}})}>
                 {"+ Add Item"}
               </button>
             </label>
             <div {...ui.props("rd-items-container", {"id": "rd-items-container"})}>
               <PageRegion name="rd-items-container" />
             </div>
             <p {...ui.props("rd-items-err", {"className": "field-error", "id": "rd-items-err"})}>
               {ui.content("rd-items-err", <>
               </>)}
             </p>
           </div>
           <div {...ui.props("donor-dashboard-83", {"className": "field"})}>
             <label {...ui.props("donor-dashboard-84", {})}>
               {"Description "}
               <span {...ui.props("donor-dashboard-85", {"className": "req"})}>
                 {"*"}
               </span>
             </label>
             <PageField as="textarea" field="rd-desc" spec={{"id": "rd-desc", "rows": "3", "placeholder": "Describe the items you want to donate and any special handling notes (min 10 chars)..."}}>
             </PageField>
             <p {...ui.props("rd-desc-err", {"className": "field-error", "id": "rd-desc-err"})}>
               {ui.content("rd-desc-err", <>
               </>)}
             </p>
           </div>
           <div {...ui.props("donor-dashboard-88", {"style": {"background": "#eff6ff", "border": "1px solid #bfdbfe", "borderRadius": "10px", "padding": "14px 16px", "marginBottom": "16px"}})}>
             <div {...ui.props("donor-dashboard-89", {"style": {"fontSize": ".78rem", "fontWeight": "600", "color": "#1e40af", "marginBottom": "6px"}})}>
               {"🚚 Pickup Details"}
             </div>
             <div {...ui.props("donor-dashboard-90", {"className": "field"})}>
               <label {...ui.props("donor-dashboard-91", {})}>
                 {"Pickup Address "}
                 <span {...ui.props("donor-dashboard-92", {"className": "req"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="textarea" field="rd-address" spec={{"id": "rd-address", "rows": "2", "placeholder": "Full address with pin code (min 10 chars)"}}>
               </PageField>
               <p {...ui.props("rd-address-err", {"className": "field-error", "id": "rd-address-err"})}>
                 {ui.content("rd-address-err", <>
                 </>)}
               </p>
             </div>
             <div {...ui.props("donor-dashboard-95", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "12px"}})}>
               <div {...ui.props("donor-dashboard-96", {"className": "field"})}>
                 <label {...ui.props("donor-dashboard-97", {})}>
                   {"Preferred Date "}
                   <span {...ui.props("donor-dashboard-98", {"className": "req"})}>
                     {"*"}
                   </span>
                 </label>
                 <PageField as="input" field="rd-date" spec={{"type": "date", "id": "rd-date"}} />
                 <p {...ui.props("rd-date-err", {"className": "field-error", "id": "rd-date-err"})}>
                   {ui.content("rd-date-err", <>
                   </>)}
                 </p>
               </div>
               <div {...ui.props("donor-dashboard-101", {"className": "field"})}>
                 <label {...ui.props("donor-dashboard-102", {})}>
                   {"Time Slot "}
                   <span {...ui.props("donor-dashboard-103", {"className": "req"})}>
                     {"*"}
                   </span>
                 </label>
                 <PageField as="select" field="rd-timeslot" spec={{"id": "rd-timeslot"}}>
                   <option {...ui.props("donor-dashboard-105", {"value": ""})}>
                     {"— Select —"}
                   </option>
                   <option {...ui.props("donor-dashboard-106", {"value": "Morning (9AM-12PM)"})}>
                     {"Morning (9AM-12PM)"}
                   </option>
                   <option {...ui.props("donor-dashboard-107", {"value": "Afternoon (12PM-4PM)"})}>
                     {"Afternoon (12PM-4PM)"}
                   </option>
                   <option {...ui.props("donor-dashboard-108", {"value": "Evening (4PM-7PM)"})}>
                     {"Evening (4PM-7PM)"}
                   </option>
                 </PageField>
                 <p {...ui.props("rd-timeslot-err", {"className": "field-error", "id": "rd-timeslot-err"})}>
                   {ui.content("rd-timeslot-err", <>
                   </>)}
                 </p>
               </div>
             </div>
           </div>
           <div {...ui.props("donor-dashboard-110", {"className": "field"})}>
             <label {...ui.props("donor-dashboard-111", {})}>
               {"Allocate to Program "}
               <span {...ui.props("donor-dashboard-112", {"style": {"fontWeight": "400", "fontSize": ".75rem", "color": "#64748b"}})}>
                 {"(optional)"}
               </span>
             </label>
              <label className="fulfillment-field">Recipient Organization<PageField as="select" field="res-org" spec={{id:'res-org',required:true,'aria-label':'Recipient Organization'}}><option value="">Select organization</option>{ui.data('organizations').map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</PageField></label>
              <label className="fulfillment-field">Resource Photo (optional)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>ui.selectFile('resource-photo',e.target.files?.[0])}/></label>
              <PageField as="select" field="rd-program" spec={{"id": "rd-program"}}>
               <option {...ui.props("donor-dashboard-114", {"value": ""})}>
                 {"— No specific program —"}
               </option>
             </PageField>
           </div>
           <div {...ui.props("donor-dashboard-115", {"className": "modal-actions"})}>
             <button {...ui.props("donor-dashboard-116", {"type": "button", "className": "btn-modal-cancel", "actionLabel": "Cancel"}, {"click": {"name": "closeResourceDonationModal", "args": []}})}>
               {"Cancel"}
             </button>
             <button {...ui.props("donor-dashboard-117", {"type": "submit", "className": "btn-modal-save", "style": {"background": "linear-gradient(135deg,#10b981,#059669)"}, "actionLabel": "📦 Submit Donation"})}>
               {"📦 Submit Donation"}
             </button>
           </div>
           </>)}
         </form>
       </div>
     </div>
   </PageModal>
  </>;
}
