import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { readStored } from '../../services/storage.js';

export default function RegistrationPendingPage() {
  const ui = usePage();
  const registration = readStored('kindred_registration') || {};
  return <>
   <main {...ui.props("registration-pending-1", {"data-react-page": "/registration-pending.html"})}>
     <div {...ui.props("registration-pending-2", {"className": "page-wrap"})}>
       <div {...ui.props("registration-pending-3", {"className": "card", "style": {"padding": "0", "overflow": "hidden"}})}>
         <div {...ui.props("registration-pending-4", {"className": "pending-hero"})}>
           <div {...ui.props("registration-pending-5", {"className": "pending-icon-wrap"})}>
             <svg {...ui.props("registration-pending-6", {"viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round"})}>
               <circle {...ui.props("registration-pending-7", {"cx": "12", "cy": "12", "r": "10"})}>
               </circle>
               <polyline {...ui.props("registration-pending-8", {"points": "12 6 12 12 16 14"})}>
               </polyline>
             </svg>
           </div>
           <h1 {...ui.props("registration-pending-9", {"className": "pending-title"})}>
             {"Account Under Review"}
           </h1>
           <p {...ui.props("registration-pending-10", {"className": "pending-subtitle"})}>
             {"Your registration has been submitted successfully! The Platform Administrator will review your application and verify your details."}
           </p>
           <div {...ui.props("registration-pending-11", {"className": "status-pill"})}>
             <span {...ui.props("registration-pending-12", {"className": "status-dot"})}>
             </span>
             {" Pending Admin Approval "}
           </div>
           {registration.verificationStatus === 'verified' && <div className="status-pill verification-confirmed">Verification Confirmed (development simulation)</div>}
           {registration.approvalStatus === 'rejected' && <div className="status-pill registration-rejected">Registration Rejected</div>}
         </div>
         <div {...ui.props("registration-pending-13", {"className": "steps-section"})}>
           <h4 {...ui.props("registration-pending-14", {})}>
             {"What happens next?"}
           </h4>
           <div {...ui.props("registration-pending-15", {"className": "step-row"})}>
             <div {...ui.props("registration-pending-16", {"className": "step-num"})}>
               {"1"}
             </div>
             <div {...ui.props("registration-pending-17", {"className": "step-text"})}>
               <strong {...ui.props("registration-pending-18", {})}>
                 {"Admin reviews your application"}
               </strong>
               {" — The Platform Administrator will verify your submitted details and credentials."}
             </div>
           </div>
           <div {...ui.props("registration-pending-19", {"className": "step-row"})}>
             <div {...ui.props("registration-pending-20", {"className": "step-num"})}>
               {"2"}
             </div>
             <div {...ui.props("registration-pending-21", {"className": "step-text"})}>
               <strong {...ui.props("registration-pending-22", {})}>
                 {"Approval notification"}
               </strong>
               {" — You will be notified via email once your account has been approved or if additional information is needed."}
             </div>
           </div>
           <div {...ui.props("registration-pending-23", {"className": "step-row"})}>
             <div {...ui.props("registration-pending-24", {"className": "step-num"})}>
               {"3"}
             </div>
             <div {...ui.props("registration-pending-25", {"className": "step-text"})}>
               <strong {...ui.props("registration-pending-26", {})}>
                 {"Access granted"}
               </strong>
               {" — Once approved, log in with your credentials to access the full Kindred platform and start contributing."}
             </div>
           </div>
         </div>
         <div {...ui.props("registration-pending-27", {"className": "pending-actions"})}>
           <button {...ui.props("registration-pending-28", {"className": "btn-go-signin", "type": "button", "actionLabel": "Go to Sign In"}, {"click": {"name": "navigate", "args": ["signin.html"]}})}>
             {" Go to Sign In "}
             <svg {...ui.props("registration-pending-29", {"width": "16", "height": "16", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
               <line {...ui.props("registration-pending-30", {"x1": "5", "y1": "12", "x2": "19", "y2": "12"})}>
               </line>
               <polyline {...ui.props("registration-pending-31", {"points": "12 5 19 12 12 19"})}>
               </polyline>
             </svg>
           </button>
           <button {...ui.props("registration-pending-32", {"className": "btn-go-home", "type": "button", "actionLabel": "Back to Home"}, {"click": {"name": "navigate", "args": ["index.html"]}})}>
             {"Back to Home"}
           </button>
         </div>
         <p {...ui.props("registration-pending-33", {"className": "info-note"})}>
           {" Need help? Contact us at "}
           <a {...ui.props("registration-pending-34", {"href": "mailto:hello@kindred.org.in", "actionLabel": "hello@kindred.org.in"})}>
             {"hello@kindred.org.in"}
           </a>
           {" or call "}
           <strong {...ui.props("registration-pending-35", {})}>
             {"+91 1800 200 3000"}
           </strong>
         </p>
       </div>
     </div>
     <PageExtras />
   </main>
  </>;
}
