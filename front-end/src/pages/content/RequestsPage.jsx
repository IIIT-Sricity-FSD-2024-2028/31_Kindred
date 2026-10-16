import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function RequestsPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/requests.html">
   <div {...ui.props("requests-1", {"className": "main-content"})}>
     <div {...ui.props("requests-2", {"className": "page-header"})}>
       <div {...ui.props("requests-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("requests-4", {})}>
           {"Platform Administrator Dashboard"}
         </h1>
         <p {...ui.props("requests-5", {})}>
           {"Manage all organizations on the Kindred platform"}
         </p>
       </div>
       <button {...ui.props("requests-6", {"className": "btn-add-org", "type": "button", "actionLabel": "+ Add Organization"})}>
         {"+ Add Organization"}
       </button>
     </div>
     <PageTabs />
     <div {...ui.props("requests-7", {"className": "stat-cards"})}>
       <div {...ui.props("requests-8", {"className": "stat-card"})}>
         <div {...ui.props("requests-9", {"className": "stat-card-header"})}>
           <div {...ui.props("requests-10", {"className": "stat-icon blue"})}>
             {"🏢"}
           </div>
           <button {...ui.props("requests-11", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("requests-12", {"className": "stat-value"})}>
           {"120"}
         </div>
         <div {...ui.props("requests-13", {"className": "stat-label"})}>
           {"Total Organizations"}
         </div>
         <div {...ui.props("requests-14", {"className": "stat-change positive"})}>
           {"+8 this month"}
         </div>
       </div>
       <div {...ui.props("requests-15", {"className": "stat-card"})}>
         <div {...ui.props("requests-16", {"className": "stat-card-header"})}>
           <div {...ui.props("requests-17", {"className": "stat-icon green"})}>
             {"👥"}
           </div>
           <button {...ui.props("requests-18", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("requests-19", {"className": "stat-value"})}>
           {"45,230"}
         </div>
         <div {...ui.props("requests-20", {"className": "stat-label"})}>
           {"Total Volunteers"}
         </div>
         <div {...ui.props("requests-21", {"className": "stat-change positive"})}>
           {"+1,245 this month"}
         </div>
       </div>
       <div {...ui.props("requests-22", {"className": "stat-card"})}>
         <div {...ui.props("requests-23", {"className": "stat-card-header"})}>
           <div {...ui.props("requests-24", {"className": "stat-icon orange"})}>
             {"⚠"}
           </div>
           <button {...ui.props("requests-25", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("requests-26", {"className": "stat-value"})}>
           {"23"}
         </div>
         <div {...ui.props("requests-27", {"className": "stat-label"})}>
           {"Emergency Requests"}
         </div>
         <div {...ui.props("requests-28", {"className": "stat-change warning"})}>
           {"5 critical"}
         </div>
       </div>
       <div {...ui.props("requests-29", {"className": "stat-card"})}>
         <div {...ui.props("requests-30", {"className": "stat-card-header"})}>
           <div {...ui.props("requests-31", {"className": "stat-icon purple"})}>
             {"📈"}
           </div>
           <button {...ui.props("requests-32", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("requests-33", {"className": "stat-value"})}>
           {"+34%"}
         </div>
         <div {...ui.props("requests-34", {"className": "stat-label"})}>
           {"Platform Growth"}
         </div>
         <div {...ui.props("requests-35", {"className": "stat-change info"})}>
           {"vs last quarter"}
         </div>
       </div>
     </div>
     <div {...ui.props("requests-36", {"className": "section-card"})}>
       <div {...ui.props("requests-37", {"className": "section-card-header"})}>
         <h2 {...ui.props("requests-38", {})}>
           {"NGO Registration Requests "}
           <span {...ui.props("requestBadge", {"className": "badge pending", "id": "requestBadge"})}>
             {ui.content("requestBadge", <>
             {"loading…"}
             </>)}
           </span>
         </h2>
       </div>
       <div {...ui.props("requestsList", {"id": "requestsList"})}>
         <PageRegion name="requestsList" />
       </div>
     </div>
   </div>
     <PageExtras />
   </main>
  </>;
}
