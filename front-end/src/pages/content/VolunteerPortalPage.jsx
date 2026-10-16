import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageModal, PageRegion } from '../runtime/PageElements.jsx';

export default function VolunteerPortalPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/volunteer-portal.html">
   <section {...ui.props("volunteer-portal-1", {"className": "portal-hero"})}>
     <h1 {...ui.props("volunteer-portal-2", {})}>
       {"🌐 Volunteer Program Portal"}
     </h1>
     <p {...ui.props("volunteer-portal-3", {})}>
       {"Find programs that match your skills and make a real impact. Browse, apply, and start contributing today."}
     </p>
     <div {...ui.props("volunteer-portal-4", {"className": "portal-filters"})}>
       <PageField as="input" field="portal-search" spec={{"type": "text", "id": "portal-search", "placeholder": "🔍 Search programs..."}} />
       <PageField as="select" field="portal-skill-filter" spec={{"id": "portal-skill-filter"}}>
         <option {...ui.props("volunteer-portal-7", {"value": ""})}>
           {"All Skills"}
         </option>
       </PageField>
       <PageField as="select" field="portal-category-filter" spec={{"id": "portal-category-filter"}}>
         <option {...ui.props("volunteer-portal-9", {"value": ""})}>
           {"All Categories"}
         </option>
         <option {...ui.props("volunteer-portal-10", {})}>
           {"Disaster Relief"}
         </option>
         <option {...ui.props("volunteer-portal-11", {})}>
           {"Healthcare"}
         </option>
         <option {...ui.props("volunteer-portal-12", {})}>
           {"Education"}
         </option>
         <option {...ui.props("volunteer-portal-13", {})}>
           {"Food Security"}
         </option>
         <option {...ui.props("volunteer-portal-14", {})}>
           {"Housing"}
         </option>
         <option {...ui.props("volunteer-portal-15", {})}>
           {"Environment"}
         </option>
         <option {...ui.props("volunteer-portal-16", {})}>
           {"Youth Empowerment"}
         </option>
       </PageField>
     </div>
   </section>
   <div {...ui.props("portalGrid", {"className": "portal-grid", "id": "portalGrid"})}>
     <PageRegion name="portalGrid" />
   </div>
   <PageModal name="applyModal">
     <div {...ui.props("volunteer-portal-19", {"className": "modal-box", "style": {"width": "460px", "maxWidth": "95vw"}})}>
       <div {...ui.props("volunteer-portal-20", {"className": "modal-header"})}>
         <h3 {...ui.props("volunteer-portal-21", {})}>
           {"📝 Apply to Program"}
         </h3>
         <button {...ui.props("volunteer-portal-22", {"className": "modal-close-btn", "type": "button", "actionLabel": "×"}, {"click": {"name": "closeApplyModal", "args": []}})}>
           {"×"}
         </button>
       </div>
       <div {...ui.props("volunteer-portal-23", {"className": "modal-body"})}>
         <div {...ui.props("apply-prog-info", {"id": "apply-prog-info", "style": {"background": "#f0f9ff", "border": "1px solid #bae6fd", "borderRadius": "10px", "padding": "14px", "marginBottom": "16px"}})}>
           <PageRegion name="apply-prog-info" />
         </div>
         <div {...ui.props("volunteer-portal-25", {"className": "field"})}>
           <label {...ui.props("volunteer-portal-26", {})}>
             {"Your Relevant Skills"}
           </label>
           <div {...ui.props("apply-skills-display", {"id": "apply-skills-display", "style": {"display": "flex", "gap": "4px", "flexWrap": "wrap", "padding": "8px 0"}})}>
             <PageRegion name="apply-skills-display" />
           </div>
         </div>
         <div {...ui.props("volunteer-portal-28", {"className": "field"})}>
           <label {...ui.props("volunteer-portal-29", {})}>
             {"Why do you want to join? "}
             <span {...ui.props("volunteer-portal-30", {"style": {"fontWeight": "400", "color": "#94a3b8"}})}>
               {"(optional)"}
             </span>
           </label>
           <PageField as="textarea" field="apply-message" spec={{"id": "apply-message", "rows": "3", "placeholder": "Tell the org admin why you're a great fit for this program..."}}>
           </PageField>
         </div>
         <PageField as="input" field="apply-prog-id" spec={{"type": "hidden", "id": "apply-prog-id"}} />
         <div {...ui.props("volunteer-portal-33", {"className": "modal-actions"})}>
           <button {...ui.props("volunteer-portal-34", {"className": "btn-modal-cancel", "type": "button", "actionLabel": "Cancel"}, {"click": {"name": "closeApplyModal", "args": []}})}>
             {"Cancel"}
           </button>
           <button {...ui.props("volunteer-portal-35", {"className": "btn-modal-save", "type": "button", "actionLabel": "🚀 Submit Application"}, {"click": {"name": "submitApplication", "args": []}})}>
             {"🚀 Submit Application"}
           </button>
         </div>
       </div>
     </div>
   </PageModal>
     <PageExtras />
   </main>
  </>;
}
