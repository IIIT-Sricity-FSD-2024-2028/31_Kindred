import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function EmergencyVerifyPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/emergency-verify.html">
   <div {...ui.props("emergency-verify-1", {"className": "emergency-banner"})}>
     <div {...ui.props("emergency-verify-2", {"className": "emergency-banner-content"})}>
       <span {...ui.props("emergency-verify-3", {"className": "emergency-banner-icon"})}>
         {"⚠"}
       </span>
       <div {...ui.props("emergency-verify-4", {})}>
         <strong {...ui.props("emergency-verify-5", {"className": "emergency-banner-title"})}>
           {"Emergency Assistance Request"}
         </strong>
         <p {...ui.props("emergency-verify-6", {"className": "emergency-banner-desc"})}>
           {"No login required — submit your request and nearby organizations will be notified immediately."}
         </p>
       </div>
     </div>
   </div>
   <div {...ui.props("emergency-verify-7", {"className": "back-link-wrapper"})}>
     <Link {...ui.props("emergency-verify-8", {"className": "back-link", "actionLabel": "← Back to Home", "to": "/index.html"})}>
       {"← Back to Home"}
     </Link>
   </div>
   <section {...ui.props("emergency-verify-9", {"className": "verify-section"})}>
     <div {...ui.props("emergency-verify-10", {"className": "verify-card"})}>
       <div {...ui.props("emergency-verify-11", {"className": "verify-icon"})}>
         {"📞"}
       </div>
       <h1 {...ui.props("emergency-verify-12", {"className": "verify-title"})}>
         {"Verify Your Phone Number"}
       </h1>
       <p {...ui.props("emergency-verify-13", {"className": "verify-desc"})}>
         {"We've sent a 6-digit code to "}
         <strong {...ui.props("maskedPhone", {"id": "maskedPhone"})}>
           {ui.content("maskedPhone", <>
           {"dxz"}
           </>)}
         </strong>
       </p>
       <div {...ui.props("otpInputs", {"className": "otp-inputs", "id": "otpInputs"})}>
         {ui.content("otpInputs", <>
         <PageField as="input" field="emergency-verify-16" spec={{"type": "text", "maxLength": "1", "className": "otp-input", "data-index": "0", "autoComplete": "off", "inputMode": "numeric"}} />
         <PageField as="input" field="emergency-verify-17" spec={{"type": "text", "maxLength": "1", "className": "otp-input", "data-index": "1", "autoComplete": "off", "inputMode": "numeric"}} />
         <PageField as="input" field="emergency-verify-18" spec={{"type": "text", "maxLength": "1", "className": "otp-input", "data-index": "2", "autoComplete": "off", "inputMode": "numeric"}} />
         <PageField as="input" field="emergency-verify-19" spec={{"type": "text", "maxLength": "1", "className": "otp-input", "data-index": "3", "autoComplete": "off", "inputMode": "numeric"}} />
         <PageField as="input" field="emergency-verify-20" spec={{"type": "text", "maxLength": "1", "className": "otp-input", "data-index": "4", "autoComplete": "off", "inputMode": "numeric"}} />
         <PageField as="input" field="emergency-verify-21" spec={{"type": "text", "maxLength": "1", "className": "otp-input", "data-index": "5", "autoComplete": "off", "inputMode": "numeric"}} />
         </>)}
       </div>
       <button {...ui.props("verifySubmitBtn", {"className": "btn-verify-submit", "id": "verifySubmitBtn", "type": "button", "actionLabel": "Verify & Submit"})}>
         {ui.content("verifySubmitBtn", <>
         {"Verify & Submit"}
         </>)}
       </button>
       <p {...ui.props("emergency-verify-23", {"className": "resend-text"})}>
         {"Didn't receive code? "}
         <a {...ui.props("resendLink", {"href": "#", "className": "resend-link", "id": "resendLink", "actionLabel": "Resend"})}>
           {ui.content("resendLink", <>
           {"Resend"}
           </>)}
         </a>
       </p>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
