import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function OrgAdminPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/org-admin.html">
   <div {...ui.props("org-admin-1", {"className": "main-content"})}>
     <div {...ui.props("org-admin-2", {"className": "page-header"})}>
       <div {...ui.props("org-admin-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("orgAdminTitle", {"id": "orgAdminTitle"})}>
           {ui.content("orgAdminTitle", <>
           {"HopeConnect"}
           </>)}
         </h1>
         <p {...ui.props("org-admin-5", {})}>
           {"Organization Administrator Dashboard • Manage programs, volunteers, donations & requests"}
         </p>
       </div>
       <div {...ui.props("org-admin-6", {"style": {"display": "flex", "gap": "10px", "flexWrap": "wrap"}})}>
         <Link {...ui.props("org-admin-7", {"style": {"display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "9px 16px", "background": "#f8fafc", "color": "#334155", "border": "1px solid #e2e8f0", "borderRadius": "8px", "fontSize": ".85rem", "fontWeight": "600", "textDecoration": "none"}, "actionLabel": "👤 Profile", "to": "/profile.html"})}>
           {"👤 Profile"}
         </Link>
         <button {...ui.props("org-admin-8", {"className": "btn-add-org", "type": "button", "actionLabel": "+ New Program"}, {"click": {"name": "openProgModal", "args": []}})}>
           {"+ New Program"}
         </button>
       </div>
     </div>
     <PageTabs />
     <div {...ui.props("org-admin-9", {"className": "stat-cards"})}>
       <div {...ui.props("org-admin-10", {"className": "stat-card"})}>
         <div {...ui.props("org-admin-11", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-12", {"className": "stat-icon green"})}>
             {"👥"}
           </div>
         </div>
         <div {...ui.props("stat-org-vols", {"className": "stat-value", "id": "stat-org-vols"})}>
           {ui.content("stat-org-vols", <>
           {"…"}
           </>)}
         </div>
         <div {...ui.props("org-admin-14", {"className": "stat-label"})}>
           {"Active Volunteers"}
         </div>
         <div {...ui.props("org-admin-15", {"className": "stat-change positive"})}>
           {"In your organization"}
         </div>
       </div>
       <div {...ui.props("org-admin-16", {"className": "stat-card"})}>
         <div {...ui.props("org-admin-17", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-18", {"className": "stat-icon blue"})}>
             {"📋"}
           </div>
         </div>
         <div {...ui.props("stat-org-progs", {"className": "stat-value", "id": "stat-org-progs"})}>
           {ui.content("stat-org-progs", <>
           {"…"}
           </>)}
         </div>
         <div {...ui.props("org-admin-20", {"className": "stat-label"})}>
           {"Active Programs"}
         </div>
         <div {...ui.props("org-admin-21", {"className": "stat-change positive"})}>
           {"Community impact"}
         </div>
       </div>
       <div {...ui.props("org-admin-22", {"className": "stat-card"})}>
         <div {...ui.props("org-admin-23", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-24", {"className": "stat-icon orange"})}>
             {"📦"}
           </div>
         </div>
         <div {...ui.props("stat-org-res", {"className": "stat-value", "id": "stat-org-res"})}>
           {ui.content("stat-org-res", <>
           {"…"}
           </>)}
         </div>
         <div {...ui.props("org-admin-26", {"className": "stat-label"})}>
           {"Resources Allocated"}
         </div>
         <div {...ui.props("org-admin-27", {"className": "stat-change info"})}>
           {"Units distributed"}
         </div>
       </div>
       <div {...ui.props("org-admin-28", {"className": "stat-card"})}>
         <div {...ui.props("org-admin-29", {"className": "stat-card-header"})}>
           <div {...ui.props("org-admin-30", {"className": "stat-icon purple"})}>
             {"📥"}
           </div>
         </div>
         <div {...ui.props("stat-org-reqs", {"className": "stat-value", "id": "stat-org-reqs"})}>
           {ui.content("stat-org-reqs", <>
           {"…"}
           </>)}
         </div>
         <div {...ui.props("org-admin-32", {"className": "stat-label"})}>
           {"Pending Requests"}
         </div>
         <div {...ui.props("org-admin-33", {"className": "stat-change warning"})}>
           {"Needs Review"}
         </div>
       </div>
     </div>
     <div {...ui.props("org-panel-overview", {"id": "org-panel-overview", "className": "org-tab-panel"})}>
       {ui.content("org-panel-overview", <>
       <PageRegion name="listingManager" />
       <section className="page-record-card" id="orgProfileManagerCard">
         <div>
           <h3>{ui.session?.org} — Organization Profile</h3>
           <p>Public profile, donation payment details and requested resources.</p>
           <p>Total donations: ₹{ui.data('donations').reduce((total, donation) => total + Number(donation.amount || 0), 0).toLocaleString('en-IN')}</p>
         </div>
         <button className="btn-primary-sm" onClick={() => ui.action('openOrgProfile')}>Edit Public Profile</button>
       </section>
       <div {...ui.props("org-admin-35", {"className": "section-card"})}>
         <div {...ui.props("org-admin-36", {"className": "section-card-header"})}>
           <h2 {...ui.props("org-admin-37", {})}>
             {"Active Community Programs"}
           </h2>
           <a {...ui.props("org-admin-38", {"href": "#", "style": {"fontSize": ".82rem", "color": "#3b82f6", "textDecoration": "none", "fontWeight": "600"}, "actionLabel": "View All Programs →"}, {"click": {"name": "switchOrgTab", "args": ["programs"]}})}>
             {"View All Programs →"}
           </a>
         </div>
         <div {...ui.props("orgOverviewPrograms", {"id": "orgOverviewPrograms"})}>
           <PageRegion name="orgOverviewPrograms" />
         </div>
       </div>
       <div {...ui.props("org-admin-40", {"className": "org-overview-grid", "style": {"display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(360px, 1fr))", "gap": "24px"}})}>
         <div {...ui.props("org-admin-41", {"className": "section-card"})}>
           <div {...ui.props("org-admin-42", {"className": "section-card-header"})}>
             <h2 {...ui.props("org-admin-43", {})}>
               {"Volunteer Team"}
             </h2>
             <a {...ui.props("org-admin-44", {"href": "#", "style": {"fontSize": ".82rem", "color": "#3b82f6", "textDecoration": "none", "fontWeight": "600"}, "actionLabel": "All Volunteers →"}, {"click": {"name": "switchOrgTab", "args": ["volunteers"]}})}>
               {"All Volunteers →"}
             </a>
           </div>
           <table {...ui.props("org-admin-45", {"className": "org-table"})}>
             <thead {...ui.props("org-admin-46", {})}>
               <tr {...ui.props("org-admin-47", {})}>
                 <th {...ui.props("org-admin-48", {})}>
                   {"Volunteer"}
                 </th>
                 <th {...ui.props("org-admin-49", {})}>
                   {"Role"}
                 </th>
                 <th {...ui.props("org-admin-50", {})}>
                   {"Skills"}
                 </th>
                 <th {...ui.props("org-admin-51", {})}>
                   {"Hours"}
                 </th>
               </tr>
             </thead>
             <tbody {...ui.props("orgOverviewVolunteersBody", {"id": "orgOverviewVolunteersBody"})}>
               <PageRegion name="orgOverviewVolunteersBody" />
             </tbody>
           </table>
         </div>
         <div {...ui.props("org-admin-53", {"className": "section-card"})}>
           <div {...ui.props("org-admin-54", {"className": "section-card-header"})}>
             <h2 {...ui.props("org-admin-55", {})}>
               {"Incoming Assistance Requests"}
             </h2>
             <a {...ui.props("org-admin-56", {"href": "#", "style": {"fontSize": ".82rem", "color": "#3b82f6", "textDecoration": "none", "fontWeight": "600"}, "actionLabel": "View All →"}, {"click": {"name": "switchOrgTab", "args": ["requests"]}})}>
               {"View All →"}
             </a>
           </div>
           <div {...ui.props("orgOverviewIncomingList", {"id": "orgOverviewIncomingList"})}>
             <PageRegion name="orgOverviewIncomingList" />
           </div>
         </div>
       </div>
       </>)}
     </div>
     <div {...ui.props("org-panel-volunteers", {"id": "org-panel-volunteers", "className": "org-tab-panel", "style": {"display": "none"}})}>
       {ui.content("org-panel-volunteers", <>
       <div {...ui.props("org-admin-59", {"className": "section-card"})}>
         <div {...ui.props("org-admin-60", {"className": "section-card-header", "style": {"flexWrap": "wrap", "gap": "14px"}})}>
           <h2 {...ui.props("org-admin-61", {})}>
             {"Organization Volunteers"}
           </h2>
           <div {...ui.props("org-admin-62", {"className": "search-bar"})}>
             <span {...ui.props("org-admin-63", {"className": "search-icon"})}>
               {"🔍"}
             </span>
             <PageField as="input" field="org-admin-64" spec={{"type": "text", "placeholder": "Search volunteers by name, skill, email..."}} />
           </div>
         </div>
         <table {...ui.props("org-admin-65", {"className": "org-table"})}>
           <thead {...ui.props("org-admin-66", {})}>
             <tr {...ui.props("org-admin-67", {})}>
               <th {...ui.props("org-admin-68", {})}>
                 {"Volunteer"}
               </th>
               <th {...ui.props("org-admin-69", {})}>
                 {"Role"}
               </th>
               <th {...ui.props("org-admin-70", {})}>
                 {"Skills"}
               </th>
               <th {...ui.props("org-admin-71", {})}>
                 {"Hours Logged"}
               </th>
               <th {...ui.props("org-admin-72", {})}>
                 {"Status"}
               </th>
               <th {...ui.props("org-admin-73", {})}>
                 {"Actions"}
               </th>
             </tr>
           </thead>
           <tbody {...ui.props("orgVolunteersTableBody", {"id": "orgVolunteersTableBody"})}>
             <PageRegion name="orgVolunteersTableBody" />
           </tbody>
         </table>
       </div>
       <div {...ui.props("org-admin-75", {"className": "section-card", "style": {"marginTop": "24px"}})}>
         <div {...ui.props("org-admin-76", {"className": "section-card-header"})}>
           <h2 {...ui.props("org-admin-77", {})}>
             {"⏱️ Pending Hour Log Verification"}
           </h2>
         </div>
         <div {...ui.props("hourVerificationList", {"id": "hourVerificationList"})}>
           <PageRegion name="hourVerificationList" />
         </div>
       </div>
       <div {...ui.props("org-admin-79", {"className": "section-card", "style": {"marginTop": "24px"}})}>
         <div {...ui.props("org-admin-80", {"className": "section-card-header"})}>
           <h2 {...ui.props("org-admin-81", {})}>
             {"📋 Pending Task Updates"}
           </h2>
         </div>
         <div {...ui.props("taskApprovalList", {"id": "taskApprovalList"})}>
           <PageRegion name="taskApprovalList" />
         </div>
       </div>
       </>)}
     </div>
     <div {...ui.props("org-panel-programs", {"id": "org-panel-programs", "className": "org-tab-panel", "style": {"display": "none"}})}>
       {ui.content("org-panel-programs", <>
       <div {...ui.props("org-admin-84", {"className": "section-card", "style": {"background": "transparent", "border": "none", "boxShadow": "none", "padding": "0"}})}>
         <div {...ui.props("org-admin-85", {"className": "section-card-header", "style": {"marginBottom": "18px"}})}>
           <h2 {...ui.props("org-admin-86", {})}>
             {"All Community Programs"}
           </h2>
           <div {...ui.props("org-admin-87", {"style": {"display": "flex", "gap": "10px", "flexWrap": "wrap"}})}>
             <button {...ui.props("org-admin-88", {"className": "btn-add-org", "style": {"background": "#059669", "borderColor": "#059669"}, "type": "button", "actionLabel": "+ Assign Task"}, {"click": {"name": "openGlobalTaskModal", "args": []}})}>
               {"+ Assign Task"}
             </button>
             <button {...ui.props("org-admin-89", {"className": "btn-add-org", "type": "button", "actionLabel": "+ Create New Program"}, {"click": {"name": "openProgModal", "args": []}})}>
               {"+ Create New Program"}
             </button>
           </div>
         </div>
         <div {...ui.props("orgProgramsGrid", {"id": "orgProgramsGrid", "className": "programs-grid"})}>
           <PageRegion name="orgProgramsGrid" />
         </div>
       </div>
       <div {...ui.props("org-admin-91", {"className": "section-card", "style": {"marginTop": "24px"}})}>
         <div {...ui.props("org-admin-92", {"className": "section-card-header"})}>
           <h2 {...ui.props("org-admin-93", {})}>
             {"🙋 Pending Volunteer Applications"}
           </h2>
         </div>
         <div {...ui.props("programApplicationsList", {"id": "programApplicationsList"})}>
           <PageRegion name="programApplicationsList" />
         </div>
       </div>
       </>)}
     </div>
     <div {...ui.props("org-panel-resources", {"id": "org-panel-resources", "className": "org-tab-panel", "style": {"display": "none"}})}>
       {ui.content("org-panel-resources", <>
       <div {...ui.props("org-admin-96", {"className": "section-card"})}>
         <div {...ui.props("org-admin-97", {"className": "section-card-header"})}>
           <h2 {...ui.props("org-admin-98", {})}>
             {"📦 Resource Donations & Pickups"}
           </h2>
         </div>
         <table {...ui.props("org-admin-99", {"className": "org-table"})}>
           <thead {...ui.props("org-admin-100", {})}>
             <tr {...ui.props("org-admin-101", {})}>
               <th {...ui.props("org-admin-102", {})}>
                 {"Donation Item"}
               </th>
               <th {...ui.props("org-admin-103", {})}>
                 {"Donor"}
               </th>
               <th {...ui.props("org-admin-104", {})}>
                 {"Pickup Location"}
               </th>
               <th {...ui.props("org-admin-105", {})}>
                 {"Status"}
               </th>
               <th {...ui.props("org-admin-106", {})}>
                 {"Actions"}
               </th>
             </tr>
           </thead>
           <tbody {...ui.props("orgResourcesTableBody", {"id": "orgResourcesTableBody"})}>
             <PageRegion name="orgResourcesTableBody" />
           </tbody>
         </table>
       </div>
       </>)}
     </div>
     <div {...ui.props("org-panel-requests", {"id": "org-panel-requests", "className": "org-tab-panel", "style": {"display": "none"}})}>
       {ui.content("org-panel-requests", <>
       <div {...ui.props("org-admin-109", {"className": "section-card"})}>
         <div {...ui.props("org-admin-110", {"className": "section-card-header"})}>
           <h2 {...ui.props("org-admin-111", {})}>
             {"📥 Beneficiary Assistance Requests"}
           </h2>
         </div>
         <div {...ui.props("orgRequestsContainer", {"id": "orgRequestsContainer"})}>
           <PageRegion name="orgRequestsContainer" />
         </div>
       </div>
       </>)}
     </div>
     <PageExtras />
   </div>
   </main>
  </>;
}
