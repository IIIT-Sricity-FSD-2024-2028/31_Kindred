import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';

export default function FeedbackThankyouPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/feedback-thankyou.html">
   <section {...ui.props("feedback-thankyou-1", {"className": "thankyou-section"})}>
     <div {...ui.props("feedback-thankyou-2", {"className": "thankyou-card"})}>
       <div {...ui.props("feedback-thankyou-3", {"className": "thankyou-icon"})}>
         <svg {...ui.props("feedback-thankyou-4", {"width": "56", "height": "56", "viewBox": "0 0 56 56", "fill": "none"})}>
           <circle {...ui.props("feedback-thankyou-5", {"cx": "28", "cy": "28", "r": "28", "fill": "#d1fae5"})}>
           </circle>
           <circle {...ui.props("feedback-thankyou-6", {"cx": "28", "cy": "28", "r": "20", "fill": "#ecfdf5"})}>
           </circle>
           <path {...ui.props("feedback-thankyou-7", {"d": "M20 28.5L25.5 34L36 23", "stroke": "#059669", "strokeWidth": "3", "strokeLinecap": "round", "strokeLinejoin": "round"})}>
           </path>
         </svg>
       </div>
       <h1 {...ui.props("feedback-thankyou-8", {"className": "thankyou-title"})}>
         {"Thank You for Your Feedback!"}
       </h1>
       <p {...ui.props("feedback-thankyou-9", {"className": "thankyou-desc"})}>
         {"Your feedback helps us improve Kindred and serve the NGO community better. We appreciate you taking the time to share your thoughts with us."}
       </p>
       <Link {...ui.props("feedback-thankyou-10", {"className": "btn-submit-another", "actionLabel": "Submit Another Feedback", "to": "/feedback.html"})}>
         {"Submit Another Feedback"}
       </Link>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
