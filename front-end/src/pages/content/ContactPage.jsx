import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function ContactPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/contact.html">
   <section {...ui.props("contact-1", {"className": "page-hero"})}>
     <h1 {...ui.props("contact-2", {})}>
       {"Contact Us"}
     </h1>
     <p {...ui.props("contact-3", {})}>
       {"Have questions? We'd love to hear from you."}
     </p>
   </section>
   <section {...ui.props("contact-4", {"className": "contact-section"})}>
     <div {...ui.props("contact-5", {"className": "contact-container"})}>
       <div {...ui.props("contact-6", {"className": "contact-info-col"})}>
         <div {...ui.props("contact-7", {"className": "contact-info-item"})}>
           <div {...ui.props("contact-8", {"className": "contact-info-icon"})}>
             {"✉"}
           </div>
           <div {...ui.props("contact-9", {})}>
             <div {...ui.props("contact-10", {"className": "contact-info-label"})}>
               {"Email"}
             </div>
             <div {...ui.props("contact-11", {"className": "contact-info-val"})}>
               {"hello@kindred.in"}
             </div>
           </div>
         </div>
         <div {...ui.props("contact-12", {"className": "contact-info-item"})}>
           <div {...ui.props("contact-13", {"className": "contact-info-icon"})}>
             {"📞"}
           </div>
           <div {...ui.props("contact-14", {})}>
             <div {...ui.props("contact-15", {"className": "contact-info-label"})}>
               {"Phone"}
             </div>
             <div {...ui.props("contact-16", {"className": "contact-info-val"})}>
               {"+91 1800 103 1234"}
             </div>
           </div>
         </div>
         <div {...ui.props("contact-17", {"className": "contact-info-item"})}>
           <div {...ui.props("contact-18", {"className": "contact-info-icon"})}>
             {"📍"}
           </div>
           <div {...ui.props("contact-19", {})}>
             <div {...ui.props("contact-20", {"className": "contact-info-label"})}>
               {"Office"}
             </div>
             <div {...ui.props("contact-21", {"className": "contact-info-val"})}>
               {"42 Nariman Point, Mumbai,"}
               <br {...ui.props("contact-22", {})} />
               {"Maharashtra 400021"}
             </div>
           </div>
         </div>
         <div {...ui.props("contact-23", {"className": "contact-info-item"})}>
           <div {...ui.props("contact-24", {"className": "contact-info-icon"})}>
             {"🕒"}
           </div>
           <div {...ui.props("contact-25", {})}>
             <div {...ui.props("contact-26", {"className": "contact-info-label"})}>
               {"Working Hours"}
             </div>
             <div {...ui.props("contact-27", {"className": "contact-info-val"})}>
               {"Mon–Sat, 9:00 AM – 6:00 PM IST"}
             </div>
           </div>
         </div>
         <div {...ui.props("contact-28", {"className": "regional-offices-card"})}>
           <h3 {...ui.props("contact-29", {})}>
             {"Regional Offices"}
           </h3>
           <div {...ui.props("contact-30", {"className": "regional-office"})}>
             <strong {...ui.props("contact-31", {})}>
               {"New Delhi"}
             </strong>
             <p {...ui.props("contact-32", {})}>
               {"11 Connaught Place, New Delhi 110001"}
             </p>
           </div>
           <div {...ui.props("contact-33", {"className": "regional-office"})}>
             <strong {...ui.props("contact-34", {})}>
               {"Bengaluru"}
             </strong>
             <p {...ui.props("contact-35", {})}>
               {"MG Road, Bengaluru, Karnataka 560001"}
             </p>
           </div>
           <div {...ui.props("contact-36", {"className": "regional-office"})}>
             <strong {...ui.props("contact-37", {})}>
               {"Chennai"}
             </strong>
             <p {...ui.props("contact-38", {})}>
               {"Anna Salai, Chennai, Tamil Nadu 600002"}
             </p>
           </div>
         </div>
       </div>
       <div {...ui.props("contact-39", {"className": "contact-form-col"})}>
         <form {...ui.props("contactForm", {"className": "contact-form", "id": "contactForm", "pageForm": true})}>
           {ui.content("contactForm", <>
           <div {...ui.props("contact-41", {"className": "form-row"})}>
             <div {...ui.props("contact-42", {"className": "form-group"})}>
               <label {...ui.props("contact-43", {"className": "form-label"})}>
                 {"First Name"}
               </label>
               <PageField as="input" field="cf-fname" spec={{"type": "text", "id": "cf-fname", "className": "form-input", "placeholder": "Rahul", "required": true}} />
             </div>
             <div {...ui.props("contact-45", {"className": "form-group"})}>
               <label {...ui.props("contact-46", {"className": "form-label"})}>
                 {"Last Name"}
               </label>
               <PageField as="input" field="cf-lname" spec={{"type": "text", "id": "cf-lname", "className": "form-input", "placeholder": "Sharma", "required": true}} />
             </div>
           </div>
           <div {...ui.props("contact-48", {"className": "form-group"})}>
             <label {...ui.props("contact-49", {"className": "form-label"})}>
               {"Email"}
             </label>
             <PageField as="input" field="cf-email" spec={{"type": "email", "id": "cf-email", "className": "form-input", "placeholder": "rahul.sharma@example.in", "required": true}} />
           </div>
           <div {...ui.props("contact-51", {"className": "form-group"})}>
             <label {...ui.props("contact-52", {"className": "form-label"})}>
               {"Phone (Optional)"}
             </label>
             <PageField as="input" field="cf-phone" spec={{"type": "tel", "id": "cf-phone", "className": "form-input", "placeholder": "+91 98765 43210"}} />
           </div>
           <div {...ui.props("contact-54", {"className": "form-group"})}>
             <label {...ui.props("contact-55", {"className": "form-label"})}>
               {"Subject"}
             </label>
             <PageField as="input" field="cf-subject" spec={{"type": "text", "id": "cf-subject", "className": "form-input", "placeholder": "How can we help you?"}} />
           </div>
           <div {...ui.props("contact-57", {"className": "form-group"})}>
             <label {...ui.props("contact-58", {"className": "form-label"})}>
               {"Message"}
             </label>
             <PageField as="textarea" field="cf-message" spec={{"id": "cf-message", "className": "form-textarea", "placeholder": "Tell us how we can help...", "rows": "5", "required": true}}>
             </PageField>
           </div>
           <button {...ui.props("contact-submit-btn", {"type": "submit", "className": "btn-primary", "style": {"width": "auto"}, "id": "contact-submit-btn", "actionLabel": "✈ Send Message"})}>
             {ui.content("contact-submit-btn", <>
             {"✈ Send Message"}
             </>)}
           </button>
           <div {...ui.props("contact-success-msg", {"id": "contact-success-msg", "style": {"display": "none", "background": "#f0fdf4", "border": "1.5px solid #86efac", "borderRadius": "10px", "padding": "14px 16px", "marginTop": "14px", "color": "#15803d", "fontSize": ".88rem"}})}>
             {ui.content("contact-success-msg", <>
             {" ✅ "}
             <strong {...ui.props("contact-62", {})}>
               {"Message sent successfully!"}
             </strong>
             {" Our team will respond within 24–48 hours. "}
             </>)}
           </div>
           </>)}
         </form>
       </div>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
