import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageRegion } from '../runtime/PageElements.jsx';

export default function FundraisingPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/fundraising.html">
   <section {...ui.props("fundraising-1", {"className": "page-hero bg-light-grey text-center", "style": {"padding": "80px 20px"}})}>
     <h1 {...ui.props("fundraising-2", {"style": {"fontFamily": "var(--brand-font)", "color": "var(--brand-navy)", "fontSize": "3rem", "marginBottom": "20px"}})}>
       {"Start a Movement. Fund the Future."}
     </h1>
     <p {...ui.props("fundraising-3", {"style": {"color": "#64748b", "fontSize": "1.1rem", "maxWidth": "600px", "margin": "0 auto 30px"}})}>
       {" Whether it's for medical emergencies, community education, or disaster relief, launch your campaign on Kindred and connect with millions of verified donors. "}
     </p>
     <Link {...ui.props("fundraising-4", {"className": "btn-primary", "style": {"padding": "16px 32px", "fontSize": "1.1rem"}, "actionLabel": "Start a Campaign Today", "to": "/signin.html"})}>
       {"Start a Campaign Today"}
     </Link>
   </section>
   <section {...ui.props("fundraising-5", {"className": "how-it-works", "style": {"maxWidth": "1200px", "margin": "60px auto", "padding": "0 32px"}})}>
     <h2 {...ui.props("fundraising-6", {"className": "section-title text-center", "style": {"marginBottom": "40px", "color": "var(--brand-navy)"}})}>
       {"How Fundraising on Kindred Works"}
     </h2>
     <div {...ui.props("fundraising-7", {"className": "grid", "style": {"display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(280px, 1fr))", "gap": "30px", "textAlign": "center"}})}>
       <div {...ui.props("fundraising-8", {"className": "step-card", "style": {"padding": "24px", "background": "#fff", "borderRadius": "12px", "boxShadow": "0 4px 12px rgba(0,0,0,0.05)"}})}>
         <div {...ui.props("fundraising-9", {"className": "icon", "style": {"fontSize": "36px", "marginBottom": "16px"}})}>
           {"??"}
         </div>
         <h3 {...ui.props("fundraising-10", {"style": {"marginBottom": "12px", "color": "#0f172a"}})}>
           {"1. Tell Your Story"}
         </h3>
         <p {...ui.props("fundraising-11", {"style": {"color": "#64748b", "fontSize": "14px"}})}>
           {"Set up your campaign in minutes. Share the problem, your goals, and add compelling photos."}
         </p>
       </div>
       <div {...ui.props("fundraising-12", {"className": "step-card", "style": {"padding": "24px", "background": "#fff", "borderRadius": "12px", "boxShadow": "0 4px 12px rgba(0,0,0,0.05)"}})}>
         <div {...ui.props("fundraising-13", {"className": "icon", "style": {"fontSize": "36px", "marginBottom": "16px"}})}>
           {"??"}
         </div>
         <h3 {...ui.props("fundraising-14", {"style": {"marginBottom": "12px", "color": "#0f172a"}})}>
           {"2. Share with the Network"}
         </h3>
         <p {...ui.props("fundraising-15", {"style": {"color": "#64748b", "fontSize": "14px"}})}>
           {"Leverage the Kindred platform and social media to reach donors and volunteers across India."}
         </p>
       </div>
       <div {...ui.props("fundraising-16", {"className": "step-card", "style": {"padding": "24px", "background": "#fff", "borderRadius": "12px", "boxShadow": "0 4px 12px rgba(0,0,0,0.05)"}})}>
         <div {...ui.props("fundraising-17", {"className": "icon", "style": {"fontSize": "36px", "marginBottom": "16px"}})}>
           {"??"}
         </div>
         <h3 {...ui.props("fundraising-18", {"style": {"marginBottom": "12px", "color": "#0f172a"}})}>
           {"3. Deliver Direct Impact"}
         </h3>
         <p {...ui.props("fundraising-19", {"style": {"color": "#64748b", "fontSize": "14px"}})}>
           {"Receive funds securely. Kindred handles the 80G tax receipt compliance automatically."}
         </p>
       </div>
     </div>
   </section>
   <section {...ui.props("fundraising-20", {"className": "active-campaigns bg-light-grey", "style": {"padding": "60px 32px"}})}>
     <div {...ui.props("fundraising-21", {"style": {"maxWidth": "1200px", "margin": "0 auto"}})}>
       <h2 {...ui.props("fundraising-22", {"className": "section-title", "style": {"marginBottom": "30px", "color": "var(--brand-navy)"}})}>
         {"Featured Live Campaigns"}
       </h2>
       <div {...ui.props("fundraising-23", {"className": "card-grid3", "style": {"display": "grid", "gap": "30px"}})}>
         <PageRegion name="fundraisingGrid" />
       </div>
       <div {...ui.props("fundraising-24", {"style": {"textAlign": "center", "marginTop": "40px"}})}>
         <Link {...ui.props("fundraising-25", {"className": "btn-outline", "actionLabel": "View All Organizations & Campaigns", "to": "/organizations.html"})}>
           {"View All Organizations & Campaigns"}
         </Link>
       </div>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
