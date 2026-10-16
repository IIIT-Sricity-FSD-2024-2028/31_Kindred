import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageTabs, PageRegion } from '../runtime/PageElements.jsx';

export default function IncomingPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("incoming-1", {"data-react-page": "/incoming.html"})}>
     <div {...ui.props("incoming-2", {"className": "page-header"})}>
       <div {...ui.props("incoming-3", {"className": "header-left"})}>
         <h1 {...ui.props("incoming-4", {"className": "page-title"})}>
           {"Incoming Requests"}
         </h1>
         <p {...ui.props("incoming-5", {"className": "page-subtitle"})}>
           {"Manage assistance requests broadcasted to your organization."}
         </p>
       </div>
       <div {...ui.props("incoming-6", {"className": "header-actions"})}>
         <div {...ui.props("incoming-7", {"className": "search-box"})}>
           <span {...ui.props("incoming-8", {"className": "search-icon"})}>
             {"??"}
           </span>
           <PageField as="input" field="requestSearch" spec={{"type": "text", "placeholder": "Search requests...", "id": "requestSearch"}} />
         </div>
         <button {...ui.props("incoming-10", {"className": "btn btn-outline", "type": "button", "actionLabel": "?? Export CSV"})}>
           <span {...ui.props("incoming-11", {})}>
             {"??"}
           </span>
           {" Export CSV "}
         </button>
       </div>
     </div>
     <PageTabs />
     <div className="requests-section" role="tabpanel" id="incoming-panel" aria-labelledby={`dashboard-tab-${ui.activeTab}`}><PageRegion name="incomingCards" /></div>
     <PageExtras />
   </main>
  </>;
}
