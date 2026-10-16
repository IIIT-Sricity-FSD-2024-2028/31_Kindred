import FormError from '../../components/pages/FormError.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function ResetPasswordPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("reset-password-1", {"data-react-page": "/reset-password.html"})}>
     <div {...ui.props("reset-password-2", {"className": "page-wrap", "style": {"maxWidth": "460px"}})}>
       <img {...ui.props("reset-password-3", {"src": "LOGO.jpeg", "className": "logo-pill-img", "alt": "Kindred"})} />
       <h1 {...ui.props("reset-password-4", {"className": "screen-title"})}>
         {"Set New Password"}
       </h1>
       <p {...ui.props("reset-password-5", {"className": "screen-sub"})}>
         {"Create a strong new password for your account"}
       </p>
       <div {...ui.props("reset-password-6", {"className": "card"})}>
         <FormError />
         <div {...ui.props("reset-password-7", {"style": {"textAlign": "center"}})}>
           <span {...ui.props("reset-password-8", {"className": "verified-badge"})}>
             <svg {...ui.props("reset-password-9", {"width": "13", "height": "13", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
               <polyline {...ui.props("reset-password-10", {"points": "20 6 9 17 4 12"})}>
               </polyline>
             </svg>
             {" OTP verified "}
             <span {...ui.props("rp-role-badge", {"id": "rp-role-badge", "style": {"color": "var(--blue)", "marginLeft": "4px"}})}>
               {ui.content("rp-role-badge", <>
               {"Volunteer"}
               </>)}
             </span>
           </span>
         </div>
         <div {...ui.props("reset-password-12", {"className": "field pass-wrap"})}>
           <label {...ui.props("reset-password-13", {})}>
             <svg {...ui.props("reset-password-14", {"width": "13", "height": "13", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24", "style": {"verticalAlign": "middle", "marginRight": "4px"}})}>
               <rect {...ui.props("reset-password-15", {"x": "3", "y": "11", "width": "18", "height": "11", "rx": "2", "ry": "2"})}>
               </rect>
               <path {...ui.props("reset-password-16", {"d": "M7 11V7a5 5 0 0 1 10 0v4"})}>
               </path>
             </svg>
             {" New Password "}
           </label>
           <PageField as="input" field="rp-pass" spec={{"type": "password", "id": "rp-pass", "placeholder": "Minimum 8 characters"}} />
           <button {...ui.props("reset-password-18", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["rp-pass"]}})}>
             <svg {...ui.props("reset-password-19", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
               <path {...ui.props("reset-password-20", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
               </path>
               <circle {...ui.props("reset-password-21", {"cx": "12", "cy": "12", "r": "3"})}>
               </circle>
             </svg>
           </button>
           <div {...ui.props("reset-password-22", {"className": "pass-strength"})}>
             <div {...ui.props("reset-password-23", {"className": "pass-strength-bar"})}>
               <div {...ui.props("strength-bar", {"className": "pass-strength-fill", "id": "strength-bar"})}>
                 {ui.content("strength-bar", <>
                 </>)}
               </div>
             </div>
             <p {...ui.props("strength-label", {"id": "strength-label", "style": {"fontSize": ".72rem", "marginTop": "3px", "color": "var(--light)"}})}>
               {ui.content("strength-label", <>
               </>)}
             </p>
           </div>
         </div>
         <div {...ui.props("reset-password-26", {"className": "field pass-wrap"})}>
           <label {...ui.props("reset-password-27", {})}>
             <svg {...ui.props("reset-password-28", {"width": "13", "height": "13", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24", "style": {"verticalAlign": "middle", "marginRight": "4px"}})}>
               <rect {...ui.props("reset-password-29", {"x": "3", "y": "11", "width": "18", "height": "11", "rx": "2", "ry": "2"})}>
               </rect>
               <path {...ui.props("reset-password-30", {"d": "M7 11V7a5 5 0 0 1 10 0v4"})}>
               </path>
             </svg>
             {" Confirm New Password "}
           </label>
           <PageField as="input" field="rp-pass2" spec={{"type": "password", "id": "rp-pass2", "placeholder": "Re-enter new password"}} />
           <button {...ui.props("reset-password-32", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["rp-pass2"]}})}>
             <svg {...ui.props("reset-password-33", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
               <path {...ui.props("reset-password-34", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
               </path>
               <circle {...ui.props("reset-password-35", {"cx": "12", "cy": "12", "r": "3"})}>
               </circle>
             </svg>
           </button>
         </div>
         <p {...ui.props("rp-error", {"id": "rp-error", "style": {"display": "none", "color": "#ef4444", "fontSize": ".8rem", "marginBottom": "14px"}})}>
           {ui.content("rp-error", <>
           </>)}
         </p>
         <button {...ui.props("reset-password-37", {"className": "btn-reset", "type": "button", "actionLabel": "Reset Password"}, {"click": {"name": "resetPassword", "args": []}})}>
           <svg {...ui.props("reset-password-38", {"width": "15", "height": "15", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24", "style": {"verticalAlign": "middle", "marginRight": "6px"}})}>
             <rect {...ui.props("reset-password-39", {"x": "3", "y": "11", "width": "18", "height": "11", "rx": "2", "ry": "2"})}>
             </rect>
             <path {...ui.props("reset-password-40", {"d": "M7 11V7a5 5 0 0 1 10 0v4"})}>
             </path>
           </svg>
           {" Reset Password "}
         </button>
       </div>
     </div>
     <PageExtras inlineError />
   </main>
  </>;
}
