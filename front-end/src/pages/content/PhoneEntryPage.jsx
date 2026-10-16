import FormError from '../../components/pages/FormError.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function PhoneEntryPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("phone-entry-1", {"data-react-page": "/phone-entry.html"})}>
     <div {...ui.props("phone-entry-2", {"className": "page-wrap"})}>
       <img {...ui.props("phone-entry-3", {"src": "LOGO.jpeg", "className": "logo-pill-img", "alt": "Kindred"})} />
       <h1 {...ui.props("phone-entry-4", {"className": "screen-title"})}>
         {"Verify Your Phone"}
       </h1>
       <p {...ui.props("phone-entry-5", {"className": "screen-sub"})}>
         {"Complete verification to access your dashboard"}
       </p>
       <div {...ui.props("phone-entry-6", {"className": "card"})}>
         <FormError />
         <div {...ui.props("phone-entry-7", {"className": "field"})}>
           <label {...ui.props("phone-entry-8", {})}>
             {"Phone Number"}
           </label>
           <div {...ui.props("phone-wrap", {"className": "phone-wrap", "id": "phone-wrap"})}>
             {ui.content("phone-wrap", <>
             <span {...ui.props("phone-entry-10", {"className": "phone-prefix"})}>
               {"+91"}
             </span>
             <PageField as="input" field="phone-input" spec={{"type": "tel", "id": "phone-input", "placeholder": "98765 43210", "maxLength": "10"}} />
             </>)}
           </div>
           <p {...ui.props("phone-entry-12", {"className": "hint"})}>
             {"We'll send a 6-digit verification code to this number"}
           </p>
           <p {...ui.props("phone-error", {"id": "phone-error", "style": {"display": "none", "color": "#ef4444", "fontSize": ".75rem", "marginTop": "6px"}})}>
             {ui.content("phone-error", <>
             {"Please enter a valid 10-digit phone number"}
             </>)}
           </p>
         </div>
         <button {...ui.props("phone-entry-14", {"className": "btn btn-primary", "type": "button", "actionLabel": "Send Verification Code"}, {"click": {"name": "sendOTP", "args": []}})}>
           {"Send Verification Code"}
         </button>
         <div {...ui.props("phone-entry-15", {"style": {"textAlign": "center"}})}>
           <button {...ui.props("phone-entry-16", {"className": "back-link", "type": "button", "actionLabel": "← Back to signup"}, {"click": {"name": "navigate", "args": ["signup.html"]}})}>
             {"← Back to signup"}
           </button>
         </div>
       </div>
     </div>
     <PageExtras inlineError />
   </main>
  </>;
}
