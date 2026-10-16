import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageRegion } from '../runtime/PageElements.jsx';

export default function OrganizationsPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/organizations.html">
   <section {...ui.props("organizations-1", {"className": "page-hero donate-hero"})}>
     <h1 {...ui.props("organizations-2", {})}>
       {"Partner Organizations"}
     </h1>
     <p {...ui.props("organizations-3", {})}>
       {"Explore our network of verified NGOs working across India to create lasting humanitarian impact."}
     </p>
   </section>
   <section {...ui.props("organizations-4", {"className": "orgs-directory-section"})}>
     <div {...ui.props("organizations-5", {"className": "orgs-container"})}>
       <div {...ui.props("organizations-6", {"className": "card-grid3"})}>
         <PageRegion name="organizationsGrid" />
       </div>
     </div>
   </section>
     <PageExtras />
   </main>
  </>;
}
