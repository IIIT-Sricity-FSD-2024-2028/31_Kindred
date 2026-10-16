import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function VolunteersPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("volunteers-1", {"data-react-page": "/volunteers.html"})}>
     <div {...ui.props("volunteers-2", {"className": "page-header fade-in"})}>
       <div {...ui.props("volunteers-3", {})}>
         <h1 {...ui.props("volunteers-4", {"className": "page-title"})}>
           {"HopeConnect"}
         </h1>
         <p {...ui.props("volunteers-5", {"className": "page-subtitle"})}>
           {"Organization Admin Dashboard"}
         </p>
       </div>
       <div {...ui.props("volunteers-6", {"className": "header-actions"})}>
         <a {...ui.props("volunteers-7", {"href": "#", "className": "btn btn-outline", "actionLabel": "📊 Reports"})}>
           {"📊 Reports"}
         </a>
         <button {...ui.props("volunteers-8", {"className": "btn btn-primary", "data-add-volunteer": "true", "type": "button", "actionLabel": "+ Add Volunteer"})}>
           {"+ Add Volunteer"}
         </button>
         <button {...ui.props("volunteers-9", {"className": "btn btn-primary", "style": {"background": "#059669", "borderColor": "#059669"}, "type": "button", "actionLabel": "+ Assign Task"}, {"click": {"name": "openGlobalTaskModal", "args": []}})}>
           {"+ Assign Task"}
         </button>
         <a {...ui.props("volunteers-10", {"href": "#", "className": "btn btn-primary", "actionLabel": "+ New Program"}, {"click": {"name": "openProgModal", "args": []}})}>
           {"+ New Program"}
         </a>
       </div>
     </div>
     <PageTabs />
     <div {...ui.props("volunteers-11", {"className": "stats-grid stagger"})}>
       <div {...ui.props("volunteers-12", {"className": "stat-card volunteers"})}>
         <div {...ui.props("volunteers-13", {"className": "stat-card-header"})}>
           <div {...ui.props("volunteers-14", {"className": "stat-icon green"})}>
             {"👥"}
           </div>
           <button {...ui.props("volunteers-15", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("volunteers-16", {"className": "stat-value"})}>
           {"1,240"}
         </div>
         <div {...ui.props("volunteers-17", {"className": "stat-label"})}>
           {"Active Volunteers"}
         </div>
       </div>
       <div {...ui.props("volunteers-18", {"className": "stat-card programs"})}>
         <div {...ui.props("volunteers-19", {"className": "stat-card-header"})}>
           <div {...ui.props("volunteers-20", {"className": "stat-icon blue"})}>
             {"📋"}
           </div>
           <button {...ui.props("volunteers-21", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("volunteers-22", {"className": "stat-value"})}>
           {"2"}
         </div>
         <div {...ui.props("volunteers-23", {"className": "stat-label"})}>
           {"Active Programs"}
         </div>
       </div>
       <div {...ui.props("volunteers-24", {"className": "stat-card resources"})}>
         <div {...ui.props("volunteers-25", {"className": "stat-card-header"})}>
           <div {...ui.props("volunteers-26", {"className": "stat-icon orange"})}>
             {"📦"}
           </div>
           <button {...ui.props("volunteers-27", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("volunteers-28", {"className": "stat-value"})}>
           {"5,910"}
         </div>
         <div {...ui.props("volunteers-29", {"className": "stat-label"})}>
           {"Resources Allocated"}
         </div>
       </div>
       <div {...ui.props("volunteers-30", {"className": "stat-card requests"})}>
         <div {...ui.props("volunteers-31", {"className": "stat-card-header"})}>
           <div {...ui.props("volunteers-32", {"className": "stat-icon red"})}>
             {"⚠️"}
           </div>
           <button {...ui.props("volunteers-33", {"className": "stat-more", "type": "button", "actionLabel": "⋯"})}>
             {"⋯"}
           </button>
         </div>
         <div {...ui.props("volunteers-34", {"className": "stat-value"})}>
           {"23"}
         </div>
         <div {...ui.props("volunteers-35", {"className": "stat-label"})}>
           {"Pending Requests"}
         </div>
       </div>
     </div>
     <div {...ui.props("volunteers-36", {"className": "volunteers-section fade-in"})}>
       <div {...ui.props("volunteers-37", {"className": "volunteers-header"})}>
         <div {...ui.props("volunteers-38", {"className": "section-title"})}>
           {"👤 Volunteers"}
         </div>
         <div {...ui.props("volunteers-39", {"className": "search-box"})}>
           <span {...ui.props("volunteers-40", {"className": "search-icon"})}>
             {"🔍"}
           </span>
           <PageField as="input" field="volunteerSearch" spec={{"type": "text", "id": "volunteerSearch", "placeholder": "Search volunteers..."}} />
         </div>
       </div>
       <div {...ui.props("volunteers-42", {"className": "table-wrap"})}>
         <table {...ui.props("volunteers-43", {})}>
           <thead {...ui.props("volunteers-44", {})}>
             <tr {...ui.props("volunteers-45", {})}>
               <th {...ui.props("volunteers-46", {})}>
                 {"Name"}
               </th>
               <th {...ui.props("volunteers-47", {})}>
                 {"Role"}
               </th>
               <th {...ui.props("volunteers-48", {})}>
                 {"Status"}
               </th>
               <th {...ui.props("volunteers-49", {})}>
                 {"Hours"}
               </th>
               <th {...ui.props("volunteers-50", {})}>
                 {"Tasks"}
               </th>
               <th {...ui.props("volunteers-51", {})}>
                 {"Actions"}
               </th>
             </tr>
           </thead>
           <tbody {...ui.props("volTableBody", {"id": "volTableBody"})}>
             <PageRegion name="volTableBody" />
           </tbody>
         </table>
       </div>
     </div>
     <PageExtras />
   </main>
  </>;
}
