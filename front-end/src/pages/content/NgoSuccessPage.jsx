import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';

export default function NgoSuccessPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("ngo-success-1", {"data-react-page": "/ngo-success.html"})}>
     <div {...ui.props("ngo-success-2", {"className": "page-wrap"})}>
       <div {...ui.props("ngo-success-3", {"className": "card text-center"})}>
         <div {...ui.props("ngo-success-4", {"className": "success-icon"})}>
           <svg {...ui.props("ngo-success-5", {"width": "28", "height": "28", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
             <polyline {...ui.props("ngo-success-6", {"points": "20 6 9 17 4 12"})}>
             </polyline>
           </svg>
         </div>
         <h2 {...ui.props("ngo-success-7", {"style": {"fontFamily": "'Sora',sans-serif", "fontSize": "1.45rem", "fontWeight": "700", "marginBottom": "12px"}})}>
           {"Request Sent to Platform Admin"}
         </h2>
         <p {...ui.props("ngo-success-8", {"style": {"color": "var(--mid)", "fontSize": ".9rem", "lineHeight": "1.65", "marginBottom": "22px"}})}>
           {"Your NGO registration request has been submitted successfully. The Platform Administrator will review your application and get back to you shortly."}
         </p>
         <div {...ui.props("ngo-success-9", {"className": "next-steps"})}>
           <h4 {...ui.props("ngo-success-10", {})}>
             {"What happens next?"}
           </h4>
           <ol {...ui.props("ngo-success-11", {})}>
             <li {...ui.props("ngo-success-12", {})}>
               <span {...ui.props("ngo-success-13", {"className": "step-num"})}>
                 {"1"}
               </span>
               {"Admin reviews your NGO details"}
             </li>
             <li {...ui.props("ngo-success-14", {})}>
               <span {...ui.props("ngo-success-15", {"className": "step-num"})}>
                 {"2"}
               </span>
               {"You receive an email confirmation"}
             </li>
             <li {...ui.props("ngo-success-16", {})}>
               <span {...ui.props("ngo-success-17", {"className": "step-num"})}>
                 {"3"}
               </span>
               {"Login with your credentials once approved"}
             </li>
           </ol>
         </div>
         <button {...ui.props("ngo-success-18", {"className": "btn btn-primary", "type": "button", "actionLabel": "Go to Sign In"}, {"click": {"name": "navigate", "args": ["signin.html"]}})}>
           {"Go to Sign In"}
         </button>
       </div>
     </div>
     <PageExtras />
   </main>
  </>;
}
