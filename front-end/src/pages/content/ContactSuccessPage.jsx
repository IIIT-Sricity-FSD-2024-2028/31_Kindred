import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';

export default function ContactSuccessPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/contact-success.html">
   <section {...ui.props("contact-success-1", {"className": "contact-success-section"})}>
     <div {...ui.props("contact-success-2", {"className": "contact-success-content"})}>
       <div {...ui.props("contact-success-3", {"className": "success-icon-circle"})}>
         <span {...ui.props("contact-success-4", {"className": "success-check"})}>
           {"✔"}
         </span>
       </div>
       <h1 {...ui.props("contact-success-5", {"className": "success-title"})}>
         {"Message Sent!"}
       </h1>
       <p {...ui.props("contact-success-6", {"className": "success-desc"})}>
         {"We'll get back to you within 24 hours."}
       </p>
       <Link {...ui.props("contact-success-7", {"className": "btn-back-home", "style": {"marginTop": "40px", "background": "rgba(255,255,255,0.1)", "borderColor": "rgba(255,255,255,0.2)", "color": "#fff"}, "actionLabel": "← Back to Home", "to": "/index.html"})}>
         {"← Back to Home"}
       </Link>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
