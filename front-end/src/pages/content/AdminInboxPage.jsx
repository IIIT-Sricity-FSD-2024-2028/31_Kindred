import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageModal, PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function AdminInboxPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/admin-inbox.html">
   <div {...ui.props("admin-inbox-1", {"className": "main-content"})}>
     <div {...ui.props("admin-inbox-2", {"className": "page-header"})}>
       <div {...ui.props("admin-inbox-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("admin-inbox-4", {})}>
           {"📥 Platform Inbox"}
         </h1>
         <p {...ui.props("admin-inbox-5", {})}>
           {"View and manage all submissions — Emergency Requests, Contact messages, Feedback, and Donations"}
         </p>
       </div>
     </div>
     <PageTabs />
     <div {...ui.props("inboxStatsBar", {"className": "inbox-stats-bar", "id": "inboxStatsBar"})}>
       <PageRegion name="inboxStatsBar" />
     </div>
     <div {...ui.props("admin-inbox-7", {"className": "section-card"})}>
       <div {...ui.props("admin-inbox-8", {"className": "section-card-header", "style": {"flexWrap": "wrap", "gap": "12px"}})}>
         <div {...ui.props("inboxFilters", {"className": "inbox-filters", "id": "inboxFilters"})}>
           {ui.content("inboxFilters", <>
           <button {...ui.props("admin-inbox-10", {"className": "inbox-filter-btn active", "data-filter": "all", "type": "button", "actionLabel": "All 0"}, {"click": {"name": "filterInbox", "args": ["all"]}})}>
             {"All "}
             <span {...ui.props("count-all", {"className": "badge-count", "id": "count-all"})}>
               {ui.content("count-all", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("admin-inbox-12", {"className": "inbox-filter-btn", "data-filter": "emergency", "type": "button", "actionLabel": "🚨 Emergency 0"}, {"click": {"name": "filterInbox", "args": ["emergency"]}})}>
             {"🚨 Emergency "}
             <span {...ui.props("count-emergency", {"className": "badge-count", "id": "count-emergency"})}>
               {ui.content("count-emergency", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("admin-inbox-14", {"className": "inbox-filter-btn", "data-filter": "contact", "type": "button", "actionLabel": "✉ Contact 0"}, {"click": {"name": "filterInbox", "args": ["contact"]}})}>
             {"✉ Contact "}
             <span {...ui.props("count-contact", {"className": "badge-count", "id": "count-contact"})}>
               {ui.content("count-contact", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("admin-inbox-16", {"className": "inbox-filter-btn", "data-filter": "feedback", "type": "button", "actionLabel": "💬 Feedback 0"}, {"click": {"name": "filterInbox", "args": ["feedback"]}})}>
             {"💬 Feedback "}
             <span {...ui.props("count-feedback", {"className": "badge-count", "id": "count-feedback"})}>
               {ui.content("count-feedback", <>
               {"0"}
               </>)}
             </span>
           </button>
           <button {...ui.props("admin-inbox-18", {"className": "inbox-filter-btn", "data-filter": "donation", "type": "button", "actionLabel": "💰 Donations 0"}, {"click": {"name": "filterInbox", "args": ["donation"]}})}>
             {"💰 Donations "}
             <span {...ui.props("count-donation", {"className": "badge-count", "id": "count-donation"})}>
               {ui.content("count-donation", <>
               {"0"}
               </>)}
             </span>
           </button>
           </>)}
         </div>
         <div {...ui.props("admin-inbox-20", {"className": "search-bar"})}>
           <span {...ui.props("admin-inbox-21", {"className": "search-icon"})}>
             {"🔍"}
           </span>
           <PageField as="input" field="searchInbox" spec={{"type": "text", "placeholder": "Search submissions...", "id": "searchInbox"}} />
           <span {...ui.props("admin-inbox-23", {"style": {"cursor": "pointer", "color": "#9ca3af", "padding": "0 6px"}, "actionLabel": "×"}, {"click": {"name": "clearField", "args": ["searchInbox"]}})}>
             {"×"}
           </span>
         </div>
       </div>
       <table {...ui.props("admin-inbox-24", {"className": "inbox-table"})}>
         <thead {...ui.props("admin-inbox-25", {})}>
           <tr {...ui.props("admin-inbox-26", {})}>
             <th {...ui.props("admin-inbox-27", {})}>
               {"Type"}
             </th>
             <th {...ui.props("admin-inbox-28", {})}>
               {"From"}
             </th>
             <th {...ui.props("admin-inbox-29", {})}>
               {"Message / Details"}
             </th>
             <th {...ui.props("admin-inbox-30", {})}>
               {"Date"}
             </th>
             <th {...ui.props("admin-inbox-31", {})}>
               {"Status"}
             </th>
             <th {...ui.props("admin-inbox-32", {})}>
               {"Actions"}
             </th>
           </tr>
         </thead>
         <tbody {...ui.props("inboxTableBody", {"id": "inboxTableBody"})}>
           <PageRegion name="inboxTableBody" />
         </tbody>
       </table>
     </div>
   </div>
   <PageModal name="inboxDetailOverlay">
     <div {...ui.props("inboxDetailBox", {"className": "inbox-detail-box", "id": "inboxDetailBox"})}>
       {ui.content("inboxDetailBox", <>
       <div {...ui.props("admin-inbox-36", {"style": {"display": "flex", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "16px"}})}>
         <h2 {...ui.props("detail-title", {"style": {"margin": "0", "fontSize": "1.1rem", "color": "#1e293b"}, "id": "detail-title"})}>
           {ui.content("detail-title", <>
           {"Submission Details"}
           </>)}
         </h2>
         <button {...ui.props("admin-inbox-38", {"style": {"background": "none", "border": "none", "fontSize": "1.2rem", "cursor": "pointer", "color": "#94a3b8"}, "type": "button", "actionLabel": "✕"}, {"click": {"name": "closeDetailModal", "args": []}})}>
           {"✕"}
         </button>
       </div>
       <div {...ui.props("detailContent", {"id": "detailContent"})}>
         {ui.content("detailContent", <>
         </>)}
       </div>
       <div {...ui.props("admin-inbox-40", {"style": {"display": "flex", "gap": "10px", "marginTop": "20px"}})}>
         <button {...ui.props("modal-resolve-btn", {"className": "inbox-action-btn resolve", "id": "modal-resolve-btn", "type": "button", "actionLabel": "✓ Mark Resolved"}, {"click": {"name": "resolveFromModal", "args": []}})}>
           {ui.content("modal-resolve-btn", <>
           {"✓ Mark Resolved"}
           </>)}
         </button>
         <button {...ui.props("admin-inbox-42", {"className": "inbox-action-btn", "type": "button", "actionLabel": "Close"}, {"click": {"name": "closeDetailModal", "args": []}})}>
           {"Close"}
         </button>
       </div>
       </>)}
     </div>
   </PageModal>
     <PageExtras />
   </main>
  </>;
}
