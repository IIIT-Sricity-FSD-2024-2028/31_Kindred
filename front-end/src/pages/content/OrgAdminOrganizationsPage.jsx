import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageTabs } from '../runtime/PageElements.jsx';

export default function OrgAdminOrganizationsPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("org-admin-organizations-1", {"className": "main-content", "data-react-page": "/org-admin-organizations.html"})}>
     <div {...ui.props("org-admin-organizations-2", {"className": "page-header"})}>
       <h1 {...ui.props("org-admin-organizations-3", {"className": "page-title"})}>
         {"Donor Dashboard"}
       </h1>
       <p {...ui.props("org-admin-organizations-4", {"className": "page-subtitle"})}>
         {"Track your donations and see your impact"}
       </p>
     </div>
     <PageTabs />
     <div {...ui.props("stats-grid", {"className": "stats-grid", "id": "stats-grid"})}>
       {ui.content("stats-grid", <>
       <div {...ui.props("stat-total-donated", {"className": "stat-card", "id": "stat-total-donated"})}>
         {ui.content("stat-total-donated", <>
         <div {...ui.props("org-admin-organizations-7", {"className": "stat-icon rupee"})}>
           {"₹"}
         </div>
         <div {...ui.props("org-admin-organizations-8", {"className": "stat-value"})}>
           {"₹94,300"}
         </div>
         <div {...ui.props("org-admin-organizations-9", {"className": "stat-label"})}>
           {"Total Donated"}
         </div>
         </>)}
       </div>
       <div {...ui.props("stat-orgs-supported", {"className": "stat-card", "id": "stat-orgs-supported"})}>
         {ui.content("stat-orgs-supported", <>
         <div {...ui.props("org-admin-organizations-11", {"className": "stat-icon org"})}>
           {"🏛"}
         </div>
         <div {...ui.props("org-admin-organizations-12", {"className": "stat-value"})}>
           {"4"}
         </div>
         <div {...ui.props("org-admin-organizations-13", {"className": "stat-label"})}>
           {"Organizations Supported"}
         </div>
         </>)}
       </div>
       <div {...ui.props("stat-people-impacted", {"className": "stat-card", "id": "stat-people-impacted"})}>
         {ui.content("stat-people-impacted", <>
         <div {...ui.props("org-admin-organizations-15", {"className": "stat-icon people"})}>
           {"👥"}
         </div>
         <div {...ui.props("org-admin-organizations-16", {"className": "stat-value"})}>
           {"1,453"}
         </div>
         <div {...ui.props("org-admin-organizations-17", {"className": "stat-label"})}>
           {"People Impacted"}
         </div>
         </>)}
       </div>
       <div {...ui.props("stat-impact-score", {"className": "stat-card", "id": "stat-impact-score"})}>
         {ui.content("stat-impact-score", <>
         <div {...ui.props("org-admin-organizations-19", {"className": "stat-icon impact"})}>
           {"📈"}
         </div>
         <div {...ui.props("org-admin-organizations-20", {"className": "stat-value"})}>
           {"92%"}
         </div>
         <div {...ui.props("org-admin-organizations-21", {"className": "stat-label"})}>
           {"Impact Score"}
         </div>
         </>)}
       </div>
       </>)}
     </div>
     <h2 {...ui.props("org-admin-organizations-22", {"className": "section-header"})}>
       {"Choose an Organization to Support"}
     </h2>
     <div {...ui.props("org-grid", {"className": "org-grid", "id": "org-grid"})}>
       {ui.content("org-grid", <>
       <div {...ui.props("org-hope", {"className": "org-card", "id": "org-hope", "data-org": "hope"})}>
         {ui.content("org-hope", <>
         <div {...ui.props("org-admin-organizations-25", {"className": "org-card-header"})}>
           <div {...ui.props("org-admin-organizations-26", {"className": "org-avatar hope"})}>
             {"H"}
           </div>
           <div {...ui.props("org-admin-organizations-27", {})}>
             <div {...ui.props("org-admin-organizations-28", {"className": "org-name"})}>
               {"HopeConnect"}
             </div>
             <div {...ui.props("org-admin-organizations-29", {"className": "org-category"})}>
               {"Disaster Relief"}
             </div>
           </div>
         </div>
         <div {...ui.props("org-admin-organizations-30", {"className": "org-stats"})}>
           <span {...ui.props("org-admin-organizations-31", {})}>
             {"Raised: ₹1.9 Cr"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-32", {})}>
             {"15,400 beneficiaries"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-33", {})}>
             <span {...ui.props("org-admin-organizations-34", {"className": "star"})}>
               {Number(ui.state.hoverRating || ui.values.ratingValue) >= 0 ? "★" : "☆"}
             </span>
             {" 4.8 Rating"}
           </span>
         </div>
         <div {...ui.props("org-admin-organizations-35", {"className": "org-actions"})}>
           <Link {...ui.props("org-admin-organizations-36", {"className": "btn btn-outline btn-full btn-sm", "actionLabel": "View Details", "to": "/organization-details.html?id=org_001"})}>
             {"View Details"}
           </Link>
         </div>
         </>)}
       </div>
       <div {...ui.props("org-edu", {"className": "org-card", "id": "org-edu", "data-org": "edu"})}>
         {ui.content("org-edu", <>
         <div {...ui.props("org-admin-organizations-38", {"className": "org-card-header"})}>
           <div {...ui.props("org-admin-organizations-39", {"className": "org-avatar edu"})}>
             {"E"}
           </div>
           <div {...ui.props("org-admin-organizations-40", {})}>
             <div {...ui.props("org-admin-organizations-41", {"className": "org-name"})}>
               {"EduBridge"}
             </div>
             <div {...ui.props("org-admin-organizations-42", {"className": "org-category"})}>
               {"Education"}
             </div>
           </div>
         </div>
         <div {...ui.props("org-admin-organizations-43", {"className": "org-stats"})}>
           <span {...ui.props("org-admin-organizations-44", {})}>
             {"Raised: ₹4.2 Cr"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-45", {})}>
             {"32,000 students"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-46", {})}>
             <span {...ui.props("org-admin-organizations-47", {"className": "star"})}>
               {Number(ui.state.hoverRating || ui.values.ratingValue) >= 0 ? "★" : "☆"}
             </span>
             {" 4.9 Rating"}
           </span>
         </div>
         <div {...ui.props("org-admin-organizations-48", {"className": "org-actions"})}>
           <Link {...ui.props("org-admin-organizations-49", {"className": "btn btn-outline btn-full btn-sm", "actionLabel": "View Details", "to": "/organization-details.html?id=org_002"})}>
             {"View Details"}
           </Link>
         </div>
         </>)}
       </div>
       <div {...ui.props("org-green", {"className": "org-card", "id": "org-green", "data-org": "green"})}>
         {ui.content("org-green", <>
         <div {...ui.props("org-admin-organizations-51", {"className": "org-card-header"})}>
           <div {...ui.props("org-admin-organizations-52", {"className": "org-avatar green"})}>
             {"G"}
           </div>
           <div {...ui.props("org-admin-organizations-53", {})}>
             <div {...ui.props("org-admin-organizations-54", {"className": "org-name"})}>
               {"GreenEarth Initiative"}
             </div>
             <div {...ui.props("org-admin-organizations-55", {"className": "org-category"})}>
               {"Environment"}
             </div>
           </div>
         </div>
         <div {...ui.props("org-admin-organizations-56", {"className": "org-stats"})}>
           <span {...ui.props("org-admin-organizations-57", {})}>
             {"Raised: ₹1.5 Cr"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-58", {})}>
             {"120 communities"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-59", {})}>
             <span {...ui.props("org-admin-organizations-60", {"className": "star"})}>
               {Number(ui.state.hoverRating || ui.values.ratingValue) >= 0 ? "★" : "☆"}
             </span>
             {" 4.6 Rating"}
           </span>
         </div>
         <div {...ui.props("org-admin-organizations-61", {"className": "org-actions"})}>
           <Link {...ui.props("org-admin-organizations-62", {"className": "btn btn-outline btn-full btn-sm", "actionLabel": "View Details", "to": "/organization-details.html?id=org_003"})}>
             {"View Details"}
           </Link>
         </div>
         </>)}
       </div>
       <div {...ui.props("org-med", {"className": "org-card", "id": "org-med", "data-org": "med"})}>
         {ui.content("org-med", <>
         <div {...ui.props("org-admin-organizations-64", {"className": "org-card-header"})}>
           <div {...ui.props("org-admin-organizations-65", {"className": "org-avatar med"})}>
             {"M"}
           </div>
           <div {...ui.props("org-admin-organizations-66", {})}>
             <div {...ui.props("org-admin-organizations-67", {"className": "org-name"})}>
               {"MedReach"}
             </div>
             <div {...ui.props("org-admin-organizations-68", {"className": "org-category"})}>
               {"Healthcare"}
             </div>
           </div>
         </div>
         <div {...ui.props("org-admin-organizations-69", {"className": "org-stats"})}>
           <span {...ui.props("org-admin-organizations-70", {})}>
             {"Raised: ₹2.6 Cr"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-71", {})}>
             {"6,800 patients"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-72", {})}>
             <span {...ui.props("org-admin-organizations-73", {"className": "star"})}>
               {Number(ui.state.hoverRating || ui.values.ratingValue) >= 0 ? "★" : "☆"}
             </span>
             {" 4.5 Rating"}
           </span>
         </div>
         <div {...ui.props("org-admin-organizations-74", {"className": "org-actions"})}>
           <Link {...ui.props("org-admin-organizations-75", {"className": "btn btn-outline btn-full btn-sm", "actionLabel": "View Details", "to": "/organization-details.html?id=org_004"})}>
             {"View Details"}
           </Link>
         </div>
         </>)}
       </div>
       <div {...ui.props("org-trust", {"className": "org-card", "id": "org-trust", "data-org": "trust"})}>
         {ui.content("org-trust", <>
         <div {...ui.props("org-admin-organizations-77", {"className": "org-card-header"})}>
           <div {...ui.props("org-admin-organizations-78", {"className": "org-avatar trust"})}>
             {"M"}
           </div>
           <div {...ui.props("org-admin-organizations-79", {})}>
             <div {...ui.props("org-admin-organizations-80", {"className": "org-name"})}>
               {"MyTrust Foundation"}
             </div>
             <div {...ui.props("org-admin-organizations-81", {"className": "org-category"})}>
               {"Community Development"}
             </div>
           </div>
         </div>
         <div {...ui.props("org-admin-organizations-82", {"className": "org-stats"})}>
           <span {...ui.props("org-admin-organizations-83", {})}>
             {"Raised: ₹2.3 Cr"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-84", {})}>
             {"18,200 families"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-85", {})}>
             <span {...ui.props("org-admin-organizations-86", {"className": "star"})}>
               {Number(ui.state.hoverRating || ui.values.ratingValue) >= 0 ? "★" : "☆"}
             </span>
             {" 4.7 Rating"}
           </span>
         </div>
         <div {...ui.props("org-admin-organizations-87", {"className": "org-actions"})}>
           <Link {...ui.props("org-admin-organizations-88", {"className": "btn btn-outline btn-full btn-sm", "actionLabel": "View Details", "to": "/organization-details.html?id=org_005"})}>
             {"View Details"}
           </Link>
         </div>
         </>)}
       </div>
       <div {...ui.props("org-food", {"className": "org-card", "id": "org-food", "data-org": "food"})}>
         {ui.content("org-food", <>
         <div {...ui.props("org-admin-organizations-90", {"className": "org-card-header"})}>
           <div {...ui.props("org-admin-organizations-91", {"className": "org-avatar food"})}>
             {"F"}
           </div>
           <div {...ui.props("org-admin-organizations-92", {})}>
             <div {...ui.props("org-admin-organizations-93", {"className": "org-name"})}>
               {"FoodFirst Alliance"}
             </div>
             <div {...ui.props("org-admin-organizations-94", {"className": "org-category"})}>
               {"Food Security"}
             </div>
           </div>
         </div>
         <div {...ui.props("org-admin-organizations-95", {"className": "org-stats"})}>
           <span {...ui.props("org-admin-organizations-96", {})}>
             {"Raised: ₹1.8 Cr"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-97", {})}>
             {"22,000 meals/month"}
           </span>
           {" "}
           <span {...ui.props("org-admin-organizations-98", {})}>
             <span {...ui.props("org-admin-organizations-99", {"className": "star"})}>
               {Number(ui.state.hoverRating || ui.values.ratingValue) >= 0 ? "★" : "☆"}
             </span>
             {" 4.6 Rating"}
           </span>
         </div>
         <div {...ui.props("org-admin-organizations-100", {"className": "org-actions"})}>
           <Link {...ui.props("org-admin-organizations-101", {"className": "btn btn-outline btn-full btn-sm", "actionLabel": "View Details", "to": "/organization-details.html?id=org_006"})}>
             {"View Details"}
           </Link>
         </div>
         </>)}
       </div>
       </>)}
     </div>
     <PageExtras />
   </main>
  </>;
}
