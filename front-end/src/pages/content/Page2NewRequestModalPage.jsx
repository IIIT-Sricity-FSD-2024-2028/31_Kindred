import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageModal, PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function Page2NewRequestModalPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("page2-new-request-modal-1", {"className": "page-wrapper", "style": {"filter": "blur(1px)", "pointerEvents": "none", "userSelect": "none"}, "data-react-page": "/page2-new-request-modal.html"})}>
     <div {...ui.props("page2-new-request-modal-2", {"className": "page-header"})}>
       <div {...ui.props("page2-new-request-modal-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("page2-new-request-modal-4", {})}>
           {"Welcome, Kavya"}
         </h1>
         <p {...ui.props("page2-new-request-modal-5", {})}>
           {"Track your assistance requests and manage your support activities here."}
         </p>
       </div>
       <button {...ui.props("page2-new-request-modal-6", {"className": "btn-new-request", "style": {"pointerEvents": "none"}, "type": "button", "actionLabel": "New Request"})}>
         <svg {...ui.props("page2-new-request-modal-7", {"width": "14", "height": "14", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5"})}>
           <line {...ui.props("page2-new-request-modal-8", {"x1": "12", "y1": "5", "x2": "12", "y2": "19"})}>
           </line>
           <line {...ui.props("page2-new-request-modal-9", {"x1": "5", "y1": "12", "x2": "19", "y2": "12"})}>
           </line>
         </svg>
         {" New Request "}
       </button>
     </div>
     <PageTabs />
     <div {...ui.props("page2-new-request-modal-10", {"className": "stats-grid"})}>
       <div {...ui.props("page2-new-request-modal-11", {"className": "stat-card"})}>
         <div {...ui.props("page2-new-request-modal-12", {"className": "stat-icon blue"})}>
           <svg {...ui.props("page2-new-request-modal-13", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("page2-new-request-modal-14", {"d": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"})}>
             </path>
           </svg>
         </div>
         <div className="stat-value">—</div>
         <div {...ui.props("page2-new-request-modal-16", {"className": "stat-label"})}>
           {"Total Requests"}
         </div>
       </div>
       <div {...ui.props("page2-new-request-modal-17", {"className": "stat-card"})}>
         <div {...ui.props("page2-new-request-modal-18", {"className": "stat-icon orange"})}>
           <svg {...ui.props("page2-new-request-modal-19", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <circle {...ui.props("page2-new-request-modal-20", {"cx": "12", "cy": "12", "r": "10"})}>
             </circle>
             <path {...ui.props("page2-new-request-modal-21", {"d": "M12 8v4l3 3"})}>
             </path>
           </svg>
         </div>
         <div className="stat-value">—</div>
         <div {...ui.props("page2-new-request-modal-23", {"className": "stat-label"})}>
           {"In Progress"}
         </div>
       </div>
       <div {...ui.props("page2-new-request-modal-24", {"className": "stat-card"})}>
         <div {...ui.props("page2-new-request-modal-25", {"className": "stat-icon purple"})}>
           <svg {...ui.props("page2-new-request-modal-26", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("page2-new-request-modal-27", {"d": "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"})}>
             </path>
           </svg>
         </div>
         <div className="stat-value">—</div>
         <div {...ui.props("page2-new-request-modal-29", {"className": "stat-label"})}>
           {"Submitted"}
         </div>
       </div>
       <div {...ui.props("page2-new-request-modal-30", {"className": "stat-card"})}>
         <div {...ui.props("page2-new-request-modal-31", {"className": "stat-icon green"})}>
           <svg {...ui.props("page2-new-request-modal-32", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("page2-new-request-modal-33", {"d": "M22 11.08V12a10 10 0 11-5.93-9.14"})}>
             </path>
             <polyline {...ui.props("page2-new-request-modal-34", {"points": "22 4 12 14.01 9 11.01"})}>
             </polyline>
           </svg>
         </div>
         <div className="stat-value">—</div>
         <div {...ui.props("page2-new-request-modal-36", {"className": "stat-label"})}>
           {"Completed"}
         </div>
       </div>
     </div>
     <div className="requests-list" role="tabpanel" id="beneficiary-panel" aria-labelledby={`dashboard-tab-${ui.activeTab}`}><PageRegion name="beneficiaryRequests" /></div>
     <PageExtras />
   </main>
   <PageModal name="request-modal">
     <div {...ui.props("page2-new-request-modal-38", {"className": "modal"})}>
       <div {...ui.props("page2-new-request-modal-39", {"className": "modal-header"})}>
         <div {...ui.props("page2-new-request-modal-40", {})}>
           <div {...ui.props("page2-new-request-modal-41", {"className": "modal-title"})}>
             {"Submit New Assistance Request"}
           </div>
           <div {...ui.props("page2-new-request-modal-42", {"className": "modal-subtitle"})}>
             {"Your request will be shared to all organizations in the Kindred platform."}
           </div>
         </div>
         <button {...ui.props("page2-new-request-modal-43", {"className": "modal-close", "data-close-modal": "request-modal", "type": "button", "actionLabel": "?"})}>
           {"?"}
         </button>
       </div>
       <div {...ui.props("page2-new-request-modal-44", {"className": "modal-body"})}>
         <div {...ui.props("page2-new-request-modal-45", {"className": "form-notice"})}>
           <svg {...ui.props("page2-new-request-modal-46", {"width": "16", "height": "16", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "style": {"flexShrink": "0", "marginTop": "1px"}})}>
             <circle {...ui.props("page2-new-request-modal-47", {"cx": "12", "cy": "12", "r": "10"})}>
             </circle>
             <path {...ui.props("page2-new-request-modal-48", {"d": "M12 8v4m0 4h.01"})}>
             </path>
           </svg>
           {" By sharing a request with us, you are allowing all Kindred organizations to view this request to find volunteers to help you. We will not share any personal data with these organizations. "}
         </div>
         <form {...ui.props("request-form", {"id": "request-form", "pageForm": true})}>
           {ui.content("request-form", <>
           <div {...ui.props("page2-new-request-modal-50", {"className": "form-grid"})}>
             <div {...ui.props("page2-new-request-modal-51", {"className": "form-group"})}>
               <label {...ui.props("page2-new-request-modal-52", {"className": "form-label"})}>
                 {"Full Name "}
                 <span {...ui.props("page2-new-request-modal-53", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="input" field="fullName" spec={{"type": "text", "className": "form-control", "name": "fullName", "placeholder": "Your full name", "required": true}} />
             </div>
             <div {...ui.props("page2-new-request-modal-55", {"className": "form-group"})}>
               <label {...ui.props("page2-new-request-modal-56", {"className": "form-label"})}>
                 {"Phone Number "}
                 <span {...ui.props("page2-new-request-modal-57", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="input" field="phone" spec={{"type": "tel", "className": "form-control", "name": "phone", "placeholder": "+91 98765 43210", "required": true}} />
             </div>
             <div {...ui.props("page2-new-request-modal-59", {"className": "form-group full"})}>
               <label {...ui.props("page2-new-request-modal-60", {"className": "form-label"})}>
                 {"Location "}
                 <span {...ui.props("page2-new-request-modal-61", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="input" field="location" spec={{"type": "text", "className": "form-control", "name": "location", "placeholder": "e.g. Sanjay Gandhi Nagar, Delhi", "required": true}} />
             </div>
             <div {...ui.props("page2-new-request-modal-63", {"className": "form-group full"})}>
               <label {...ui.props("page2-new-request-modal-64", {"className": "form-label"})}>
                 {"Type of Assistance "}
                 <span {...ui.props("page2-new-request-modal-65", {"className": "required"})}>
                   {"*"}
                 </span>
               </label>
               <div {...ui.props("page2-new-request-modal-66", {"className": "radio-group"})}>
                 <label {...ui.props("page2-new-request-modal-67", {"className": "radio-label", "radioValueLabel": "food"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "food"}} />
                   {" Food"}
                 </label>
                 <label {...ui.props("page2-new-request-modal-69", {"className": "radio-label", "radioValueLabel": "shelter"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "shelter"}} />
                   {" Shelter"}
                 </label>
                 <label {...ui.props("page2-new-request-modal-71", {"className": "radio-label", "radioValueLabel": "medical"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "medical"}} />
                   {" Medical"}
                 </label>
                 <label {...ui.props("page2-new-request-modal-73", {"className": "radio-label", "radioValueLabel": "education"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "education"}} />
                   {" Education"}
                 </label>
                 <label {...ui.props("page2-new-request-modal-75", {"className": "radio-label", "radioValueLabel": "other"})}>
                   <PageField as="input" field="type" spec={{"type": "radio", "name": "type", "radioValue": "other"}} />
                   {" Other Need"}
                 </label>
               </div>
             </div>
             <div {...ui.props("page2-new-request-modal-77", {"className": "form-group full"})}>
               <label {...ui.props("page2-new-request-modal-78", {"className": "form-label"})}>
                 {"Urgency Level"}
               </label>
               <div {...ui.props("page2-new-request-modal-79", {"className": "urgency-group"})}>
                 <button {...ui.props("page2-new-request-modal-80", {"type": "button", "className": "urgency-btn low", "actionLabel": "Low"})}>
                   {"Low"}
                 </button>
                 <button {...ui.props("page2-new-request-modal-81", {"type": "button", "className": "urgency-btn medium selected", "actionLabel": "Medium"})}>
                   {"Medium"}
                 </button>
                 <button {...ui.props("page2-new-request-modal-82", {"type": "button", "className": "urgency-btn high", "actionLabel": "High"})}>
                   {"High"}
                 </button>
                 <button {...ui.props("page2-new-request-modal-83", {"type": "button", "className": "urgency-btn critical", "actionLabel": "Critical"})}>
                   {"Critical"}
                 </button>
               </div>
             </div>
             <div {...ui.props("page2-new-request-modal-84", {"className": "form-group full"})}>
               <label {...ui.props("page2-new-request-modal-85", {"className": "form-label"})}>
                 {"Description"}
               </label>
               <PageField as="textarea" field="description" spec={{"className": "form-control", "name": "description", "placeholder": "Describe the situation and what kind of help is needed..."}}>
               </PageField>
             </div>
           </div>
           <div {...ui.props("page2-new-request-modal-87", {"className": "form-actions"})}>
             <button {...ui.props("page2-new-request-modal-88", {"type": "button", "className": "btn-secondary", "data-close-modal": "request-modal", "actionLabel": "Cancel"})}>
               {"Cancel"}
             </button>
             <button {...ui.props("page2-new-request-modal-89", {"type": "submit", "className": "btn-primary", "actionLabel": "Submit Request"})}>
               {"Submit Request"}
             </button>
           </div>
           <button {...ui.props("broadcast-btn", {"type": "button", "className": "btn-broadcast", "id": "broadcast-btn", "actionLabel": "Broadcast Request to All Organizations"})}>
             {ui.content("broadcast-btn", <>
             <svg {...ui.props("page2-new-request-modal-91", {"width": "15", "height": "15", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
               <path {...ui.props("page2-new-request-modal-92", {"d": "M22 12h-4l-3 9L9 3l-3 9H2"})}>
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
     <div {...ui.props("page2-new-request-modal-94", {"className": "modal", "style": {"maxWidth": "460px"}})}>
       <div {...ui.props("page2-new-request-modal-95", {"className": "confirmation-modal"})}>
         <div {...ui.props("page2-new-request-modal-96", {"className": "confirmation-icon"})}>
           <svg {...ui.props("page2-new-request-modal-97", {"width": "36", "height": "36", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("page2-new-request-modal-98", {"d": "M22 12h-4l-3 9L9 3l-3 9H2"})}>
             </path>
           </svg>
         </div>
         <div {...ui.props("page2-new-request-modal-99", {"className": "confirmation-title"})}>
           {"Request Broadcast Sent"}
         </div>
         <div {...ui.props("page2-new-request-modal-100", {"className": "confirmation-body"})}>
           {" Your assistance request has been broadcast to all organizations on the Kindred platform. You will be notified when an organization responds. Your reference number is: "}
         </div>
         <div {...ui.props("page2-new-request-modal-101", {"className": "confirmation-code"})}>
           {"3008"}
         </div>
         <br {...ui.props("page2-new-request-modal-102", {})} />
         <button {...ui.props("page2-new-request-modal-103", {"className": "btn-back", "data-close-modal": "broadcast-modal", "type": "button", "actionLabel": "Back to Dashboard"})}>
           {"Back to Dashboard"}
         </button>
       </div>
     </div>
   </PageModal>
  </>;
}
