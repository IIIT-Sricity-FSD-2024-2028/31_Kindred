import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageTabs, PageRegion, PageChart } from '../runtime/PageElements.jsx';

export default function OrgAdminOverviewPage({ footer }) {
  const ui = usePage();
  return <>
   <main {...ui.props("org-admin-overview-1", {"data-react-page": "/org-admin-overview.html"})}>
     <div {...ui.props("org-admin-overview-2", {"className": "page-header fade-in"})}>
       <div {...ui.props("org-admin-overview-3", {})}>
         <h1 {...ui.props("orgAdminTitle", {"className": "page-title", "id": "orgAdminTitle"})}>
           {ui.content("orgAdminTitle", <>
           {"My Organization"}
           </>)}
         </h1>
         <p {...ui.props("org-admin-overview-5", {"className": "page-subtitle"})}>
           {"Organization Admin Dashboard"}
         </p>
       </div>
       <div {...ui.props("org-admin-overview-6", {"className": "header-actions"})}>
         <Link {...ui.props("org-admin-overview-7", {"style": {"display": "inline-flex", "alignItems": "center", "gap": "7px", "padding": "9px 18px", "background": "#f1f5f9", "color": "#374151", "border": "1px solid #e2e8f0", "borderRadius": "8px", "fontSize": ".84rem", "fontWeight": "600", "textDecoration": "none", "transition": "all .15s"}, "data-page-node": "org-admin-overview-7", "actionLabel": "👤 Edit Profile", "to": "/profile.html"})}>
           {"👤 Edit Profile"}
         </Link>
         {" "}
         <a {...ui.props("org-admin-overview-8", {"href": "#", "className": "btn btn-primary", "actionLabel": "+ New Program"}, {"click": {"name": "openProgModal", "args": []}})}>
           {"+ New Program"}
         </a>
       </div>
     </div>
     <PageTabs />
     <div {...ui.props("orgOverviewStats", {"id": "orgOverviewStats", "className": "stats-grid stagger"})}>
       <PageRegion name="orgOverviewStats" />
     </div>
     <div {...ui.props("org-admin-overview-10", {"className": "volunteers-section fade-in"})}>
       <div {...ui.props("org-admin-overview-11", {"className": "volunteers-header"})}>
         <div {...ui.props("org-admin-overview-12", {"className": "section-title"})}>
           {"👤 Volunteers"}
         </div>
         <div {...ui.props("org-admin-overview-13", {"style": {"display": "flex", "gap": "15px", "alignItems": "center"}})}>
           <button {...ui.props("org-admin-overview-14", {"className": "btn btn-primary btn-sm", "style": {"background": "#059669", "borderColor": "#059669"}, "type": "button", "actionLabel": "+ Assign Task"}, {"click": {"name": "openGlobalTaskModal", "args": []}})}>
             {"+ Assign Task"}
           </button>
           <div {...ui.props("org-admin-overview-15", {"className": "search-box"})}>
             <span {...ui.props("org-admin-overview-16", {"className": "search-icon"})}>
               {"🔍"}
             </span>
             <PageField as="input" field="volunteerSearch" spec={{"type": "text", "id": "volunteerSearch", "placeholder": "Search volunteers..."}} />
           </div>
         </div>
       </div>
       <div {...ui.props("org-admin-overview-18", {"className": "table-wrap"})}>
         <table {...ui.props("org-admin-overview-19", {})}>
           <thead {...ui.props("org-admin-overview-20", {})}>
             <tr {...ui.props("org-admin-overview-21", {})}>
               <th {...ui.props("org-admin-overview-22", {})}>
                 {"Name"}
               </th>
               <th {...ui.props("org-admin-overview-23", {})}>
                 {"Role"}
               </th>
               <th {...ui.props("org-admin-overview-24", {})}>
                 {"Status"}
               </th>
               <th {...ui.props("org-admin-overview-25", {})}>
                 {"Hours"}
               </th>
               <th {...ui.props("org-admin-overview-26", {})}>
                 {"Tasks"}
               </th>
               <th {...ui.props("org-admin-overview-27", {})}>
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
     <div {...ui.props("org-admin-overview-29", {"className": "programs-section fade-in"})}>
       <div {...ui.props("org-admin-overview-30", {"className": "section-header"})}>
         <div {...ui.props("org-admin-overview-31", {"className": "section-title"})}>
           {"📋 Programs"}
         </div>
         <button {...ui.props("org-admin-overview-32", {"className": "btn btn-outline btn-sm", "type": "button", "actionLabel": "+ Add New Program"}, {"click": {"name": "openProgModal", "args": []}})}>
           {"+ Add New Program"}
         </button>
       </div>
       <div {...ui.props("programsGrid", {"className": "programs-grid", "id": "programsGrid"})}>
         <PageRegion name="programsGrid" />
       </div>
     </div>
     <div {...ui.props("org-admin-overview-34", {"className": "resources-section fade-in"})}>
       <div {...ui.props("org-admin-overview-35", {"className": "section-header"})}>
         <div {...ui.props("org-admin-overview-36", {"className": "section-title"})}>
           {"📦 Resource Inventory"}
         </div>
       </div>
       <div {...ui.props("org-admin-overview-37", {"className": "resources-grid"})}>
         <div {...ui.props("org-admin-overview-38", {"className": "resource-card"})}>
           <div {...ui.props("org-admin-overview-39", {"className": "resource-name"})}>
             {"Emergency Tents"}
           </div>
           <div {...ui.props("org-admin-overview-40", {"className": "resource-count"})}>
             {"320 / 450 units"}
           </div>
           <div {...ui.props("org-admin-overview-41", {"className": "resource-bar"})}>
             <div {...ui.props("org-admin-overview-42", {"className": "resource-fill", "style": {"width": "71%"}})}>
             </div>
           </div>
           <div {...ui.props("org-admin-overview-43", {"className": "resource-pct"})}>
             {"71% allocated"}
           </div>
         </div>
         <div {...ui.props("org-admin-overview-44", {"className": "resource-card"})}>
           <div {...ui.props("org-admin-overview-45", {"className": "resource-name"})}>
             {"Medical Kits"}
           </div>
           <div {...ui.props("org-admin-overview-46", {"className": "resource-count"})}>
             {"890 / 1,200 kits"}
           </div>
           <div {...ui.props("org-admin-overview-47", {"className": "resource-bar"})}>
             <div {...ui.props("org-admin-overview-48", {"className": "resource-fill", "style": {"width": "74%"}})}>
             </div>
           </div>
           <div {...ui.props("org-admin-overview-49", {"className": "resource-pct"})}>
             {"74% allocated"}
           </div>
         </div>
         <div {...ui.props("org-admin-overview-50", {"className": "resource-card"})}>
           <div {...ui.props("org-admin-overview-51", {"className": "resource-name"})}>
             {"Food Packages"}
           </div>
           <div {...ui.props("org-admin-overview-52", {"className": "resource-count"})}>
             {"3,200 / 5,000 packages"}
           </div>
           <div {...ui.props("org-admin-overview-53", {"className": "resource-bar"})}>
             <div {...ui.props("org-admin-overview-54", {"className": "resource-fill", "style": {"width": "64%"}})}>
             </div>
           </div>
           <div {...ui.props("org-admin-overview-55", {"className": "resource-pct"})}>
             {"64% allocated"}
           </div>
         </div>
         <div {...ui.props("org-admin-overview-56", {"className": "resource-card"})}>
           <div {...ui.props("org-admin-overview-57", {"className": "resource-name"})}>
             {"Blankets"}
           </div>
           <div {...ui.props("org-admin-overview-58", {"className": "resource-count"})}>
             {"1,500 / 2,000 pieces"}
           </div>
           <div {...ui.props("org-admin-overview-59", {"className": "resource-bar"})}>
             <div {...ui.props("org-admin-overview-60", {"className": "resource-fill", "style": {"width": "75%"}})}>
             </div>
           </div>
           <div {...ui.props("org-admin-overview-61", {"className": "resource-pct"})}>
             {"75% allocated"}
           </div>
         </div>
       </div>
     </div>
     <div {...ui.props("org-admin-overview-62", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "20px", "marginBottom": "24px"}, "className": "fade-in"})}>
       <div {...ui.props("org-admin-overview-63", {"style": {"background": "#fff", "border": "1px solid #e2e8f0", "borderRadius": "16px", "padding": "20px", "boxShadow": "0 2px 8px rgba(0,0,0,.04)"}})}>
         <div {...ui.props("org-admin-overview-64", {"style": {"display": "flex", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "14px"}})}>
           <div {...ui.props("org-admin-overview-65", {"style": {"fontWeight": "700", "fontSize": ".95rem", "color": "#1e293b"}})}>
             {"📈 Volunteer Growth"}
           </div>
           <span {...ui.props("org-admin-overview-66", {"style": {"fontSize": ".72rem", "background": "#ecfdf5", "color": "#059669", "padding": "3px 10px", "borderRadius": "20px", "fontWeight": "600"}})}>
             {"Last 6 Months"}
           </span>
         </div>
         <PageChart name="orgVolChart" />
       </div>
       <div {...ui.props("org-admin-overview-68", {"style": {"background": "#fff", "border": "1px solid #e2e8f0", "borderRadius": "16px", "padding": "20px", "boxShadow": "0 2px 8px rgba(0,0,0,.04)"}})}>
         <div {...ui.props("org-admin-overview-69", {"style": {"fontWeight": "700", "fontSize": ".95rem", "color": "#1e293b", "marginBottom": "14px"}})}>
           {"📋 Program Status"}
         </div>
         <div {...ui.props("org-admin-overview-70", {"style": {"display": "flex", "alignItems": "center", "gap": "20px"}})}>
           <PageChart name="orgProgDonut" />
           <div {...ui.props("orgProgLegend", {"id": "orgProgLegend", "style": {"display": "flex", "flexDirection": "column", "gap": "8px"}})}>
             {ui.content("orgProgLegend", <>
             </>)}
           </div>
         </div>
       </div>
     </div>
     <div {...ui.props("org-admin-overview-73", {"className": "beneficiary-section fade-in"})}>
       <div {...ui.props("org-admin-overview-74", {"className": "section-header"})}>
         <div {...ui.props("org-admin-overview-75", {"className": "section-title"})}>
           {"📝 Beneficiary Requests"}
         </div>
       </div>
       <div {...ui.props("beneficiaryReqList", {"id": "beneficiaryReqList"})}>
         <PageRegion name="beneficiaryReqList" />
       </div>
     </div>
     <div {...ui.props("org-admin-overview-77", {"className": "volunteer-logs-section fade-in", "style": {"marginTop": "24px"}})}>
       <div {...ui.props("org-admin-overview-78", {"className": "section-header"})}>
         <div {...ui.props("org-admin-overview-79", {"className": "section-title"})}>
           {"⏱️ Pending Hour Verification"}
         </div>
       </div>
       <div {...ui.props("hourVerificationList", {"id": "hourVerificationList"})}>
         <PageRegion name="hourVerificationList" />
       </div>
     </div>
     <div {...ui.props("org-admin-overview-81", {"className": "volunteer-apps-section fade-in", "style": {"marginTop": "24px"}})}>
       <div {...ui.props("org-admin-overview-82", {"className": "section-header"})}>
         <div {...ui.props("org-admin-overview-83", {"className": "section-title"})}>
           {"📬 Volunteer Applications"}
         </div>
       </div>
       <div {...ui.props("volAppReviewList", {"id": "volAppReviewList"})}>
         <PageRegion name="volAppReviewList" />
       </div>
     </div>
     <div {...ui.props("org-admin-overview-85", {"className": "resources-section fade-in", "style": {"marginTop": "24px"}})}>
       <div {...ui.props("org-admin-overview-86", {"className": "section-header"})}>
         <div {...ui.props("org-admin-overview-87", {"className": "section-title"})}>
           {"📦 Resource Donations"}
         </div>
         <Link {...ui.props("org-admin-overview-88", {"style": {"fontSize": ".82rem", "fontWeight": "600", "color": "#6366f1", "textDecoration": "none"}, "actionLabel": "View All →", "to": "/resources.html"})}>
           {"View All →"}
         </Link>
       </div>
       <div {...ui.props("resOverviewList", {"id": "resOverviewList"})}>
         <PageRegion name="resOverviewList" />
       </div>
     </div>
     <PageRegion name="listingManager" />
     <PageExtras />
     {footer}
   </main>
  </>;
}
