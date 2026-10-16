import FormError from '../../components/pages/FormError.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function ForgotPasswordPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("forgot-password-1", {"data-react-page": "/forgot-password.html"})}>
     <div {...ui.props("forgot-password-2", {"className": "page-wrap fp-card"})}>
       <img {...ui.props("forgot-password-3", {"src": "LOGO.jpeg", "className": "logo-pill-img", "alt": "Kindred"})} />
       <h1 {...ui.props("forgot-password-4", {"className": "screen-title"})}>
         {"Forgot Password?"}
       </h1>
       <p {...ui.props("forgot-password-5", {"className": "screen-sub"})}>
         {"Enter your registered mobile number to receive an OTP"}
       </p>
       <div {...ui.props("forgot-password-6", {"className": "card"})}>
         <FormError />
         <div {...ui.props("forgot-password-7", {"className": "field"})}>
           <label {...ui.props("forgot-password-8", {})}>
             <svg {...ui.props("forgot-password-9", {"width": "13", "height": "13", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24", "style": {"verticalAlign": "middle", "marginRight": "4px"}})}>
               <path {...ui.props("forgot-password-10", {"d": "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.71 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.91.35 1.85.58 2.81.71A2 2 0 0 1 22 16.92z"})}>
               </path>
             </svg>
             {" Registered Mobile Number "}
           </label>
           <div {...ui.props("fp-phone-wrap", {"className": "phone-wrap", "id": "fp-phone-wrap"})}>
             {ui.content("fp-phone-wrap", <>
             <span {...ui.props("forgot-password-12", {"className": "phone-prefix"})}>
               {"🇮🇳 +91"}
             </span>
             <PageField as="input" field="fp-phone" spec={{"type": "tel", "id": "fp-phone", "placeholder": "98765 43210", "maxLength": "10"}} />
             </>)}
           </div>
           <p {...ui.props("forgot-password-14", {"className": "hint"})}>
             {"Enter the 10-digit number linked to your Kindred account."}
           </p>
           <p {...ui.props("fp-phone-error", {"id": "fp-phone-error", "style": {"display": "none", "color": "#ef4444", "fontSize": ".75rem", "marginTop": "4px"}})}>
             {ui.content("fp-phone-error", <>
             </>)}
           </p>
         </div>
         <p {...ui.props("forgot-password-16", {"className": "section-lbl"})}>
           {"Your Role"}
         </p>
         <div {...ui.props("fp-role-list", {"className": "role-list", "id": "fp-role-list"})}>
           {ui.content("fp-role-list", <>
           <button {...ui.props("forgot-password-18", {"className": "role-list-item", "data-role": "platform", "type": "button", "actionLabel": "Platform Administrator"}, {"click": {"name": "selectFPRole", "args": []}})}>
             <span {...ui.props("forgot-password-19", {"className": "role-radio"})}>
               <span {...ui.props("forgot-password-20", {"className": "role-radio-dot"})}>
               </span>
             </span>
             {" Platform Administrator "}
           </button>
           <button {...ui.props("forgot-password-21", {"className": "role-list-item", "data-role": "org", "type": "button", "actionLabel": "Organization Admin"}, {"click": {"name": "selectFPRole", "args": []}})}>
             <span {...ui.props("forgot-password-22", {"className": "role-radio"})}>
               <span {...ui.props("forgot-password-23", {"className": "role-radio-dot"})}>
               </span>
             </span>
             {" Organization Admin "}
           </button>
           <button {...ui.props("forgot-password-24", {"className": "role-list-item", "data-role": "volunteer", "type": "button", "actionLabel": "Volunteer"}, {"click": {"name": "selectFPRole", "args": []}})}>
             <span {...ui.props("forgot-password-25", {"className": "role-radio"})}>
               <span {...ui.props("forgot-password-26", {"className": "role-radio-dot"})}>
               </span>
             </span>
             {" Volunteer "}
           </button>
           <button {...ui.props("forgot-password-27", {"className": "role-list-item", "data-role": "donor", "type": "button", "actionLabel": "Donor"}, {"click": {"name": "selectFPRole", "args": []}})}>
             <span {...ui.props("forgot-password-28", {"className": "role-radio"})}>
               <span {...ui.props("forgot-password-29", {"className": "role-radio-dot"})}>
               </span>
             </span>
             {" Donor "}
           </button>
           <button {...ui.props("forgot-password-30", {"className": "role-list-item", "data-role": "beneficiary", "type": "button", "actionLabel": "Beneficiary"}, {"click": {"name": "selectFPRole", "args": []}})}>
             <span {...ui.props("forgot-password-31", {"className": "role-radio"})}>
               <span {...ui.props("forgot-password-32", {"className": "role-radio-dot"})}>
               </span>
             </span>
             {" Beneficiary "}
           </button>
           </>)}
         </div>
         <p {...ui.props("fp-role-error", {"id": "fp-role-error", "style": {"display": "none", "color": "#ef4444", "fontSize": ".75rem", "marginBottom": "14px"}})}>
           {ui.content("fp-role-error", <>
           </>)}
         </p>
         <button {...ui.props("forgot-password-34", {"className": "btn-send", "type": "button", "actionLabel": "Send OTP"}, {"click": {"name": "sendFPOTP", "args": []}})}>
           <svg {...ui.props("forgot-password-35", {"width": "15", "height": "15", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
             <line {...ui.props("forgot-password-36", {"x1": "22", "y1": "2", "x2": "11", "y2": "13"})}>
             </line>
             <polygon {...ui.props("forgot-password-37", {"points": "22 2 15 22 11 13 2 9 22 2"})}>
             </polygon>
           </svg>
           {" Send OTP "}
         </button>
         <button {...ui.props("forgot-password-38", {"className": "btn-back", "type": "button", "actionLabel": "← Back to Sign In"}, {"click": {"name": "navigate", "args": ["signin.html"]}})}>
           {"← Back to Sign In"}
         </button>
       </div>
     </div>
     <PageExtras inlineError />
   </main>
  </>;
}
