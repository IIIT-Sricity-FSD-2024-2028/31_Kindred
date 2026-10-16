import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageRegion, AnimatedCounter } from '../runtime/PageElements.jsx';

export default function IndexPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/index.html">
   <section {...ui.props("index-1", {"className": "hero hero-video-bg"})}>
     <video {...ui.props("index-2", {"className": "hero-bg-video", "autoPlay": true, "loop": true, "muted": true, "playsInline": true})}>
       <source {...ui.props("index-3", {"src": "Untitled design (1).mp4", "type": "video/mp4"})} />
     </video>
     <div {...ui.props("index-4", {"className": "hero-overlay"})}>
     </div>
     <div {...ui.props("index-5", {"className": "hero-content-centered"})}>
       <div {...ui.props("index-6", {"className": "hero-text-centered"})}>
         <span {...ui.props("index-7", {"className": "hero-subtitle"})}>
           {"INDIA'S VOLUNTEER PLATFORM"}
         </span>
         <h1 {...ui.props("index-8", {"className": "hero-title-main"})}>
           <span {...ui.props("index-9", {"className": "text-blue"})}>
             {"Connecting"}
           </span>
           <br {...ui.props("index-10", {})} />
           <span {...ui.props("index-11", {"className": "text-blue"})}>
             {"Communities"}
           </span>
           <br {...ui.props("index-12", {})} />
           <span {...ui.props("index-13", {"className": "text-blue"})}>
             {"Through"}
           </span>
           {" "}
           <span {...ui.props("index-14", {"className": "text-red"})}>
             {"Kindness"}
           </span>
         </h1>
         <div {...ui.props("index-15", {"className": "hero-buttons-centered"})}>
           <Link {...ui.props("index-16", {"className": "btn-hero btn-blue", "actionLabel": "🤝 Join as Volunteer →", "to": "/join-volunteer.html"})}>
             <span {...ui.props("index-17", {"className": "btn-icon"})}>
               {"🤝"}
             </span>
             {" Join as Volunteer → "}
           </Link>
           {" "}
           <Link {...ui.props("index-18", {"className": "btn-hero btn-green", "actionLabel": "♡ Donate Now", "to": "/donate.html"})}>
             <span {...ui.props("index-19", {"className": "btn-icon"})}>
               {"♡"}
             </span>
             {" Donate Now "}
           </Link>
           {" "}
           <Link {...ui.props("index-20", {"className": "btn-hero btn-red", "actionLabel": "⚠ Emergency Help", "to": "/emergency-request.html"})}>
             <span {...ui.props("index-21", {"className": "btn-icon"})}>
               {"⚠"}
             </span>
             {" Emergency Help "}
           </Link>
         </div>
       </div>
     </div>
   </section>
   <section {...ui.props("index-22", {"className": "home-section bg-light"})}>
     <div {...ui.props("index-23", {"className": "home-container"})}>
       <span {...ui.props("index-24", {"className": "section-badge"})}>
         {"💰 ACTIVE CAMPAIGNS"}
       </span>
       <h2 {...ui.props("index-25", {"className": "section-title"})}>
         {"Active Fundraising Campaigns"}
       </h2>
       <p {...ui.props("index-26", {"className": "section-subtitle"})}>
         {"Help us reach our goals. Every contribution makes a difference!"}
       </p>
       <div {...ui.props("campaignsGrid", {"className": "campaigns-grid", "id": "campaignsGrid"})}>
         <PageRegion name="campaignsGrid" />
       </div>
     </div>
   </section>
   <section {...ui.props("index-28", {"className": "home-section"})}>
     <div {...ui.props("index-29", {"className": "home-container"})}>
       <span {...ui.props("index-30", {"className": "section-badge"})}>
         {"🤝 OUR PARTNERS"}
       </span>
       <h2 {...ui.props("index-31", {"className": "section-title"})}>
         {"Partner Organizations"}
       </h2>
       <p {...ui.props("index-32", {"className": "section-subtitle"})}>
         {"Trusted NGOs and institutions we work with to amplify social impact"}
       </p>
       <div {...ui.props("partnersGrid", {"className": "partners-grid", "id": "partnersGrid"})}>
         <PageRegion name="partnersGrid" />
       </div>
     </div>
   </section>
   <section {...ui.props("index-34", {"className": "home-section"})}>
     <div {...ui.props("index-35", {"className": "home-container"})}>
       <h2 {...ui.props("index-36", {"className": "section-title"})}>
         {"Making a Difference Together"}
       </h2>
       <div {...ui.props("index-37", {"className": "impact-stats"})}>
         <div {...ui.props("index-38", {"className": "impact-stat"})}>
           <div {...ui.props("index-39", {"className": "impact-icon"})}>
             {"🏢"}
           </div>
           <AnimatedCounter target={120} />
           <div {...ui.props("index-41", {"className": "impact-suffix"})}>
             {"+"}
           </div>
           <div {...ui.props("index-42", {"className": "impact-label"})}>
             {"NGOs Partnered"}
           </div>
         </div>
         <div {...ui.props("index-43", {"className": "impact-stat"})}>
           <div {...ui.props("index-44", {"className": "impact-icon"})}>
             {"👥"}
           </div>
           <AnimatedCounter target={45000} />
           <div {...ui.props("index-46", {"className": "impact-suffix"})}>
             {"+"}
           </div>
           <div {...ui.props("index-47", {"className": "impact-label"})}>
             {"Active Volunteers"}
           </div>
         </div>
         <div {...ui.props("index-48", {"className": "impact-stat"})}>
           <div {...ui.props("index-49", {"className": "impact-icon"})}>
             {"❤️"}
           </div>
           <AnimatedCounter target={23} />
           <div {...ui.props("index-51", {"className": "impact-suffix"})}>
             {"Lakh+"}
           </div>
           <div {...ui.props("index-52", {"className": "impact-label"})}>
             {"Lives Impacted"}
           </div>
         </div>
         <div {...ui.props("index-53", {"className": "impact-stat"})}>
           <div {...ui.props("index-54", {"className": "impact-icon"})}>
             {"💰"}
           </div>
           <AnimatedCounter target={15} />
           <div {...ui.props("index-56", {"className": "impact-suffix"})}>
             {".2 Cr"}
           </div>
           <div {...ui.props("index-57", {"className": "impact-label"})}>
             {"Funds Raised"}
           </div>
         </div>
       </div>
     </div>
   </section>
   <section {...ui.props("index-58", {"className": "home-section bg-light"})}>
     <div {...ui.props("index-59", {"className": "home-container"})}>
       <span {...ui.props("index-60", {"className": "section-badge"})}>
         {"🌟 OUR WORK"}
       </span>
       <h2 {...ui.props("index-61", {"className": "section-title"})}>
         {"Featured Programs"}
       </h2>
       <div {...ui.props("index-62", {"className": "programs-grid"})}>
         <div {...ui.props("index-63", {"className": "program-card large"})}>
           <img {...ui.props("index-64", {"src": "images/program-disaster.png", "alt": "Disaster Response"})} />
           <div {...ui.props("index-65", {"className": "program-card-overlay"})}>
             <span {...ui.props("index-66", {"className": "program-tag"})}>
               {"Disaster Relief"}
             </span>
             <h3 {...ui.props("index-67", {})}>
               {"Disaster Response & Recovery"}
             </h3>
             <p {...ui.props("index-68", {})}>
               {"Rapid deployment of volunteers and resources to communities affected by natural disasters across India. "}
             </p>
           </div>
         </div>
         <div {...ui.props("index-69", {"className": "program-card"})}>
           <img {...ui.props("index-70", {"src": "images/program-education.png", "alt": "Education Initiatives"})} />
           <div {...ui.props("index-71", {"className": "program-card-overlay"})}>
             <span {...ui.props("index-72", {"className": "program-tag"})}>
               {"Education"}
             </span>
             <h3 {...ui.props("index-73", {})}>
               {"Rural Education Initiative"}
             </h3>
             <p {...ui.props("index-74", {})}>
               {"Bridging the education gap in underserved rural communities."}
             </p>
           </div>
         </div>
         <div {...ui.props("index-75", {"className": "program-card"})}>
           <img {...ui.props("index-76", {"src": "images/program-environment.png", "alt": "Clean Environment"})} />
           <div {...ui.props("index-77", {"className": "program-card-overlay"})}>
             <span {...ui.props("index-78", {"className": "program-tag"})}>
               {"Environment"}
             </span>
             <h3 {...ui.props("index-79", {})}>
               {"Clean India, Green India"}
             </h3>
             <p {...ui.props("index-80", {})}>
               {"Tree plantation, river cleanups, and sustainable living programs."}
             </p>
           </div>
         </div>
         <div {...ui.props("index-81", {"className": "program-card"})}>
           <img {...ui.props("index-82", {"src": "images/program-healthcare.png", "alt": "Healthcare Camps"})} />
           <div {...ui.props("index-83", {"className": "program-card-overlay"})}>
             <span {...ui.props("index-84", {"className": "program-tag"})}>
               {"Healthcare"}
             </span>
             <h3 {...ui.props("index-85", {})}>
               {"Free Health Camps"}
             </h3>
             <p {...ui.props("index-86", {})}>
               {"Mobile medical units bringing healthcare to remote villages."}
             </p>
           </div>
         </div>
       </div>
     </div>
   </section>
   <section {...ui.props("index-87", {"className": "home-section"})}>
     <div {...ui.props("index-88", {"className": "home-container"})}>
       <h2 {...ui.props("index-89", {"className": "section-title"})}>
         {"Voices from Our Community"}
       </h2>
       <div {...ui.props("testimonialsGrid", {"className": "testimonials-grid", "id": "testimonialsGrid"})}>
         <PageRegion name="testimonialsGrid" />
       </div>
     </div>
   </section>
   <section {...ui.props("index-91", {"className": "cta-section"})}>
     <div {...ui.props("index-92", {"className": "home-container"})}>
       <h2 {...ui.props("index-93", {})}>
         {"Ready to Make a Difference?"}
       </h2>
       <p {...ui.props("index-94", {})}>
         {"Join the Kindred community today and be part of India's largest social impact network."}
       </p>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
