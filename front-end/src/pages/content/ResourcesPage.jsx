import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function ResourcesPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("resources-1", {"data-react-page": "/resources.html"})}>
     <div {...ui.props("resources-2", {"className": "page-header fade-in"})}>
       <div {...ui.props("resources-3", {})}>
         <h1 {...ui.props("resources-4", {"className": "page-title"})}>
           {"Resources & Donations"}
         </h1>
         <p {...ui.props("resources-5", {"className": "page-subtitle"})}>
           {"Manage resource donations from donors, assign volunteer pickups, and allocate to programs."}
         </p>
       </div>
       <div {...ui.props("resources-6", {"className": "header-actions"})}>
         <Link {...ui.props("resources-7", {"className": "btn btn-outline", "actionLabel": "📊 Reports", "to": "/analytics.html"})}>
           {"📊 Reports"}
         </Link>
         {" "}
         <a {...ui.props("resources-8", {"href": "#", "className": "btn btn-primary", "actionLabel": "+ New Program"}, {"click": {"name": "openProgModal", "args": []}})}>
           {"+ New Program"}
         </a>
       </div>
     </div>
     <PageTabs />
     <div {...ui.props("resources-9", {"className": "stats-grid stagger"})}>
       <div {...ui.props("resources-10", {"className": "stat-card volunteers"})}>
         <div {...ui.props("resources-11", {"className": "stat-card-header"})}>
           <div {...ui.props("resources-12", {"className": "stat-icon green"})}>
             {"📦"}
           </div>
           <button {...ui.props("resources-13", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("rstat-total", {"className": "stat-value", "id": "rstat-total"})}>
           {ui.content("rstat-total", <>
           {"0"}
           </>)}
         </div>
         <div {...ui.props("resources-15", {"className": "stat-label"})}>
           {"Total Donations"}
         </div>
       </div>
       <div {...ui.props("resources-16", {"className": "stat-card programs"})}>
         <div {...ui.props("resources-17", {"className": "stat-card-header"})}>
           <div {...ui.props("resources-18", {"className": "stat-icon orange"})}>
             {"⏳"}
           </div>
           <button {...ui.props("resources-19", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("rstat-pending", {"className": "stat-value", "id": "rstat-pending"})}>
           {ui.content("rstat-pending", <>
           {"0"}
           </>)}
         </div>
         <div {...ui.props("resources-21", {"className": "stat-label"})}>
           {"Pending Pickup"}
         </div>
       </div>
       <div {...ui.props("resources-22", {"className": "stat-card resources"})}>
         <div {...ui.props("resources-23", {"className": "stat-card-header"})}>
           <div {...ui.props("resources-24", {"className": "stat-icon blue"})}>
             {"🚚"}
           </div>
           <button {...ui.props("resources-25", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("rstat-active", {"className": "stat-value", "id": "rstat-active"})}>
           {ui.content("rstat-active", <>
           {"0"}
           </>)}
         </div>
         <div {...ui.props("resources-27", {"className": "stat-label"})}>
           {"In Transit"}
         </div>
       </div>
       <div {...ui.props("resources-28", {"className": "stat-card requests"})}>
         <div {...ui.props("resources-29", {"className": "stat-card-header"})}>
           <div {...ui.props("resources-30", {"className": "stat-icon green"})}>
             {"✅"}
           </div>
           <button {...ui.props("resources-31", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("rstat-delivered", {"className": "stat-value", "id": "rstat-delivered"})}>
           {ui.content("rstat-delivered", <>
           {"0"}
           </>)}
         </div>
         <div {...ui.props("resources-33", {"className": "stat-label"})}>
           {"Delivered"}
         </div>
       </div>
     </div>
     <div {...ui.props("resources-34", {"className": "resources-section fade-in", "style": {"marginBottom": "24px"}})}>
       <div {...ui.props("resources-35", {"className": "section-header"})}>
         <div {...ui.props("resources-36", {"className": "section-title"})}>
           {"📦 Pending Resource Donations"}
         </div>
       </div>
       <div {...ui.props("resPendingList", {"id": "resPendingList"})}>
         <PageRegion name="resPendingList" />
       </div>
     </div>
     <div {...ui.props("resources-38", {"className": "resources-section fade-in", "style": {"marginBottom": "24px"}})}>
       <div {...ui.props("resources-39", {"className": "section-header"})}>
         <div {...ui.props("resources-40", {"className": "section-title"})}>
           {"🚚 Active Pickups"}
         </div>
       </div>
       <div {...ui.props("resActiveList", {"id": "resActiveList"})}>
         <PageRegion name="resActiveList" />
       </div>
     </div>
     <div {...ui.props("resources-42", {"className": "resources-section fade-in", "style": {"marginBottom": "24px"}})}>
       <div {...ui.props("resources-43", {"className": "section-header"})}>
         <div {...ui.props("resources-44", {"className": "section-title"})}>
           {"✅ Completed Donations"}
         </div>
       </div>
       <div {...ui.props("resCompletedList", {"id": "resCompletedList"})}>
         <PageRegion name="resCompletedList" />
       </div>
     </div>
     <PageExtras />
   </main>
  </>;
}
