import FormError from '../../components/pages/FormError.jsx';
import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function SigninPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("signin-1", {"data-react-page": "/signin.html"})}>
     <div {...ui.props("signin-2", {"className": "page-wrap", "style": {"maxWidth": "480px"}})}>
       <img {...ui.props("signin-3", {"src": "LOGO.jpeg", "className": "logo-pill-img", "alt": "Kindred"})} />
       <h1 {...ui.props("signin-4", {"className": "screen-title"})}>
         {"Welcome Back"}
       </h1>
       <form {...ui.props("signin-5", {"className": "card", "pageForm": true})}>
         <FormError />
         <div {...ui.props("signin-6", {"className": "si-tabs"})}>
           <button {...ui.props("tab-signin", {"className": "si-tab active", "id": "tab-signin", "type": "button", "actionLabel": "Sign In"})}>
             {ui.content("tab-signin", <>
             {"Sign In"}
             </>)}
           </button>
           <button {...ui.props("signin-8", {"className": "si-tab", "type": "button", "actionLabel": "Sign Up"}, {"click": {"name": "navigate", "args": ["signup.html"]}})}>
             {"Sign Up"}
           </button>
         </div>
         <p {...ui.props("signin-9", {"className": "role-list-label"})}>
           {"Role"}
         </p>
         <div {...ui.props("signin-10", {"className": "role-list"})}>
           <button {...ui.props("signin-11", {"className": "role-list-item", "data-role": "platform", "type": "button", "actionLabel": "Platform Administrator"}, {"click": {"name": "selectSignInRole", "args": []}})}>
             <span {...ui.props("signin-12", {"className": "role-icon icon-platform"})}>
               <svg {...ui.props("signin-13", {"width": "16", "height": "16", "fill": "none", "stroke": "#7c3aed", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <rect {...ui.props("signin-14", {"x": "2", "y": "7", "width": "20", "height": "14", "rx": "2"})}>
                 </rect>
                 <path {...ui.props("signin-15", {"d": "M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"})}>
                 </path>
               </svg>
             </span>
             {" Platform Administrator "}
           </button>
           <button {...ui.props("signin-16", {"className": "role-list-item", "data-role": "org", "type": "button", "actionLabel": "Organization Admin"}, {"click": {"name": "selectSignInRole", "args": []}})}>
             <span {...ui.props("signin-17", {"className": "role-icon icon-org"})}>
               <svg {...ui.props("signin-18", {"width": "16", "height": "16", "fill": "none", "stroke": "#3b82f6", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <rect {...ui.props("signin-19", {"x": "3", "y": "3", "width": "7", "height": "7"})}>
                 </rect>
                 <rect {...ui.props("signin-20", {"x": "14", "y": "3", "width": "7", "height": "7"})}>
                 </rect>
                 <rect {...ui.props("signin-21", {"x": "3", "y": "14", "width": "7", "height": "7"})}>
                 </rect>
                 <rect {...ui.props("signin-22", {"x": "14", "y": "14", "width": "7", "height": "7"})}>
                 </rect>
               </svg>
             </span>
             {" Organization Admin "}
           </button>
           <button {...ui.props("signin-23", {"className": "role-list-item", "data-role": "volunteer", "type": "button", "actionLabel": "Volunteer"}, {"click": {"name": "selectSignInRole", "args": []}})}>
             <span {...ui.props("signin-24", {"className": "role-icon icon-vol"})}>
               <svg {...ui.props("signin-25", {"width": "16", "height": "16", "fill": "none", "stroke": "#10b981", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signin-26", {"d": "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"})}>
                 </path>
                 <circle {...ui.props("signin-27", {"cx": "9", "cy": "7", "r": "4"})}>
                 </circle>
               </svg>
             </span>
             {" Volunteer "}
           </button>
           <button {...ui.props("signin-28", {"className": "role-list-item", "data-role": "donor", "type": "button", "actionLabel": "Donor"}, {"click": {"name": "selectSignInRole", "args": []}})}>
             <span {...ui.props("signin-29", {"className": "role-icon icon-donor"})}>
               <svg {...ui.props("signin-30", {"width": "16", "height": "16", "fill": "none", "stroke": "#f59e0b", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signin-31", {"d": "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"})}>
                 </path>
               </svg>
             </span>
             {" Donor "}
           </button>
           <button {...ui.props("signin-32", {"className": "role-list-item", "data-role": "beneficiary", "type": "button", "actionLabel": "Beneficiary"}, {"click": {"name": "selectSignInRole", "args": []}})}>
             <span {...ui.props("signin-33", {"className": "role-icon icon-ben"})}>
               <svg {...ui.props("signin-34", {"width": "16", "height": "16", "fill": "none", "stroke": "#8b5cf6", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signin-35", {"d": "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"})}>
                 </path>
                 <circle {...ui.props("signin-36", {"cx": "9", "cy": "7", "r": "4"})}>
                 </circle>
                 <path {...ui.props("signin-37", {"d": "M23 21v-2a4 4 0 0 0-3-3.87"})}>
                 </path>
                 <path {...ui.props("signin-38", {"d": "M16 3.13a4 4 0 0 1 0 7.75"})}>
                 </path>
               </svg>
             </span>
             {" Beneficiary "}
           </button>
           <button {...ui.props("signin-39", {"className": "role-list-item", "data-role": "seller", "type": "button", "actionLabel": "Seller / Artisan"}, {"click": {"name": "selectSignInRole", "args": []}})}>
             <span {...ui.props("signin-40", {"className": "role-icon icon-seller", "style": {"background": "#ccfbf1"}})}>
               <svg {...ui.props("signin-41", {"width": "16", "height": "16", "fill": "none", "stroke": "#0d9488", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signin-42", {"d": "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"})}>
                 </path>
                 <line {...ui.props("signin-43", {"x1": "3", "y1": "6", "x2": "21", "y2": "6"})}>
                 </line>
                 <path {...ui.props("signin-44", {"d": "M16 10a4 4 0 0 1-8 0"})}>
                 </path>
               </svg>
             </span>
             {" Seller / Artisan "}
           </button>
         </div>
         <div {...ui.props("adminTeamSelector", {"id": "adminTeamSelector", "style": {"display": "none", "marginTop": "-6px", "marginBottom": "18px", "background": "#f8fafc", "padding": "12px", "borderRadius": "12px", "border": "1px solid #e2e8f0"}})}>
           {ui.content("adminTeamSelector", <>
           <label {...ui.props("signin-46", {"style": {"fontSize": ".75rem", "fontWeight": "700", "color": "#64748b", "textTransform": "uppercase", "letterSpacing": ".5px", "display": "block", "marginBottom": "8px"}})}>
             {"Choose Admin Account / Team"}
           </label>
           <div {...ui.props("signin-47", {"style": {"display": "grid", "gridTemplateColumns": "1fr", "gap": "6px"}})}>
             <button {...ui.props("signin-48", {"type": "button", "className": "admin-subteam-btn", "style": {"display": "flex", "alignItems": "center", "justifyContent": "space-between", "padding": "8px 12px", "background": "#fff", "border": "1.5px solid #6366f1", "borderRadius": "8px", "fontSize": ".82rem", "fontWeight": "600", "color": "#1e293b", "cursor": "pointer", "textAlign": "left"}, "actionLabel": "👑 Master Super-Admin (All Modules)\n            super@kindred.org"}, {"click": {"name": "selectAdminSubteam", "args": ["master"]}})}>
               <span {...ui.props("signin-49", {})}>
                 {"👑 Master Super-Admin (All Modules)"}
               </span>
               {" "}
               <span {...ui.props("signin-50", {"style": {"fontSize": ".72rem", "color": "#6366f1", "fontWeight": "700"}})}>
                 {"super@kindred.org"}
               </span>
             </button>
             <button {...ui.props("signin-51", {"type": "button", "className": "admin-subteam-btn", "style": {"display": "flex", "alignItems": "center", "justifyContent": "space-between", "padding": "8px 12px", "background": "#fff", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontSize": ".82rem", "fontWeight": "600", "color": "#1e293b", "cursor": "pointer", "textAlign": "left"}, "actionLabel": "🛡️ Team 1: Users, Approvals & Inbox\n            admin1@kindred.org"}, {"click": {"name": "selectAdminSubteam", "args": ["team1"]}})}>
               <span {...ui.props("signin-52", {})}>
                 {"🛡️ Team 1: Users, Approvals & Inbox"}
               </span>
               {" "}
               <span {...ui.props("signin-53", {"style": {"fontSize": ".72rem", "color": "#6366f1", "fontWeight": "700"}})}>
                 {"admin1@kindred.org"}
               </span>
             </button>
             <button {...ui.props("signin-54", {"type": "button", "className": "admin-subteam-btn", "style": {"display": "flex", "alignItems": "center", "justifyContent": "space-between", "padding": "8px 12px", "background": "#fff", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontSize": ".82rem", "fontWeight": "600", "color": "#1e293b", "cursor": "pointer", "textAlign": "left"}, "actionLabel": "🛍️ Team 2: Shop & Donations\n            admin2@kindred.org"}, {"click": {"name": "selectAdminSubteam", "args": ["team2"]}})}>
               <span {...ui.props("signin-55", {})}>
                 {"🛍️ Team 2: Shop & Donations"}
               </span>
               {" "}
               <span {...ui.props("signin-56", {"style": {"fontSize": ".72rem", "color": "#0d9488", "fontWeight": "700"}})}>
                 {"admin2@kindred.org"}
               </span>
             </button>
           </div>
           </>)}
         </div>
         <p {...ui.props("si-role-error", {"id": "si-role-error", "style": {"display": "none", "color": "#ef4444", "fontSize": ".75rem", "marginTop": "-14px", "marginBottom": "14px"}})}>
           {ui.content("si-role-error", <>
           {"Please select your role"}
           </>)}
         </p>
         <div {...ui.props("signin-58", {"className": "field"})}>
           <label {...ui.props("signin-59", {})}>
             {"Email"}
           </label>
           <PageField as="input" field="si-email" spec={{"type": "email", "id": "si-email", "placeholder": "you@example.com"}} />
           <p {...ui.props("si-email-error", {"id": "si-email-error", "style": {"display": "none", "color": "#ef4444", "fontSize": ".75rem", "marginTop": "4px"}})}>
             {ui.content("si-email-error", <>
             </>)}
           </p>
         </div>
         <div {...ui.props("signin-62", {"className": "field pass-wrap", "style": {"marginBottom": "0"}})}>
           <label {...ui.props("signin-63", {})}>
             {"Password"}
           </label>
           <PageField as="input" field="si-pass" spec={{"type": "password", "id": "si-pass", "placeholder": "........"}} />
           <button {...ui.props("signin-65", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["si-pass"]}})}>
             <svg {...ui.props("signin-66", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
               <path {...ui.props("signin-67", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
               </path>
               <circle {...ui.props("signin-68", {"cx": "12", "cy": "12", "r": "3"})}>
               </circle>
             </svg>
           </button>
           <p {...ui.props("si-pass-error", {"id": "si-pass-error", "style": {"display": "none", "color": "#ef4444", "fontSize": ".75rem", "marginTop": "4px"}})}>
             {ui.content("si-pass-error", <>
             </>)}
           </p>
         </div>
         <Link {...ui.props("signin-70", {"className": "forgot-link", "actionLabel": "Forgot Password?", "to": "/forgot-password.html"})}>
           {"Forgot Password?"}
         </Link>
         <button {...ui.props("signin-71", {"className": "btn-signin-main", "type": "button", "actionLabel": "Sign In"}, {"click": {"name": "signIn", "args": []}})}>
           {" Sign In "}
           <svg {...ui.props("signin-72", {"width": "16", "height": "16", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
             <line {...ui.props("signin-73", {"x1": "5", "y1": "12", "x2": "19", "y2": "12"})}>
             </line>
             <polyline {...ui.props("signin-74", {"points": "12 5 19 12 12 19"})}>
             </polyline>
           </svg>
         </button>
       </form>
     </div>
     <PageExtras inlineError />
   </main>
  </>;
}
