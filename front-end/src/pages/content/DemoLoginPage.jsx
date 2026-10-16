import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';

export default function DemoLoginPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/demo-login.html">
   <div {...ui.props("demo-login-1", {"className": "card"})}>
     <div {...ui.props("demo-login-2", {"className": "card-header"})}>
       <h1 {...ui.props("demo-login-3", {})}>
         {"🌐 Kindred — Demo Guide"}
       </h1>
       <p {...ui.props("demo-login-4", {})}>
         {"Click any role card below to auto-login, or use the credentials on the Sign In page."}
       </p>
     </div>
     <div {...ui.props("demo-login-5", {"className": "card-body"})}>
       <p {...ui.props("demo-login-6", {"className": "section-title"})}>
         {"Role-Based Access"}
       </p>
       <div {...ui.props("demo-login-7", {"className": "role-grid"})}>
         <Link {...ui.props("demo-login-8", {"className": "role-card", "style": {"--c": "#6366f1"}, "actionLabel": "🛡 Super User\n        Platform Administrator\n        Full CRUD — manages all organizations, requests, analytics, platform settings.\n        Emailsuper@kindred.org\n        PasswordSuper@123\n        Dashboardoverview.html", "to": "/signin.html"}, {"click": {"name": "autoLogin", "args": ["superuser"]}})}>
           <div {...ui.props("demo-login-9", {"className": "role-badge", "style": {"background": "#ede9fe", "color": "#6366f1"}})}>
             {"🛡 Super User"}
           </div>
           <div {...ui.props("demo-login-10", {"className": "role-title"})}>
             {"Platform Administrator"}
           </div>
           <div {...ui.props("demo-login-11", {"className": "role-desc"})}>
             {"Full CRUD — manages all organizations, requests, analytics, platform settings."}
           </div>
           <div {...ui.props("demo-login-12", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-13", {"className": "cred-label"})}>
               {"Email"}
             </span>
             <span {...ui.props("demo-login-14", {"className": "cred-val"})}>
               {"super@kindred.org"}
             </span>
           </div>
           <div {...ui.props("demo-login-15", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-16", {"className": "cred-label"})}>
               {"Password"}
             </span>
             <span {...ui.props("demo-login-17", {"className": "cred-val"})}>
               {"Super@123"}
             </span>
           </div>
           <div {...ui.props("demo-login-18", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-19", {"className": "cred-label"})}>
               {"Dashboard"}
             </span>
             <span {...ui.props("demo-login-20", {"className": "cred-val"})}>
               {"overview.html"}
             </span>
           </div>
         </Link>
         {" "}
         <Link {...ui.props("demo-login-21", {"className": "role-card", "style": {"--c": "#3b82f6"}, "actionLabel": "🏢 Admin\n        Organization Admin\n        Manages HopeConnect — volunteers, programs, resources, incoming requests. No delete.\n        Emailadmin@hopeconnect.org\n        PasswordAdmin@123\n        Dashboardorg-admin-overview.html", "to": "/signin.html"}, {"click": {"name": "autoLogin", "args": ["admin"]}})}>
           <div {...ui.props("demo-login-22", {"className": "role-badge", "style": {"background": "#eff6ff", "color": "#3b82f6"}})}>
             {"🏢 Admin"}
           </div>
           <div {...ui.props("demo-login-23", {"className": "role-title"})}>
             {"Organization Admin"}
           </div>
           <div {...ui.props("demo-login-24", {"className": "role-desc"})}>
             {"Manages HopeConnect — volunteers, programs, resources, incoming requests. No delete."}
           </div>
           <div {...ui.props("demo-login-25", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-26", {"className": "cred-label"})}>
               {"Email"}
             </span>
             <span {...ui.props("demo-login-27", {"className": "cred-val"})}>
               {"admin@hopeconnect.org"}
             </span>
           </div>
           <div {...ui.props("demo-login-28", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-29", {"className": "cred-label"})}>
               {"Password"}
             </span>
             <span {...ui.props("demo-login-30", {"className": "cred-val"})}>
               {"Admin@123"}
             </span>
           </div>
           <div {...ui.props("demo-login-31", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-32", {"className": "cred-label"})}>
               {"Dashboard"}
             </span>
             <span {...ui.props("demo-login-33", {"className": "cred-val"})}>
               {"org-admin-overview.html"}
             </span>
           </div>
         </Link>
         {" "}
         <Link {...ui.props("demo-login-34", {"className": "role-card", "style": {"--c": "#10b981"}, "actionLabel": "🤝 Volunteer\n        Volunteer\n        View assignments, log hours, receive notifications. Read-only on most modules.\n        Emailvolunteer@kindred.org\n        PasswordVol@123\n        Dashboardvolunteer-dashboard.html", "to": "/signin.html"}, {"click": {"name": "autoLogin", "args": ["volunteer"]}})}>
           <div {...ui.props("demo-login-35", {"className": "role-badge", "style": {"background": "#ecfdf5", "color": "#10b981"}})}>
             {"🤝 Volunteer"}
           </div>
           <div {...ui.props("demo-login-36", {"className": "role-title"})}>
             {"Volunteer"}
           </div>
           <div {...ui.props("demo-login-37", {"className": "role-desc"})}>
             {"View assignments, log hours, receive notifications. Read-only on most modules."}
           </div>
           <div {...ui.props("demo-login-38", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-39", {"className": "cred-label"})}>
               {"Email"}
             </span>
             <span {...ui.props("demo-login-40", {"className": "cred-val"})}>
               {"volunteer@kindred.org"}
             </span>
           </div>
           <div {...ui.props("demo-login-41", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-42", {"className": "cred-label"})}>
               {"Password"}
             </span>
             <span {...ui.props("demo-login-43", {"className": "cred-val"})}>
               {"Vol@123"}
             </span>
           </div>
           <div {...ui.props("demo-login-44", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-45", {"className": "cred-label"})}>
               {"Dashboard"}
             </span>
             <span {...ui.props("demo-login-46", {"className": "cred-val"})}>
               {"volunteer-dashboard.html"}
             </span>
           </div>
         </Link>
         {" "}
         <Link {...ui.props("demo-login-47", {"className": "role-card", "style": {"--c": "#f59e0b"}, "actionLabel": "💝 Donor\n        Donor\n        Browse campaigns, make donations, view payment history and impact reports.\n        Emaildonor@kindred.org\n        PasswordDonor@123\n        Dashboarddonor-dashboard.html", "to": "/signin.html"}, {"click": {"name": "autoLogin", "args": ["donor"]}})}>
           <div {...ui.props("demo-login-48", {"className": "role-badge", "style": {"background": "#fffbeb", "color": "#d97706"}})}>
             {"💝 Donor"}
           </div>
           <div {...ui.props("demo-login-49", {"className": "role-title"})}>
             {"Donor"}
           </div>
           <div {...ui.props("demo-login-50", {"className": "role-desc"})}>
             {"Browse campaigns, make donations, view payment history and impact reports."}
           </div>
           <div {...ui.props("demo-login-51", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-52", {"className": "cred-label"})}>
               {"Email"}
             </span>
             <span {...ui.props("demo-login-53", {"className": "cred-val"})}>
               {"donor@kindred.org"}
             </span>
           </div>
           <div {...ui.props("demo-login-54", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-55", {"className": "cred-label"})}>
               {"Password"}
             </span>
             <span {...ui.props("demo-login-56", {"className": "cred-val"})}>
               {"Donor@123"}
             </span>
           </div>
           <div {...ui.props("demo-login-57", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-58", {"className": "cred-label"})}>
               {"Dashboard"}
             </span>
             <span {...ui.props("demo-login-59", {"className": "cred-val"})}>
               {"donor-dashboard.html"}
             </span>
           </div>
         </Link>
         {" "}
         <Link {...ui.props("demo-login-60", {"className": "role-card", "style": {"--c": "#8b5cf6"}, "actionLabel": "🙏 Beneficiary\n        Beneficiary\n        Submit assistance requests, track status, access emergency help.\n        Emailbeneficiary@kindred.org\n        PasswordBen@123\n        Dashboardbeneficiary-dashboard.html", "to": "/signin.html"}, {"click": {"name": "autoLogin", "args": ["beneficiary"]}})}>
           <div {...ui.props("demo-login-61", {"className": "role-badge", "style": {"background": "#f5f3ff", "color": "#7c3aed"}})}>
             {"🙏 Beneficiary"}
           </div>
           <div {...ui.props("demo-login-62", {"className": "role-title"})}>
             {"Beneficiary"}
           </div>
           <div {...ui.props("demo-login-63", {"className": "role-desc"})}>
             {"Submit assistance requests, track status, access emergency help."}
           </div>
           <div {...ui.props("demo-login-64", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-65", {"className": "cred-label"})}>
               {"Email"}
             </span>
             <span {...ui.props("demo-login-66", {"className": "cred-val"})}>
               {"beneficiary@kindred.org"}
             </span>
           </div>
           <div {...ui.props("demo-login-67", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-68", {"className": "cred-label"})}>
               {"Password"}
             </span>
             <span {...ui.props("demo-login-69", {"className": "cred-val"})}>
               {"Ben@123"}
             </span>
           </div>
           <div {...ui.props("demo-login-70", {"className": "cred-row"})}>
             <span {...ui.props("demo-login-71", {"className": "cred-label"})}>
               {"Dashboard"}
             </span>
             <span {...ui.props("demo-login-72", {"className": "cred-val"})}>
               {"beneficiary-dashboard.html"}
             </span>
           </div>
         </Link>
       </div>
       <p {...ui.props("demo-login-73", {"className": "section-title"})}>
         {"How It Works"}
       </p>
       <div {...ui.props("demo-login-74", {"className": "flow-list"})}>
         <div {...ui.props("demo-login-75", {"className": "flow-item"})}>
           <div {...ui.props("demo-login-76", {"className": "flow-num"})}>
             {"1"}
           </div>
           <div {...ui.props("demo-login-77", {"className": "flow-text"})}>
             <strong {...ui.props("demo-login-78", {})}>
               {"Select a role card above"}
             </strong>
             {" — credentials are auto-filled on the Sign In page."}
           </div>
         </div>
         <div {...ui.props("demo-login-79", {"className": "flow-item"})}>
           <div {...ui.props("demo-login-80", {"className": "flow-num"})}>
             {"2"}
           </div>
           <div {...ui.props("demo-login-81", {"className": "flow-text"})}>
             <strong {...ui.props("demo-login-82", {})}>
               {"Click \"Sign In\""}
             </strong>
             {" — you'll be routed to the correct dashboard based on your role."}
           </div>
         </div>
         <div {...ui.props("demo-login-83", {"className": "flow-item"})}>
           <div {...ui.props("demo-login-84", {"className": "flow-num"})}>
             {"3"}
           </div>
           <div {...ui.props("demo-login-85", {"className": "flow-text"})}>
             <strong {...ui.props("demo-login-86", {})}>
               {"Super User:"}
             </strong>
             {" Add/Edit/Delete organizations, approve/reject requests, view analytics."}
             <br {...ui.props("demo-login-87", {})} />
             <strong {...ui.props("demo-login-88", {})}>
               {"Admin:"}
             </strong>
             {" Add/Edit volunteers & programs, accept/decline incoming requests."}
             <br {...ui.props("demo-login-89", {})} />
             <strong {...ui.props("demo-login-90", {})}>
               {"End Users:"}
             </strong>
             {" View dashboard, submit requests, browse campaigns."}
           </div>
         </div>
         <div {...ui.props("demo-login-91", {"className": "flow-item"})}>
           <div {...ui.props("demo-login-92", {"className": "flow-num"})}>
             {"4"}
           </div>
           <div {...ui.props("demo-login-93", {"className": "flow-text"})}>
             <strong {...ui.props("demo-login-94", {})}>
               {"All data is in-memory"}
             </strong>
             {" — changes persist within the browser session. Refresh resets to initial data."}
           </div>
         </div>
       </div>
       <Link {...ui.props("demo-login-95", {"className": "btn-start", "actionLabel": "🏠 Go to Landing Page", "to": "/index.html"})}>
         {"🏠 Go to Landing Page"}
       </Link>
     </div>
   </div>
     <PageExtras />
   </main>
  </>;
}
