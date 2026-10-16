import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageRegion } from '../runtime/PageElements.jsx';

export default function ProgramsPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/programs.html">
   <section {...ui.props("programs-1", {"className": "page-hero donate-hero"})}>
     <h1 {...ui.props("programs-2", {})}>
       {"Active Programs"}
     </h1>
     <p {...ui.props("programs-3", {})}>
       {"Explore ongoing humanitarian programs from our partner NGO network across India."}
     </p>
   </section>
   <section {...ui.props("programs-4", {"className": "orgs-directory-section"})}>
     <div {...ui.props("programs-5", {"className": "orgs-container"})}>
       <div {...ui.props("programs-6", {"className": "card-grid3"})}>
         <PageRegion name="programsGrid" />
       </div>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
