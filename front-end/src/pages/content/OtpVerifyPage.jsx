import FormError from '../../components/pages/FormError.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function OtpVerifyPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("otp-verify-1", {"data-react-page": "/otp-verify.html"})}>
     <div {...ui.props("otp-verify-2", {"className": "page-wrap"})}>
       <img {...ui.props("otp-verify-3", {"src": "LOGO.jpeg", "className": "logo-pill-img", "alt": "Kindred"})} />
       <h1 {...ui.props("otp-verify-4", {"className": "screen-title"})}>
         {"Verify Your Phone"}
       </h1>
       <p {...ui.props("otp-verify-5", {"className": "screen-sub"})}>
         {"Complete verification to access your dashboard"}
       </p>
       <div {...ui.props("otp-verify-6", {"className": "card"})}>
         <FormError />
         <div {...ui.props("otp-verify-7", {"className": "otp-top"})}>
           <svg {...ui.props("otp-verify-8", {"width": "44", "height": "44", "fill": "none", "stroke": "#3b82f6", "strokeWidth": "1.6", "viewBox": "0 0 24 24"})}>
             <path {...ui.props("otp-verify-9", {"d": "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.71 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.91.35 1.85.58 2.81.71A2 2 0 0 1 22 16.92z"})}>
             </path>
           </svg>
         </div>
         <p {...ui.props("otp-verify-10", {"className": "phone-display"})}>
           {"Enter the 6-digit code sent to "}
           <strong {...ui.props("phone-display-num", {"id": "phone-display-num"})}>
             {ui.content("phone-display-num", <>
             {"your phone"}
             </>)}
           </strong>
         </p>
         <div {...ui.props("otp-verify-12", {"className": "otp-grid"})}>
           <PageField as="input" field="otp-verify-13" spec={{"className": "otp-input", "maxLength": "1", "type": "text", "inputMode": "numeric"}} />
           <PageField as="input" field="otp-verify-14" spec={{"className": "otp-input", "maxLength": "1", "type": "text", "inputMode": "numeric"}} />
           <PageField as="input" field="otp-verify-15" spec={{"className": "otp-input", "maxLength": "1", "type": "text", "inputMode": "numeric"}} />
           <PageField as="input" field="otp-verify-16" spec={{"className": "otp-input", "maxLength": "1", "type": "text", "inputMode": "numeric"}} />
           <PageField as="input" field="otp-verify-17" spec={{"className": "otp-input", "maxLength": "1", "type": "text", "inputMode": "numeric"}} />
           <PageField as="input" field="otp-verify-18" spec={{"className": "otp-input", "maxLength": "1", "type": "text", "inputMode": "numeric"}} />
         </div>
         <div {...ui.props("otp-verify-19", {"className": "info-box"})}>
           <svg {...ui.props("otp-verify-20", {"width": "14", "height": "14", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
             <polyline {...ui.props("otp-verify-21", {"points": "20 6 9 17 4 12"})}>
             </polyline>
           </svg>
           <p {...ui.props("dash-text", {"id": "dash-text"})}>
             {ui.content("dash-text", <>
             {"After verification, you'll go directly to your dashboard"}
             </>)}
           </p>
         </div>
         <button {...ui.props("otp-verify-23", {"className": "btn btn-green-solid", "type": "button", "actionLabel": "Verify & Continue to Dashboard"}, {"click": {"name": "verifyOTP", "args": []}})}>
           {"Verify & Continue to Dashboard"}
         </button>
         <button {...ui.props("otp-verify-24", {"className": "resend-link", "type": "button", "actionLabel": "Didn't receive code? Resend"})}>
           {"Didn't receive code? Resend"}
         </button>
         <div {...ui.props("otp-verify-25", {"style": {"textAlign": "center"}})}>
           <button {...ui.props("otp-verify-26", {"className": "back-link", "type": "button", "actionLabel": "← Back"}, {"click": {"name": "navigate", "args": ["phone-entry.html"]}})}>
             {"← Back"}
           </button>
         </div>
       </div>
     </div>
     <PageExtras inlineError />
   </main>
  </>;
}
