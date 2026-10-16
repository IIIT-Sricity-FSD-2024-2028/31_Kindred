import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageRegion } from '../runtime/PageElements.jsx';

export default function JoinVolunteerPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("join-volunteer-1", {"data-react-page": "/join-volunteer.html"})}>
     <div {...ui.props("join-volunteer-2", {"className": "page-wrap", "style": {"maxWidth": "640px"}})}>
       <div {...ui.props("join-volunteer-3", {"className": "vol-hero"})}>
         <div {...ui.props("join-volunteer-4", {"className": "vol-hero-badge"})}>
           <svg {...ui.props("join-volunteer-5", {"width": "16", "height": "16", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
             <path {...ui.props("join-volunteer-6", {"d": "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"})}>
             </path>
             <circle {...ui.props("join-volunteer-7", {"cx": "9", "cy": "7", "r": "4"})}>
             </circle>
             <path {...ui.props("join-volunteer-8", {"d": "M23 21v-2a4 4 0 0 0-3-3.87"})}>
             </path>
             <path {...ui.props("join-volunteer-9", {"d": "M16 3.13a4 4 0 0 1 0 7.75"})}>
             </path>
           </svg>
           {" Volunteer Registration "}
         </div>
         <h1 {...ui.props("join-volunteer-10", {})}>
           {"Join as a Volunteer"}
         </h1>
         <p {...ui.props("join-volunteer-11", {})}>
           {"Make a difference in communities across India. Tell us about your skills and availability."}
         </p>
       </div>
       <form {...ui.props("join-volunteer-12", {"className": "card vol-card", "pageForm": true})}>
         <div {...ui.props("jv-general-error", {"id": "jv-general-error"})}>
           {ui.content("jv-general-error", <>
           </>)}
         </div>
         <div {...ui.props("join-volunteer-14", {"className": "section-divider"})}>
           <svg {...ui.props("join-volunteer-15", {"width": "16", "height": "16", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
             <path {...ui.props("join-volunteer-16", {"d": "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"})}>
             </path>
             <circle {...ui.props("join-volunteer-17", {"cx": "12", "cy": "7", "r": "4"})}>
             </circle>
           </svg>
           {" Personal Details "}
         </div>
         <div {...ui.props("join-volunteer-18", {"className": "field"})}>
           <label {...ui.props("join-volunteer-19", {})}>
             {"Full Name *"}
           </label>
           <PageField as="input" field="jv-name" spec={{"type": "text", "id": "jv-name", "placeholder": "Your full name"}} />
         </div>
         <div {...ui.props("join-volunteer-21", {"className": "field"})}>
           <label {...ui.props("join-volunteer-22", {})}>
             {"Email *"}
           </label>
           <PageField as="input" field="jv-email" spec={{"type": "email", "id": "jv-email", "placeholder": "you@email.com"}} />
         </div>
         <div {...ui.props("join-volunteer-24", {"className": "field"})}>
           <label {...ui.props("join-volunteer-25", {})}>
             {"Phone Number *"}
           </label>
           <div {...ui.props("join-volunteer-26", {"className": "phone-wrap"})}>
             <span {...ui.props("join-volunteer-27", {"className": "phone-prefix"})}>
               {"+91"}
             </span>
             <PageField as="input" field="jv-phone" spec={{"type": "tel", "id": "jv-phone", "placeholder": "98765 43210"}} />
           </div>
         </div>
         <div {...ui.props("join-volunteer-29", {"className": "field"})}>
           <label {...ui.props("join-volunteer-30", {})}>
             {"Gender *"}
           </label>
           <div {...ui.props("join-volunteer-31", {"className": "gender-grid"})}>
             <button {...ui.props("join-volunteer-32", {"type": "button", "className": "gender-btn", "actionLabel": "👨 Male"}, {"click": {"name": "selectGender", "args": []}})}>
               {"👨 Male"}
             </button>
             <button {...ui.props("join-volunteer-33", {"type": "button", "className": "gender-btn", "actionLabel": "👩 Female"}, {"click": {"name": "selectGender", "args": []}})}>
               {"👩 Female"}
             </button>
             <button {...ui.props("join-volunteer-34", {"type": "button", "className": "gender-btn", "actionLabel": "🧑 Other"}, {"click": {"name": "selectGender", "args": []}})}>
               {"🧑 Other"}
             </button>
           </div>
         </div>
         <div {...ui.props("join-volunteer-35", {"className": "section-divider"})}>
           <svg {...ui.props("join-volunteer-36", {"width": "16", "height": "16", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
             <path {...ui.props("join-volunteer-37", {"d": "M22 11.08V12a10 10 0 1 1-5.93-9.14"})}>
             </path>
             <polyline {...ui.props("join-volunteer-38", {"points": "22 4 12 14.01 9 11.01"})}>
             </polyline>
           </svg>
           {" Skills & Expertise "}
         </div>
         <p {...ui.props("join-volunteer-39", {"style": {"fontSize": ".82rem", "color": "#64748b", "marginBottom": "14px"}})}>
           {"Select all skills that apply to you"}
         </p>
         <div {...ui.props("skillsGrid", {"className": "skills-grid", "id": "skillsGrid"})}>
           {ui.content("skillsGrid", <>
           <label {...ui.props("join-volunteer-41", {"className": "skill-check"})}>
             <PageField as="input" field="skill-teaching" spec={{"type": "checkbox", "name": "skill"}} />
             {" Teaching"}
           </label>
           <label {...ui.props("join-volunteer-43", {"className": "skill-check"})}>
             <PageField as="input" field="skill-medical" spec={{"type": "checkbox", "name": "skill"}} />
             {" Medical Aid"}
           </label>
           <label {...ui.props("join-volunteer-45", {"className": "skill-check"})}>
             <PageField as="input" field="skill-logistics" spec={{"type": "checkbox", "name": "skill"}} />
             {" Logistics"}
           </label>
           <label {...ui.props("join-volunteer-47", {"className": "skill-check"})}>
             <PageField as="input" field="skill-cooking" spec={{"type": "checkbox", "name": "skill"}} />
             {" Cooking"}
           </label>
           <label {...ui.props("join-volunteer-49", {"className": "skill-check"})}>
             <PageField as="input" field="skill-translation" spec={{"type": "checkbox", "name": "skill"}} />
             {" Translation"}
           </label>
           <label {...ui.props("join-volunteer-51", {"className": "skill-check"})}>
             <PageField as="input" field="skill-technology" spec={{"type": "checkbox", "name": "skill"}} />
             {" Technology"}
           </label>
           <label {...ui.props("join-volunteer-53", {"className": "skill-check"})}>
             <PageField as="input" field="skill-counseling" spec={{"type": "checkbox", "name": "skill"}} />
             {" Counseling"}
           </label>
           <label {...ui.props("join-volunteer-55", {"className": "skill-check"})}>
             <PageField as="input" field="skill-driving" spec={{"type": "checkbox", "name": "skill"}} />
             {" Driving"}
           </label>
           <label {...ui.props("join-volunteer-57", {"className": "skill-check"})}>
             <PageField as="input" field="skill-construction" spec={{"type": "checkbox", "name": "skill"}} />
             {" Construction"}
           </label>
           <label {...ui.props("join-volunteer-59", {"className": "skill-check"})}>
             <PageField as="input" field="skill-first-aid" spec={{"type": "checkbox", "name": "skill"}} />
             {" First Aid"}
           </label>
           <label {...ui.props("join-volunteer-61", {"className": "skill-check"})}>
             <PageField as="input" field="skill-fundraising" spec={{"type": "checkbox", "name": "skill"}} />
             {" Fundraising"}
           </label>
           <label {...ui.props("join-volunteer-63", {"className": "skill-check"})}>
             <PageField as="input" field="skill-photography" spec={{"type": "checkbox", "name": "skill"}} />
             {" Photography"}
           </label>
           </>)}
         </div>
         <div {...ui.props("join-volunteer-65", {"style": {"display": "flex", "gap": "8px", "alignItems": "center", "marginBottom": "8px"}})}>
           <PageField as="input" field="jv-custom-skill" spec={{"type": "text", "id": "jv-custom-skill", "placeholder": "Add a custom skill…", "style": {"flex": "1", "padding": "10px 14px", "border": "1.5px solid #e2e8f0", "borderRadius": "10px", "fontFamily": "inherit", "fontSize": ".85rem", "color": "#1e293b", "outline": "none", "transition": "border-color .2s"}, "data-page-node": "jv-custom-skill"}} />
           <button {...ui.props("join-volunteer-67", {"type": "button", "style": {"padding": "10px 18px", "background": "linear-gradient(135deg,#10b981,#059669)", "color": "#fff", "border": "none", "borderRadius": "10px", "fontFamily": "inherit", "fontSize": ".82rem", "fontWeight": "600", "cursor": "pointer", "whiteSpace": "nowrap", "transition": "all .15s"}, "data-page-node": "join-volunteer-67", "actionLabel": "+ Add"}, {"click": {"name": "addCustomSkillJV", "args": []}})}>
             {"+ Add"}
           </button>
         </div>
         <div {...ui.props("customSkillTags", {"id": "customSkillTags", "style": {"display": "flex", "flexWrap": "wrap", "gap": "8px", "marginBottom": "4px"}})}>
           <PageRegion name="customSkillTags" />
         </div>
         <div {...ui.props("join-volunteer-69", {"className": "section-divider"})}>
           <svg {...ui.props("join-volunteer-70", {"width": "16", "height": "16", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
             <circle {...ui.props("join-volunteer-71", {"cx": "12", "cy": "12", "r": "10"})}>
             </circle>
             <polyline {...ui.props("join-volunteer-72", {"points": "12 6 12 12 16 14"})}>
             </polyline>
           </svg>
           {" Availability "}
         </div>
         <p {...ui.props("join-volunteer-73", {"style": {"fontSize": ".82rem", "color": "#64748b", "marginBottom": "14px"}})}>
           {"When are you available to volunteer?"}
         </p>
         <div {...ui.props("availGrid", {"className": "avail-grid", "id": "availGrid"})}>
           {ui.content("availGrid", <>
           <button {...ui.props("join-volunteer-75", {"type": "button", "className": "avail-btn", "data-value": "fulltime", "actionLabel": "🕐\n            Full-Time"}, {"click": {"name": "selectAvailability", "args": []}})}>
             {"🕐 Full-Time"}
           </button>
           <button {...ui.props("join-volunteer-76", {"type": "button", "className": "avail-btn", "data-value": "parttime", "actionLabel": "🕑\n            Part-Time"}, {"click": {"name": "selectAvailability", "args": []}})}>
             {"🕑 Part-Time"}
           </button>
           <button {...ui.props("join-volunteer-77", {"type": "button", "className": "avail-btn", "data-value": "weekends", "actionLabel": "📅 Weekends\n            Only"}, {"click": {"name": "selectAvailability", "args": []}})}>
             {"📅 Weekends Only"}
           </button>
           <button {...ui.props("join-volunteer-78", {"type": "button", "className": "avail-btn", "data-value": "flexible", "actionLabel": "✨\n            Flexible"}, {"click": {"name": "selectAvailability", "args": []}})}>
             {"✨ Flexible"}
           </button>
           </>)}
         </div>
         <div {...ui.props("join-volunteer-79", {"className": "section-divider"})}>
           <svg {...ui.props("join-volunteer-80", {"width": "16", "height": "16", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
             <rect {...ui.props("join-volunteer-81", {"x": "3", "y": "11", "width": "18", "height": "11", "rx": "2", "ry": "2"})}>
             </rect>
             <path {...ui.props("join-volunteer-82", {"d": "M7 11V7a5 5 0 0 1 10 0v4"})}>
             </path>
           </svg>
           {" Account Security "}
         </div>
         <div {...ui.props("join-volunteer-83", {"className": "field pass-wrap"})}>
           <label {...ui.props("join-volunteer-84", {})}>
             {"Password *"}
           </label>
           <PageField as="input" field="jv-pass" spec={{"type": "password", "id": "jv-pass", "placeholder": "••••••••"}} />
           <button {...ui.props("join-volunteer-86", {"type": "button", "className": "pass-eye", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["jv-pass"]}})}>
             <svg {...ui.props("join-volunteer-87", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
               <path {...ui.props("join-volunteer-88", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
               </path>
               <circle {...ui.props("join-volunteer-89", {"cx": "12", "cy": "12", "r": "3"})}>
               </circle>
             </svg>
           </button>
         </div>
         <div {...ui.props("join-volunteer-90", {"className": "field pass-wrap"})}>
           <label {...ui.props("join-volunteer-91", {})}>
             {"Confirm Password *"}
           </label>
           <PageField as="input" field="jv-pass2" spec={{"type": "password", "id": "jv-pass2", "placeholder": "••••••••"}} />
           <button {...ui.props("join-volunteer-93", {"type": "button", "className": "pass-eye", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["jv-pass2"]}})}>
             <svg {...ui.props("join-volunteer-94", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
               <path {...ui.props("join-volunteer-95", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
               </path>
               <circle {...ui.props("join-volunteer-96", {"cx": "12", "cy": "12", "r": "3"})}>
               </circle>
             </svg>
           </button>
         </div>
         <div {...ui.props("join-volunteer-97", {"className": "approval-note"})}>
           <svg {...ui.props("join-volunteer-98", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
             <circle {...ui.props("join-volunteer-99", {"cx": "12", "cy": "12", "r": "10"})}>
             </circle>
             <line {...ui.props("join-volunteer-100", {"x1": "12", "y1": "8", "x2": "12", "y2": "12"})}>
             </line>
             <line {...ui.props("join-volunteer-101", {"x1": "12", "y1": "16", "x2": "12.01", "y2": "16"})}>
             </line>
           </svg>
           {" "}
           <span {...ui.props("join-volunteer-102", {})}>
             {"Your volunteer application will be reviewed by the Platform Administrator before you can access the platform."}
           </span>
         </div>
         <button {...ui.props("btnVolSubmit", {"className": "btn-vol-submit", "id": "btnVolSubmit", "type": "button", "actionLabel": "Submit Volunteer Application"}, {"click": {"name": "submitVolunteerForm", "args": []}})}>
           {ui.content("btnVolSubmit", <>
           {" Submit Volunteer Application "}
           <svg {...ui.props("join-volunteer-104", {"width": "16", "height": "16", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
             <line {...ui.props("join-volunteer-105", {"x1": "5", "y1": "12", "x2": "19", "y2": "12"})}>
             </line>
             <polyline {...ui.props("join-volunteer-106", {"points": "12 5 19 12 12 19"})}>
             </polyline>
           </svg>
           </>)}
         </button>
       </form>
       <p {...ui.props("join-volunteer-107", {"style": {"marginTop": "16px", "fontSize": ".85rem", "color": "rgba(255,255,255,.75)", "textAlign": "center"}})}>
         {" Already have an account? "}
         <Link {...ui.props("join-volunteer-108", {"style": {"color": "#fff", "fontWeight": "700", "textDecoration": "none"}, "actionLabel": "Sign\n          In", "to": "/signin.html"})}>
           {"Sign In"}
         </Link>
         {" · "}
         <Link {...ui.props("join-volunteer-109", {"style": {"color": "#fff", "fontWeight": "700", "textDecoration": "none"}, "actionLabel": "Other Roles", "to": "/signup.html"})}>
           {"Other Roles"}
         </Link>
       </p>
     </div>
     <PageExtras />
   </main>
  </>;
}
