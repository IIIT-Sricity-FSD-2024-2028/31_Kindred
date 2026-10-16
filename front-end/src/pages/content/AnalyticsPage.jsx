import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageTabs } from '../runtime/PageElements.jsx';

export default function AnalyticsPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/analytics.html">
   <div {...ui.props("analytics-1", {"className": "main-content"})}>
     <div {...ui.props("analytics-2", {"className": "page-header"})}>
       <div {...ui.props("analytics-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("analytics-4", {})}>
           {"Platform Administrator Dashboard"}
         </h1>
         <p {...ui.props("analytics-5", {})}>
           {"Manage all organizations on the Kindred platform"}
         </p>
       </div>
       <button {...ui.props("analytics-6", {"className": "btn-add-org", "type": "button", "actionLabel": "+ Add Organization"})}>
         {"+ Add Organization"}
       </button>
     </div>
     <PageTabs />
     <div {...ui.props("analytics-7", {"className": "stat-cards"})}>
       <div {...ui.props("analytics-8", {"className": "stat-card"})}>
         <div {...ui.props("analytics-9", {"className": "stat-card-header"})}>
           <div {...ui.props("analytics-10", {"className": "stat-icon blue"})}>
             {"🏢"}
           </div>
           <button {...ui.props("analytics-11", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("analytics-12", {"className": "stat-value"})}>
           {"120"}
         </div>
         <div {...ui.props("analytics-13", {"className": "stat-label"})}>
           {"Total Organizations"}
         </div>
         <div {...ui.props("analytics-14", {"className": "stat-change positive"})}>
           {"+8 this month"}
         </div>
       </div>
       <div {...ui.props("analytics-15", {"className": "stat-card"})}>
         <div {...ui.props("analytics-16", {"className": "stat-card-header"})}>
           <div {...ui.props("analytics-17", {"className": "stat-icon green"})}>
             {"👥"}
           </div>
           <button {...ui.props("analytics-18", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("analytics-19", {"className": "stat-value"})}>
           {"45,230"}
         </div>
         <div {...ui.props("analytics-20", {"className": "stat-label"})}>
           {"Total Volunteers"}
         </div>
         <div {...ui.props("analytics-21", {"className": "stat-change positive"})}>
           {"+1,245 this month"}
         </div>
       </div>
       <div {...ui.props("analytics-22", {"className": "stat-card"})}>
         <div {...ui.props("analytics-23", {"className": "stat-card-header"})}>
           <div {...ui.props("analytics-24", {"className": "stat-icon orange"})}>
             {"⚠"}
           </div>
           <button {...ui.props("analytics-25", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("analytics-26", {"className": "stat-value"})}>
           {"23"}
         </div>
         <div {...ui.props("analytics-27", {"className": "stat-label"})}>
           {"Emergency Requests"}
         </div>
         <div {...ui.props("analytics-28", {"className": "stat-change warning"})}>
           {"5 critical"}
         </div>
       </div>
       <div {...ui.props("analytics-29", {"className": "stat-card"})}>
         <div {...ui.props("analytics-30", {"className": "stat-card-header"})}>
           <div {...ui.props("analytics-31", {"className": "stat-icon purple"})}>
             {"📈"}
           </div>
           <button {...ui.props("analytics-32", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("analytics-33", {"className": "stat-value"})}>
           {"+34%"}
         </div>
         <div {...ui.props("analytics-34", {"className": "stat-label"})}>
           {"Platform Growth"}
         </div>
         <div {...ui.props("analytics-35", {"className": "stat-change info"})}>
           {"vs last quarter"}
         </div>
       </div>
     </div>
   </div>
     <PageExtras />
   </main>
  </>;
}
