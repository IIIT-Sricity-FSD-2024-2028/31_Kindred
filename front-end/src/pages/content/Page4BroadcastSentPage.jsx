import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';

export default function Page4BroadcastSentPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/page4-broadcast-sent.html">
   <div {...ui.props("page4-broadcast-sent-1", {"className": "confirmation-page"})}>
     <div {...ui.props("page4-broadcast-sent-2", {"className": "confirmation-card"})}>
       <div {...ui.props("page4-broadcast-sent-3", {"className": "step-indicator"})}>
         <div {...ui.props("page4-broadcast-sent-4", {"className": "step-dot"})}>
         </div>
         <div {...ui.props("page4-broadcast-sent-5", {"className": "step-dot"})}>
         </div>
         <div {...ui.props("page4-broadcast-sent-6", {"className": "step-dot active"})}>
         </div>
       </div>
       <div {...ui.props("page4-broadcast-sent-7", {"className": "big-icon"})}>
         <svg {...ui.props("page4-broadcast-sent-8", {"width": "40", "height": "40", "viewBox": "0 0 24 24", "fill": "none", "stroke": "#10b981", "strokeWidth": "2.5"})}>
           <path {...ui.props("page4-broadcast-sent-9", {"d": "M22 12h-4l-3 9L9 3l-3 9H2"})}>
           </path>
         </svg>
       </div>
       <h2 {...ui.props("page4-broadcast-sent-10", {})}>
         {"Request Broadcast Sent"}
       </h2>
       <p {...ui.props("page4-broadcast-sent-11", {})}>
         {" Your assistance request has been successfully broadcast to all organizations on the Kindred platform. Our team will match you with the most suitable volunteers and organizations to provide support. "}
       </p>
       <p {...ui.props("page4-broadcast-sent-12", {})}>
         {" You will receive a notification once an organization responds to your request. In the meantime, you can track the status from your dashboard. "}
       </p>
       <div {...ui.props("page4-broadcast-sent-13", {"className": "ref-label"})}>
         {"Your Reference Number"}
       </div>
       <div {...ui.props("page4-broadcast-sent-14", {"className": "ref-code"})}>
         {"3008"}
       </div>
       <div {...ui.props("page4-broadcast-sent-15", {"className": "action-group"})}>
         <button {...ui.props("page4-broadcast-sent-16", {"className": "btn-back-home", "type": "button", "actionLabel": "Back to Dashboard"}, {"click": {"name": "navigate", "args": ["beneficiary-dashboard.html"]}})}>
           {" Back to Dashboard "}
         </button>
         <button {...ui.props("page4-broadcast-sent-17", {"className": "btn-new-req", "type": "button", "actionLabel": "Submit Another Request"}, {"click": {"name": "navigate", "args": ["page2-new-request-modal.html"]}})}>
           {" Submit Another Request "}
         </button>
       </div>
     </div>
   </div>
     <PageExtras />
   </main>
  </>;
}
