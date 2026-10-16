import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageModal, PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function Page5ConnectedNotificationPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("page5-connected-notification-1", {"className": "page-wrapper", "data-react-page": "/page5-connected-notification.html"})}>
     <div {...ui.props("page5-connected-notification-2", {"className": "page-header"})}>
       <div {...ui.props("page5-connected-notification-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("page5-connected-notification-4", {})}>
           {"Welcome, Kavya"}
         </h1>
         <p {...ui.props("page5-connected-notification-5", {})}>
           {"Track your assistance requests and manage your support activities here."}
         </p>
       </div>
       <button {...ui.props("page5-connected-notification-6", {"className": "btn-new-request", "type": "button", "actionLabel": "New Request"})}>
         <svg {...ui.props("page5-connected-notification-7", {"width": "14", "height": "14", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5"})}>
           <line {...ui.props("page5-connected-notification-8", {"x1": "12", "y1": "5", "x2": "12", "y2": "19"})}>
           </line>
           <line {...ui.props("page5-connected-notification-9", {"x1": "5", "y1": "12", "x2": "19", "y2": "12"})}>
           </line>
         </svg>
         {" New Request "}
       </button>
     </div>
     <PageTabs />
     <div {...ui.props("page5-connected-notification-10", {"className": "stats-grid"})}>
       <div {...ui.props("page5-connected-notification-11", {"className": "stat-card"})}>
         <div {...ui.props("page5-connected-notification-12", {"className": "stat-icon blue"})}>
           <svg {...ui.props("page5-connected-notification-13", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("page5-connected-notification-14", {"d": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"})}>
             </path>
           </svg>
         </div>
         <div className="stat-value">—</div>
         <div {...ui.props("page5-connected-notification-16", {"className": "stat-label"})}>
           {"Unanswered"}
         </div>
       </div>
       <div {...ui.props("page5-connected-notification-17", {"className": "stat-card"})}>
         <div {...ui.props("page5-connected-notification-18", {"className": "stat-icon orange"})}>
           <svg {...ui.props("page5-connected-notification-19", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <circle {...ui.props("page5-connected-notification-20", {"cx": "12", "cy": "12", "r": "10"})}>
             </circle>
             <path {...ui.props("page5-connected-notification-21", {"d": "M12 8v4l3 3"})}>
             </path>
           </svg>
         </div>
         <div className="stat-value">—</div>
         <div {...ui.props("page5-connected-notification-23", {"className": "stat-label"})}>
           {"1 In Progress"}
         </div>
       </div>
       <div {...ui.props("page5-connected-notification-24", {"className": "stat-card"})}>
         <div {...ui.props("page5-connected-notification-25", {"className": "stat-icon purple"})}>
           <svg {...ui.props("page5-connected-notification-26", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("page5-connected-notification-27", {"d": "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"})}>
             </path>
           </svg>
         </div>
         <div className="stat-value">—</div>
         <div {...ui.props("page5-connected-notification-29", {"className": "stat-label"})}>
           {"Submitted"}
         </div>
       </div>
       <div {...ui.props("page5-connected-notification-30", {"className": "stat-card"})}>
         <div {...ui.props("page5-connected-notification-31", {"className": "stat-icon green"})}>
           <svg {...ui.props("page5-connected-notification-32", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("page5-connected-notification-33", {"d": "M22 11.08V12a10 10 0 11-5.93-9.14"})}>
             </path>
             <polyline {...ui.props("page5-connected-notification-34", {"points": "22 4 12 14.01 9 11.01"})}>
             </polyline>
           </svg>
         </div>
         <div className="stat-value">—</div>
         <div {...ui.props("page5-connected-notification-36", {"className": "stat-label"})}>
           {"Waiting"}
         </div>
       </div>
     </div>
     <div {...ui.props("org-connected-banner", {"className": "inline-notification success", "id": "org-connected-banner", "data-autodismiss": "8000"})}>
       {ui.content("org-connected-banner", <>
       <svg {...ui.props("page5-connected-notification-38", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.2", "style": {"flexShrink": "0", "marginTop": "1px"}})}>
         <path {...ui.props("page5-connected-notification-39", {"d": "M22 11.08V12a10 10 0 11-5.93-9.14"})}>
         </path>
         <polyline {...ui.props("page5-connected-notification-40", {"points": "22 4 12 14.01 9 11.01"})}>
         </polyline>
       </svg>
       <div {...ui.props("page5-connected-notification-41", {})}>
         <strong {...ui.props("page5-connected-notification-42", {})}>
           {"Get to Organization"}
         </strong>
         {" "}
         <span {...ui.props("page5-connected-notification-43", {})}>
           {"You've successfully connected to an organization. They will review your request shortly."}
         </span>
       </div>
       <button {...ui.props("page5-connected-notification-44", {"style": {"marginLeft": "auto", "background": "none", "border": "none", "cursor": "pointer", "color": "var(--success)", "fontSize": "18px", "lineHeight": "1"}, "type": "button", "actionLabel": "×"}, {"click": {"name": "closeModal", "args": ["org-connected-banner"]}})}>
         {"×"}
       </button>
       </>)}
     </div>
     <div {...ui.props("org-response-banner", {"className": "inline-notification info", "id": "org-response-banner", "data-autodismiss": "10000"})}>
       {ui.content("org-response-banner", <>
       <svg {...ui.props("page5-connected-notification-46", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "style": {"flexShrink": "0", "marginTop": "1px"}})}>
         <circle {...ui.props("page5-connected-notification-47", {"cx": "12", "cy": "12", "r": "10"})}>
         </circle>
         <path {...ui.props("page5-connected-notification-48", {"d": "M12 8v4m0 4h.01"})}>
         </path>
       </svg>
       <div {...ui.props("page5-connected-notification-49", {})}>
         <strong {...ui.props("page5-connected-notification-50", {})}>
           {"Connect to Organization Text"}
         </strong>
         {" "}
         <span {...ui.props("page5-connected-notification-51", {})}>
           {"Organization has accepted your request. You can view the details and track progress below."}
         </span>
       </div>
       <button {...ui.props("page5-connected-notification-52", {"style": {"marginLeft": "auto", "background": "none", "border": "none", "cursor": "pointer", "color": "var(--info)", "fontSize": "18px", "lineHeight": "1"}, "type": "button", "actionLabel": "×"}, {"click": {"name": "closeModal", "args": ["org-response-banner"]}})}>
         {"×"}
       </button>
       </>)}
     </div>
     <div {...ui.props("page5-connected-notification-53", {"className": "section-title", "style": {"marginTop": "8px"}})}>
       {"My Requests"}
     </div>
     <div className="requests-list" role="tabpanel" id="beneficiary-panel" aria-labelledby={`dashboard-tab-${ui.activeTab}`}><PageRegion name="beneficiaryRequests" /></div>
     <div {...ui.props("page5-connected-notification-55", {"className": "emergency-banner"})}>
       <div {...ui.props("page5-connected-notification-56", {"className": "emergency-banner-text"})}>
         <svg {...ui.props("page5-connected-notification-57", {"width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
           <path {...ui.props("page5-connected-notification-58", {"d": "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"})}>
           </path>
           <line {...ui.props("page5-connected-notification-59", {"x1": "12", "y1": "9", "x2": "12", "y2": "13"})}>
           </line>
           <line {...ui.props("page5-connected-notification-60", {"x1": "12", "y1": "17", "x2": "12.01", "y2": "17"})}>
           </line>
         </svg>
         <div {...ui.props("page5-connected-notification-61", {})}>
           <strong {...ui.props("page5-connected-notification-62", {})}>
             {"Need Immediate Help?"}
           </strong>
           <p {...ui.props("page5-connected-notification-63", {})}>
             {"Our emergency response team is available 24/7. Call now for urgent support required."}
           </p>
         </div>
       </div>
       <button {...ui.props("page5-connected-notification-64", {"className": "btn-call-helpline", "type": "button", "actionLabel": "📞 Call Helpline"})}>
         {"📞 Call Helpline"}
       </button>
     </div>
     <PageExtras />
   </main>
   <PageModal name="request-modal">
     <div {...ui.props("page5-connected-notification-66", {"className": "modal"})}>
       <div {...ui.props("page5-connected-notification-67", {"className": "modal-header"})}>
         <div {...ui.props("page5-connected-notification-68", {})}>
           <div {...ui.props("page5-connected-notification-69", {"className": "modal-title"})}>
             {"Submit New Assistance Request"}
           </div>
           <div {...ui.props("page5-connected-notification-70", {"className": "modal-subtitle"})}>
             {"Your request will be shared to all organizations in the Kindred platform."}
           </div>
         </div>
         <button {...ui.props("page5-connected-notification-71", {"className": "modal-close", "data-close-modal": "request-modal", "type": "button", "actionLabel": "✕"})}>
           {"✕"}
         </button>
       </div>
       <div {...ui.props("page5-connected-notification-72", {"className": "modal-body"})}>
         <div {...ui.props("page5-connected-notification-73", {"className": "form-notice"})}>
           <svg {...ui.props("page5-connected-notification-74", {"width": "16", "height": "16", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "style": {"flexShrink": "0", "marginTop": "1px"}})}>
             <circle {...ui.props("page5-connected-notification-75", {"cx": "12", "cy": "12", "r": "10"})}>
             </circle>
             <path {...ui.props("page5-connected-notification-76", {"d": "M12 8v4m0 4h.01"})}>
             </path>
           </svg>
           {" By sharing a request with us, you are allowing all Kindred organizations to view this request to find volunteers to help you. "}
         </div>
         <form {...ui.props("request-form", {"id": "request-form", "pageForm": true})}>
           {ui.content("request-form", <>
           <div {...ui.props("page5-connected-notification-78", {"className": "form-grid"})}>
             <div {...ui.props("page5-connected-notification-79", {"className": "form-group"})}>
               <label {...ui.props("page5-connected-notification-80", {"className": "form-label"})}>
                 {"Full Name "}
                 <span {...ui.props("page5-connected-notification-81", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="input" field="fullName" spec={{"type": "text", "className": "form-control", "name": "fullName", "placeholder": "Your full name", "required": true}} />
             </div>
             <div {...ui.props("page5-connected-notification-83", {"className": "form-group"})}>
               <label {...ui.props("page5-connected-notification-84", {"className": "form-label"})}>
                 {"Phone Number "}
                 <span {...ui.props("page5-connected-notification-85", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="input" field="phone" spec={{"type": "tel", "className": "form-control", "name": "phone", "placeholder": "+91 98765 43210", "required": true}} />
             </div>
             <div {...ui.props("page5-connected-notification-87", {"className": "form-group full"})}>
               <label {...ui.props("page5-connected-notification-88", {"className": "form-label"})}>
                 {"Location "}
                 <span {...ui.props("page5-connected-notification-89", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="input" field="location" spec={{"type": "text", "className": "form-control", "name": "location", "placeholder": "e.g. Sanjay Gandhi Nagar, Delhi", "required": true}} />
             </div>
             <div {...ui.props("page5-connected-notification-91", {"className": "form-group full"})}>
               <label {...ui.props("page5-connected-notification-92", {"className": "form-label"})}>
                 {"Type of Assistance "}
                 <span {...ui.props("page5-connected-notification-93", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <div {...ui.props("page5-connected-notification-94", {"className": "radio-group"})}>
                 <label {...ui.props("page5-connected-notification-95", {"className": "radio-label", "radioValueLabel": "food"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "food"}} />
                   {" Food"}
                 </label>
                 <label {...ui.props("page5-connected-notification-97", {"className": "radio-label", "radioValueLabel": "shelter"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "shelter"}} />
                   {" Shelter"}
                 </label>
                 <label {...ui.props("page5-connected-notification-99", {"className": "radio-label", "radioValueLabel": "medical"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "medical"}} />
                   {" Medical"}
                 </label>
                 <label {...ui.props("page5-connected-notification-101", {"className": "radio-label", "radioValueLabel": "other"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "other"}} />
                   {" Other Need"}
                 </label>
               </div>
             </div>
             <div {...ui.props("page5-connected-notification-103", {"className": "form-group full"})}>
               <label {...ui.props("page5-connected-notification-104", {"className": "form-label"})}>
                 {"Urgency Level"}
               </label>
               <div {...ui.props("page5-connected-notification-105", {"className": "urgency-group"})}>
                 <button {...ui.props("page5-connected-notification-106", {"type": "button", "className": "urgency-btn low", "actionLabel": "Low"})}>
                   {"Low"}
                 </button>
                 <button {...ui.props("page5-connected-notification-107", {"type": "button", "className": "urgency-btn medium selected", "actionLabel": "Medium"})}>
                   {"Medium"}
                 </button>
                 <button {...ui.props("page5-connected-notification-108", {"type": "button", "className": "urgency-btn high", "actionLabel": "High"})}>
                   {"High"}
                 </button>
                 <button {...ui.props("page5-connected-notification-109", {"type": "button", "className": "urgency-btn critical", "actionLabel": "Critical"})}>
                   {"Critical"}
                 </button>
               </div>
             </div>
             <div {...ui.props("page5-connected-notification-110", {"className": "form-group full"})}>
               <label {...ui.props("page5-connected-notification-111", {"className": "form-label"})}>
                 {"Description"}
               </label>
               <PageField as="textarea" field="description" spec={{"className": "form-control", "name": "description", "placeholder": "Describe the situation..."}}>
               </PageField>
             </div>
           </div>
           <div {...ui.props("page5-connected-notification-113", {"className": "form-actions"})}>
             <button {...ui.props("page5-connected-notification-114", {"type": "button", "className": "btn-secondary", "data-close-modal": "request-modal", "actionLabel": "Cancel"})}>
               {"Cancel"}
             </button>
             <button {...ui.props("page5-connected-notification-115", {"type": "submit", "className": "btn-primary", "actionLabel": "Submit Request"})}>
               {"Submit Request"}
             </button>
           </div>
           <button {...ui.props("broadcast-btn", {"type": "button", "className": "btn-broadcast", "id": "broadcast-btn", "actionLabel": "Broadcast Request to All Organizations"})}>
             {ui.content("broadcast-btn", <>
             <svg {...ui.props("page5-connected-notification-117", {"width": "15", "height": "15", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
               <path {...ui.props("page5-connected-notification-118", {"d": "M22 12h-4l-3 9L9 3l-3 9H2"})}>
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
     <div {...ui.props("page5-connected-notification-120", {"className": "modal", "style": {"maxWidth": "460px"}})}>
       <div {...ui.props("page5-connected-notification-121", {"className": "confirmation-modal"})}>
         <div {...ui.props("page5-connected-notification-122", {"className": "confirmation-icon"})}>
           <svg {...ui.props("page5-connected-notification-123", {"width": "36", "height": "36", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("page5-connected-notification-124", {"d": "M22 12h-4l-3 9L9 3l-3 9H2"})}>
             </path>
           </svg>
         </div>
         <div {...ui.props("page5-connected-notification-125", {"className": "confirmation-title"})}>
           {"Request Broadcast Sent"}
         </div>
         <div {...ui.props("page5-connected-notification-126", {"className": "confirmation-body"})}>
           {"Your request has been broadcast to all organizations. Reference:"}
         </div>
         <div {...ui.props("page5-connected-notification-127", {"className": "confirmation-code"})}>
           {"3008"}
         </div>
         <br {...ui.props("page5-connected-notification-128", {})} />
         <button {...ui.props("page5-connected-notification-129", {"className": "btn-back", "data-close-modal": "broadcast-modal", "type": "button", "actionLabel": "Back to Dashboard"})}>
           {"Back to Dashboard"}
         </button>
       </div>
     </div>
   </PageModal>
  </>;
}
