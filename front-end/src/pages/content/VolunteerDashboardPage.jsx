import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageModal, PageRegion } from '../runtime/PageElements.jsx';

export default function VolunteerDashboardPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("volunteer-dashboard-1", {"className": "page-wrapper", "data-react-page": "/volunteer-dashboard.html"})}>
     <div {...ui.props("volunteer-dashboard-2", {"className": "page-header", "style": {"display": "flex", "justifyContent": "space-between", "alignItems": "center"}})}>
       <div {...ui.props("volunteer-dashboard-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("welcome-msg", {"id": "welcome-msg"})}>
           {ui.content("welcome-msg", <>
           {"Welcome, Volunteer!"}
           </>)}
         </h1>
         <p {...ui.props("welcome-sub", {"id": "welcome-sub"})}>
           {ui.content("welcome-sub", <>
           {"Track your active assignments, logged hours, and community impact."}
           </>)}
         </p>
       </div>
       <div {...ui.props("volunteer-dashboard-6", {"style": {"display": "flex", "gap": "10px", "alignItems": "center", "flexWrap": "wrap"}})}>
         <Link {...ui.props("volunteer-dashboard-7", {"style": {"display": "inline-flex", "alignItems": "center", "gap": "7px", "padding": "10px 18px", "background": "#f0fdf4", "color": "#065f46", "border": "1px solid #a7f3d0", "borderRadius": "10px", "fontSize": ".85rem", "fontWeight": "600", "textDecoration": "none", "transition": "all .15s"}, "data-page-node": "volunteer-dashboard-7", "actionLabel": "👤 Edit Profile", "to": "/profile.html"})}>
           {" 👤 Edit Profile "}
         </Link>
         {" "}
         <Link {...ui.props("volunteer-dashboard-8", {"style": {"display": "inline-flex", "alignItems": "center", "gap": "7px", "padding": "10px 18px", "background": "#eff6ff", "color": "#1d4ed8", "border": "1px solid #bfdbfe", "borderRadius": "10px", "fontSize": ".85rem", "fontWeight": "600", "textDecoration": "none", "transition": "all .15s"}, "data-page-node": "volunteer-dashboard-8", "actionLabel": "🌐 Browse Programs", "to": "/volunteer-portal.html"})}>
           {" 🌐 Browse Programs "}
         </Link>
         <button {...ui.props("volunteer-dashboard-9", {"className": "btn-primary-sm", "style": {"background": "#059669", "borderColor": "#059669"}, "type": "button", "actionLabel": "+ Add Task"}, {"click": {"name": "openVolunteerTaskModal", "args": []}})}>
           {"+ Add Task"}
         </button>
         <button {...ui.props("volunteer-dashboard-10", {"className": "btn-primary-sm", "type": "button", "actionLabel": "+ Log Hours"}, {"click": {"name": "logHoursModal", "args": []}})}>
           {"+ Log Hours"}
         </button>
       </div>
     </div>
     <div {...ui.props("vol-stats", {"className": "stats-grid", "id": "vol-stats"})}>
       {ui.content("vol-stats", <>
       <div {...ui.props("volunteer-dashboard-12", {"className": "stat-card"})}>
         <div {...ui.props("volunteer-dashboard-13", {"className": "stat-icon green"})}>
           <svg {...ui.props("volunteer-dashboard-14", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <circle {...ui.props("volunteer-dashboard-15", {"cx": "12", "cy": "12", "r": "10"})}>
             </circle>
             <polyline {...ui.props("volunteer-dashboard-16", {"points": "12 6 12 12 16 14"})}>
             </polyline>
           </svg>
         </div>
         <div {...ui.props("stat-hours", {"className": "stat-value", "id": "stat-hours"})}>
           {ui.content("stat-hours", <>
           {"0"}
           </>)}
         </div>
         <div {...ui.props("volunteer-dashboard-18", {"className": "stat-label"})}>
           {"Hours Logged"}
         </div>
       </div>
       <div {...ui.props("volunteer-dashboard-19", {"className": "stat-card"})}>
         <div {...ui.props("volunteer-dashboard-20", {"className": "stat-icon orange"})}>
           <svg {...ui.props("volunteer-dashboard-21", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("volunteer-dashboard-22", {"d": "M22 11.08V12a10 10 0 11-5.93-9.14"})}>
             </path>
             <polyline {...ui.props("volunteer-dashboard-23", {"points": "22 4 12 14.01 9 11.01"})}>
             </polyline>
           </svg>
         </div>
         <div {...ui.props("stat-active", {"className": "stat-value", "id": "stat-active"})}>
           {ui.content("stat-active", <>
           {"0"}
           </>)}
         </div>
         <div {...ui.props("volunteer-dashboard-25", {"className": "stat-label"})}>
           {"Active Tasks"}
         </div>
       </div>
       <div {...ui.props("volunteer-dashboard-26", {"className": "stat-card"})}>
         <div {...ui.props("volunteer-dashboard-27", {"className": "stat-icon blue"})}>
           <svg {...ui.props("volunteer-dashboard-28", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <path {...ui.props("volunteer-dashboard-29", {"d": "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"})}>
             </path>
             <circle {...ui.props("volunteer-dashboard-30", {"cx": "9", "cy": "7", "r": "4"})}>
             </circle>
             <path {...ui.props("volunteer-dashboard-31", {"d": "M23 21v-2a4 4 0 00-3-3.87"})}>
             </path>
             <path {...ui.props("volunteer-dashboard-32", {"d": "M16 3.13a4 4 0 010 7.75"})}>
             </path>
           </svg>
         </div>
         <div {...ui.props("stat-families", {"className": "stat-value", "id": "stat-families"})}>
           {ui.content("stat-families", <>
           {"0"}
           </>)}
         </div>
         <div {...ui.props("volunteer-dashboard-34", {"className": "stat-label"})}>
           {"Families Helped"}
         </div>
       </div>
       <div {...ui.props("volunteer-dashboard-35", {"className": "stat-card"})}>
         <div {...ui.props("volunteer-dashboard-36", {"className": "stat-icon purple"})}>
           <svg {...ui.props("volunteer-dashboard-37", {"width": "18", "height": "18", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2"})}>
             <polygon {...ui.props("volunteer-dashboard-38", {"points": "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"})}>
             </polygon>
           </svg>
         </div>
         <div {...ui.props("stat-tier", {"className": "stat-value", "id": "stat-tier"})}>
           {ui.content("stat-tier", <>
           {"New"}
           </>)}
         </div>
         <div {...ui.props("volunteer-dashboard-40", {"className": "stat-label"})}>
           {"Volunteer Tier"}
         </div>
       </div>
       </>)}
     </div>
     <div {...ui.props("my-skills-section", {"id": "my-skills-section", "style": {"marginBottom": "24px", "background": "#fff", "border": "1px solid #e2e8f0", "borderRadius": "14px", "padding": "20px 24px", "boxShadow": "0 2px 8px rgba(0,0,0,.04)", "display": "none"}})}>
       {ui.content("my-skills-section", <>
       <div {...ui.props("volunteer-dashboard-42", {"style": {"display": "flex", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "14px"}})}>
         <h3 {...ui.props("volunteer-dashboard-43", {"style": {"fontSize": "1rem", "fontWeight": "700", "color": "#1e293b", "margin": "0", "display": "flex", "alignItems": "center", "gap": "8px"}})}>
           {" 🛠️ My Skills "}
         </h3>
         <Link {...ui.props("volunteer-dashboard-44", {"style": {"fontSize": ".8rem", "fontWeight": "600", "color": "#6366f1", "textDecoration": "none", "display": "inline-flex", "alignItems": "center", "gap": "4px", "transition": "gap .15s"}, "data-page-node": "volunteer-dashboard-44", "actionLabel": "✏️ Edit Skills →", "to": "/profile.html"})}>
           {" ✏️ Edit Skills → "}
         </Link>
       </div>
       <div {...ui.props("my-skills-tags", {"id": "my-skills-tags", "style": {"display": "flex", "flexWrap": "wrap", "gap": "8px"}})}>
         <PageRegion name="my-skills-tags" />
       </div>
       </>)}
     </div>
     <div {...ui.props("onboarding-panel", {"className": "onboarding-panel", "id": "onboarding-panel", "style": {"display": "none"}})}>
       {ui.content("onboarding-panel", <>
       <h3 {...ui.props("volunteer-dashboard-47", {})}>
         {"🎉 Welcome to Kindred!"}
       </h3>
       <p {...ui.props("volunteer-dashboard-48", {})}>
         {"You're all set as a Volunteer. Here's how to get started:"}
       </p>
       <div {...ui.props("volunteer-dashboard-49", {"className": "onboarding-steps"})}>
         <div {...ui.props("volunteer-dashboard-50", {"className": "onboarding-step", "actionLabel": "📋\n          Browse Programs\n          Explore active programs you can help with"}, {"click": {"name": "navigate", "args": ["volunteer-portal.html"]}})}>
           <div {...ui.props("volunteer-dashboard-51", {"className": "step-icon"})}>
             {"📋"}
           </div>
           <div {...ui.props("volunteer-dashboard-52", {"className": "step-title"})}>
             {"Browse Programs"}
           </div>
           <div {...ui.props("volunteer-dashboard-53", {"className": "step-desc"})}>
             {"Explore active programs you can help with"}
           </div>
         </div>
         <div {...ui.props("volunteer-dashboard-54", {"className": "onboarding-step", "actionLabel": "🏢\n          Find Organizations\n          Connect with NGOs in your area"}, {"click": {"name": "navigate", "args": ["organizations.html"]}})}>
           <div {...ui.props("volunteer-dashboard-55", {"className": "step-icon"})}>
             {"🏢"}
           </div>
           <div {...ui.props("volunteer-dashboard-56", {"className": "step-title"})}>
             {"Find Organizations"}
           </div>
           <div {...ui.props("volunteer-dashboard-57", {"className": "step-desc"})}>
             {"Connect with NGOs in your area"}
           </div>
         </div>
         <div {...ui.props("volunteer-dashboard-58", {"className": "onboarding-step", "actionLabel": "⏱️\n          Log Your Hours\n          Start tracking your volunteer impact"}, {"click": {"name": "logHoursModal", "args": []}})}>
           <div {...ui.props("volunteer-dashboard-59", {"className": "step-icon"})}>
             {"⏱️"}
           </div>
           <div {...ui.props("volunteer-dashboard-60", {"className": "step-title"})}>
             {"Log Your Hours"}
           </div>
           <div {...ui.props("volunteer-dashboard-61", {"className": "step-desc"})}>
             {"Start tracking your volunteer impact"}
           </div>
         </div>
         <div {...ui.props("volunteer-dashboard-62", {"className": "onboarding-step", "actionLabel": "📞\n          Contact Support\n          Reach out if you need help getting started"}, {"click": {"name": "navigate", "args": ["contact.html"]}})}>
           <div {...ui.props("volunteer-dashboard-63", {"className": "step-icon"})}>
             {"📞"}
           </div>
           <div {...ui.props("volunteer-dashboard-64", {"className": "step-title"})}>
             {"Contact Support"}
           </div>
           <div {...ui.props("volunteer-dashboard-65", {"className": "step-desc"})}>
             {"Reach out if you need help getting started"}
           </div>
         </div>
       </div>
       </>)}
     </div>
     <section className="volunteer-progress-section" aria-labelledby="volunteer-progress-title">
       <div className="volunteer-progress-heading"><div><span className="volunteer-progress-eyebrow">Your impact</span><h2 id="volunteer-progress-title">Volunteer Progress</h2></div><p>Track your programs, assigned work, and reported progress.</p></div>
       <h3 className="volunteer-progress-subheading">My Assigned Programs</h3>
       <div {...ui.props("my-programs-list", {"className": "volunteer-program-list", "id": "my-programs-list"})}>
         <PageRegion name="my-programs-list" />
       </div>
       <h3 className="volunteer-progress-subheading">My Assigned Tasks</h3>
       <div {...ui.props("assignments-list", {"className": "assignments-list volunteer-task-list", "id": "assignments-list"})}>
         <PageRegion name="assignments-list" />
       </div>
     </section>
     <h3 {...ui.props("volunteer-dashboard-70", {"style": {"marginBottom": "16px", "fontSize": "1.1rem", "borderBottom": "1px solid #e2e8f0", "paddingBottom": "8px"}})}>
       {" ⏱️ My Logged Hours "}
     </h3>
     <div {...ui.props("hour-logs-list", {"className": "assignments-list", "id": "hour-logs-list", "style": {"marginBottom": "32px"}})}>
       <PageRegion name="hour-logs-list" />
     </div>
     <h3 {...ui.props("volunteer-dashboard-72", {"style": {"marginBottom": "16px", "fontSize": "1.1rem", "borderBottom": "1px solid #e2e8f0", "paddingBottom": "8px"}})}>
       {" 📦 My Pickups "}
     </h3>
     <div {...ui.props("vol-pickups-list", {"id": "vol-pickups-list", "style": {"marginBottom": "32px"}})}>
       <PageRegion name="vol-pickups-list" />
     </div>
     <PageExtras />
   </main>
   <PageModal name="logHoursModal">
     <div {...ui.props("volunteer-dashboard-75", {"className": "modal-box", "style": {"width": "420px", "maxWidth": "95vw"}})}>
       <div {...ui.props("volunteer-dashboard-76", {"className": "modal-header"})}>
         <h3 {...ui.props("volunteer-dashboard-77", {})}>
           {"⏱️ Log Volunteer Hours"}
         </h3>
         <button {...ui.props("volunteer-dashboard-78", {"className": "modal-close-btn", "type": "button", "actionLabel": "×"}, {"click": {"name": "closeLogHours", "args": []}})}>
           {"×"}
         </button>
       </div>
       <div {...ui.props("volunteer-dashboard-79", {"className": "modal-body"})}>
         <div {...ui.props("volunteer-dashboard-80", {"className": "field"})}>
           <label {...ui.props("volunteer-dashboard-81", {})}>
             {"Task / Activity"}
           </label>
           <label htmlFor="log-program">Program (optional)</label><PageField as="select" field="log-program" spec={{ id: 'log-program' }}><option value="">Organization work</option>{ui.data('programs').filter((p) => ui.data('assignments').some((a) => a.programId === p.id && a.status === 'active')).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</PageField>
           <PageField as="input" field="log-activity" spec={{"type": "text", "id": "log-activity", "placeholder": "e.g. Food Distribution Drive"}} />
         </div>
         <div {...ui.props("volunteer-dashboard-83", {"className": "field"})}>
           <label {...ui.props("volunteer-dashboard-84", {})}>
             {"Hours Logged"}
           </label>
           <PageField as="input" field="log-hours" spec={{"type": "number", "id": "log-hours", "min": "0.5", "step": "0.5", "placeholder": "e.g. 3.5"}} />
         </div>
         <div {...ui.props("volunteer-dashboard-86", {"className": "field"})}>
           <label {...ui.props("volunteer-dashboard-87", {})}>
             {"Date"}
           </label>
           <PageField as="input" field="log-date" spec={{"type": "date", "id": "log-date"}} />
         </div>
         <div {...ui.props("volunteer-dashboard-89", {"className": "modal-actions"})}>
           <button {...ui.props("volunteer-dashboard-90", {"className": "btn-modal-cancel", "type": "button", "actionLabel": "Cancel"}, {"click": {"name": "closeLogHours", "args": []}})}>
             {"Cancel"}
           </button>
           <button {...ui.props("volunteer-dashboard-91", {"className": "btn-modal-save", "type": "button", "actionLabel": "Log Hours"}, {"click": {"name": "submitLogHours", "args": []}})}>
             {"Log Hours"}
           </button>
         </div>
       </div>
     </div>
   </PageModal>
   <PageModal name="addTaskModal">
     <div {...ui.props("volunteer-dashboard-93", {"className": "modal-box", "style": {"width": "480px", "maxWidth": "95vw"}})}>
       <div {...ui.props("volunteer-dashboard-94", {"className": "modal-header"})}>
         <h3 {...ui.props("volunteer-dashboard-95", {})}>
           {"📋 Add Self-Assigned Task"}
         </h3>
         <button {...ui.props("volunteer-dashboard-96", {"className": "modal-close-btn", "type": "button", "actionLabel": "×"}, {"click": {"name": "closeVolunteerTask", "args": []}})}>
           {"×"}
         </button>
       </div>
       <div {...ui.props("volunteer-dashboard-97", {"className": "modal-body"})}>
         <div {...ui.props("volunteer-dashboard-98", {"className": "field"})}>
           <label {...ui.props("volunteer-dashboard-99", {})}>
             {"Task Title "}
             <span {...ui.props("volunteer-dashboard-100", {"className": "req"})}>
               {"*"}
             </span>
           </label>
           <PageField as="input" field="vt-title" spec={{"type": "text", "id": "vt-title", "placeholder": "e.g. Community Cleanup"}} />
         </div>
         <div {...ui.props("volunteer-dashboard-102", {"className": "field"})}>
           <label {...ui.props("volunteer-dashboard-103", {})}>
             {"Description"}
           </label>
           <PageField as="textarea" field="vt-desc" spec={{"id": "vt-desc", "rows": "2", "placeholder": "What did you do or what do you plan to do?"}}>
           </PageField>
         </div>
         <div {...ui.props("volunteer-dashboard-105", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "16px"}})}>
           <div {...ui.props("volunteer-dashboard-106", {"className": "field"})}>
             <label {...ui.props("volunteer-dashboard-107", {})}>
               {"Program"}
             </label>
             <PageField as="select" field="vt-prog" spec={{"id": "vt-prog"}}>
               <option {...ui.props("volunteer-dashboard-109", {"value": ""})}>
                 {"— Select Program —"}
               </option>
             </PageField>
           </div>
           <div {...ui.props("volunteer-dashboard-110", {"className": "field"})}>
             <label {...ui.props("volunteer-dashboard-111", {})}>
               {"Priority"}
             </label>
             <PageField as="select" field="vt-priority" spec={{"id": "vt-priority"}}>
               <option {...ui.props("volunteer-dashboard-113", {"value": "normal"})}>
                 {"Normal"}
               </option>
               <option {...ui.props("volunteer-dashboard-114", {"value": "high"})}>
                 {"High"}
               </option>
               <option {...ui.props("volunteer-dashboard-115", {"value": "urgent"})}>
                 {"Urgent"}
               </option>
             </PageField>
           </div>
         </div>
         <div {...ui.props("volunteer-dashboard-116", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "16px"}})}>
           <div {...ui.props("volunteer-dashboard-117", {"className": "field"})}>
             <label {...ui.props("volunteer-dashboard-118", {})}>
               {"Location"}
             </label>
             <PageField as="input" field="vt-location" spec={{"type": "text", "id": "vt-location", "placeholder": "e.g. Sector 12 Park"}} />
           </div>
           <div {...ui.props("volunteer-dashboard-120", {"className": "field"})}>
             <label {...ui.props("volunteer-dashboard-121", {})}>
               {"Date"}
             </label>
             <PageField as="input" field="vt-date" spec={{"type": "date", "id": "vt-date"}} />
           </div>
         </div>
         <div {...ui.props("volunteer-dashboard-123", {"className": "modal-actions"})}>
           <button {...ui.props("volunteer-dashboard-124", {"className": "btn-modal-cancel", "type": "button", "actionLabel": "Cancel"}, {"click": {"name": "closeVolunteerTask", "args": []}})}>
             {"Cancel"}
           </button>
           <button {...ui.props("volunteer-dashboard-125", {"className": "btn-modal-save", "type": "button", "actionLabel": "Add Task"}, {"click": {"name": "submitVolunteerTask", "args": []}})}>
             {"Add Task"}
           </button>
         </div>
       </div>
     </div>
   </PageModal>
  </>;
}
