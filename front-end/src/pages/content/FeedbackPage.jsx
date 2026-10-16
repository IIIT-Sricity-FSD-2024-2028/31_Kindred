import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function FeedbackPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/feedback.html">
   <section {...ui.props("feedback-1", {"className": "feedback-hero"})}>
     <div {...ui.props("feedback-2", {"className": "feedback-hero-icon"})}>
       {"💬"}
     </div>
     <h1 {...ui.props("feedback-3", {"className": "feedback-hero-title"})}>
       {"We Value Your Feedback"}
     </h1>
     <p {...ui.props("feedback-4", {"className": "feedback-hero-desc"})}>
       {"Your insights help us improve Kindred's platform. Share your experience, suggestions, or report any issues you've encountered."}
     </p>
   </section>
   <section {...ui.props("feedback-5", {"className": "feedback-form-section"})}>
     <div {...ui.props("feedback-6", {"className": "feedback-container"})}>
       <form {...ui.props("feedbackForm", {"className": "feedback-form", "id": "feedbackForm", "pageForm": true})}>
         {ui.content("feedbackForm", <>
         <div {...ui.props("feedback-8", {"className": "form-group"})}>
           <label {...ui.props("feedback-9", {"className": "form-label", "htmlFor": "feedbackName"})}>
             {"Full Name "}
             <span {...ui.props("feedback-10", {"className": "required"})}>
               {"*"}
             </span>
           </label>
           <PageField as="input" field="feedbackName" spec={{"type": "text", "id": "feedbackName", "className": "form-input", "placeholder": "Priya Sharma", "required": true}} />
         </div>
         <div {...ui.props("feedback-12", {"className": "form-row"})}>
           <div {...ui.props("feedback-13", {"className": "form-group"})}>
             <label {...ui.props("feedback-14", {"className": "form-label", "htmlFor": "feedbackEmail"})}>
               {"Email Address "}
               <span {...ui.props("feedback-15", {"className": "required"})}>
                 {"*"}
               </span>
             </label>
             <PageField as="input" field="feedbackEmail" spec={{"type": "email", "id": "feedbackEmail", "className": "form-input", "placeholder": "priya.sharma@example.in", "required": true}} />
           </div>
           <div {...ui.props("feedback-17", {"className": "form-group"})}>
             <label {...ui.props("feedback-18", {"className": "form-label", "htmlFor": "feedbackPhone"})}>
               {"Mobile Number"}
             </label>
             <PageField as="input" field="feedbackPhone" spec={{"type": "tel", "id": "feedbackPhone", "className": "form-input", "placeholder": "9876543210"}} />
             <span {...ui.props("feedback-20", {"className": "form-hint"})}>
               {"10-digit mobile number (without +91)"}
             </span>
           </div>
         </div>
         <div {...ui.props("feedback-21", {"className": "form-group"})}>
           <label {...ui.props("feedback-22", {"className": "form-label", "htmlFor": "feedbackCategory"})}>
             {"Feedback Category "}
             <span {...ui.props("feedback-23", {"className": "required"})}>
               {"*"}
             </span>
           </label>
           <PageField as="select" field="feedbackCategory" spec={{"id": "feedbackCategory", "className": "form-select", "required": true}}>
             <option {...ui.props("feedback-25", {"value": "", "disabled": true})}>
               {"Select a category"}
             </option>
             <option {...ui.props("feedback-26", {"value": "general"})}>
               {"General Feedback"}
             </option>
             <option {...ui.props("feedback-27", {"value": "bug"})}>
               {"Bug Report"}
             </option>
             <option {...ui.props("feedback-28", {"value": "feature"})}>
               {"Feature Request"}
             </option>
             <option {...ui.props("feedback-29", {"value": "complaint"})}>
               {"Complaint"}
             </option>
             <option {...ui.props("feedback-30", {"value": "appreciation"})}>
               {"Appreciation"}
             </option>
             <option {...ui.props("feedback-31", {"value": "other"})}>
               {"Other"}
             </option>
           </PageField>
         </div>
         <div {...ui.props("feedback-32", {"className": "form-group"})}>
           <label {...ui.props("feedback-33", {"className": "form-label"})}>
             {"How would you rate your overall experience? "}
             <span {...ui.props("feedback-34", {"className": "required"})}>
               {"*"}
             </span>
           </label>
           <div {...ui.props("starRating", {"className": "star-rating", "id": "starRating"})}>
             {ui.content("starRating", <>
             <span {...ui.props("feedback-36", {"className": "star", "data-value": "1"})}>
               {Number(ui.state.hoverRating || ui.values.ratingValue) >= 1 ? "★" : "☆"}
             </span>
             {" "}
             <span {...ui.props("feedback-37", {"className": "star", "data-value": "2"})}>
               {Number(ui.state.hoverRating || ui.values.ratingValue) >= 2 ? "★" : "☆"}
             </span>
             {" "}
             <span {...ui.props("feedback-38", {"className": "star", "data-value": "3"})}>
               {Number(ui.state.hoverRating || ui.values.ratingValue) >= 3 ? "★" : "☆"}
             </span>
             {" "}
             <span {...ui.props("feedback-39", {"className": "star", "data-value": "4"})}>
               {Number(ui.state.hoverRating || ui.values.ratingValue) >= 4 ? "★" : "☆"}
             </span>
             {" "}
             <span {...ui.props("feedback-40", {"className": "star", "data-value": "5"})}>
               {Number(ui.state.hoverRating || ui.values.ratingValue) >= 5 ? "★" : "☆"}
             </span>
             </>)}
           </div>
           <PageField as="input" field="ratingValue" spec={{"type": "hidden", "id": "ratingValue"}} />
         </div>
         <div {...ui.props("feedback-42", {"className": "form-group"})}>
           <label {...ui.props("feedback-43", {"className": "form-label", "htmlFor": "feedbackText"})}>
             {"Your Feedback "}
             <span {...ui.props("feedback-44", {"className": "required"})}>
               {"*"}
             </span>
           </label>
           <PageField as="textarea" field="feedbackText" spec={{"id": "feedbackText", "className": "form-textarea", "placeholder": "Please share your thoughts, suggestions, or describe any issues you've encountered.", "rows": "5", "required": true}}>
           </PageField>
           <span {...ui.props("feedback-46", {"className": "form-hint"})}>
             {"Minimum 20 characters"}
           </span>
         </div>
         <div {...ui.props("feedback-47", {"className": "feedback-info-banner"})}>
           <span {...ui.props("feedback-48", {"className": "info-banner-icon"})}>
             {"ℹ"}
           </span>
           {" "}
           <span {...ui.props("feedback-49", {})}>
             {"Your feedback is important to us. For urgent, technical issues or emergencies, please use the "}
             <strong {...ui.props("feedback-50", {})}>
               <Link {...ui.props("feedback-51", {"style": {"color": "white", "textDecoration": "underline"}, "actionLabel": "Emergency\n                Help", "to": "/emergency-request.html"})}>
                 {"Emergency Help"}
               </Link>
             </strong>
             {" button or contact our support team at "}
             <strong {...ui.props("feedback-52", {})}>
               {"support@kindred.org.in"}
             </strong>
             {" or call "}
             <strong {...ui.props("feedback-53", {})}>
               {"+91 1800 200 3000"}
             </strong>
             {"."}
           </span>
         </div>
         <button {...ui.props("submitFeedbackBtn", {"type": "submit", "className": "btn-submit-feedback", "id": "submitFeedbackBtn", "actionLabel": "💬 Submit Feedback"})}>
           {ui.content("submitFeedbackBtn", <>
           {" 💬 Submit Feedback "}
           </>)}
         </button>
         <div {...ui.props("feedback-success-msg", {"id": "feedback-success-msg", "style": {"display": "none", "background": "linear-gradient(135deg,#f0fdf4,#dcfce7)", "border": "1.5px solid #86efac", "borderRadius": "12px", "padding": "16px 20px", "marginTop": "16px", "textAlign": "center"}})}>
           {ui.content("feedback-success-msg", <>
           <div {...ui.props("feedback-56", {"style": {"fontSize": "1.8rem", "marginBottom": "6px"}})}>
             {"🙏"}
           </div>
           <strong {...ui.props("feedback-57", {"style": {"color": "#15803d"}})}>
             {"Thank you for your feedback!"}
           </strong>
           <p {...ui.props("feedback-58", {"style": {"color": "#166534", "fontSize": ".85rem", "margin": "6px 0 0"}})}>
             {"Your submission has been shared with the platform admin. We'll review it within 48 hours."}
           </p>
           </>)}
         </div>
         </>)}
       </form>
       <div {...ui.props("feedback-59", {"className": "feedback-features"})}>
         <div {...ui.props("feedback-60", {"className": "feedback-feature-card", "style": {"borderTop": "3px solid #22c55e"}})}>
           <h4 {...ui.props("feedback-61", {"style": {"color": "#22c55e"}})}>
             {"Anonymous Option"}
           </h4>
           <p {...ui.props("feedback-62", {})}>
             {"You can submit feedback anonymously by leaving the name & fields empty."}
           </p>
         </div>
         <div {...ui.props("feedback-63", {"className": "feedback-feature-card", "style": {"borderTop": "3px solid #3b82f6"}})}>
           <h4 {...ui.props("feedback-64", {"style": {"color": "#3b82f6"}})}>
             {"Quick Response"}
           </h4>
           <p {...ui.props("feedback-65", {})}>
             {"We aim to review all feedback within 48 hours and respond if needed."}
           </p>
         </div>
         <div {...ui.props("feedback-66", {"className": "feedback-feature-card", "style": {"borderTop": "3px solid #ef4444"}})}>
           <h4 {...ui.props("feedback-67", {"style": {"color": "#ef4444"}})}>
             {"Make an Impact"}
           </h4>
           <p {...ui.props("feedback-68", {})}>
             {"Your feedback directly influences our platform improvements and priorities."}
           </p>
         </div>
       </div>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
