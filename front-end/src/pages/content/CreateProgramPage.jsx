import { hasBankDetails } from '../../services/organizations.js';
import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageRegion } from '../runtime/PageElements.jsx';

export default function CreateProgramPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("create-program-1", {"data-react-page": "/create-program.html"})}>
     <div {...ui.props("create-program-2", {"className": "form-page fade-in"})}>
       <Link {...ui.props("create-program-3", {"className": "back-link", "actionLabel": "← Back to Programs", "to": "/org-admin.html#programs"})}>
         {"← Back to Programs"}
       </Link>
       <div {...ui.props("create-program-4", {"className": "form-card"})}>
         <div {...ui.props("create-program-5", {"className": "form-card-header"})}>
           <div {...ui.props("create-program-6", {"className": "form-card-icon"})}>
             {"+"}
           </div>
           <div {...ui.props("create-program-7", {})}>
             <div {...ui.props("create-program-8", {"className": "form-card-title"})}>
               {"Create New Program"}
             </div>
             <div {...ui.props("create-program-9", {"className": "form-card-sub"})}>
               {ui.session?.org || 'Your organization'}
             </div>
           </div>
         </div>
         <div {...ui.props("create-program-10", {"className": "form-group"})}>
           <label {...ui.props("create-program-11", {"className": "form-label", "htmlFor": "programTitle"})}>
             {"Program Title "}
             <span {...ui.props("create-program-12", {"className": "required"})}>
               {"*"}
             </span>
           </label>
           <PageField as="input" field="programTitle" spec={{"className": "form-input", "type": "text", "id": "programTitle", "placeholder": "e.g. Rural Health Camp 2026"}} />
         </div>
         <div {...ui.props("create-program-14", {"className": "form-row"})}>
           <div {...ui.props("create-program-15", {})}>
             <label {...ui.props("create-program-16", {"className": "form-label"})}>
               {"Category "}
               <span {...ui.props("create-program-17", {"className": "required"})}>
                 {"*"}
               </span>
               {" "}
               <span {...ui.props("create-program-18", {"style": {"fontWeight": "400", "fontSize": ".75rem", "color": "#94a3b8"}})}>
                 {"(select one or more)"}
               </span>
             </label>
             <div {...ui.props("progCategoryContainer", {"id": "progCategoryContainer", "style": {"display": "flex", "flexWrap": "wrap", "gap": "6px", "padding": "10px", "border": "1px solid #e2e8f0", "borderRadius": "10px", "background": "#fafbfc", "minHeight": "40px"}})}>
               <PageRegion name="progCategoryContainer" />
             </div>
             <div {...ui.props("create-program-20", {"style": {"display": "flex", "gap": "8px", "marginTop": "6px", "alignItems": "center"}})}>
               <PageField as="input" field="customCategoryInput" spec={{"type": "text", "id": "customCategoryInput", "placeholder": "Custom category...", "style": {"flex": "1", "padding": "7px 12px", "border": "1.5px solid #e5e7eb", "borderRadius": "8px", "fontSize": ".82rem", "fontFamily": "inherit", "outline": "none"}}} />
               <button {...ui.props("create-program-22", {"type": "button", "style": {"padding": "7px 14px", "background": "#f59e0b", "color": "#fff", "border": "none", "borderRadius": "8px", "fontSize": ".78rem", "fontWeight": "600", "cursor": "pointer", "whiteSpace": "nowrap"}, "actionLabel": "+ Add"}, {"click": {"name": "addCustomCategory", "args": []}})}>
                 {"+ Add"}
               </button>
             </div>
           </div>
           <div {...ui.props("create-program-23", {})}>
             <label {...ui.props("create-program-24", {"className": "form-label", "htmlFor": "programLocation"})}>
               {"Location "}
               <span {...ui.props("create-program-25", {"className": "required"})}>
                 {"*"}
               </span>
             </label>
             <div {...ui.props("create-program-26", {"className": "form-input-icon"})}>
               <span {...ui.props("create-program-27", {"className": "icon"})}>
                 {"📍"}
               </span>
               <PageField as="input" field="programLocation" spec={{"className": "form-input", "type": "text", "id": "programLocation", "placeholder": "e.g. Patna, Bihar"}} />
             </div>
           </div>
         </div>
         <div {...ui.props("create-program-29", {"className": "form-row"})}>
           <div {...ui.props("create-program-30", {})}>
             <label {...ui.props("create-program-31", {"className": "form-label", "htmlFor": "programBudget"})}>
               {"Budget (₹)"}
             </label>
             <PageField as="input" field="programBudget" spec={{"className": "form-input", "type": "number", "id": "programBudget", "placeholder": "e.g. 500000", "min": "0"}} />
           </div>
           <div {...ui.props("create-program-33", {})}>
             <label {...ui.props("create-program-34", {"className": "form-label", "htmlFor": "programEndDate"})}>
               {"End Date"}
             </label>
             <div {...ui.props("create-program-35", {"className": "form-input-icon"})}>
               <span {...ui.props("create-program-36", {"className": "icon"})}>
                 {"📅"}
               </span>
               <PageField as="input" field="programEndDate" spec={{"className": "form-input", "type": "date", "id": "programEndDate"}} />
             </div>
           </div>
         </div>
         <div {...ui.props("create-program-38", {"className": "form-group"})}>
           <label {...ui.props("create-program-39", {"className": "form-label", "htmlFor": "volunteerGoal"})}>
             <span {...ui.props("create-program-40", {"style": {"display": "flex", "alignItems": "center", "gap": "6px"}})}>
               {"👥 Volunteer Goal"}
             </span>
           </label>
           <PageField as="input" field="volunteerGoal" spec={{"className": "form-input", "type": "number", "id": "volunteerGoal", "placeholder": "How many volunteers do you need?", "min": "0"}} />
         </div>
         <div {...ui.props("create-program-42", {"className": "form-group"})}>
           <label {...ui.props("create-program-43", {"className": "form-label", "htmlFor": "programDesc"})}>
             {"Program Description "}
             <span {...ui.props("create-program-44", {"className": "required"})}>
               {"*"}
             </span>
           </label>
           <PageField as="textarea" field="programDesc" spec={{"className": "form-textarea", "id": "programDesc", "placeholder": "Describe the program objectives, target beneficiaries, and activities..."}}>
           </PageField>
         </div>
         <div {...ui.props("create-program-46", {"className": "form-group"})}>
           <label {...ui.props("create-program-47", {"className": "form-label"})}>
             {"🎯 Required Skills"}
           </label>
           <div {...ui.props("progSkillsContainer", {"id": "progSkillsContainer", "style": {"display": "flex", "flexWrap": "wrap", "gap": "6px", "padding": "10px", "border": "1px solid #e2e8f0", "borderRadius": "10px", "background": "#fafbfc", "minHeight": "40px"}})}>
             <PageRegion name="progSkillsContainer" />
           </div>
         </div>
         <div {...ui.props("create-program-49", {"className": "form-group"})}>
           <label {...ui.props("create-program-50", {"className": "form-label"})}>
             {"Open for Volunteer Applications?"}
           </label>
           <PageField as="select" field="progOpenApps" spec={{"className": "form-select", "id": "progOpenApps"}}>
             <option {...ui.props("create-program-52", {"value": "true"})}>
               {"Yes — Volunteers can apply via portal"}
             </option>
             <option {...ui.props("create-program-53", {"value": "false"})}>
               {"No — Invite only"}
             </option>
           </PageField>
         </div>
         <div {...ui.props("create-program-54", {"className": "form-group"})}>
           <label {...ui.props("create-program-55", {"className": "form-label"})}>
             {"👥 Add Volunteers to This Program "}
             <span {...ui.props("create-program-56", {"style": {"fontWeight": "400", "color": "#94a3b8"}})}>
               {"(optional — select one or more)"}
             </span>
           </label>
           <p className="field-hint">Choose active volunteers from the directory. {ui.state.selectedVolunteers.length} selected. They must accept an invitation before receiving program tasks.</p>
           <PageField field="program-volunteer-search" spec={{ type: 'search', placeholder: 'Search volunteers by name, email or skills', 'aria-label': 'Search volunteers to invite', className: 'form-input' }} />
           <div {...ui.props("progVolsContainer", {"id": "progVolsContainer", "style": {"maxHeight": "220px", "overflowY": "auto", "border": "1px solid #e2e8f0", "borderRadius": "10px", "background": "#fafbfc"}})}>
             <p className="field-hint">Selected volunteers receive invitations. They must accept before you can assign tasks or subtasks.</p><PageRegion name="progVolsContainer" />
           </div>
         </div>
         <div className="form-group public-program-request"><label className="form-label"><PageField field="requestPublicListing" spec={{ type: 'checkbox', 'aria-label': 'Request display on the public Programs page', disabled: !hasBankDetails(ui.data('organizations').find((o) => o.name === ui.session.org)) || ui.data('organizations').find((o) => o.name === ui.session.org)?.status !== 'active' }} /> Request display on the public Programs page</label><p className="field-hint">Bank details: {hasBankDetails(ui.data('organizations').find((o) => o.name === ui.session.org)) ? 'saved' : 'required'}. Registration: {ui.data('organizations').find((o) => o.name === ui.session.org)?.status || 'loading'}. Save valid bank details and obtain organization registration approval before requesting public display. You can still create a private program and invite volunteers.</p><label className="form-label" htmlFor="program-photo">Program Photo (optional)</label><input id="program-photo" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => ui.selectFile('program-photo',e.target.files?.[0])} /></div>
         <div {...ui.props("create-program-58", {"className": "form-actions"})}>
           <Link {...ui.props("create-program-59", {"className": "btn btn-outline", "style": {"flex": "1", "justifyContent": "center"}, "actionLabel": "Cancel", "to": "/org-admin.html#programs"})}>
             {"Cancel"}
           </Link>
           <button {...ui.props("createProgramBtn", {"className": "btn btn-primary", "style": {"flex": "2", "justifyContent": "center"}, "id": "createProgramBtn", "type": "button", "actionLabel": "+ Create Program"})}>
             {ui.content("createProgramBtn", <>
             {"+ Create Program"}
             </>)}
           </button>
         </div>
       </div>
     </div>
     <PageExtras />
   </main>
  </>;
}
