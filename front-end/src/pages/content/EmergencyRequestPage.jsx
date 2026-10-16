import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function EmergencyRequestPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("emergency-request-1", {"data-react-page": "/emergency-request.html"})}>
     <div {...ui.props("emergency-request-2", {"className": "page-wrap", "style": {"maxWidth": "560px"}})}>
       <div {...ui.props("emergency-request-3", {"className": "emergency-icon-wrap"})}>
         {"🚨"}
       </div>
       <h1 {...ui.props("emergency-request-4", {"className": "screen-title", "style": {"color": "#ef4444"}})}>
         {"Emergency Request"}
       </h1>
       <p {...ui.props("emergency-request-5", {"className": "screen-sub"})}>
         {"No login required — submit your request and nearby organizations will be notified."}
       </p>
       <div {...ui.props("emergency-request-6", {"className": "card"})}>
         <form {...ui.props("emergencyRequestForm", {"id": "emergencyRequestForm", "pageForm": true})}>
           {ui.content("emergencyRequestForm", <>
           <div {...ui.props("emergency-request-8", {"className": "field-row"})}>
             <div {...ui.props("emergency-request-9", {"className": "field"})}>
               <label {...ui.props("emergency-request-10", {})}>
                 {"Full Name "}
                 <span {...ui.props("emergency-request-11", {"className": "req"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="input" field="er-name" spec={{"type": "text", "id": "er-name", "placeholder": "Enter your full name", "required": true}} />
             </div>
             <div {...ui.props("emergency-request-13", {"className": "field"})}>
               <label {...ui.props("emergency-request-14", {})}>
                 {"Phone Number "}
                 <span {...ui.props("emergency-request-15", {"className": "req"})}>
                   {"*"}
                 </span>
               </label>
               <PageField as="input" field="er-phone" spec={{"type": "tel", "id": "er-phone", "placeholder": "+91 98765 43210", "required": true}} />
             </div>
           </div>
           <div {...ui.props("emergency-request-17", {"className": "field", "style": {"position": "relative"}})}>
             <label {...ui.props("emergency-request-18", {})}>
               {"Location "}
               <span {...ui.props("emergency-request-19", {"className": "req"})}>
                 {"*"}
               </span>
             </label>
             <PageField as="input" field="er-location" spec={{"type": "text", "id": "er-location", "placeholder": "Address or location details", "required": true}} />
             <a {...ui.props("currentLocationLink", {"href": "#", "id": "currentLocationLink", "style": {"position": "absolute", "right": "0", "top": "0", "fontSize": "0.75rem", "color": "var(--blue)", "fontWeight": "600", "textDecoration": "none"}, "actionLabel": "📍 Use my location"})}>
               {ui.content("currentLocationLink", <>
               {"📍 Use my location"}
               </>)}
             </a>
           </div>
           <div {...ui.props("emergency-request-22", {"className": "field"})}>
             <label {...ui.props("emergency-request-23", {})}>
               {"Emergency Type "}
               <span {...ui.props("emergency-request-24", {"className": "req"})}>
                 {"*"}
               </span>
             </label>
             <div {...ui.props("emergencyTypePills", {"className": "pill-grid", "id": "emergencyTypePills"})}>
               {ui.content("emergencyTypePills", <>
               <button {...ui.props("emergency-request-26", {"type": "button", "className": "pill-btn", "actionLabel": "Flood"})}>
                 {"Flood"}
               </button>
               <button {...ui.props("emergency-request-27", {"type": "button", "className": "pill-btn", "actionLabel": "Earthquake"})}>
                 {"Earthquake"}
               </button>
               <button {...ui.props("emergency-request-28", {"type": "button", "className": "pill-btn", "actionLabel": "Fire"})}>
                 {"Fire"}
               </button>
               <button {...ui.props("emergency-request-29", {"type": "button", "className": "pill-btn", "actionLabel": "Medical"})}>
                 {"Medical"}
               </button>
               <button {...ui.props("emergency-request-30", {"type": "button", "className": "pill-btn", "actionLabel": "Food Shortage"})}>
                 {"Food Shortage"}
               </button>
               <button {...ui.props("emergency-request-31", {"type": "button", "className": "pill-btn", "actionLabel": "Displacement"})}>
                 {"Displacement"}
               </button>
               <button {...ui.props("emergency-request-32", {"type": "button", "className": "pill-btn", "actionLabel": "Cyclone"})}>
                 {"Cyclone"}
               </button>
               <button {...ui.props("emergency-request-33", {"type": "button", "className": "pill-btn", "actionLabel": "Other"})}>
                 {"Other"}
               </button>
               </>)}
             </div>
             <PageField as="input" field="selectedEmergencyType" spec={{"type": "hidden", "id": "selectedEmergencyType", "required": true}} />
           </div>
           <div {...ui.props("emergency-request-35", {"className": "field"})}>
             <label {...ui.props("emergency-request-36", {})}>
               {"Description "}
               <span {...ui.props("emergency-request-37", {"className": "req"})}>
                 {"*"}
               </span>
             </label>
             <PageField as="textarea" field="er-desc" spec={{"id": "er-desc", "placeholder": "Describe the situation and help needed...", "rows": "4", "required": true}}>
             </PageField>
           </div>
           <div {...ui.props("emergency-request-39", {"className": "field"})}>
             <label {...ui.props("emergency-request-40", {})}>
               {"Photo (Optional)"}
             </label>
             <PageField as="input" field="emergency-request-41" spec={{"type": "file", "accept": "image/*", "style": {"padding": "9px"}}} />
           </div>
           <button {...ui.props("er-submit-btn", {"type": "submit", "className": "btn btn-emergency", "id": "er-submit-btn", "style": {"marginTop": "10px"}, "actionLabel": "🚨 Submit Emergency Request"})}>
             {ui.content("er-submit-btn", <>
             {" 🚨 Submit Emergency Request "}
             </>)}
           </button>
           <Link {...ui.props("emergency-request-43", {"className": "back-link", "style": {"display": "flex", "justifyContent": "center", "marginTop": "20px"}, "actionLabel": "← Cancel & Back", "to": "/index.html"})}>
             {" ← Cancel & Back "}
           </Link>
           </>)}
         </form>
         <div {...ui.props("er-success-banner", {"id": "er-success-banner", "style": {"display": "none", "background": "linear-gradient(135deg,#22c55e,#16a34a)", "color": "#fff", "borderRadius": "12px", "padding": "18px 20px", "marginTop": "20px", "textAlign": "center"}})}>
           {ui.content("er-success-banner", <>
           <div {...ui.props("emergency-request-45", {"style": {"fontSize": "2rem", "marginBottom": "8px"}})}>
             {"✅"}
           </div>
           <strong {...ui.props("emergency-request-46", {"style": {"fontSize": "1rem"}})}>
             {"Emergency Request Submitted!"}
           </strong>
           <p {...ui.props("emergency-request-47", {"style": {"margin": "6px 0 0", "fontSize": ".85rem", "opacity": ".9"}})}>
             {"Your request has been sent to the platform admin and nearby organizations."}
           </p>
           <p {...ui.props("emergency-request-48", {"style": {"margin": "8px 0 0", "fontSize": ".8rem", "opacity": ".8"}})}>
             {"Reference ID: "}
             <strong {...ui.props("er-ref-id", {"id": "er-ref-id"})}>
               {ui.content("er-ref-id", <>
               </>)}
             </strong>
           </p>
           </>)}
         </div>
       </div>
     </div>
     <PageExtras />
   </main>
  </>;
}
