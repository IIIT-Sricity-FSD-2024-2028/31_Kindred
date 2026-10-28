import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageRegion } from '../runtime/PageElements.jsx';

export default function ProfilePage() {
  const ui = usePage();
  return <>
   <main data-react-page="/profile.html">
   <div {...ui.props("profile-1", {"className": "profile-page"})}>
     <Link {...ui.props("backLink", {"href": "#", "className": "back-link", "id": "backLink", "actionLabel": "← Back to Dashboard"})}>
       {ui.content("backLink", <>
       {" ← Back to Dashboard "}
       </>)}
     </Link>
     <div {...ui.props("profile-3", {"className": "profile-hero"})}>
       <div {...ui.props("heroAvatar", {"className": "profile-avatar-big", "id": "heroAvatar"})}>
         {ui.content("heroAvatar", <>
         {"U"}
         </>)}
       </div>
       <div {...ui.props("profile-5", {"className": "profile-hero-info"})}>
         <div {...ui.props("heroName", {"className": "profile-hero-name", "id": "heroName"})}>
           {ui.content("heroName", <>
           {"Loading…"}
           </>)}
         </div>
         <div {...ui.props("heroEmail", {"className": "profile-hero-email", "id": "heroEmail"})}>
           {ui.content("heroEmail", <>
           </>)}
         </div>
         <div {...ui.props("profile-8", {"className": "profile-hero-badges"})}>
           <span {...ui.props("heroBadgeRole", {"className": "profile-badge badge-role", "id": "heroBadgeRole"})}>
             {ui.content("heroBadgeRole", <>
             {"—"}
             </>)}
           </span>
           {" "}
           <span {...ui.props("heroBadgeStatus", {"className": "profile-badge badge-status-approved", "id": "heroBadgeStatus"})}>
             {ui.content("heroBadgeStatus", <>
             {"—"}
             </>)}
           </span>
         </div>
       </div>
     </div>
     <div {...ui.props("profile-11", {"className": "profile-card"})}>
       <div {...ui.props("profile-12", {"className": "profile-card-title"})}>
         {"✏️ Personal Information"}
       </div>
       <form {...ui.props("profileForm", {"id": "profileForm", "noValidate": true, "pageForm": true}, {"submit": {"name": "saveProfile", "args": []}})}>
         {ui.content("profileForm", <>
         <div {...ui.props("profile-14", {"className": "profile-fields-grid"})}>
           <div {...ui.props("profile-15", {"className": "profile-field"})}>
             <label {...ui.props("profile-16", {})}>
               {"Full Name *"}
             </label>
             <PageField as="input" field="pf-name" spec={{"type": "text", "className": "profile-input", "id": "pf-name", "placeholder": "Your full name"}} />
           </div>
           <div {...ui.props("profile-18", {"className": "profile-field"})}>
             <label {...ui.props("profile-19", {})}>
               {"Email Address"}
             </label>
             <PageField as="input" field="pf-email" spec={{"type": "email", "className": "profile-input", "id": "pf-email", "readOnly": true}} />
             <p {...ui.props("profile-21", {"className": "field-hint"})}>
               {"Email cannot be changed"}
             </p>
           </div>
         </div>
         <div {...ui.props("profile-22", {"className": "profile-fields-grid"})}>
           <div {...ui.props("profile-23", {"className": "profile-field"})}>
             <label {...ui.props("profile-24", {})}>
               {"Phone Number"}
             </label>
             <PageField as="input" field="pf-phone" spec={{"type": "tel", "className": "profile-input", "id": "pf-phone", "placeholder": "+91 98765 43210"}} />
           </div>
           <div {...ui.props("profile-26", {"className": "profile-field"})}>
             <label {...ui.props("profile-27", {})}>
               {"Role"}
             </label>
             <PageField as="input" field="pf-role" spec={{"type": "text", "className": "profile-input", "id": "pf-role", "readOnly": true}} />
             <p {...ui.props("profile-29", {"className": "field-hint"})}>
               {"Role is assigned by administrator"}
             </p>
           </div>
         </div>
         <div {...ui.props("orgSection", {"className": "profile-field org-section", "id": "orgSection"})}>
           {ui.content("orgSection", <>
           <label {...ui.props("profile-31", {})}>
             {"Organization Name"}
           </label>
           <PageField as="input" field="pf-org" spec={{"type": "text", "className": "profile-input", "id": "pf-org", "placeholder": "Your NGO / Organization name"}} />
           <p {...ui.props("profile-33", {"className": "field-hint"})}>
             {"Organization you manage on Kindred"}
           </p>
           </>)}
         </div>
         <div {...ui.props("profile-34", {"className": "profile-field"})}>
           <label {...ui.props("profile-35", {})}>
             {"Bio / About You"}
           </label>
           <PageField as="textarea" field="pf-bio" spec={{"className": "profile-textarea", "id": "pf-bio", "placeholder": "Tell us a little about yourself…"}}>
           </PageField>
         </div>
         <div {...ui.props("profile-37", {"className": "profile-actions"})}>
           <button {...ui.props("saveBtn", {"type": "submit", "className": "btn-profile-save", "id": "saveBtn", "actionLabel": "💾 Save Changes"})}>
             {ui.content("saveBtn", <>
             {"💾 Save Changes"}
             </>)}
           </button>
           <button {...ui.props("profile-39", {"type": "button", "className": "btn-profile-cancel", "actionLabel": "Cancel"}, {"click": {"name": "resetForm", "args": []}})}>
             {"Cancel"}
           </button>
         </div>
         </>)}
       </form>
     </div>
     <div className="profile-card">
       <div className="profile-card-title">Account Recovery Questions</div>
       <p className="field-hint" style={{ marginBottom: 16 }}>Set two questions and answers so you can recover your password if you get locked out. You can replace them any time while signed in.</p>
       <form {...ui.props('recoveryQuestionsForm', { id: 'recoveryQuestionsForm', noValidate: true, pageForm: true })}>
         <div className="profile-field"><label htmlFor="pf-security-question-1">Security question 1 *</label><PageField as="select" field="pf-security-question-1" spec={{ id: 'pf-security-question-1', className: 'profile-input' }}><option value="">Choose a question</option><option value="first_school">What was the name of your first school?</option><option value="childhood_friend">What was the first name of your childhood best friend?</option><option value="first_pet">What was the name of your first pet?</option><option value="birth_city">In what city were you born?</option></PageField></div>
         <div className="profile-field"><label htmlFor="pf-security-answer-1">Answer *</label><PageField field="pf-security-answer-1" spec={{ id: 'pf-security-answer-1', type: 'text', className: 'profile-input', autoComplete: 'off', placeholder: 'Your answer' }} /></div>
         <div className="profile-field" style={{ marginTop: 12 }}><label htmlFor="pf-security-question-2">Security question 2 *</label><PageField as="select" field="pf-security-question-2" spec={{ id: 'pf-security-question-2', className: 'profile-input' }}><option value="">Choose a different question</option><option value="first_school">What was the name of your first school?</option><option value="childhood_friend">What was the first name of your childhood best friend?</option><option value="first_pet">What was the name of your first pet?</option><option value="birth_city">In what city were you born?</option></PageField></div>
         <div className="profile-field"><label htmlFor="pf-security-answer-2">Answer *</label><PageField field="pf-security-answer-2" spec={{ id: 'pf-security-answer-2', type: 'text', className: 'profile-input', autoComplete: 'off', placeholder: 'Your answer' }} /></div>
         <div className="profile-actions"><button type="submit" className="btn-profile-save">Save Recovery Questions</button></div>
       </form>
     </div>
     <div {...ui.props("skillsSection", {"className": "profile-card vol-skills-section", "id": "skillsSection"})}>
       {ui.content("skillsSection", <>
       <div {...ui.props("profile-41", {"className": "profile-card-title"})}>
         {"🛠️ Skills & Expertise"}
       </div>
       <p {...ui.props("profile-42", {"style": {"fontSize": ".82rem", "color": "#64748b", "marginBottom": "16px"}})}>
         {"Select your skills and add custom ones. Changes are saved when you click \"Save Skills\"."}
       </p>
       <div {...ui.props("pfSkillsGrid", {"className": "pf-skills-grid", "id": "pfSkillsGrid"})}>
         {ui.content("pfSkillsGrid", <>
         <label {...ui.props("profile-44", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-teaching" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" Teaching"}
         </label>
         <label {...ui.props("profile-46", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-medical" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" Medical Aid"}
         </label>
         <label {...ui.props("profile-48", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-logistics" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" Logistics"}
         </label>
         <label {...ui.props("profile-50", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-cooking" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" Cooking"}
         </label>
         <label {...ui.props("profile-52", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-translation" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" Translation"}
         </label>
         <label {...ui.props("profile-54", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-technology" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" Technology"}
         </label>
         <label {...ui.props("profile-56", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-counseling" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" Counseling"}
         </label>
         <label {...ui.props("profile-58", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-driving" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" Driving"}
         </label>
         <label {...ui.props("profile-60", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-construction" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" Construction"}
         </label>
         <label {...ui.props("profile-62", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-first-aid" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" First Aid"}
         </label>
         <label {...ui.props("profile-64", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-fundraising" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" Fundraising"}
         </label>
         <label {...ui.props("profile-66", {"className": "pf-skill-check"})}>
           <PageField as="input" field="pf-skill-photography" spec={{"type": "checkbox", "name": "pf-skill"}} />
           {" Photography"}
         </label>
         </>)}
       </div>
       <div {...ui.props("profile-68", {"style": {"display": "flex", "gap": "8px", "alignItems": "center", "marginBottom": "10px"}})}>
         <PageField as="input" field="pf-custom-skill" spec={{"type": "text", "id": "pf-custom-skill", "className": "profile-input", "placeholder": "Add a custom skill…", "style": {"flex": "1"}}} />
         <button {...ui.props("profile-70", {"type": "button", "style": {"padding": "10px 18px", "background": "linear-gradient(135deg,#10b981,#059669)", "color": "#fff", "border": "none", "borderRadius": "10px", "fontSize": ".82rem", "fontWeight": "600", "cursor": "pointer", "whiteSpace": "nowrap", "transition": "all .15s"}, "data-page-node": "profile-70", "actionLabel": "+ Add"}, {"click": {"name": "addCustomSkillProfile", "args": []}})}>
           {"+ Add"}
         </button>
       </div>
       <div {...ui.props("pfCustomSkillTags", {"id": "pfCustomSkillTags", "style": {"display": "flex", "flexWrap": "wrap", "gap": "8px", "marginBottom": "16px"}})}>
         <PageRegion name="pfCustomSkillTags" />
       </div>
       <div {...ui.props("profile-72", {"className": "profile-actions"})}>
         <button {...ui.props("profile-73", {"type": "button", "className": "btn-profile-save", "actionLabel": "🛠️ Save Skills"}, {"click": {"name": "saveSkills", "args": []}})}>
           {"🛠️ Save Skills"}
         </button>
         <button {...ui.props("profile-74", {"type": "button", "className": "btn-profile-cancel", "actionLabel": "Cancel"}, {"click": {"name": "resetSkills", "args": []}})}>
           {"Cancel"}
         </button>
       </div>
       </>)}
     </div>
     <div {...ui.props("profile-75", {"className": "profile-card"})}>
       <div {...ui.props("profile-76", {"className": "profile-card-title"})}>
         {"🔒 Change Password"}
       </div>
       <form {...ui.props("passForm", {"id": "passForm", "noValidate": true, "pageForm": true}, {"submit": {"name": "changePassword", "args": []}})}>
         {ui.content("passForm", <>
         <div {...ui.props("profile-78", {"className": "pass-fields"})}>
           <div {...ui.props("profile-79", {"className": "profile-field"})}>
             <label {...ui.props("profile-80", {})}>
               {"New Password"}
             </label>
             <PageField as="input" field="pf-newpass" spec={{"type": "password", "className": "profile-input", "id": "pf-newpass", "placeholder": "Min 8 characters"}} />
           </div>
           <div {...ui.props("profile-82", {"className": "profile-field"})}>
             <label {...ui.props("profile-83", {})}>
               {"Confirm New Password"}
             </label>
             <PageField as="input" field="pf-newpass2" spec={{"type": "password", "className": "profile-input", "id": "pf-newpass2", "placeholder": "Repeat password"}} />
           </div>
         </div>
         <div {...ui.props("profile-85", {"className": "profile-actions"})}>
           <button {...ui.props("profile-86", {"type": "submit", "className": "btn-profile-save", "actionLabel": "🔑 Update Password"})}>
             {"🔑 Update Password"}
           </button>
         </div>
         </>)}
       </form>
     </div>
   </div>
     <PageExtras />
   </main>
  </>;
}
