import FormError from '../../components/pages/FormError.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function ForgotOtpPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("forgot-otp-1", {"data-react-page": "/forgot-otp.html"})}>
     <div {...ui.props("forgot-otp-2", {"className": "page-wrap", "style": {"maxWidth": "440px"}})}>
       <img {...ui.props("forgot-otp-3", {"src": "LOGO.jpeg", "className": "logo-pill-img", "alt": "Kindred"})} />
       <h1 {...ui.props("forgot-otp-4", {"className": "screen-title"})}>
         {"Enter OTP"}
       </h1>
       <p {...ui.props("forgot-otp-5", {"className": "screen-sub"})}>
         {"We've sent a 4-digit code to your registered number"}
       </p>
       <div {...ui.props("forgot-otp-6", {"className": "card"})}>
         <FormError />
         <p {...ui.props("forgot-otp-7", {"className": "sent-to"})}>
           {"Code sent to "}
           <strong {...ui.props("fotp-phone", {"id": "fotp-phone"})}>
             {ui.content("fotp-phone", <>
             {"+91 XXXXX XXXXX"}
             </>)}
           </strong>
         </p>
         <div {...ui.props("forgot-otp-9", {"className": "otp4-grid"})}>
           <PageField as="input" field="forgot-otp-10" spec={{"className": "otp4-input", "maxLength": "1", "type": "text", "inputMode": "numeric"}} />
           <PageField as="input" field="forgot-otp-11" spec={{"className": "otp4-input", "maxLength": "1", "type": "text", "inputMode": "numeric"}} />
           <PageField as="input" field="forgot-otp-12" spec={{"className": "otp4-input", "maxLength": "1", "type": "text", "inputMode": "numeric"}} />
           <PageField as="input" field="forgot-otp-13" spec={{"className": "otp4-input", "maxLength": "1", "type": "text", "inputMode": "numeric"}} />
         </div>
         <div {...ui.props("forgot-otp-14", {"className": "resend-row"})}>
           <button {...ui.props("forgot-otp-15", {"className": "resend-btn", "type": "button", "actionLabel": "Resend OTP"}, {"click": {"name": "resendOTP", "args": []}})}>
             <svg {...ui.props("forgot-otp-16", {"width": "13", "height": "13", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
               <polyline {...ui.props("forgot-otp-17", {"points": "1 4 1 10 7 10"})}>
               </polyline>
               <path {...ui.props("forgot-otp-18", {"d": "M3.51 15a9 9 0 1 0 .49-3.5"})}>
               </path>
             </svg>
             {" Resend OTP "}
           </button>
         </div>
         <p {...ui.props("fotp-error", {"id": "fotp-error", "style": {"display": "none", "color": "#ef4444", "fontSize": ".8rem", "textAlign": "center", "marginBottom": "14px"}})}>
           {ui.content("fotp-error", <>
           </>)}
         </p>
         <button {...ui.props("forgot-otp-20", {"className": "btn-verify", "type": "button", "actionLabel": "Verify OTP"}, {"click": {"name": "verifyFOTP", "args": []}})}>
           <svg {...ui.props("forgot-otp-21", {"width": "15", "height": "15", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
             <polyline {...ui.props("forgot-otp-22", {"points": "20 6 9 17 4 12"})}>
             </polyline>
           </svg>
           {" Verify OTP "}
         </button>
         <button {...ui.props("forgot-otp-23", {"className": "btn-back-outline", "type": "button", "actionLabel": "← Back"}, {"click": {"name": "navigate", "args": ["forgot-password.html"]}})}>
           {"← Back"}
         </button>
       </div>
     </div>
     <PageExtras inlineError />
   </main>
  </>;
}
