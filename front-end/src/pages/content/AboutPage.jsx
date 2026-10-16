import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';

const valueIcons = {
  compassion: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8Z" /></>,
  transparency: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  collaboration: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  innovation: <><path d="M9 18h6M10 22h4M8.5 14.5A7 7 0 1 1 15.5 14.5C14.6 15.2 14 16.1 14 17h-4c0-.9-.6-1.8-1.5-2.5Z" /></>,
  inclusivity: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  impact: <><path d="M4 19V9M10 19V5M16 19v-7M22 19V2" /><path d="m3 6 6-3 6 4 7-5" /></>,
};

function ValueIcon({ name }) {
  return <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{valueIcons[name]}</svg>;
}

export default function AboutPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/about.html">
   <section {...ui.props("about-1", {"className": "about-hero"})}>
     <div {...ui.props("about-2", {"className": "about-hero-content"})}>
       <span {...ui.props("about-3", {"className": "about-badge"})}>
         {"ABOUT KINDRED"}
       </span>
       <h1 {...ui.props("about-4", {"className": "about-hero-title"})}>
         {"Empowering Communities"}
         <br {...ui.props("about-5", {})} />
         {"Through Connection"}
       </h1>
       <p {...ui.props("about-6", {"className": "about-hero-desc"})}>
         {"Kindred is a multi-organization platform that brings together NGOs, volunteers, donors, and beneficiaries under one unified system to maximize humanitarian impact."}
       </p>
     </div>
     <div {...ui.props("about-7", {"className": "about-hero-divider"})}>
       <svg {...ui.props("about-8", {"viewBox": "0 0 1440 60", "preserveAspectRatio": "none"})}>
         <path {...ui.props("about-9", {"d": "M0,60 L0,20 Q720,80 1440,20 L1440,60 Z", "fill": "#f0f2f5"})}>
         </path>
       </svg>
     </div>
   </section>
   <section {...ui.props("about-10", {"className": "about-section"})}>
     <div {...ui.props("about-11", {"className": "about-container"})}>
       <div {...ui.props("about-12", {"className": "mission-vision-grid"})}>
         <div {...ui.props("about-13", {"className": "mv-card"})}>
           <h2 {...ui.props("about-14", {"className": "mv-title"})}>
             {"Our Mission"}
           </h2>
           <p {...ui.props("about-15", {})}>
             {"We believe that coordinated humanitarian response is more effective than fragmented efforts. Kindred provides the digital infrastructure that enables NGOs to collaborate, share resources, and respond to crises faster."}
           </p>
           <p {...ui.props("about-16", {})}>
             {"Our platform connects those who want to help with those who need help, creating a seamless ecosystem of compassion, accountability, and impact."}
           </p>
         </div>
         <div {...ui.props("about-17", {"className": "mv-card"})}>
           <h2 {...ui.props("about-18", {"className": "mv-title"})}>
             {"Our Vision"}
           </h2>
           <p {...ui.props("about-19", {})}>
             {"A world where every community in crisis receives timely, coordinated assistance through a network of empowered organizations and engaged individuals."}
           </p>
           <p {...ui.props("about-20", {})}>
             {"We envision Kindred as the global standard for humanitarian coordination — a platform that makes giving, volunteering, and receiving aid as simple and transparent as possible."}
           </p>
         </div>
       </div>
     </div>
   </section>
   <section {...ui.props("about-21", {"className": "about-section about-values-section"})}>
     <div {...ui.props("about-22", {"className": "about-container"})}>
       <div {...ui.props("about-23", {"className": "about-values-header"})}>
         <span {...ui.props("about-24", {"className": "about-badge"})}>
           {"WHAT WE STAND FOR"}
         </span>
         <h2 {...ui.props("about-25", {"className": "section-title", "style": {"textAlign": "center"}})}>
           {"Our Core Values"}
         </h2>
       </div>
       <div {...ui.props("about-26", {"className": "values-grid"})}>
         <div {...ui.props("about-27", {"className": "value-card"})}>
           <div {...ui.props("about-28", {"className": "value-icon", "style": {"background": "#fef2f2", "color": "#ef4444"}})}>
             <ValueIcon name="compassion" />
           </div>
           <h3 {...ui.props("about-29", {"className": "value-name"})}>
             {"Compassion"}
           </h3>
           <p {...ui.props("about-30", {"className": "value-desc"})}>
             {"Every action driven by genuine care for communities in need."}
           </p>
         </div>
         <div {...ui.props("about-31", {"className": "value-card"})}>
           <div {...ui.props("about-32", {"className": "value-icon", "style": {"background": "#eff6ff", "color": "#3b82f6"}})}>
             <ValueIcon name="transparency" />
           </div>
           <h3 {...ui.props("about-33", {"className": "value-name"})}>
             {"Transparency"}
           </h3>
           <p {...ui.props("about-34", {"className": "value-desc"})}>
             {"Full accountability in resource allocation and impact reporting."}
           </p>
         </div>
         <div {...ui.props("about-35", {"className": "value-card"})}>
           <div {...ui.props("about-36", {"className": "value-icon", "style": {"background": "#fef3c7", "color": "#f59e0b"}})}>
             <ValueIcon name="collaboration" />
           </div>
           <h3 {...ui.props("about-37", {"className": "value-name"})}>
             {"Collaboration"}
           </h3>
           <p {...ui.props("about-38", {"className": "value-desc"})}>
             {"Uniting organizations for greater collective impact."}
           </p>
         </div>
         <div {...ui.props("about-39", {"className": "value-card"})}>
           <div {...ui.props("about-40", {"className": "value-icon", "style": {"background": "#f0fdf4", "color": "#22c55e"}})}>
             <ValueIcon name="innovation" />
           </div>
           <h3 {...ui.props("about-41", {"className": "value-name"})}>
             {"Innovation"}
           </h3>
           <p {...ui.props("about-42", {"className": "value-desc"})}>
             {"Using technology to solve humanitarian challenges at scale."}
           </p>
         </div>
         <div {...ui.props("about-43", {"className": "value-card"})}>
           <div {...ui.props("about-44", {"className": "value-icon", "style": {"background": "#f0f9ff", "color": "#0ea5e9"}})}>
             <ValueIcon name="inclusivity" />
           </div>
           <h3 {...ui.props("about-45", {"className": "value-name"})}>
             {"Inclusivity"}
           </h3>
           <p {...ui.props("about-46", {"className": "value-desc"})}>
             {"Serving every community regardless of geography or background."}
           </p>
         </div>
         <div {...ui.props("about-47", {"className": "value-card"})}>
           <div {...ui.props("about-48", {"className": "value-icon", "style": {"background": "#fdf4ff", "color": "#a855f7"}})}>
             <ValueIcon name="impact" />
           </div>
           <h3 {...ui.props("about-49", {"className": "value-name"})}>
             {"Impact"}
           </h3>
           <p {...ui.props("about-50", {"className": "value-desc"})}>
             {"Measuring and maximizing outcomes for every dollar and hour."}
           </p>
         </div>
       </div>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
