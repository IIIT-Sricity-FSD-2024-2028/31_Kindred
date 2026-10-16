import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';

export default function ProgramSuccessPage() {
  const ui = usePage();
  return <>
   <main {...ui.props("program-success-1", {"data-react-page": "/program-success.html"})}>
     <div {...ui.props("program-success-2", {"className": "success-page fade-in"})}>
       <Link {...ui.props("program-success-3", {"className": "back-link", "actionLabel": "Back to Programs", "to": "/org-admin.html#programs"})}>
         {"← Back to Programs"}
       </Link>
       <div {...ui.props("program-success-4", {"className": "success-card"})}>
         <div {...ui.props("program-success-5", {"className": "success-icon"})}>
           {"✓"}
         </div>
         <h2 {...ui.props("program-success-6", {"className": "success-title"})}>
           {"Program Created!"}
         </h2>
         <p {...ui.props("program-success-7", {"className": "success-sub"})}>
           <strong {...ui.props("programNameDisplay", {"id": "programNameDisplay"})}>
             {ui.content("programNameDisplay", <>
             {"Your program"}
             </>)}
           </strong>
           {" has been successfully added to your programs list and is now active."}
         </p>
         <div {...ui.props("program-success-9", {"className": "next-steps"})}>
           <div {...ui.props("program-success-10", {"className": "next-steps-title"})}>
             {"Next Steps"}
           </div>
           <div {...ui.props("program-success-11", {"className": "next-step"})}>
             <div {...ui.props("program-success-12", {"className": "step-num"})}>
               {"1"}
             </div>
             <div {...ui.props("program-success-13", {"className": "step-text"})}>
               {"Invite volunteers and wait for their acceptance"}
             </div>
           </div>
           <div {...ui.props("program-success-14", {"className": "next-step"})}>
             <div {...ui.props("program-success-15", {"className": "step-num"})}>
               {"2"}
             </div>
             <div {...ui.props("program-success-16", {"className": "step-text"})}>
               {"Allocate resources as needed"}
             </div>
           </div>
           <div {...ui.props("program-success-17", {"className": "next-step"})}>
             <div {...ui.props("program-success-18", {"className": "step-num"})}>
               {"3"}
             </div>
             <div {...ui.props("program-success-19", {"className": "step-text"})}>
               {"Track progress in the Programs tab"}
             </div>
           </div>
         </div>
         <Link {...ui.props("program-success-20", {"className": "btn btn-primary btn-full btn-lg", "actionLabel": "View Programs", "to": "/org-admin.html#programs"})}>
           {"View Programs"}
         </Link>
       </div>
     </div>
     <PageExtras />
   </main>
  </>;
}
