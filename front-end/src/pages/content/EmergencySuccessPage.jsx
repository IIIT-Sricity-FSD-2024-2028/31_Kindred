import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';

export default function EmergencySuccessPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/emergency-success.html">
   <section {...ui.props("emergency-success-1", {"className": "emergency-success-section"})}>
     <div {...ui.props("emergency-success-2", {"className": "emergency-success-card"})}>
       <div {...ui.props("emergency-success-3", {"className": "thankyou-icon"})}>
         <svg {...ui.props("emergency-success-4", {"width": "56", "height": "56", "viewBox": "0 0 56 56", "fill": "none"})}>
           <circle {...ui.props("emergency-success-5", {"cx": "28", "cy": "28", "r": "28", "fill": "#d1fae5"})}>
           </circle>
           <circle {...ui.props("emergency-success-6", {"cx": "28", "cy": "28", "r": "20", "fill": "#ecfdf5"})}>
           </circle>
           <path {...ui.props("emergency-success-7", {"d": "M20 28.5L25.5 34L36 23", "stroke": "#059669", "strokeWidth": "3", "strokeLinecap": "round", "strokeLinejoin": "round"})}>
           </path>
         </svg>
       </div>
       <h1 {...ui.props("emergency-success-8", {"className": "emergency-success-title"})}>
         {"Request Submitted Successfully"}
       </h1>
       <p {...ui.props("emergency-success-9", {"className": "emergency-success-desc"})}>
         {"Your emergency request has been received. Nearby organizations have been notified."}
       </p>
       <div {...ui.props("emergency-success-10", {"className": "request-id-box"})}>
         <span {...ui.props("emergency-success-11", {"className": "request-id-label"})}>
           {"Your Request ID"}
         </span>
         {" "}
         <span {...ui.props("emergency-success-12", {"className": "request-id-value"})}>
           {"2006"}
         </span>
       </div>
       <div {...ui.props("emergency-success-13", {"className": "emergency-info-card"})}>
         <div {...ui.props("emergency-success-14", {"className": "emergency-info-icon"})}>
           {"⏱"}
         </div>
         <div {...ui.props("emergency-success-15", {})}>
           <strong {...ui.props("emergency-success-16", {})}>
             {"Estimated Response Time"}
           </strong>
           {" "}
           <span {...ui.props("emergency-success-17", {"className": "emergency-info-detail"})}>
             {"15-30 minutes for nearby organizations"}
           </span>
         </div>
       </div>
       <div {...ui.props("emergency-success-18", {"className": "emergency-info-card"})}>
         <div {...ui.props("emergency-success-19", {"className": "emergency-info-icon"})}>
           {"🏢"}
         </div>
         <div {...ui.props("emergency-success-20", {})}>
           <strong {...ui.props("emergency-success-21", {})}>
             {"3 Organizations Notified"}
           </strong>
           {" "}
           <span {...ui.props("emergency-success-22", {"className": "emergency-info-detail orgs-list"})}>
             {"HopeConnect, MedReach, ShelterHope"}
           </span>
         </div>
       </div>
       <Link {...ui.props("emergency-success-23", {"className": "btn-back-home", "actionLabel": "Back to Home", "to": "/index.html"})}>
         {"Back to Home"}
       </Link>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
