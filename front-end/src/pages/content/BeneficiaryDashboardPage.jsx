import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageModal, PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function BeneficiaryDashboardPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("beneficiary-dashboard-1", {"className": "page-wrapper", "data-react-page": "/beneficiary-dashboard.html"})}>
     <div {...ui.props("beneficiary-dashboard-2", {"className": "page-header"})}>
       <div {...ui.props("beneficiary-dashboard-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("ben-welcome", {"id": "ben-welcome"})}>
           {ui.content("ben-welcome", <>
           {"Welcome, Friend!"}
           </>)}
         </h1>
         <p {...ui.props("beneficiary-dashboard-5", {})}>
           {"Track your assistance requests and manage your support activities here."}
         </p>
       </div>
       <div {...ui.props("beneficiary-dashboard-6", {"style": {"display": "flex", "gap": "10px", "alignItems": "center", "flexWrap": "wrap"}})}>
         <Link {...ui.props("beneficiary-dashboard-7", {"style": {"display": "inline-flex", "alignItems": "center", "gap": "7px", "padding": "10px 18px", "background": "#fff7ed", "color": "#9a3412", "border": "1px solid #fed7aa", "borderRadius": "10px", "fontSize": ".85rem", "fontWeight": "600", "textDecoration": "none", "transition": "all .15s"}, "data-page-node": "beneficiary-dashboard-7", "actionLabel": "👤 Edit Profile", "to": "/profile.html"})}>
           {" 👤 Edit Profile "}
         </Link>
         <button {...ui.props("beneficiary-dashboard-8", {"className": "btn-new-request", "type": "button", "actionLabel": "New Request"})}>
           <svg {...ui.props("beneficiary-dashboard-9", {"width": "14", "height": "14", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5"})}>
             <line {...ui.props("beneficiary-dashboard-10", {"x1": "12", "y1": "5", "x2": "12", "y2": "19"})}>
             </line>
             <line {...ui.props("beneficiary-dashboard-11", {"x1": "5", "y1": "12", "x2": "19", "y2": "12"})}>
             </line>
           </svg>
           {" New Request "}
         </button>
       </div>
     </div>
     <PageTabs />
     <div {...ui.props("ben-onboarding", {"id": "ben-onboarding", "style": {"display": "none", "marginBottom": "24px"}})}>
       {ui.content("ben-onboarding", <>
       <div {...ui.props("beneficiary-dashboard-13", {"style": {"background": "linear-gradient(135deg,#fff7ed,#ffedd5)", "border": "1px solid #fed7aa", "borderRadius": "16px", "padding": "32px 28px"}})}>
         <h3 {...ui.props("beneficiary-dashboard-14", {"style": {"fontSize": "1.1rem", "fontWeight": "700", "color": "#7c2d12", "marginBottom": "6px"}})}>
           {"👋 Getting Started"}
         </h3>
         <p {...ui.props("beneficiary-dashboard-15", {"style": {"color": "#9a3412", "fontSize": ".88rem", "marginBottom": "20px"}})}>
           {"You haven't requested any assistance yet. We're here to help — take your first step:"}
         </p>
         <div {...ui.props("beneficiary-dashboard-16", {"style": {"display": "grid", "gridTemplateColumns": "repeat(auto-fill,minmax(160px,1fr))", "gap": "12px"}})}>
           <div {...ui.props("beneficiary-dashboard-17", {"style": {"background": "#fff", "border": "1px solid #fed7aa", "borderRadius": "12px", "padding": "16px", "textAlign": "center", "cursor": "pointer", "transition": "all .2s"}, "data-page-node": "beneficiary-dashboard-17", "actionLabel": "📝\n            Submit a Request\n            Ask for food, shelter, medical aid"}, {"click": {"name": "openModal", "args": ["request-modal"]}})}>
             <div {...ui.props("beneficiary-dashboard-18", {"style": {"fontSize": "1.8rem", "marginBottom": "8px"}})}>
               {"📝"}
             </div>
             <div {...ui.props("beneficiary-dashboard-19", {"style": {"fontSize": ".82rem", "fontWeight": "700", "color": "#7c2d12"}})}>
               {"Submit a Request"}
             </div>
             <div {...ui.props("beneficiary-dashboard-20", {"style": {"fontSize": ".74rem", "color": "#64748b", "marginTop": "4px"}})}>
               {"Ask for food, shelter, medical aid"}
             </div>
           </div>
           <div {...ui.props("beneficiary-dashboard-21", {"style": {"background": "#fff", "border": "1px solid #fed7aa", "borderRadius": "12px", "padding": "16px", "textAlign": "center", "cursor": "pointer", "transition": "all .2s"}, "data-page-node": "beneficiary-dashboard-21", "actionLabel": "🚨\n            Emergency Help\n            Urgent 24/7 support"}, {"click": {"name": "navigate", "args": ["emergency-request.html"]}})}>
             <div {...ui.props("beneficiary-dashboard-22", {"style": {"fontSize": "1.8rem", "marginBottom": "8px"}})}>
               {"🚨"}
             </div>
             <div {...ui.props("beneficiary-dashboard-23", {"style": {"fontSize": ".82rem", "fontWeight": "700", "color": "#7c2d12"}})}>
               {"Emergency Help"}
             </div>
             <div {...ui.props("beneficiary-dashboard-24", {"style": {"fontSize": ".74rem", "color": "#64748b", "marginTop": "4px"}})}>
               {"Urgent 24/7 support"}
             </div>
           </div>
           <div {...ui.props("beneficiary-dashboard-25", {"style": {"background": "#fff", "border": "1px solid #fed7aa", "borderRadius": "12px", "padding": "16px", "textAlign": "center", "cursor": "pointer", "transition": "all .2s"}, "data-page-node": "beneficiary-dashboard-25", "actionLabel": "📞\n            Contact Us\n            Speak to a support advisor"}, {"click": {"name": "navigate", "args": ["contact.html"]}})}>
             <div {...ui.props("beneficiary-dashboard-26", {"style": {"fontSize": "1.8rem", "marginBottom": "8px"}})}>
               {"📞"}
             </div>
             <div {...ui.props("beneficiary-dashboard-27", {"style": {"fontSize": ".82rem", "fontWeight": "700", "color": "#7c2d12"}})}>
               {"Contact Us"}
             </div>
             <div {...ui.props("beneficiary-dashboard-28", {"style": {"fontSize": ".74rem", "color": "#64748b", "marginTop": "4px"}})}>
               {"Speak to a support advisor"}
             </div>
           </div>
         </div>
       </div>
       </>)}
     </div>
     <div {...ui.props("beneficiary-dashboard-29", {"className": "stats-grid"})}>
       <div {...ui.props("beneficiary-dashboard-30", {"className": "stat-card"})}>
         <div {...ui.props("beneficiary-dashboard-31", {"className": "stat-icon blue"})}>
           <svg {...ui.props("beneficiary-dashboard-32", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("beneficiary-dashboard-33", {"d": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"})}>
             </path>
           </svg>
         </div>
         <div className="stat-value">{ui.content("ben-stat-total", 0)}</div>
         <div {...ui.props("beneficiary-dashboard-35", {"className": "stat-label"})}>
           {"Total Requests"}
         </div>
       </div>
       <div {...ui.props("beneficiary-dashboard-36", {"className": "stat-card"})}>
         <div {...ui.props("beneficiary-dashboard-37", {"className": "stat-icon orange"})}>
           <svg {...ui.props("beneficiary-dashboard-38", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <circle {...ui.props("beneficiary-dashboard-39", {"cx": "12", "cy": "12", "r": "10"})}>
             </circle>
             <path {...ui.props("beneficiary-dashboard-40", {"d": "M12 8v4l3 3"})}>
             </path>
           </svg>
         </div>
         <div className="stat-value">{ui.content("ben-stat-progress", 0)}</div>
         <div {...ui.props("beneficiary-dashboard-42", {"className": "stat-label"})}>
           {"In Progress"}
         </div>
       </div>
       <div {...ui.props("beneficiary-dashboard-43", {"className": "stat-card"})}>
         <div {...ui.props("beneficiary-dashboard-44", {"className": "stat-icon purple"})}>
           <svg {...ui.props("beneficiary-dashboard-45", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("beneficiary-dashboard-46", {"d": "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"})}>
             </path>
           </svg>
         </div>
         <div className="stat-value">{ui.content("ben-stat-submitted", 0)}</div>
         <div {...ui.props("beneficiary-dashboard-48", {"className": "stat-label"})}>
           {"Submitted"}
         </div>
       </div>
       <div {...ui.props("beneficiary-dashboard-49", {"className": "stat-card"})}>
         <div {...ui.props("beneficiary-dashboard-50", {"className": "stat-icon green"})}>
           <svg {...ui.props("beneficiary-dashboard-51", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("beneficiary-dashboard-52", {"d": "M22 11.08V12a10 10 0 11-5.93-9.14"})}>
             </path>
             <polyline {...ui.props("beneficiary-dashboard-53", {"points": "22 4 12 14.01 9 11.01"})}>
             </polyline>
           </svg>
         </div>
         <div className="stat-value">{ui.content("ben-stat-completed", 0)}</div>
         <div {...ui.props("beneficiary-dashboard-55", {"className": "stat-label"})}>
           {"Completed"}
         </div>
       </div>
     </div>
     <div {...ui.props("beneficiary-dashboard-56", {"className": "section-title"})}>
       {"Requests"}
     </div>
     <div className="requests-list" role="tabpanel" id="beneficiary-panel" aria-labelledby={`dashboard-tab-${ui.activeTab}`}><PageRegion name="beneficiaryRequests" /></div>
     <div {...ui.props("beneficiary-dashboard-58", {"className": "emergency-banner"})}>
       <div {...ui.props("beneficiary-dashboard-59", {"className": "emergency-banner-text"})}>
         <svg {...ui.props("beneficiary-dashboard-60", {"width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
           <path {...ui.props("beneficiary-dashboard-61", {"d": "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"})}>
           </path>
           <line {...ui.props("beneficiary-dashboard-62", {"x1": "12", "y1": "9", "x2": "12", "y2": "13"})}>
           </line>
           <line {...ui.props("beneficiary-dashboard-63", {"x1": "12", "y1": "17", "x2": "12.01", "y2": "17"})}>
           </line>
         </svg>
         <div {...ui.props("beneficiary-dashboard-64", {})}>
           <strong {...ui.props("beneficiary-dashboard-65", {})}>
             {"Need Immediate Help?"}
           </strong>
           <p {...ui.props("beneficiary-dashboard-66", {})}>
             {"Our emergency response team is available 24/7. Call now for urgent support required."}
           </p>
         </div>
       </div>
     </div>
     <PageExtras />
   </main>
   <PageModal name="request-modal">
     <div {...ui.props("beneficiary-dashboard-68", {"className": "modal"})}>
       <div {...ui.props("beneficiary-dashboard-69", {"className": "modal-header"})}>
         <div {...ui.props("beneficiary-dashboard-70", {})}>
           <div {...ui.props("beneficiary-dashboard-71", {"className": "modal-title"})}>
             {"Submit New Assistance Request"}
           </div>
           <div {...ui.props("beneficiary-dashboard-72", {"className": "modal-subtitle"})}>
             {"Your request will be shared to all organizations in the Kindred platform."}
           </div>
         </div>
         <button {...ui.props("beneficiary-dashboard-73", {"className": "modal-close", "data-close-modal": "request-modal", "type": "button", "actionLabel": "✕"})}>
           {"✕"}
         </button>
       </div>
       <div {...ui.props("beneficiary-dashboard-74", {"className": "modal-body"})}>
         <div {...ui.props("beneficiary-dashboard-75", {"className": "form-notice"})}>
           <svg {...ui.props("beneficiary-dashboard-76", {"width": "16", "height": "16", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "style": {"flexShrink": "0", "marginTop": "1px"}})}>
             <circle {...ui.props("beneficiary-dashboard-77", {"cx": "12", "cy": "12", "r": "10"})}>
             </circle>
             <path {...ui.props("beneficiary-dashboard-78", {"d": "M12 8v4m0 4h.01"})}>
             </path>
           </svg>
           {" By sharing a request with us, you are allowing all Kindred organizations to view this request to find volunteers to help you. We will not share any personal data with these organizations. "}
         </div>
         <form {...ui.props("request-form", {"id": "request-form", "pageForm": true})}>
           {ui.content("request-form", <>
           <div {...ui.props("beneficiary-dashboard-80", {"className": "form-grid"})}>
             <div {...ui.props("beneficiary-dashboard-81", {"className": "form-group"})}>
               <label {...ui.props("beneficiary-dashboard-82", {"className": "form-label"})}>
                 {"Full Name "}
                 <span {...ui.props("beneficiary-dashboard-83", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="input" field="fullName" spec={{"type": "text", "className": "form-control", "name": "fullName", "placeholder": "Your full name", "required": true}} />
             </div>
             <div {...ui.props("beneficiary-dashboard-85", {"className": "form-group"})}>
               <label {...ui.props("beneficiary-dashboard-86", {"className": "form-label"})}>
                 {"Phone Number "}
                 <span {...ui.props("beneficiary-dashboard-87", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="input" field="phone" spec={{"type": "tel", "className": "form-control", "name": "phone", "placeholder": "+91 98765 43210", "required": true}} />
             </div>
             <div {...ui.props("beneficiary-dashboard-89", {"className": "form-group full"})}>
               <label {...ui.props("beneficiary-dashboard-90", {"className": "form-label"})}>
                 {"Location "}
                 <span {...ui.props("beneficiary-dashboard-91", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="input" field="location" spec={{"type": "text", "className": "form-control", "name": "location", "placeholder": "e.g. Sanjay Gandhi Nagar, Delhi", "required": true}} />
             </div>
             <div {...ui.props("beneficiary-dashboard-93", {"className": "form-group full"})}>
               <label {...ui.props("beneficiary-dashboard-94", {"className": "form-label"})}>
                 {"Type of Assistance "}
                 <span {...ui.props("beneficiary-dashboard-95", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <div {...ui.props("beneficiary-dashboard-96", {"className": "radio-group"})}>
                 <label {...ui.props("beneficiary-dashboard-97", {"className": "radio-label", "radioValueLabel": "food"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "food"}} />
                   {" Food"}
                 </label>
                 <label {...ui.props("beneficiary-dashboard-99", {"className": "radio-label", "radioValueLabel": "shelter"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "shelter"}} />
                   {" Shelter"}
                 </label>
                 <label {...ui.props("beneficiary-dashboard-101", {"className": "radio-label", "radioValueLabel": "medical"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "medical"}} />
                   {" Medical"}
                 </label>
                 <label {...ui.props("beneficiary-dashboard-103", {"className": "radio-label", "radioValueLabel": "education"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "education"}} />
                   {" Education"}
                 </label>
                 <label {...ui.props("beneficiary-dashboard-105", {"className": "radio-label", "radioValueLabel": "other"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "other"}} />
                   {" Other Need"}
                 </label>
               </div>
             </div>
             <div {...ui.props("beneficiary-dashboard-107", {"className": "form-group full"})}>
               <label {...ui.props("beneficiary-dashboard-108", {"className": "form-label"})}>
                 {"Urgency Level"}
               </label>
               <div {...ui.props("beneficiary-dashboard-109", {"className": "urgency-group"})}>
                 <button {...ui.props("beneficiary-dashboard-110", {"type": "button", "className": "urgency-btn low", "actionLabel": "Low"})}>
                   {"Low"}
                 </button>
                 <button {...ui.props("beneficiary-dashboard-111", {"type": "button", "className": "urgency-btn medium selected", "actionLabel": "Medium"})}>
                   {"Medium"}
                 </button>
                 <button {...ui.props("beneficiary-dashboard-112", {"type": "button", "className": "urgency-btn high", "actionLabel": "High"})}>
                   {"High"}
                 </button>
                 <button {...ui.props("beneficiary-dashboard-113", {"type": "button", "className": "urgency-btn critical", "actionLabel": "Critical"})}>
                   {"Critical"}
                 </button>
               </div>
             </div>
             <div {...ui.props("beneficiary-dashboard-114", {"className": "form-group full"})}>
               <label {...ui.props("beneficiary-dashboard-115", {"className": "form-label"})}>
                 {"Description"}
               </label>
               <PageField as="textarea" field="description" spec={{"className": "form-control", "name": "description", "placeholder": "Describe the situation and what kind of help is needed..."}}>
               </PageField>
             </div>
           </div>
           <div {...ui.props("beneficiary-dashboard-117", {"className": "form-actions"})}>
             <button {...ui.props("beneficiary-dashboard-118", {"type": "button", "className": "btn-secondary", "data-close-modal": "request-modal", "actionLabel": "Cancel"})}>
               {"Cancel"}
             </button>
             <button {...ui.props("beneficiary-dashboard-119", {"type": "submit", "className": "btn-primary", "actionLabel": "Submit Request"})}>
               {"Submit Request"}
             </button>
           </div>
           <button {...ui.props("broadcast-btn", {"type": "button", "className": "btn-broadcast", "id": "broadcast-btn", "actionLabel": "Broadcast Request to All Organizations"})}>
             {ui.content("broadcast-btn", <>
             <svg {...ui.props("beneficiary-dashboard-121", {"width": "15", "height": "15", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
               <path {...ui.props("beneficiary-dashboard-122", {"d": "M22 12h-4l-3 9L9 3l-3 9H2"})}>
               </path>
             </svg>
             {" Broadcast Request to All Organizations "}
             </>)}
           </button>
           </>)}
         </form>
       </div>
     </div>
   </PageModal>
   <PageModal name="broadcast-modal">
     <div {...ui.props("beneficiary-dashboard-124", {"className": "modal", "style": {"maxWidth": "460px"}})}>
       <div {...ui.props("beneficiary-dashboard-125", {"className": "confirmation-modal"})}>
         <div {...ui.props("beneficiary-dashboard-126", {"className": "confirmation-icon"})}>
           <svg {...ui.props("beneficiary-dashboard-127", {"width": "36", "height": "36", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("beneficiary-dashboard-128", {"d": "M22 12h-4l-3 9L9 3l-3 9H2"})}>
             </path>
           </svg>
         </div>
         <div {...ui.props("beneficiary-dashboard-129", {"className": "confirmation-title"})}>
           {"Request Broadcast Sent"}
         </div>
         <div {...ui.props("beneficiary-dashboard-130", {"className": "confirmation-body"})}>
           {" Your assistance request has been broadcast to all organizations on the Kindred platform. You will be notified when an organization responds. Your reference number is: "}
         </div>
         <div {...ui.props("beneficiary-dashboard-131", {"className": "confirmation-code"})}>
           {"3008"}
         </div>
         <br {...ui.props("beneficiary-dashboard-132", {})} />
         <button {...ui.props("beneficiary-dashboard-133", {"className": "btn-back", "data-close-modal": "broadcast-modal", "type": "button", "actionLabel": "Back to Dashboard"})}>
           {"Back to Dashboard"}
         </button>
       </div>
     </div>
   </PageModal>
  </>;
}
