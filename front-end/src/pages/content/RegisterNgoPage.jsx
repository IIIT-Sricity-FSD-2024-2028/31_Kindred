import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function RegisterNgoPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/register-ngo.html">
   <section {...ui.props("register-ngo-1", {"className": "page-hero text-center", "style": {"padding": "80px 20px", "background": "#fff", "borderBottom": "1px solid #e2e8f0"}})}>
     <h1 {...ui.props("register-ngo-2", {"style": {"fontFamily": "var(--brand-font)", "color": "var(--brand-navy)", "fontSize": "2.5rem", "marginBottom": "20px"}})}>
       {"Partner With Kindred: Amplify Your Impact"}
     </h1>
     <p {...ui.props("register-ngo-3", {"style": {"color": "#64748b", "fontSize": "1.1rem", "maxWidth": "700px", "margin": "0 auto"}})}>
       {" Join India's fastest-growing social impact network. By verifying your NGO with Kindred, you gain immediate access to volunteers, secure fundraising metrics, and beneficiary management tools. "}
     </p>
   </section>
   <section {...ui.props("register-ngo-4", {"style": {"maxWidth": "800px", "margin": "60px auto", "padding": "0 20px"}})}>
     <div {...ui.props("register-ngo-5", {"style": {"background": "#fff", "padding": "40px", "borderRadius": "16px", "boxShadow": "0 10px 30px rgba(0,0,0,0.05)"}})}>
       <h2 {...ui.props("register-ngo-6", {"style": {"fontSize": "22px", "color": "var(--brand-navy)", "marginBottom": "8px"}})}>
         {"Organization Registration"}
       </h2>
       <p {...ui.props("register-ngo-7", {"style": {"color": "#64748b", "fontSize": "14px", "marginBottom": "30px"}})}>
         {"Complete the form below. Our verification team will review your application within 48 hours."}
       </p>
       <form {...ui.props("ngo-register-form", {"id": "ngo-register-form", "pageForm": true})}>
         {ui.content("ngo-register-form", <>
         <p className="page-payment-note">Registration IDs and tax declarations are not stored by this service. This application submits your organization name, focus, email and address.</p>
         <h3 {...ui.props("register-ngo-9", {"style": {"fontSize": "16px", "color": "#0f172a", "marginBottom": "16px", "paddingBottom": "8px", "borderBottom": "1px solid #e2e8f0"}})}>
           {"Organization Details"}
         </h3>
         <div {...ui.props("register-ngo-10", {"style": {"display": "grid", "gridTemplateColumns": "1fr", "gap": "20px", "marginBottom": "30px"}})}>
           <div {...ui.props("register-ngo-11", {})}>
             <label {...ui.props("register-ngo-12", {"style": {"display": "block", "fontSize": "13px", "fontWeight": "600", "color": "#475569", "marginBottom": "8px"}})}>
               {"Official NGO Name *"}
             </label>
             <PageField as="input" field="register-ngo-13" spec={{"type": "text", "required": true, "placeholder": "e.g. HopeConnect Foundation", "style": {"width": "100%", "padding": "12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontSize": "14px", "outline": "none"}}} />
           </div>
           <div {...ui.props("register-ngo-14", {})}>
             <label {...ui.props("register-ngo-15", {"style": {"display": "block", "fontSize": "13px", "fontWeight": "600", "color": "#475569", "marginBottom": "8px"}})}>
               {"Primary Focus Area *"}
             </label>
             <PageField as="select" field="register-ngo-16" spec={{"required": true, "style": {"width": "100%", "padding": "12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontSize": "14px", "outline": "none", "background": "#fff"}}}>
               <option {...ui.props("register-ngo-17", {"value": ""})}>
                 {"Select a Category"}
               </option>
               <option {...ui.props("register-ngo-18", {"value": "education"})}>
                 {"Education & Literacy"}
               </option>
               <option {...ui.props("register-ngo-19", {"value": "healthcare"})}>
                 {"Healthcare & Medical"}
               </option>
               <option {...ui.props("register-ngo-20", {"value": "disaster"})}>
                 {"Disaster Relief"}
               </option>
               <option {...ui.props("register-ngo-21", {"value": "environment"})}>
                 {"Environment & Sustainability"}
               </option>
               <option {...ui.props("register-ngo-22", {"value": "women"})}>
                 {"Women Empowerment"}
               </option>
               <option {...ui.props("register-ngo-23", {"value": "other"})}>
                 {"Other"}
               </option>
             </PageField>
           </div>
         </div>
         <h3 {...ui.props("register-ngo-24", {"style": {"fontSize": "16px", "color": "#0f172a", "marginBottom": "16px", "paddingBottom": "8px", "borderBottom": "1px solid #e2e8f0"}})}>
           {"Compliance & Registration"}
         </h3>
         <div {...ui.props("register-ngo-25", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "20px", "marginBottom": "30px"}})}>
           <div {...ui.props("register-ngo-26", {})}>
             <label {...ui.props("register-ngo-27", {"style": {"display": "block", "fontSize": "13px", "fontWeight": "600", "color": "#475569", "marginBottom": "8px"}})}>
               {"Society Registration No. *"}
             </label>
             <PageField as="input" field="register-ngo-28" spec={{"type": "text", "required": true, "placeholder": "e.g. S/12345/2010", "style": {"width": "100%", "padding": "12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontSize": "14px", "outline": "none"}}} />
           </div>
           <div {...ui.props("register-ngo-29", {})}>
             <label {...ui.props("register-ngo-30", {"style": {"display": "block", "fontSize": "13px", "fontWeight": "600", "color": "#475569", "marginBottom": "8px"}})}>
               {"NGO Darpan ID (Optional)"}
             </label>
             <PageField as="input" field="register-ngo-31" spec={{"type": "text", "placeholder": "e.g. DL/2015/0000000", "style": {"width": "100%", "padding": "12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontSize": "14px", "outline": "none"}}} />
           </div>
           <div {...ui.props("register-ngo-32", {"style": {"gridColumn": "1 / -1", "display": "flex", "gap": "20px"}})}>
             <label {...ui.props("register-ngo-33", {"style": {"display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "14px", "color": "#334155", "cursor": "pointer"}})}>
               <PageField as="input" field="register-ngo-34" spec={{"type": "checkbox", "style": {"width": "16px", "height": "16px"}}} />
               {" We have 80G Tax Exemption Status "}
             </label>
             <label {...ui.props("register-ngo-35", {"style": {"display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "14px", "color": "#334155", "cursor": "pointer"}})}>
               <PageField as="input" field="register-ngo-36" spec={{"type": "checkbox", "style": {"width": "16px", "height": "16px"}}} />
               {" We have FCRA Registration "}
             </label>
           </div>
         </div>
         <h3 {...ui.props("register-ngo-37", {"style": {"fontSize": "16px", "color": "#0f172a", "marginBottom": "16px", "paddingBottom": "8px", "borderBottom": "1px solid #e2e8f0"}})}>
           {"Contact Information"}
         </h3>
         <div {...ui.props("register-ngo-38", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "20px", "marginBottom": "30px"}})}>
           <div {...ui.props("register-ngo-39", {})}>
             <label {...ui.props("register-ngo-40", {"style": {"display": "block", "fontSize": "13px", "fontWeight": "600", "color": "#475569", "marginBottom": "8px"}})}>
               {"Contact Person Name *"}
             </label>
             <PageField as="input" field="register-ngo-41" spec={{"type": "text", "required": true, "placeholder": "Full Name", "style": {"width": "100%", "padding": "12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontSize": "14px", "outline": "none"}}} />
           </div>
           <div {...ui.props("register-ngo-42", {})}>
             <label {...ui.props("register-ngo-43", {"style": {"display": "block", "fontSize": "13px", "fontWeight": "600", "color": "#475569", "marginBottom": "8px"}})}>
               {"Official Email *"}
             </label>
             <PageField as="input" field="register-ngo-44" spec={{"type": "email", "required": true, "placeholder": "name@ngo.org", "style": {"width": "100%", "padding": "12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontSize": "14px", "outline": "none"}}} />
           </div>
           <div {...ui.props("register-ngo-45", {"style": {"gridColumn": "1 / -1"}})}>
             <label {...ui.props("register-ngo-46", {"style": {"display": "block", "fontSize": "13px", "fontWeight": "600", "color": "#475569", "marginBottom": "8px"}})}>
               {"Headquarters Address *"}
             </label>
             <PageField as="textarea" field="register-ngo-47" spec={{"required": true, "rows": "3", "placeholder": "Full Postal Address", "style": {"width": "100%", "padding": "12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontSize": "14px", "outline": "none", "resize": "vertical"}}}>
             </PageField>
           </div>
         </div>
         <div {...ui.props("register-ngo-48", {"style": {"background": "#f8fafc", "padding": "20px", "borderRadius": "12px", "marginBottom": "24px", "fontSize": "13px", "color": "#64748b"}})}>
           {" By submitting this form, you agree to Kindred's Terms of Service and Privacy Policy. Our verification team will reach out to your official email to request uploaded copies of your registration certificates. "}
         </div>
         <button {...ui.props("register-ngo-49", {"type": "submit", "className": "btn-primary", "style": {"width": "100%", "padding": "16px", "fontSize": "16px"}, "actionLabel": "Submit Application for Verification"})}>
           {"Submit Application for Verification"}
         </button>
         </>)}
       </form>
       <div {...ui.props("ngo-success-msg", {"id": "ngo-success-msg", "style": {"display": "none", "textAlign": "center", "padding": "40px 20px"}})}>
         {ui.content("ngo-success-msg", <>
         <div {...ui.props("register-ngo-51", {"style": {"width": "64px", "height": "64px", "background": "#10b981", "color": "#fff", "borderRadius": "50%", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "32px", "margin": "0 auto 20px"}})}>
           {"✓"}
         </div>
         <h2 {...ui.props("register-ngo-52", {"style": {"fontSize": "24px", "color": "#0f172a", "marginBottom": "12px"}})}>
           {"Application Received!"}
         </h2>
         <p {...ui.props("register-ngo-53", {"style": {"color": "#64748b", "fontSize": "15px", "maxWidth": "400px", "margin": "0 auto"}})}>
           {"Thank you for your interest in partnering with Kindred. Our team will review your application and contact you within 48 hours for the next steps."}
         </p>
         <button {...ui.props("register-ngo-54", {"className": "btn-outline", "style": {"marginTop": "30px"}, "type": "button", "actionLabel": "Return to Home"}, {"click": {"name": "navigate", "args": ["index.html"]}})}>
           {"Return to Home"}
         </button>
         </>)}
       </div>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
