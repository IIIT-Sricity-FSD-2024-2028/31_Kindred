import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function AdminUsersPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/admin-users.html">
   <div {...ui.props("admin-users-1", {"className": "main-content"})}>
     <div {...ui.props("admin-users-2", {"className": "page-header", "style": {"display": "flex", "justifyContent": "space-between", "alignItems": "center"}})}>
       <div {...ui.props("admin-users-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("admin-users-4", {})}>
           {"User Management"}
         </h1>
         <p {...ui.props("admin-users-5", {})}>
           {"Manage all platform users — approve, reject, edit roles, and control access"}
         </p>
       </div>
     </div>
     <PageTabs />
     <div {...ui.props("userStatsBar", {"className": "user-stats-bar", "id": "userStatsBar"})}>
       <PageRegion name="userStatsBar" />
     </div>
     <div {...ui.props("admin-users-7", {"className": "section-card"})}>
       <div {...ui.props("admin-users-8", {"className": "section-card-header", "style": {"flexWrap": "wrap", "gap": "12px"}})}>
         <div {...ui.props("userFilters", {"className": "user-filters", "id": "userFilters"})}>
           {ui.content("userFilters", <>
           <button {...ui.props("admin-users-10", {"className": "filter-btn active", "data-filter": "all", "type": "button", "actionLabel": "All Users 0"}, {"click": {"name": "filterUsers", "args": ["all"]}})}>
             {"All Users "}
             <span {...ui.props("count-all", {"className": "filter-count", "id": "count-all"})}>
               {ui.content("count-all", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("admin-users-12", {"className": "filter-btn", "data-filter": "pending", "type": "button", "actionLabel": "Pending 0"}, {"click": {"name": "filterUsers", "args": ["pending"]}})}>
             {"Pending "}
             <span {...ui.props("count-pending", {"className": "filter-count", "id": "count-pending"})}>
               {ui.content("count-pending", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("admin-users-14", {"className": "filter-btn", "data-filter": "approved", "type": "button", "actionLabel": "Approved 0"}, {"click": {"name": "filterUsers", "args": ["approved"]}})}>
             {"Approved "}
             <span {...ui.props("count-approved", {"className": "filter-count", "id": "count-approved"})}>
               {ui.content("count-approved", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("admin-users-16", {"className": "filter-btn", "data-filter": "seller", "type": "button", "actionLabel": "Sellers 0"}, {"click": {"name": "filterUsers", "args": ["seller"]}})}>
             {"Sellers "}
             <span {...ui.props("count-seller", {"className": "filter-count", "id": "count-seller"})}>
               {ui.content("count-seller", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("admin-users-18", {"className": "filter-btn", "data-filter": "rejected", "type": "button", "actionLabel": "Rejected 0"}, {"click": {"name": "filterUsers", "args": ["rejected"]}})}>
             {"Rejected "}
             <span {...ui.props("count-rejected", {"className": "filter-count", "id": "count-rejected"})}>
               {ui.content("count-rejected", <>
               {"0"}
               </>)}
             </span>
           </button>
           </>)}
         </div>
         <div {...ui.props("admin-users-20", {"className": "search-bar"})}>
           <span {...ui.props("admin-users-21", {"className": "search-icon"})}>
             {"🔍"}
           </span>
           <PageField as="input" field="searchUsers" spec={{"type": "text", "placeholder": "Search users...", "id": "searchUsers"}} />
           <span {...ui.props("admin-users-23", {"style": {"cursor": "pointer", "color": "#9ca3af", "padding": "0 6px"}, "actionLabel": "×"}, {"click": {"name": "clearField", "args": ["searchUsers"]}})}>
             {"×"}
           </span>
         </div>
       </div>
       <table {...ui.props("admin-users-24", {"className": "user-table"})}>
         <thead {...ui.props("admin-users-25", {})}>
           <tr {...ui.props("admin-users-26", {})}>
             <th {...ui.props("admin-users-27", {})}>
               {"User"}
             </th>
             <th {...ui.props("admin-users-28", {})}>
               {"Role"}
             </th>
             <th {...ui.props("admin-users-29", {})}>
               {"Status"}
             </th>
             <th {...ui.props("admin-users-30", {})}>
               {"Source"}
             </th>
             <th {...ui.props("admin-users-31", {})}>
               {"Registered"}
             </th>
             <th {...ui.props("admin-users-32", {})}>
               {"Actions"}
             </th>
           </tr>
         </thead>
         <tbody {...ui.props("userTableBody", {"id": "userTableBody"})}>
           <PageRegion name="userTableBody" />
         </tbody>
       </table>
     </div>
   </div>
     <PageExtras />
   </main>
  </>;
}
