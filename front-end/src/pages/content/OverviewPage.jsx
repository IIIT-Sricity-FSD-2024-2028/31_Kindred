import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageTabs, PageRegion, PageChart } from '../runtime/PageElements.jsx';

export default function OverviewPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/overview.html">
   <div {...ui.props("overview-1", {"className": "main-content"})}>
     <div {...ui.props("overview-2", {"className": "page-header"})}>
       <div {...ui.props("overview-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("overview-4", {})}>
           {"Platform Administrator Dashboard"}
         </h1>
         <p {...ui.props("overview-5", {})}>
           {"Manage all organizations on the Kindred platform"}
         </p>
       </div>
       <button {...ui.props("overview-6", {"className": "btn-add-org", "type": "button", "actionLabel": "+ Add Organization"})}>
         {"+ Add Organization"}
       </button>
     </div>
     <PageTabs />
     <div {...ui.props("overview-7", {"className": "stat-cards"})}>
       <div {...ui.props("overview-8", {"className": "stat-card"})}>
         <div {...ui.props("overview-9", {"className": "stat-card-header"})}>
           <div {...ui.props("overview-10", {"className": "stat-icon blue"})}>
             {"🏢"}
           </div>
           <button {...ui.props("overview-11", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("overview-12", {"className": "stat-value", "data-stat": "orgs"})}>
           {"120"}
         </div>
         <div {...ui.props("overview-13", {"className": "stat-label"})}>
           {"Total Organizations"}
         </div>
         <div {...ui.props("overview-14", {"className": "stat-change positive"})}>
           {"+8 this month"}
         </div>
       </div>
       <div {...ui.props("overview-15", {"className": "stat-card"})}>
         <div {...ui.props("overview-16", {"className": "stat-card-header"})}>
           <div {...ui.props("overview-17", {"className": "stat-icon green"})}>
             {"👥"}
           </div>
           <button {...ui.props("overview-18", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("overview-19", {"className": "stat-value"})}>
           {"45,230"}
         </div>
         <div {...ui.props("overview-20", {"className": "stat-label"})}>
           {"Total Volunteers"}
         </div>
         <div {...ui.props("overview-21", {"className": "stat-change positive"})}>
           {"+1,245 this month"}
         </div>
       </div>
       <div {...ui.props("overview-22", {"className": "stat-card"})}>
         <div {...ui.props("overview-23", {"className": "stat-card-header"})}>
           <div {...ui.props("overview-24", {"className": "stat-icon orange"})}>
             {"⚠"}
           </div>
           <button {...ui.props("overview-25", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("overview-26", {"className": "stat-value"})}>
           {"23"}
         </div>
         <div {...ui.props("overview-27", {"className": "stat-label"})}>
           {"Emergency Requests"}
         </div>
         <div {...ui.props("overview-28", {"className": "stat-change warning"})}>
           {"5 critical"}
         </div>
       </div>
       <div {...ui.props("overview-29", {"className": "stat-card"})}>
         <div {...ui.props("overview-30", {"className": "stat-card-header"})}>
           <div {...ui.props("overview-31", {"className": "stat-icon purple"})}>
             {"📈"}
           </div>
           <button {...ui.props("overview-32", {"className": "more-btn", "type": "button", "actionLabel": "⋮"})}>
             {"⋮"}
           </button>
         </div>
         <div {...ui.props("overview-33", {"className": "stat-value"})}>
           {"+34%"}
         </div>
         <div {...ui.props("overview-34", {"className": "stat-label"})}>
           {"Platform Growth"}
         </div>
         <div {...ui.props("overview-35", {"className": "stat-change info"})}>
           {"vs last quarter"}
         </div>
       </div>
     </div>
     <div {...ui.props("liveUserStats", {"id": "liveUserStats", "style": {"display": "flex", "gap": "14px", "flexWrap": "wrap", "marginBottom": "24px"}})}>
       <PageRegion name="liveUserStats" />
     </div>
     <div {...ui.props("pendingUsersSection", {"className": "section-card", "id": "pendingUsersSection", "style": {"display": "none"}})}>
       {ui.content("pendingUsersSection", <>
       <div {...ui.props("overview-38", {"className": "section-card-header"})}>
         <h2 {...ui.props("overview-39", {})}>
           {"⏳ Pending User Approvals"}
         </h2>
         <Link {...ui.props("overview-40", {"className": "btn-view-all", "style": {"fontSize": ".82rem", "color": "#6366f1", "textDecoration": "none", "fontWeight": "600"}, "actionLabel": "View All Users →", "to": "/admin-users.html"})}>
           {"View All Users →"}
         </Link>
       </div>
       <div {...ui.props("pendingUsersList", {"id": "pendingUsersList"})}>
         <PageRegion name="pendingUsersList" />
       </div>
       </>)}
     </div>
     <div {...ui.props("overview-42", {"className": "charts-row"})}>
       <div {...ui.props("overview-43", {"className": "chart-container"})}>
         <h3 {...ui.props("overview-44", {})}>
           {"Platform Growth Trend"}
         </h3>
         <PageChart name="lineChart" />
       </div>
     </div>
     <div {...ui.props("overview-46", {"className": "charts-split"})}>
       <div {...ui.props("overview-47", {"className": "chart-container"})}>
         <h3 {...ui.props("overview-48", {})}>
           {"Organizations by Category"}
         </h3>
         <div {...ui.props("overview-49", {"className": "donut-chart-wrapper"})}>
           <PageChart name="donutChart" />
           <div {...ui.props("donutLegend", {"className": "donut-legend", "id": "donutLegend"})}>
             {ui.content("donutLegend", <>
             </>)}
           </div>
         </div>
       </div>
       <div {...ui.props("overview-52", {"className": "chart-container"})}>
         <h3 {...ui.props("overview-53", {})}>
           {"Volunteer Activity"}
         </h3>
         <div {...ui.props("overview-54", {"className": "bar-chart-wrapper"})}>
           <div {...ui.props("barChart", {"className": "bar-chart", "id": "barChart"})}>
             {ui.content("barChart", <>
             </>)}
           </div>
         </div>
       </div>
     </div>
     <div {...ui.props("requestsList", {"id": "requestsList", "className": "request-list-container"})}>
       <PageRegion name="requestsList" />
     </div>
     <div {...ui.props("overview-57", {"className": "section-card"})}>
       <div {...ui.props("overview-58", {"className": "section-card-header"})}>
         <h2 {...ui.props("overview-59", {})}>
           {"Registered Organizations"}
         </h2>
         <div {...ui.props("overview-60", {"className": "search-bar"})}>
           <span {...ui.props("overview-61", {"className": "search-icon"})}>
             {"🔍"}
           </span>
           <PageField as="input" field="searchOrgs" spec={{"type": "text", "placeholder": "Search organizations...", "id": "searchOrgs"}} />
           <span {...ui.props("searchClear", {"id": "searchClear", "style": {"cursor": "pointer", "color": "#9ca3af", "padding": "0 6px"}, "actionLabel": "×"}, {"click": {"name": "clearField", "args": ["searchOrgs"]}})}>
             {ui.content("searchClear", <>
             {"×"}
             </>)}
           </span>
         </div>
       </div>
       <table {...ui.props("overview-64", {"className": "org-table"})}>
         <thead {...ui.props("overview-65", {})}>
           <tr {...ui.props("overview-66", {})}>
             <th {...ui.props("overview-67", {})}>
               {"Organization"}
             </th>
             <th {...ui.props("overview-68", {})}>
               {"Focus Area"}
             </th>
             <th {...ui.props("overview-69", {})}>
               {"Status"}
             </th>
             <th {...ui.props("overview-70", {})}>
               {"Volunteers"}
             </th>
             <th {...ui.props("overview-71", {})}>
               {"Beneficiaries"}
             </th>
             <th {...ui.props("overview-72", {})}>
               {"Rating"}
             </th>
             <th {...ui.props("overview-73", {})}>
               {"Actions"}
             </th>
           </tr>
         </thead>
         <tbody {...ui.props("orgTableBody", {"id": "orgTableBody"})}>
           <PageRegion name="orgTableBody" />
         </tbody>
       </table>
     </div>
     <div {...ui.props("overview-75", {"className": "section-card"})}>
       <div {...ui.props("overview-76", {"className": "section-card-header"})}>
         <h2 {...ui.props("overview-77", {})}>
           {"Recent Emergency Requests"}
         </h2>
       </div>
       <div {...ui.props("emergencyRequests", {"id": "emergencyRequests"})}>
         <PageRegion name="emergencyRequests" />
       </div>
     </div>
     <div {...ui.props("platformInboxSection", {"className": "section-card", "id": "platformInboxSection"})}>
       {ui.content("platformInboxSection", <>
       <div {...ui.props("overview-80", {"className": "section-card-header"})}>
         <h2 {...ui.props("overview-81", {})}>
           {"📥 Platform Inbox"}
         </h2>
         <Link {...ui.props("overview-82", {"className": "btn-view-all", "style": {"fontSize": ".82rem", "color": "#6366f1", "textDecoration": "none", "fontWeight": "600"}, "actionLabel": "View All →", "to": "/admin-inbox.html"})}>
           {"View All →"}
         </Link>
       </div>
       <div {...ui.props("platformInboxList", {"id": "platformInboxList", "style": {"maxHeight": "400px", "overflowY": "auto"}})}>
         <PageRegion name="platformInboxList" />
       </div>
       </>)}
     </div>
   </div>
     <PageExtras />
   </main>
  </>;
}
