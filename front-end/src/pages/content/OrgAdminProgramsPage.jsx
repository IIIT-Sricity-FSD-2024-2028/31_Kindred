import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function OrgAdminProgramsPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("org-admin-programs-1", {"data-react-page": "/org-admin-programs.html"})}>
     <div {...ui.props("org-admin-programs-2", {"className": "page-header fade-in"})}>
       <div {...ui.props("org-admin-programs-3", {})}>
         <h1 {...ui.props("org-admin-programs-4", {"className": "page-title"})}>
           {"HopeConnect"}
         </h1>
         <p {...ui.props("org-admin-programs-5", {"className": "page-subtitle"})}>
           {"Organization Admin Dashboard"}
         </p>
       </div>
       <div {...ui.props("org-admin-programs-6", {"className": "header-actions"})}>
         <a {...ui.props("org-admin-programs-7", {"href": "#", "className": "btn btn-outline", "actionLabel": "📊 Reports"})}>
           {"📊 Reports"}
         </a>
         <button {...ui.props("org-admin-programs-8", {"className": "btn btn-primary", "style": {"background": "#059669", "borderColor": "#059669"}, "type": "button", "actionLabel": "+ Assign Task"}, {"click": {"name": "openGlobalTaskModal", "args": []}})}>
           {"+ Assign Task"}
         </button>
         <a {...ui.props("org-admin-programs-9", {"href": "#", "data-add-program": "true", "className": "btn btn-primary", "actionLabel": "+ New Program"}, {"click": {"name": "openProgModal", "args": []}})}>
           {"+ New Program"}
         </a>
       </div>
     </div>
     <PageTabs />
     <div {...ui.props("org-admin-programs-10", {"className": "stats-grid stagger"})}>
       <div {...ui.props("org-admin-programs-11", {"className": "stat-card volunteers"})}>
         <div {...ui.props("org-admin-programs-12", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-programs-13", {"className": "stat-icon green"})}>
             {"👥"}
           </div>
           <button {...ui.props("org-admin-programs-14", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("org-admin-programs-15", {"className": "stat-value"})}>
           {"1,240"}
         </div>
         <div {...ui.props("org-admin-programs-16", {"className": "stat-label"})}>
           {"Active Volunteers"}
         </div>
       </div>
       <div {...ui.props("org-admin-programs-17", {"className": "stat-card programs"})}>
         <div {...ui.props("org-admin-programs-18", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-programs-19", {"className": "stat-icon blue"})}>
             {"📋"}
           </div>
           <button {...ui.props("org-admin-programs-20", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("org-admin-programs-21", {"className": "stat-value"})}>
           {"3"}
         </div>
         <div {...ui.props("org-admin-programs-22", {"className": "stat-label"})}>
           {"Active Programs"}
         </div>
       </div>
       <div {...ui.props("org-admin-programs-23", {"className": "stat-card resources"})}>
         <div {...ui.props("org-admin-programs-24", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-programs-25", {"className": "stat-icon orange"})}>
             {"📦"}
           </div>
           <button {...ui.props("org-admin-programs-26", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("org-admin-programs-27", {"className": "stat-value"})}>
           {"5,910"}
         </div>
         <div {...ui.props("org-admin-programs-28", {"className": "stat-label"})}>
           {"Resources Allocated"}
         </div>
       </div>
       <div {...ui.props("org-admin-programs-29", {"className": "stat-card requests"})}>
         <div {...ui.props("org-admin-programs-30", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-programs-31", {"className": "stat-icon red"})}>
             {"⚠️"}
           </div>
           <button {...ui.props("org-admin-programs-32", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("org-admin-programs-33", {"className": "stat-value"})}>
           {"23"}
         </div>
         <div {...ui.props("org-admin-programs-34", {"className": "stat-label"})}>
           {"Pending Requests"}
         </div>
       </div>
     </div>
     <div {...ui.props("org-admin-programs-35", {"className": "programs-section fade-in"})}>
       <div {...ui.props("org-admin-programs-36", {"className": "section-header"})}>
         <div {...ui.props("org-admin-programs-37", {"className": "section-title"})}>
           {"📋 Programs"}
         </div>
         <div {...ui.props("org-admin-programs-38", {"style": {"display": "flex", "gap": "8px"}})}>
           <button {...ui.props("org-admin-programs-39", {"className": "btn btn-outline btn-sm", "style": {"color": "#059669", "borderColor": "#10b981", "fontWeight": "600"}, "type": "button", "actionLabel": "+ Assign Task"}, {"click": {"name": "openGlobalTaskModal", "args": []}})}>
             {"+ Assign Task"}
           </button>
           <a {...ui.props("org-admin-programs-40", {"href": "#", "className": "btn btn-outline btn-sm", "actionLabel": "+ Add New Program"}, {"click": {"name": "openProgModal", "args": []}})}>
             {"+ Add New Program"}
           </a>
         </div>
       </div>
       <div {...ui.props("programsGrid", {"id": "programsGrid", "className": "programs-grid"})}>
         <PageRegion name="programsGrid" />
       </div>
     </div>
     <PageExtras />
   </main>
  </>;
}
