import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function OrgAdminRequestsPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("org-admin-requests-1", {"data-react-page": "/org-admin-requests.html"})}>
     <div {...ui.props("org-admin-requests-2", {"className": "page-header fade-in"})}>
       <div {...ui.props("org-admin-requests-3", {})}>
         <h1 {...ui.props("org-admin-requests-4", {"className": "page-title"})}>
           {"HopeConnect"}
         </h1>
         <p {...ui.props("org-admin-requests-5", {"className": "page-subtitle"})}>
           {"Organization Admin Dashboard"}
         </p>
       </div>
       <div {...ui.props("org-admin-requests-6", {"className": "header-actions"})}>
         <a {...ui.props("org-admin-requests-7", {"href": "#", "className": "btn btn-outline", "actionLabel": "📊 Reports"})}>
           {"📊 Reports"}
         </a>
         {" "}
         <a {...ui.props("org-admin-requests-8", {"href": "#", "className": "btn btn-primary", "actionLabel": "+ New Program"}, {"click": {"name": "openProgModal", "args": []}})}>
           {"+ New Program"}
         </a>
       </div>
     </div>
     <PageTabs />
     <div {...ui.props("org-admin-requests-9", {"className": "stats-grid stagger"})}>
       <div {...ui.props("org-admin-requests-10", {"className": "stat-card volunteers"})}>
         <div {...ui.props("org-admin-requests-11", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-requests-12", {"className": "stat-icon green"})}>
             {"👥"}
           </div>
           <button {...ui.props("org-admin-requests-13", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("org-admin-requests-14", {"className": "stat-value"})}>
           {"1,240"}
         </div>
         <div {...ui.props("org-admin-requests-15", {"className": "stat-label"})}>
           {"Active Volunteers"}
         </div>
       </div>
       <div {...ui.props("org-admin-requests-16", {"className": "stat-card programs"})}>
         <div {...ui.props("org-admin-requests-17", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-requests-18", {"className": "stat-icon blue"})}>
             {"📋"}
           </div>
           <button {...ui.props("org-admin-requests-19", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("org-admin-requests-20", {"className": "stat-value"})}>
           {"3"}
         </div>
         <div {...ui.props("org-admin-requests-21", {"className": "stat-label"})}>
           {"Active Programs"}
         </div>
       </div>
       <div {...ui.props("org-admin-requests-22", {"className": "stat-card resources"})}>
         <div {...ui.props("org-admin-requests-23", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-requests-24", {"className": "stat-icon orange"})}>
             {"📦"}
           </div>
           <button {...ui.props("org-admin-requests-25", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("org-admin-requests-26", {"className": "stat-value"})}>
           {"5,910"}
         </div>
         <div {...ui.props("org-admin-requests-27", {"className": "stat-label"})}>
           {"Resources Allocated"}
         </div>
       </div>
       <div {...ui.props("org-admin-requests-28", {"className": "stat-card requests"})}>
         <div {...ui.props("org-admin-requests-29", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-requests-30", {"className": "stat-icon red"})}>
             {"⚠️"}
           </div>
           <button {...ui.props("org-admin-requests-31", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("org-admin-requests-32", {"className": "stat-value"})}>
           {"23"}
         </div>
         <div {...ui.props("org-admin-requests-33", {"className": "stat-label"})}>
           {"Pending Requests"}
         </div>
       </div>
     </div>
     <div {...ui.props("org-admin-requests-34", {"className": "beneficiary-section fade-in"})}>
       <div {...ui.props("org-admin-requests-35", {"className": "section-header"})}>
         <div {...ui.props("org-admin-requests-36", {"className": "section-title"})}>
           {"📝 Beneficiary Requests"}
         </div>
       </div>
       <div {...ui.props("beneficiaryReqList", {"id": "beneficiaryReqList"})}>
         <PageRegion name="beneficiaryReqList" />
       </div>
     </div>
     <PageExtras />
   </main>
  </>;
}
