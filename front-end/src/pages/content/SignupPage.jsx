import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

export default function SignupPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("signup-1", {"data-react-page": "/signup.html"})}>
     <div {...ui.props("signup-2", {"className": "page-wrap"})}>
       <img {...ui.props("signup-3", {"src": "LOGO.jpeg", "className": "logo-pill-img", "alt": "Kindred Logo"})} />
       <h1 {...ui.props("signup-4", {"className": "screen-title"})}>
         {"Join Kindred"}
       </h1>
       <div {...ui.props("signup-5", {"className": "card", "style": {"padding": "32px"}})}>
         <p {...ui.props("signup-6", {"className": "role-label"})}>
           {"I want to sign up as"}
         </p>
         <div {...ui.props("signup-7", {"className": "role-grid", "style": {"gridTemplateColumns": "repeat(auto-fit, minmax(130px, 1fr))"}})}>
           <button {...ui.props("signup-8", {"className": "role-btn active", "data-role": "org", "type": "button", "actionLabel": "Organization"}, {"click": {"name": "selectRole", "args": ["org"]}})}>
             <svg {...ui.props("signup-9", {"width": "22", "height": "22", "fill": "none", "stroke": "#3b82f6", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
               <rect {...ui.props("signup-10", {"x": "3", "y": "3", "width": "7", "height": "7"})}>
               </rect>
               <rect {...ui.props("signup-11", {"x": "14", "y": "3", "width": "7", "height": "7"})}>
               </rect>
               <rect {...ui.props("signup-12", {"x": "3", "y": "14", "width": "7", "height": "7"})}>
               </rect>
               <rect {...ui.props("signup-13", {"x": "14", "y": "14", "width": "7", "height": "7"})}>
               </rect>
             </svg>
             {" Organization "}
           </button>
           <button {...ui.props("signup-14", {"className": "role-btn", "data-role": "volunteer", "type": "button", "actionLabel": "Volunteer"}, {"click": {"name": "selectRole", "args": ["volunteer"]}})}>
             <svg {...ui.props("signup-15", {"width": "22", "height": "22", "fill": "none", "stroke": "#10b981", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
               <path {...ui.props("signup-16", {"d": "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"})}>
               </path>
               <circle {...ui.props("signup-17", {"cx": "9", "cy": "7", "r": "4"})}>
               </circle>
             </svg>
             {" Volunteer "}
           </button>
           <button {...ui.props("signup-18", {"className": "role-btn", "data-role": "donor", "type": "button", "actionLabel": "Donor"}, {"click": {"name": "selectRole", "args": ["donor"]}})}>
             <svg {...ui.props("signup-19", {"width": "22", "height": "22", "fill": "none", "stroke": "#f59e0b", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
               <path {...ui.props("signup-20", {"d": "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"})}>
               </path>
             </svg>
             {" Donor "}
           </button>
           <button {...ui.props("signup-21", {"className": "role-btn", "data-role": "beneficiary", "type": "button", "actionLabel": "Beneficiary"}, {"click": {"name": "selectRole", "args": ["beneficiary"]}})}>
             <svg {...ui.props("signup-22", {"width": "22", "height": "22", "fill": "none", "stroke": "#8b5cf6", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
               <path {...ui.props("signup-23", {"d": "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"})}>
               </path>
               <circle {...ui.props("signup-24", {"cx": "9", "cy": "7", "r": "4"})}>
               </circle>
               <path {...ui.props("signup-25", {"d": "M23 21v-2a4 4 0 0 0-3-3.87"})}>
               </path>
               <path {...ui.props("signup-26", {"d": "M16 3.13a4 4 0 0 1 0 7.75"})}>
               </path>
             </svg>
             {" Beneficiary "}
           </button>
           <button {...ui.props("signup-27", {"className": "role-btn", "data-role": "seller", "type": "button", "actionLabel": "Seller / Artisan"}, {"click": {"name": "selectRole", "args": ["seller"]}})}>
             <svg {...ui.props("signup-28", {"width": "22", "height": "22", "fill": "none", "stroke": "#14b8a6", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
               <path {...ui.props("signup-29", {"d": "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"})}>
               </path>
               <line {...ui.props("signup-30", {"x1": "3", "y1": "6", "x2": "21", "y2": "6"})}>
               </line>
               <path {...ui.props("signup-31", {"d": "M16 10a4 4 0 0 1-8 0"})}>
               </path>
             </svg>
             {" Seller / Artisan "}
           </button>
         </div>
         <section className="security-questions" aria-label="Account recovery questions">
           <h2 style={{ fontSize: '1rem', margin: '0 0 6px' }}>Account recovery questions</h2>
           <p style={{ fontSize: '.82rem', color: '#64748b', margin: '0 0 14px' }}>These answers let you reset your password if you lose access. Answers are not case sensitive.</p>
           <label htmlFor="security-question-1">Security question 1 *</label>
           <PageField as="select" field="security-question-1" spec={{ id: 'security-question-1', className: 'security-question-control', 'aria-label': 'Security question 1' }}>
             <option value="">Choose a question</option><option value="first_school">What was the name of your first school?</option><option value="childhood_friend">What was the first name of your childhood best friend?</option><option value="first_pet">What was the name of your first pet?</option><option value="birth_city">In what city were you born?</option>
           </PageField>
           <PageField as="input" field="security-answer-1" spec={{ type: 'text', className: 'security-answer-control', autoComplete: 'off', placeholder: 'Your answer', 'aria-label': 'Answer to security question 1' }} />
           <label htmlFor="security-question-2" style={{ display: 'block', marginTop: '12px' }}>Security question 2 *</label>
           <PageField as="select" field="security-question-2" spec={{ id: 'security-question-2', className: 'security-question-control', 'aria-label': 'Security question 2' }}>
             <option value="">Choose a different question</option><option value="first_school">What was the name of your first school?</option><option value="childhood_friend">What was the first name of your childhood best friend?</option><option value="first_pet">What was the name of your first pet?</option><option value="birth_city">In what city were you born?</option>
           </PageField>
           <PageField as="input" field="security-answer-2" spec={{ type: 'text', className: 'security-answer-control', autoComplete: 'off', placeholder: 'Your answer', 'aria-label': 'Answer to security question 2' }} />
         </section>
         <form {...ui.props("form-org", {"id": "form-org", "pageForm": true})}>
           {ui.content("form-org", <>
           <div {...ui.props("signup-33", {"className": "section-label"})}>
             {"Register your NGO on Kindred"}
           </div>
           <div {...ui.props("signup-34", {"className": "field"})}>
             <label {...ui.props("signup-35", {})}>
               {"NGO Name *"}
             </label>
             <PageField as="input" field="org-name" spec={{"type": "text", "id": "org-name", "placeholder": "e.g. Helping Hands Foundation"}} />
           </div>
           <div {...ui.props("signup-37", {"className": "field-row"})}>
             <div {...ui.props("signup-38", {"className": "field mb-0"})}>
               <label {...ui.props("signup-39", {})}>
                 {"Focus Area *"}
               </label>
               <PageField as="input" field="org-focus" spec={{"type": "text", "id": "org-focus", "placeholder": "e.g. Education"}} />
             </div>
             <div {...ui.props("signup-41", {"className": "field mb-0"})}>
               <label {...ui.props("signup-42", {})}>
                 {"Location *"}
               </label>
               <PageField as="input" field="org-loc" spec={{"type": "text", "id": "org-loc", "placeholder": "e.g. Mumbai"}} />
             </div>
           </div>
           <div {...ui.props("signup-44", {"className": "field", "style": {"marginTop": "18px"}})}>
             <label {...ui.props("signup-45", {})}>
               {"Organization Phone *"}
             </label>
             <PageField as="input" field="org-phone" spec={{"type": "tel", "id": "org-phone", "placeholder": "e.g. +91 98765 43210"}} />
           </div>
           <div {...ui.props("signup-47", {"className": "field", "style": {"marginTop": "18px"}})}>
             <label {...ui.props("signup-48", {})}>
               {"NGO Description"}
             </label>
             <PageField as="textarea" field="org-desc" spec={{"rows": "3", "id": "org-desc", "placeholder": "Brief description of your organization…", "style": {"resize": "vertical"}}}>
             </PageField>
           </div>
           <div {...ui.props("signup-50", {"className": "field", "style": {"marginTop": "16px"}})}>
             <label {...ui.props("signup-51", {})}>
               {"Government Registration Certificate / 12A / 80G *"}
             </label>
             <div {...ui.props("certDropZone", {"className": "cert-upload-zone", "id": "certDropZone", "actionLabel": "Drag & Drop Govt Certificate or Browse\n              Supports PDF, PNG, JPG (Max 5MB)\n            \n            \n              📄\n              \n                document.pdf\n                1.2 MB\n              \n              Remove"}, {"click": {"name": "chooseFile", "args": ["org-cert-file"]}})}>
               {ui.content("certDropZone", <>
               <PageField as="input" field="org-cert-file" spec={{"type": "file", "id": "org-cert-file", "accept": ".pdf,.png,.jpg,.jpeg", "style": {"display": "none"}}} />
               <div {...ui.props("certUploadPrompt", {"id": "certUploadPrompt"})}>
                 {ui.content("certUploadPrompt", <>
                 <svg {...ui.props("signup-55", {"width": "32", "height": "32", "fill": "none", "stroke": "#6366f1", "strokeWidth": "2", "viewBox": "0 0 24 24", "style": {"marginBottom": "8px"}})}>
                   <path {...ui.props("signup-56", {"d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"})}>
                   </path>
                   <polyline {...ui.props("signup-57", {"points": "17 8 12 3 7 8"})}>
                   </polyline>
                   <line {...ui.props("signup-58", {"x1": "12", "y1": "3", "x2": "12", "y2": "15"})}>
                   </line>
                 </svg>
                 <div {...ui.props("signup-59", {"style": {"fontWeight": "600", "fontSize": ".88rem", "color": "#1e293b"}})}>
                   {"Drag & Drop Govt Certificate or "}
                   <span {...ui.props("signup-60", {"style": {"color": "#6366f1", "textDecoration": "underline"}})}>
                     {"Browse"}
                   </span>
                 </div>
                 <div {...ui.props("signup-61", {"style": {"fontSize": ".75rem", "color": "#94a3b8", "marginTop": "4px"}})}>
                   {"Supports PDF, PNG, JPG (Max 5MB)"}
                 </div>
                 </>)}
               </div>
               <div {...ui.props("certFilePreview", {"id": "certFilePreview", "style": {"display": "none", "alignItems": "center", "gap": "12px", "justifyContent": "center"}})}>
                 {ui.content("certFilePreview", <>
                 <span {...ui.props("signup-63", {"style": {"fontSize": "1.5rem"}})}>
                   {"📄"}
                 </span>
                 <div {...ui.props("signup-64", {"style": {"textAlign": "left"}})}>
                   <div {...ui.props("certFileName", {"id": "certFileName", "style": {"fontWeight": "600", "fontSize": ".85rem", "color": "#1e293b"}})}>
                     {ui.content("certFileName", <>
                     {"document.pdf"}
                     </>)}
                   </div>
                   <div {...ui.props("certFileSize", {"id": "certFileSize", "style": {"fontSize": ".75rem", "color": "#64748b"}})}>
                     {ui.content("certFileSize", <>
                     {"1.2 MB"}
                     </>)}
                   </div>
                 </div>
                 <button {...ui.props("signup-67", {"type": "button", "style": {"background": "#fee2e2", "color": "#ef4444", "border": "none", "borderRadius": "6px", "padding": "4px 8px", "fontSize": ".75rem", "cursor": "pointer", "fontWeight": "600"}, "actionLabel": "Remove"}, {"click": {"name": "removeCert", "args": []}})}>
                   {"Remove"}
                 </button>
                 </>)}
               </div>
               </>)}
             </div>
           </div>
           <div {...ui.props("signup-68", {"className": "field", "style": {"marginTop": "16px"}})}>
             <label {...ui.props("signup-69", {})}>
               {"Admin Full Name *"}
             </label>
             <PageField as="input" field="org-admin" spec={{"type": "text", "id": "org-admin", "placeholder": "Full name"}} />
           </div>
           <div {...ui.props("signup-71", {"className": "field"})}>
             <label {...ui.props("signup-72", {})}>
               {"Email *"}
             </label>
             <PageField as="input" field="org-email" spec={{"type": "email", "id": "org-email", "placeholder": "admin@ngo.org"}} />
           </div>
           <div {...ui.props("signup-74", {"className": "field pass-wrap"})}>
             <label {...ui.props("signup-75", {})}>
               {"Password *"}
             </label>
             <PageField as="input" field="org-pass" spec={{"type": "password", "id": "org-pass", "placeholder": "••••••••"}} />
             <button {...ui.props("signup-77", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["org-pass"]}})}>
               <svg {...ui.props("signup-78", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signup-79", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
                 </path>
                 <circle {...ui.props("signup-80", {"cx": "12", "cy": "12", "r": "3"})}>
                 </circle>
               </svg>
             </button>
           </div>
           <div {...ui.props("signup-81", {"className": "field pass-wrap"})}>
             <label {...ui.props("signup-82", {})}>
               {"Confirm Password *"}
             </label>
             <PageField as="input" field="org-pass2" spec={{"type": "password", "id": "org-pass2", "placeholder": "••••••••"}} />
             <button {...ui.props("signup-84", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["org-pass2"]}})}>
               <svg {...ui.props("signup-85", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signup-86", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
                 </path>
                 <circle {...ui.props("signup-87", {"cx": "12", "cy": "12", "r": "3"})}>
                 </circle>
               </svg>
             </button>
           </div>
           <button {...ui.props("signup-88", {"className": "btn btn-primary", "type": "button", "actionLabel": "Register NGO →"}, {"click": {"name": "submitOrg", "args": []}})}>
             {"Register NGO →"}
           </button>
           </>)}
         </form>
         <form {...ui.props("form-volunteer", {"id": "form-volunteer", "style": {"display": "none"}, "pageForm": true})}>
           {ui.content("form-volunteer", <>
           <div {...ui.props("signup-90", {"className": "field"})}>
             <label {...ui.props("signup-91", {})}>
               {"Full Name *"}
             </label>
             <PageField as="input" field="vol-name" spec={{"type": "text", "id": "vol-name", "placeholder": "Your full name"}} />
           </div>
           <div {...ui.props("signup-93", {"className": "field"})}>
             <label {...ui.props("signup-94", {})}>
               {"Email *"}
             </label>
             <PageField as="input" field="vol-email" spec={{"type": "email", "id": "vol-email", "placeholder": "you@email.com"}} />
           </div>
           <div {...ui.props("signup-96", {"className": "field"})}>
             <label {...ui.props("signup-97", {})}>
               {"Phone Number *"}
             </label>
             <div {...ui.props("signup-98", {"className": "phone-wrap"})}>
               <span {...ui.props("signup-99", {"className": "phone-prefix"})}>
                 {"+91"}
               </span>
               <PageField as="input" field="vol-phone" spec={{"type": "tel", "id": "vol-phone", "placeholder": "98765 43210"}} />
             </div>
             <p {...ui.props("signup-101", {"className": "hint"})}>
               {"Required for OTP verification"}
             </p>
           </div>
           <div {...ui.props("signup-102", {"className": "field"})}>
             <label {...ui.props("signup-103", {})}>
               {"Gender *"}
             </label>
             <div {...ui.props("signup-104", {"className": "gender-grid"})}>
               <button {...ui.props("signup-105", {"className": "gender-btn", "type": "button", "actionLabel": "👨 Male"}, {"click": {"name": "selectGender", "args": []}})}>
                 {"👨 Male"}
               </button>
               <button {...ui.props("signup-106", {"className": "gender-btn", "type": "button", "actionLabel": "👩 Female"}, {"click": {"name": "selectGender", "args": []}})}>
                 {"👩 Female"}
               </button>
               <button {...ui.props("signup-107", {"className": "gender-btn", "type": "button", "actionLabel": "🧑 Other"}, {"click": {"name": "selectGender", "args": []}})}>
                 {"🧑 Other"}
               </button>
             </div>
             <p {...ui.props("signup-108", {"className": "hint"})}>
               {"Please select your gender to continue"}
             </p>
           </div>
           <div {...ui.props("signup-109", {"className": "field pass-wrap"})}>
             <label {...ui.props("signup-110", {})}>
               {"Password *"}
             </label>
             <PageField as="input" field="vol-pass" spec={{"type": "password", "id": "vol-pass", "placeholder": "••••••••"}} />
             <button {...ui.props("signup-112", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["vol-pass"]}})}>
               <svg {...ui.props("signup-113", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signup-114", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
                 </path>
                 <circle {...ui.props("signup-115", {"cx": "12", "cy": "12", "r": "3"})}>
                 </circle>
               </svg>
             </button>
           </div>
           <div {...ui.props("signup-116", {"className": "field pass-wrap"})}>
             <label {...ui.props("signup-117", {})}>
               {"Confirm Password *"}
             </label>
             <PageField as="input" field="vol-pass2" spec={{"type": "password", "id": "vol-pass2", "placeholder": "••••••••"}} />
             <button {...ui.props("signup-119", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["vol-pass2"]}})}>
               <svg {...ui.props("signup-120", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signup-121", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
                 </path>
                 <circle {...ui.props("signup-122", {"cx": "12", "cy": "12", "r": "3"})}>
                 </circle>
               </svg>
             </button>
           </div>
           <div {...ui.props("signup-123", {"className": "info-box"})}>
             <svg {...ui.props("signup-124", {"width": "14", "height": "14", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
               <polyline {...ui.props("signup-125", {"points": "20 6 9 17 4 12"})}>
               </polyline>
             </svg>
             <p {...ui.props("signup-126", {})}>
               {"Your volunteer application will be reviewed by the Platform Administrator before access is granted. "}
               <Link {...ui.props("signup-127", {"style": {"color": "#10b981", "fontWeight": "700"}, "actionLabel": "Want to add skills & availability? Use the detailed form →", "to": "/join-volunteer.html"})}>
                 {"Want to add skills & availability? Use the detailed form →"}
               </Link>
             </p>
           </div>
           <button {...ui.props("signup-128", {"className": "btn btn-green-solid", "type": "button", "actionLabel": "Continue to Verification →"}, {"click": {"name": "submitVolunteer", "args": []}})}>
             {"Continue to Verification →"}
           </button>
           </>)}
         </form>
         <form {...ui.props("form-donor", {"id": "form-donor", "style": {"display": "none"}, "pageForm": true})}>
           {ui.content("form-donor", <>
           <div {...ui.props("signup-130", {"className": "field"})}>
             <label {...ui.props("signup-131", {})}>
               {"Full Name *"}
             </label>
             <PageField as="input" field="don-name" spec={{"type": "text", "id": "don-name", "placeholder": "Your full name"}} />
           </div>
           <div {...ui.props("signup-133", {"className": "field"})}>
             <label {...ui.props("signup-134", {})}>
               {"Email *"}
             </label>
             <PageField as="input" field="don-email" spec={{"type": "email", "id": "don-email", "placeholder": "you@email.com"}} />
           </div>
           <div {...ui.props("signup-136", {"className": "field"})}>
             <label {...ui.props("signup-137", {})}>
               {"Phone Number *"}
             </label>
             <div {...ui.props("signup-138", {"className": "phone-wrap"})}>
               <span {...ui.props("signup-139", {"className": "phone-prefix"})}>
                 {"+91"}
               </span>
               <PageField as="input" field="don-phone" spec={{"type": "tel", "id": "don-phone", "placeholder": "98765 43210"}} />
             </div>
             <p {...ui.props("signup-141", {"className": "hint"})}>
               {"Required for OTP verification"}
             </p>
           </div>
           <div {...ui.props("signup-142", {"className": "field pass-wrap"})}>
             <label {...ui.props("signup-143", {})}>
               {"Password *"}
             </label>
             <PageField as="input" field="don-pass" spec={{"type": "password", "id": "don-pass", "placeholder": "••••••••"}} />
             <button {...ui.props("signup-145", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["don-pass"]}})}>
               <svg {...ui.props("signup-146", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signup-147", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
                 </path>
                 <circle {...ui.props("signup-148", {"cx": "12", "cy": "12", "r": "3"})}>
                 </circle>
               </svg>
             </button>
           </div>
           <div {...ui.props("signup-149", {"className": "field pass-wrap"})}>
             <label {...ui.props("signup-150", {})}>
               {"Confirm Password *"}
             </label>
             <PageField as="input" field="don-pass2" spec={{"type": "password", "id": "don-pass2", "placeholder": "••••••••"}} />
             <button {...ui.props("signup-152", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["don-pass2"]}})}>
               <svg {...ui.props("signup-153", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signup-154", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
                 </path>
                 <circle {...ui.props("signup-155", {"cx": "12", "cy": "12", "r": "3"})}>
                 </circle>
               </svg>
             </button>
           </div>
           <div {...ui.props("signup-156", {"className": "info-box"})}>
             <svg {...ui.props("signup-157", {"width": "14", "height": "14", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
               <polyline {...ui.props("signup-158", {"points": "20 6 9 17 4 12"})}>
               </polyline>
             </svg>
             <p {...ui.props("signup-159", {})}>
               {"After phone verification, you'll go directly to your Donor Dashboard"}
             </p>
           </div>
           <button {...ui.props("signup-160", {"className": "btn btn-green-solid", "type": "button", "actionLabel": "Continue to Verification →"}, {"click": {"name": "submitDonor", "args": []}})}>
             {"Continue to Verification →"}
           </button>
           </>)}
         </form>
         <form {...ui.props("form-beneficiary", {"id": "form-beneficiary", "style": {"display": "none"}, "pageForm": true})}>
           {ui.content("form-beneficiary", <>
           <div {...ui.props("signup-162", {"className": "field"})}>
             <label {...ui.props("signup-163", {})}>
               {"Full Name *"}
             </label>
             <PageField as="input" field="ben-name" spec={{"type": "text", "id": "ben-name", "placeholder": "Your full name"}} />
           </div>
           <div {...ui.props("signup-165", {"className": "field"})}>
             <label {...ui.props("signup-166", {})}>
               {"Email *"}
             </label>
             <PageField as="input" field="ben-email" spec={{"type": "email", "id": "ben-email", "placeholder": "you@email.com"}} />
           </div>
           <div {...ui.props("signup-168", {"className": "field"})}>
             <label {...ui.props("signup-169", {})}>
               {"Phone Number *"}
             </label>
             <div {...ui.props("signup-170", {"className": "phone-wrap"})}>
               <span {...ui.props("signup-171", {"className": "phone-prefix"})}>
                 {"+91"}
               </span>
               <PageField as="input" field="ben-phone" spec={{"type": "tel", "id": "ben-phone", "placeholder": "98765 43210"}} />
             </div>
             <p {...ui.props("signup-173", {"className": "hint"})}>
               {"Required for OTP verification"}
             </p>
           </div>
           <div {...ui.props("signup-174", {"className": "field pass-wrap"})}>
             <label {...ui.props("signup-175", {})}>
               {"Password *"}
             </label>
             <PageField as="input" field="ben-pass" spec={{"type": "password", "id": "ben-pass", "placeholder": "••••••••"}} />
             <button {...ui.props("signup-177", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["ben-pass"]}})}>
               <svg {...ui.props("signup-178", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signup-179", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
                 </path>
                 <circle {...ui.props("signup-180", {"cx": "12", "cy": "12", "r": "3"})}>
                 </circle>
               </svg>
             </button>
           </div>
           <div {...ui.props("signup-181", {"className": "field pass-wrap"})}>
             <label {...ui.props("signup-182", {})}>
               {"Confirm Password *"}
             </label>
             <PageField as="input" field="ben-pass2" spec={{"type": "password", "id": "ben-pass2", "placeholder": "••••••••"}} />
             <button {...ui.props("signup-184", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["ben-pass2"]}})}>
               <svg {...ui.props("signup-185", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signup-186", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
                 </path>
                 <circle {...ui.props("signup-187", {"cx": "12", "cy": "12", "r": "3"})}>
                 </circle>
               </svg>
             </button>
           </div>
           <div {...ui.props("signup-188", {"className": "info-box"})}>
             <svg {...ui.props("signup-189", {"width": "14", "height": "14", "fill": "none", "stroke": "currentColor", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
               <polyline {...ui.props("signup-190", {"points": "20 6 9 17 4 12"})}>
               </polyline>
             </svg>
             <p {...ui.props("signup-191", {})}>
               {"After phone verification, you'll go directly to your Beneficiary Dashboard"}
             </p>
           </div>
           <button {...ui.props("signup-192", {"className": "btn btn-green-solid", "type": "button", "actionLabel": "Continue to Verification →"}, {"click": {"name": "submitBeneficiary", "args": []}})}>
             {"Continue to Verification →"}
           </button>
           </>)}
         </form>
         <form {...ui.props("form-seller", {"id": "form-seller", "style": {"display": "none"}, "pageForm": true})}>
           {ui.content("form-seller", <>
           <div {...ui.props("signup-194", {"className": "section-label"})}>
             {"Register as a Seller on Kindred"}
           </div>
           <div {...ui.props("signup-195", {"className": "field"})}>
             <label {...ui.props("signup-196", {})}>
               {"Full Name *"}
             </label>
             <PageField as="input" field="seller-name" spec={{"type": "text", "id": "seller-name", "placeholder": "Your full name"}} />
           </div>
           <div {...ui.props("signup-198", {"className": "field"})}>
             <label {...ui.props("signup-199", {})}>
               {"Business / Shop Name *"}
             </label>
             <PageField as="input" field="seller-business" spec={{"type": "text", "id": "seller-business", "placeholder": "e.g. Handmade Crafts, Artisan Pottery"}} />
           </div>
           <div {...ui.props("signup-201", {"className": "field"})}>
             <label {...ui.props("signup-202", {})}>
               {"Business Description"}
             </label>
             <PageField as="textarea" field="seller-desc" spec={{"rows": "3", "id": "seller-desc", "placeholder": "Brief description of products you make or sell…", "style": {"resize": "vertical"}}}>
             </PageField>
           </div>
           <div {...ui.props("signup-204", {"className": "field"})}>
             <label {...ui.props("signup-205", {})}>
               {"Email *"}
             </label>
             <PageField as="input" field="seller-email" spec={{"type": "email", "id": "seller-email", "placeholder": "you@seller.com"}} />
           </div>
           <div {...ui.props("signup-207", {"className": "field"})}>
             <label {...ui.props("signup-208", {})}>
               {"Phone Number *"}
             </label>
             <div {...ui.props("signup-209", {"className": "phone-wrap"})}>
               <span {...ui.props("signup-210", {"className": "phone-prefix"})}>
                 {"+91"}
               </span>
               <PageField as="input" field="seller-phone" spec={{"type": "tel", "id": "seller-phone", "placeholder": "98765 43210"}} />
             </div>
             <p {...ui.props("signup-212", {"className": "hint"})}>
               {"Required for OTP verification and customer contact"}
             </p>
           </div>
           <div {...ui.props("signup-213", {"className": "field pass-wrap"})}>
             <label {...ui.props("signup-214", {})}>
               {"Password *"}
             </label>
             <PageField as="input" field="seller-pass" spec={{"type": "password", "id": "seller-pass", "placeholder": "••••••••"}} />
             <button {...ui.props("signup-216", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["seller-pass"]}})}>
               <svg {...ui.props("signup-217", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signup-218", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
                 </path>
                 <circle {...ui.props("signup-219", {"cx": "12", "cy": "12", "r": "3"})}>
                 </circle>
               </svg>
             </button>
           </div>
           <div {...ui.props("signup-220", {"className": "field pass-wrap"})}>
             <label {...ui.props("signup-221", {})}>
               {"Confirm Password *"}
             </label>
             <PageField as="input" field="seller-pass2" spec={{"type": "password", "id": "seller-pass2", "placeholder": "••••••••"}} />
             <button {...ui.props("signup-223", {"className": "pass-eye", "type": "button", "actionLabel": ""}, {"click": {"name": "togglePass", "args": ["seller-pass2"]}})}>
               <svg {...ui.props("signup-224", {"width": "18", "height": "18", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "viewBox": "0 0 24 24"})}>
                 <path {...ui.props("signup-225", {"d": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})}>
                 </path>
                 <circle {...ui.props("signup-226", {"cx": "12", "cy": "12", "r": "3"})}>
                 </circle>
               </svg>
             </button>
           </div>
           <div {...ui.props("signup-227", {"className": "info-box", "style": {"background": "#f0fdfa", "borderColor": "#99f6e4"}})}>
             <svg {...ui.props("signup-228", {"width": "14", "height": "14", "fill": "none", "stroke": "#0d9488", "strokeWidth": "2.5", "viewBox": "0 0 24 24"})}>
               <polyline {...ui.props("signup-229", {"points": "20 6 9 17 4 12"})}>
               </polyline>
             </svg>
             <p {...ui.props("signup-230", {"style": {"color": "#115e59"}})}>
               {"Your seller account and product listings will be reviewed and verified by the Platform Administrator before appearing in the public Shop."}
             </p>
           </div>
           <button {...ui.props("signup-231", {"className": "btn btn-primary", "style": {"background": "#0d9488", "borderColor": "#0d9488"}, "type": "button", "actionLabel": "Register as Seller →"}, {"click": {"name": "submitSeller", "args": []}})}>
             {"Register as Seller →"}
           </button>
           </>)}
         </form>
       </div>
       <p {...ui.props("signup-232", {"style": {"marginTop": "16px", "fontSize": ".85rem", "color": "rgba(255,255,255,.75)", "textAlign": "center"}})}>
         {" Already have an account? "}
         <Link {...ui.props("signup-233", {"style": {"color": "#fff", "fontWeight": "700", "textDecoration": "none"}, "actionLabel": "Sign In", "to": "/signin.html"})}>
           {"Sign In"}
         </Link>
       </p>
     </div>
     <PageExtras />
   </main>
  </>;
}
