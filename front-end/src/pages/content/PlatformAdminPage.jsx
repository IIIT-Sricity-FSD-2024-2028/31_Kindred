import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageTabs, PageRegion, PageChart } from '../runtime/PageElements.jsx';

export default function PlatformAdminPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/platform-admin.html">
   <div {...ui.props("platform-admin-1", {"className": "main-content"})}>
     <div {...ui.props("platform-admin-2", {"className": "page-header"})}>
       <div {...ui.props("platform-admin-3", {"className": "page-header-text"})}>
         <div {...ui.props("platform-admin-4", {"style": {"display": "flex", "alignItems": "center", "gap": "10px", "marginBottom": "4px"}})}>
           <h1 {...ui.props("platform-admin-5", {"style": {"margin": "0"}})}>
             {"Platform Administrator Dashboard"}
           </h1>
           <span {...ui.props("adminTeamBadge", {"id": "adminTeamBadge", "style": {"display": "inline-block", "padding": "4px 12px", "borderRadius": "100px", "fontSize": ".75rem", "fontWeight": "700", "background": "#ede9fe", "color": "#7c3aed"}})}>
             {ui.content("adminTeamBadge", <>
             {"All Modules"}
             </>)}
           </span>
         </div>
         <p {...ui.props("adminSubtext", {"id": "adminSubtext"})}>
           {ui.content("adminSubtext", <>
           {"Unified control center for all organizations, users, requests, messages, and platform analytics"}
           </>)}
         </p>
       </div>
       <div className="platform-header-actions">
         <button type="button" className="btn-announce" onClick={() => ui.action('openAnnouncement')}>📣 Announce</button>
         <button {...ui.props("platform-admin-8", {"className": "btn-add-org", "type": "button", "actionLabel": "+ Add Organization"}, {"click": {"name": "openOrgModal", "args": []}})}>
           {"+ Add Organization"}
         </button>
       </div>
     </div>
     <PageTabs />
     <div {...ui.props("platform-admin-9", {"className": "stat-cards"})}>
       <div {...ui.props("platform-admin-10", {"className": "stat-card"})}>
         <div {...ui.props("platform-admin-11", {"className": "stat-card-header"})}>
           <div {...ui.props("platform-admin-12", {"className": "stat-icon blue"})}>
             {"🏢"}
           </div>
         </div>
         <div {...ui.props("stat-total-orgs", {"className": "stat-value", "id": "stat-total-orgs"})}>
           {ui.content("stat-total-orgs", <>
           {"…"}
           </>)}
         </div>
         <div {...ui.props("platform-admin-14", {"className": "stat-label"})}>
           {"Total Organizations"}
         </div>
         <div {...ui.props("platform-admin-15", {"className": "stat-change positive"})}>
           {"+8 this month"}
         </div>
       </div>
       <div {...ui.props("platform-admin-16", {"className": "stat-card"})}>
         <div {...ui.props("platform-admin-17", {"className": "stat-card-header"})}>
           <div {...ui.props("platform-admin-18", {"className": "stat-icon green"})}>
             {"👥"}
           </div>
         </div>
         <div {...ui.props("stat-total-vols", {"className": "stat-value", "id": "stat-total-vols"})}>
           {ui.content("stat-total-vols", <>
           {"…"}
           </>)}
         </div>
         <div {...ui.props("platform-admin-20", {"className": "stat-label"})}>
           {"Active Volunteers"}
         </div>
         <div {...ui.props("platform-admin-21", {"className": "stat-change positive"})}>
           {"+1,245 this month"}
         </div>
       </div>
       <div {...ui.props("platform-admin-22", {"className": "stat-card"})}>
         <div {...ui.props("platform-admin-23", {"className": "stat-card-header"})}>
           <div {...ui.props("platform-admin-24", {"className": "stat-icon orange"})}>
             {"⏳"}
           </div>
         </div>
         <div {...ui.props("stat-pending-reqs", {"className": "stat-value", "id": "stat-pending-reqs"})}>
           {ui.content("stat-pending-reqs", <>
           {"…"}
           </>)}
         </div>
         <div {...ui.props("platform-admin-26", {"className": "stat-label"})}>
           {"Pending Approvals"}
         </div>
         <div {...ui.props("platform-admin-27", {"className": "stat-change warning"})}>
           {"Action Required"}
         </div>
       </div>
       <div {...ui.props("platform-admin-28", {"className": "stat-card"})}>
         <div {...ui.props("platform-admin-29", {"className": "stat-card-header"})}>
           <div {...ui.props("platform-admin-30", {"className": "stat-icon purple"})}>
             {"👤"}
           </div>
         </div>
         <div {...ui.props("stat-total-users", {"className": "stat-value", "id": "stat-total-users"})}>
           {ui.content("stat-total-users", <>
           {"…"}
           </>)}
         </div>
         <div {...ui.props("platform-admin-32", {"className": "stat-label"})}>
           {"Total Registered Users"}
         </div>
         <div {...ui.props("platform-admin-33", {"className": "stat-change info"})}>
           {"Across all roles"}
         </div>
       </div>
       <div {...ui.props("stat-card-donations", {"className": "stat-card", "id": "stat-card-donations", "style": {"display": "none"}})}>
         {ui.content("stat-card-donations", <>
         <div {...ui.props("platform-admin-35", {"className": "stat-card-header"})}>
           <div {...ui.props("platform-admin-36", {"className": "stat-icon blue", "style": {"background": "#ccfbf1", "color": "#0f766e"}})}>
             {"💰"}
           </div>
         </div>
         <div {...ui.props("stat-today-donations", {"className": "stat-value", "id": "stat-today-donations"})}>
           {ui.content("stat-today-donations", <>
           {"…"}
           </>)}
         </div>
         <div {...ui.props("platform-admin-38", {"className": "stat-label"})}>
           {"Today's Total Donations"}
         </div>
         <div {...ui.props("platform-admin-39", {"className": "stat-change positive"})}>
           {"Financial Support"}
         </div>
         </>)}
       </div>
     </div>
     <div {...ui.props("liveUserStats", {"id": "liveUserStats", "style": {"display": "flex", "gap": "14px", "flexWrap": "wrap", "marginBottom": "24px"}})}>
       <PageRegion name="liveUserStats" />
     </div>
     <div {...ui.props("panel-overview", {"id": "panel-overview", "className": "tab-panel"})}>
       {ui.content("panel-overview", <>
       <div {...ui.props("platform-admin-42", {"className": "charts-row"})}>
         <div {...ui.props("platform-admin-43", {"className": "chart-container"})}>
           <h3 {...ui.props("platform-admin-44", {})}>
             {"Platform Growth Trend"}
           </h3>
           <PageChart name="lineChart" />
         </div>
       </div>
       <div {...ui.props("platform-admin-46", {"className": "charts-split"})}>
         <div {...ui.props("platform-admin-47", {"className": "chart-container"})}>
           <h3 {...ui.props("platform-admin-48", {})}>
             {"Organizations by Category"}
           </h3>
           <div {...ui.props("platform-admin-49", {"className": "donut-chart-wrapper", "style": {"display": "flex", "alignItems": "center", "justifyContent": "center", "padding": "16px"}})}>
             <PageChart name="donutChart" />
           </div>
           <div {...ui.props("platform-admin-51", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "8px", "fontSize": ".8rem", "marginTop": "10px", "padding": "0 10px"}})}>
             <div {...ui.props("platform-admin-52", {"style": {"color": "#6366f1"}})}>
               {"■ Disaster Relief (35%)"}
             </div>
             <div {...ui.props("platform-admin-53", {"style": {"color": "#f59e0b"}})}>
               {"■ Education (28%)"}
             </div>
             <div {...ui.props("platform-admin-54", {"style": {"color": "#ef4444"}})}>
               {"■ Healthcare (20%)"}
             </div>
             <div {...ui.props("platform-admin-55", {"style": {"color": "#10b981"}})}>
               {"■ Environment (17%)"}
             </div>
           </div>
         </div>
         <div {...ui.props("platform-admin-56", {"className": "chart-container"})}>
           <h3 {...ui.props("platform-admin-57", {})}>
             {"Volunteer Activity"}
           </h3>
           <div {...ui.props("platform-admin-58", {"className": "bar-chart-wrapper", "style": {"padding": "16px"}})}>
             <PageChart name="volunteerActivityChart" />
           </div>
         </div>
       </div>
       <div {...ui.props("platform-admin-60", {"className": "section-card"})}>
         <div {...ui.props("platform-admin-61", {"className": "section-card-header"})}>
           <h2 {...ui.props("platform-admin-62", {})}>
             {"Registered Organizations"}
           </h2>
           <div {...ui.props("platform-admin-63", {"className": "organization-header-actions", "style": {"display": "flex", "gap": "12px", "alignItems": "center"}})}>
             <div {...ui.props("platform-admin-64", {"className": "search-bar"})}>
               <span {...ui.props("platform-admin-65", {"className": "search-icon"})}>
                 {"🔍"}
               </span>
               <PageField as="input" field="searchOrgs" spec={{"type": "text", "placeholder": "Search organizations...", "id": "searchOrgs"}} />
             </div>
             <button {...ui.props("platform-admin-67", {"className": "btn-add-org", "style": {"fontSize": ".82rem", "padding": "7px 14px"}, "type": "button", "actionLabel": "+ Add"}, {"click": {"name": "openOrgModal", "args": []}})}>
               {"+ Add"}
             </button>
           </div>
         </div>
         <table {...ui.props("platform-admin-68", {"className": "org-table"})}>
           <thead {...ui.props("platform-admin-69", {})}>
             <tr {...ui.props("platform-admin-70", {})}>
               <th {...ui.props("platform-admin-71", {})}>
                 {"Organization"}
               </th>
               <th {...ui.props("platform-admin-72", {})}>
                 {"Focus Area"}
               </th>
               <th {...ui.props("platform-admin-73", {})}>
                 {"Status"}
               </th>
               <th {...ui.props("platform-admin-74", {})}>
                 {"Volunteers"}
               </th>
               <th {...ui.props("platform-admin-75", {})}>
                 {"Beneficiaries"}
               </th>
               <th {...ui.props("platform-admin-76", {})}>
                 {"Rating"}
               </th>
               <th {...ui.props("platform-admin-77", {})}>
                 {"Actions"}
               </th>
             </tr>
           </thead>
           <tbody {...ui.props("orgTableBody", {"id": "orgTableBody"})}>
             <PageRegion name="orgTableBody" />
           </tbody>
         </table>
       </div>
       <div {...ui.props("platform-admin-79", {"className": "section-card"})}>
         <div {...ui.props("platform-admin-80", {"className": "section-card-header"})}>
           <h2 {...ui.props("platform-admin-81", {})}>
             {"🚨 Recent Emergency Help Requests"}
           </h2>
         </div>
         <div {...ui.props("emergencyRequestsOverview", {"id": "emergencyRequestsOverview"})}>
           <PageRegion name="emergencyRequestsOverview" />
         </div>
       </div>
       <div {...ui.props("platform-admin-83", {"className": "section-card"})}>
         <div {...ui.props("platform-admin-84", {"className": "section-card-header"})}>
           <h2 {...ui.props("platform-admin-85", {})}>
             {"📥 Recent Submissions"}
           </h2>
           <a {...ui.props("platform-admin-86", {"href": "#", "style": {"fontSize": ".82rem", "color": "#6366f1", "textDecoration": "none", "fontWeight": "600"}, "actionLabel": "View All Inbox →"}, {"click": {"name": "switchAdminTab", "args": ["inbox"]}})}>
             {"View All Inbox →"}
           </a>
         </div>
         <div {...ui.props("platformInboxList", {"id": "platformInboxList", "style": {"maxHeight": "350px", "overflowY": "auto"}})}>
           <PageRegion name="platformInboxList" />
         </div>
       </div>
       </>)}
     </div>
     <div {...ui.props("panel-requests", {"id": "panel-requests", "className": "tab-panel", "style": {"display": "none"}})}>
       {ui.content("panel-requests", <>
       <div {...ui.props("allRequestsContainer", {"id": "allRequestsContainer"})}>
         <PageRegion name="allRequestsContainer" />
       </div>
       </>)}
     </div>
     <div {...ui.props("panel-users", {"id": "panel-users", "className": "tab-panel", "style": {"display": "none"}})}>
       {ui.content("panel-users", <>
       <div {...ui.props("platform-admin-91", {"className": "section-card"})}>
         <div {...ui.props("platform-admin-92", {"className": "section-card-header", "style": {"flexWrap": "wrap", "gap": "14px"}})}>
           <h2 {...ui.props("platform-admin-93", {})}>
             {"All Platform Users"}
           </h2>
           <div className="user-header-actions">
           <div {...ui.props("platform-admin-94", {"className": "search-bar"})}>
             <span {...ui.props("platform-admin-95", {"className": "search-icon"})}>
               {"🔍"}
             </span>
             <PageField as="input" field="platform-admin-96" spec={{"type": "text", "placeholder": "Search by name, email, role..."}} />
           </div>
           <button type="button" className="btn-add-org" onClick={() => ui.action('openUserEditor')}>+ Create User</button>
           </div>
         </div>
         <div {...ui.props("platform-admin-97", {"className": "user-filters", "style": {"display": "flex", "gap": "10px", "flexWrap": "wrap", "margin": "16px 0 20px"}})}>
           <button {...ui.props("platform-admin-98", {"className": "filter-btn active", "data-filter": "all", "type": "button", "actionLabel": "All 0"}, {"click": {"name": "filterUsers", "args": ["all"]}})}>
             {"All "}
             <span {...ui.props("fc-all", {"className": "filter-count", "id": "fc-all"})}>
               {ui.content("fc-all", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("platform-admin-100", {"className": "filter-btn", "data-filter": "pending", "type": "button", "actionLabel": "Pending 0"}, {"click": {"name": "filterUsers", "args": ["pending"]}})}>
             {"Pending "}
             <span {...ui.props("fc-pending", {"className": "filter-count", "id": "fc-pending"})}>
               {ui.content("fc-pending", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("platform-admin-102", {"className": "filter-btn", "data-filter": "approved", "type": "button", "actionLabel": "Approved 0"}, {"click": {"name": "filterUsers", "args": ["approved"]}})}>
             {"Approved "}
             <span {...ui.props("fc-approved", {"className": "filter-count", "id": "fc-approved"})}>
               {ui.content("fc-approved", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("platform-admin-104", {"className": "filter-btn", "data-filter": "admin", "type": "button", "actionLabel": "Org Admins"}, {"click": {"name": "filterUsers", "args": ["admin"]}})}>
             {"Org Admins"}
           </button>
           <button {...ui.props("platform-admin-105", {"className": "filter-btn", "data-filter": "volunteer", "type": "button", "actionLabel": "Volunteers 0"}, {"click": {"name": "filterUsers", "args": ["volunteer"]}})}>
             {"Volunteers "}
             <span {...ui.props("fc-volunteer", {"className": "filter-count", "id": "fc-volunteer"})}>
               {ui.content("fc-volunteer", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("platform-admin-107", {"className": "filter-btn", "data-filter": "donor", "type": "button", "actionLabel": "Donors"}, {"click": {"name": "filterUsers", "args": ["donor"]}})}>
             {"Donors"}
           </button>
           <button {...ui.props("platform-admin-108", {"className": "filter-btn", "data-filter": "beneficiary", "type": "button", "actionLabel": "Beneficiaries"}, {"click": {"name": "filterUsers", "args": ["beneficiary"]}})}>
             {"Beneficiaries"}
           </button>
           <button {...ui.props("platform-admin-109", {"className": "filter-btn", "data-filter": "seller", "type": "button", "actionLabel": "Sellers 0"}, {"click": {"name": "filterUsers", "args": ["seller"]}})}>
             {"Sellers "}
             <span {...ui.props("fc-seller", {"className": "filter-count", "id": "fc-seller"})}>
               {ui.content("fc-seller", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("platform-admin-111", {"className": "filter-btn", "data-filter": "rejected", "type": "button", "actionLabel": "Rejected 0"}, {"click": {"name": "filterUsers", "args": ["rejected"]}})}>
             {"Rejected "}
             <span {...ui.props("fc-rejected", {"className": "filter-count", "id": "fc-rejected"})}>
               {ui.content("fc-rejected", <>
               {"0"}
               </>)}
             </span>
           </button>
         </div>
         <table {...ui.props("platform-admin-113", {"className": "org-table"})}>
           <thead {...ui.props("platform-admin-114", {})}>
             <tr {...ui.props("platform-admin-115", {})}>
               <th {...ui.props("platform-admin-116", {})}>
                 {"User"}
               </th>
               <th {...ui.props("platform-admin-117", {})}>
                 {"Email"}
               </th>
               <th {...ui.props("platform-admin-118", {})}>
                 {"Role"}
               </th>
               <th {...ui.props("platform-admin-119", {})}>
                 {"Organization / Shop"}
               </th>
               <th {...ui.props("platform-admin-120", {})}>
                 {"Status"}
               </th>
               <th {...ui.props("platform-admin-121", {})}>
                 {"Actions"}
               </th>
             </tr>
           </thead>
           <tbody {...ui.props("userTableBody", {"id": "userTableBody"})}>
             <PageRegion name="userTableBody" />
           </tbody>
         </table>
       </div>
       </>)}
     </div>
     <div {...ui.props("panel-shop", {"id": "panel-shop", "className": "tab-panel", "style": {"display": "none"}})}>
       {ui.content("panel-shop", <>
       <div {...ui.props("platform-admin-124", {"className": "section-card", "style": {"marginBottom": "24px"}})}>
         <div {...ui.props("platform-admin-125", {"className": "section-card-header", "style": {"flexWrap": "wrap", "gap": "14px"}})}>
           <div {...ui.props("platform-admin-126", {})}>
             <h2 {...ui.props("platform-admin-127", {"style": {"margin": "0 0 4px 0"}})}>
               {"Artisan & Seller Product Catalog"}
             </h2>
             <p {...ui.props("platform-admin-128", {"style": {"fontSize": ".82rem", "color": "#64748b", "margin": "0"}})}>
               {"Approve or reject seller items submitted for the public shop"}
             </p>
           </div>
           <div {...ui.props("platform-admin-129", {"className": "search-bar"})}>
             <span {...ui.props("platform-admin-130", {"className": "search-icon"})}>
               {"🔍"}
             </span>
             <PageField as="input" field="platform-admin-131" spec={{"type": "text", "placeholder": "Search products, sellers, categories..."}} />
           </div>
         </div>
         <div {...ui.props("platform-admin-132", {"className": "shop-filters", "style": {"display": "flex", "gap": "10px", "flexWrap": "wrap", "margin": "16px 0 20px"}})}>
           <button {...ui.props("platform-admin-133", {"className": "filter-btn active", "data-shop-filter": "all", "type": "button", "actionLabel": "All Products 0"}, {"click": {"name": "filterShopManagement", "args": ["all"]}})}>
             {"All Products "}
             <span {...ui.props("sfc-all", {"className": "filter-count", "id": "sfc-all"})}>
               {ui.content("sfc-all", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("platform-admin-135", {"className": "filter-btn", "data-shop-filter": "pending_approval", "type": "button", "actionLabel": "Pending Approval 0"}, {"click": {"name": "filterShopManagement", "args": ["pending_approval"]}})}>
             {"Pending Approval "}
             <span {...ui.props("sfc-pending", {"className": "filter-count", "id": "sfc-pending", "style": {"background": "#fef3c7", "color": "#b45309"}})}>
               {ui.content("sfc-pending", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("platform-admin-137", {"className": "filter-btn", "data-shop-filter": "approved", "type": "button", "actionLabel": "Live on Shop 0"}, {"click": {"name": "filterShopManagement", "args": ["approved"]}})}>
             {"Live on Shop "}
             <span {...ui.props("sfc-approved", {"className": "filter-count", "id": "sfc-approved", "style": {"background": "#dcfce7", "color": "#15803d"}})}>
               {ui.content("sfc-approved", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("platform-admin-139", {"className": "filter-btn", "data-shop-filter": "rejected", "type": "button", "actionLabel": "Rejected 0"}, {"click": {"name": "filterShopManagement", "args": ["rejected"]}})}>
             {"Rejected "}
             <span {...ui.props("sfc-rejected", {"className": "filter-count", "id": "sfc-rejected"})}>
               {ui.content("sfc-rejected", <>
               {"0"}
               </>)}
             </span>
           </button>
         </div>
         <table {...ui.props("platform-admin-141", {"className": "org-table"})}>
           <thead {...ui.props("platform-admin-142", {})}>
             <tr {...ui.props("platform-admin-143", {})}>
               <th {...ui.props("platform-admin-144", {})}>
                 {"Product"}
               </th>
               <th {...ui.props("platform-admin-145", {})}>
                 {"Category"}
               </th>
               <th {...ui.props("platform-admin-146", {})}>
                 {"Artisan / Seller"}
               </th>
               <th {...ui.props("platform-admin-147", {})}>
                 {"Price"}
               </th>
               <th {...ui.props("platform-admin-148", {})}>
                 {"Stock Qty"}
               </th>
               <th {...ui.props("platform-admin-149", {})}>
                 {"Status"}
               </th>
               <th {...ui.props("platform-admin-150", {})}>
                 {"Actions"}
               </th>
             </tr>
           </thead>
           <tbody {...ui.props("shopManagementTableBody", {"id": "shopManagementTableBody"})}>
             <PageRegion name="shopManagementTableBody" />
           </tbody>
         </table>
       </div>
       <div {...ui.props("platform-admin-152", {"className": "section-card"})}>
         <div {...ui.props("platform-admin-153", {"className": "section-card-header"})}>
           <h2 {...ui.props("platform-admin-154", {})}>
             {"🏪 Verified Sellers & Artisans"}
           </h2>
         </div>
         <div {...ui.props("verifiedSellersList", {"id": "verifiedSellersList"})}>
           <PageRegion name="verifiedSellersList" />
         </div>
       </div>
       </>)}
     </div>
     <div {...ui.props("panel-inbox", {"id": "panel-inbox", "className": "tab-panel", "style": {"display": "none"}})}>
       {ui.content("panel-inbox", <>
       <div {...ui.props("platform-admin-157", {"className": "section-card"})}>
         <div {...ui.props("platform-admin-158", {"className": "section-card-header", "style": {"flexWrap": "wrap", "gap": "14px"}})}>
           <h2 {...ui.props("platform-admin-159", {})}>
             {"Platform Submissions & Messages"}
           </h2>
           <div {...ui.props("platform-admin-160", {"className": "search-bar"})}>
             <span {...ui.props("platform-admin-161", {"className": "search-icon"})}>
               {"🔍"}
             </span>
             <PageField as="input" field="platform-admin-162" spec={{"type": "text", "placeholder": "Search messages..."}} />
           </div>
         </div>
         <div {...ui.props("platform-admin-163", {"className": "inbox-filters", "style": {"display": "flex", "gap": "10px", "flexWrap": "wrap", "margin": "16px 0 20px"}})}>
           <button {...ui.props("platform-admin-164", {"className": "inbox-filter-btn active", "data-filter": "all", "type": "button", "actionLabel": "All Messages"}, {"click": {"name": "filterInbox", "args": ["all"]}})}>
             {"All Messages"}
           </button>
           <button {...ui.props("platform-admin-165", {"className": "inbox-filter-btn", "data-filter": "emergency", "type": "button", "actionLabel": "🚨 Emergency Help"}, {"click": {"name": "filterInbox", "args": ["emergency"]}})}>
             {"🚨 Emergency Help"}
           </button>
           <button {...ui.props("platform-admin-166", {"className": "inbox-filter-btn", "data-filter": "contact", "type": "button", "actionLabel": "✉️ Contact Inquiries"}, {"click": {"name": "filterInbox", "args": ["contact"]}})}>
             {"✉️ Contact Inquiries"}
           </button>
           <button {...ui.props("platform-admin-167", {"className": "inbox-filter-btn", "data-filter": "feedback", "type": "button", "actionLabel": "💬 User Feedback"}, {"click": {"name": "filterInbox", "args": ["feedback"]}})}>
             {"💬 User Feedback"}
           </button>
           <button {...ui.props("platform-admin-168", {"className": "inbox-filter-btn", "data-filter": "donation", "type": "button", "actionLabel": "💰 Donations"}, {"click": {"name": "filterInbox", "args": ["donation"]}})}>
             {"💰 Donations"}
           </button>
         </div>
         <table {...ui.props("platform-admin-169", {"className": "org-table"})}>
           <thead {...ui.props("platform-admin-170", {})}>
             <tr {...ui.props("platform-admin-171", {})}>
               <th {...ui.props("platform-admin-172", {})}>
                 {"Category"}
               </th>
               <th {...ui.props("platform-admin-173", {})}>
                 {"Sender"}
               </th>
               <th {...ui.props("platform-admin-174", {})}>
                 {"Message Preview"}
               </th>
               <th {...ui.props("platform-admin-175", {})}>
                 {"Date"}
               </th>
               <th {...ui.props("platform-admin-176", {})}>
                 {"Action"}
               </th>
             </tr>
           </thead>
           <tbody {...ui.props("inboxTableBody", {"id": "inboxTableBody"})}>
             <PageRegion name="inboxTableBody" />
           </tbody>
         </table>
       </div>
       </>)}
     </div>
     <div {...ui.props("panel-analytics", {"id": "panel-analytics", "className": "tab-panel", "style": {"display": "none"}})}>
       {ui.content("panel-analytics", <>
       <div {...ui.props("platform-admin-179", {"className": "charts-split"})}>
         <div {...ui.props("platform-admin-180", {"className": "chart-container"})}>
           <h3 {...ui.props("platform-admin-181", {})}>
             {"Organizations by Focus Area"}
           </h3>
           <div {...ui.props("platform-admin-182", {"className": "donut-chart-wrapper", "style": {"display": "flex", "alignItems": "center", "justifyContent": "center", "padding": "20px"}})}>
             <PageChart name="donutChart" />
           </div>
           <div {...ui.props("platform-admin-184", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "10px", "fontSize": ".82rem", "marginTop": "14px"}})}>
             <div {...ui.props("platform-admin-185", {"style": {"color": "#6366f1"}})}>
               {"■ Disaster Relief (35%)"}
             </div>
             <div {...ui.props("platform-admin-186", {"style": {"color": "#f59e0b"}})}>
               {"■ Education (28%)"}
             </div>
             <div {...ui.props("platform-admin-187", {"style": {"color": "#ef4444"}})}>
               {"■ Healthcare (20%)"}
             </div>
             <div {...ui.props("platform-admin-188", {"style": {"color": "#10b981"}})}>
               {"■ Environment (17%)"}
             </div>
           </div>
         </div>
         <div {...ui.props("platform-admin-189", {"className": "chart-container"})}>
           <h3 {...ui.props("platform-admin-190", {})}>
             {"Volunteer & Platform Impact"}
           </h3>
           <div {...ui.props("platform-admin-191", {"style": {"padding": "20px", "display": "grid", "gap": "16px"}})}>
             <div {...ui.props("platform-admin-192", {"style": {"background": "#f8fafc", "padding": "16px", "borderRadius": "12px", "border": "1px solid #e2e8f0"}})}>
               <div {...ui.props("platform-admin-193", {"style": {"fontSize": ".8rem", "color": "#64748b", "fontWeight": "600"}})}>
                 {"Total Volunteer Hours Logged"}
               </div>
               <div {...ui.props("platform-admin-194", {"style": {"fontSize": "1.8rem", "fontWeight": "800", "color": "#10b981", "marginTop": "4px"}})}>
                 {"14,520 hrs"}
               </div>
               <div {...ui.props("platform-admin-195", {"style": {"fontSize": ".75rem", "color": "#059669", "marginTop": "2px"}})}>
                 {"↑ 18% increase this quarter"}
               </div>
             </div>
             <div {...ui.props("platform-admin-196", {"style": {"background": "#f8fafc", "padding": "16px", "borderRadius": "12px", "border": "1px solid #e2e8f0"}})}>
               <div {...ui.props("platform-admin-197", {"style": {"fontSize": ".8rem", "color": "#64748b", "fontWeight": "600"}})}>
                 {"Total Funds Distributed to Programs"}
               </div>
               <div {...ui.props("platform-admin-198", {"style": {"fontSize": "1.8rem", "fontWeight": "800", "color": "#6366f1", "marginTop": "4px"}})}>
                 {"₹ 48.2 Lakhs"}
               </div>
               <div {...ui.props("platform-admin-199", {"style": {"fontSize": ".75rem", "color": "#4f46e5", "marginTop": "2px"}})}>
                 {"Across 12 Active Disaster & Health Programs"}
               </div>
             </div>
           </div>
         </div>
       </div>
       </>)}
     </div>
     <PageExtras />
   </div>
   </main>
  </>;
}
