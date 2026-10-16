import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';

export default function ResetSuccessPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("reset-success-1", {"data-react-page": "/reset-success.html"})}>
     <div {...ui.props("reset-success-2", {"className": "page-wrap", "style": {"maxWidth": "460px"}})}>
       <div {...ui.props("reset-success-3", {"className": "card success-card"})}>
         <div {...ui.props("reset-success-4", {"className": "success-circle"})}>
           <svg {...ui.props("reset-success-5", {"width": "30", "height": "30", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
             <polyline {...ui.props("reset-success-6", {"points": "20 6 9 17 4 12"})}>
             </polyline>
           </svg>
         </div>
         <h2 {...ui.props("reset-success-7", {"className": "rs-title"})}>
           {"Password Reset Successful!"}
         </h2>
         <p {...ui.props("reset-success-8", {"className": "rs-sub"})}>
           {"Your password has been reset successfully. You can now sign in with your new password."}
         </p>
         <div {...ui.props("reset-success-9", {"className": "rs-bullets"})}>
           <p {...ui.props("reset-success-10", {"style": {"fontSize": ".75rem", "fontWeight": "700", "color": "var(--light)", "textTransform": "uppercase", "letterSpacing": ".06em", "marginBottom": "10px"}})}>
             {"Account secured"}
           </p>
           <ul {...ui.props("reset-success-11", {})}>
             <li {...ui.props("reset-success-12", {})}>
               <svg {...ui.props("reset-success-13", {"width": "14", "height": "14", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
                 <polyline {...ui.props("reset-success-14", {"points": "20 6 9 17 4 12"})}>
                 </polyline>
               </svg>
               {" Your new password is now active "}
             </li>
             <li {...ui.props("reset-success-15", {})}>
               <svg {...ui.props("reset-success-16", {"width": "14", "height": "14", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
                 <polyline {...ui.props("reset-success-17", {"points": "20 6 9 17 4 12"})}>
                 </polyline>
               </svg>
               {" All other sessions have been logged out "}
             </li>
             <li {...ui.props("reset-success-18", {})}>
               <svg {...ui.props("reset-success-19", {"width": "14", "height": "14", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
                 <polyline {...ui.props("reset-success-20", {"points": "20 6 9 17 4 12"})}>
                 </polyline>
               </svg>
               {" Use the new password to sign in "}
             </li>
           </ul>
         </div>
         <button {...ui.props("reset-success-21", {"className": "btn-signin-now", "type": "button", "actionLabel": "Sign In Now"}, {"click": {"name": "navigate", "args": ["signin.html"]}})}>
           {"Sign In Now"}
         </button>
       </div>
     </div>
     <PageExtras />
   </main>
  </>;
}
