import { layoutDefinitions } from './layoutDefinitions.js';
import Navbar from '../components/navigation/Navbar.jsx';
import Footer from '../components/navigation/Footer.jsx';
import NotificationDock from '../components/notifications/NotificationDock.jsx';
import { cloneElement, useLayoutEffect, useState } from 'react';
import interactionStyles from '../pages/runtime/interactionStyles.json';
import { activateRouteStyles } from '../routes/routeStyles.js';

function LoadedLayout({ route, layout, children }) {
  const [failed, setFailed] = useState(false);
  const stylesKey = JSON.stringify(layout.styles);
  useLayoutEffect(() => {
    let current = true;
    activateRouteStyles(JSON.parse(stylesKey)).then((hasFailed) => {
      if (current) setFailed(hasFailed);
    });
    return () => { current = false; };
  }, [stylesKey]);
  const footer = <Footer variant={layout.footer} includeShop={layout.footerShop} />;
  const insideMain = route.path === '/org-admin-overview.html';
  return (
    <>
      <div data-layout-frame="" data-route={route.path} className={route.path === '/contact-success.html' ? 'bg-gradient-blue' : ['/donate.html','/organizations.html','/organization-details.html','/programs.html','/register-ngo.html'].includes(route.path) ? 'bg-light-grey' : undefined}>
      {failed && <p role="alert">Some page styles could not load. <button type="button" onClick={() => window.location.reload()}>Reload</button></p>}
      <Navbar key={`navbar:${route.path}`} showShop={layout.showShop} variant={route.path === '/incoming.html' ? 'organization' : 'standard'} />
      {insideMain ? cloneElement(children, { footer }) : children}
      {!insideMain && footer}
      {layout.notifications && <NotificationDock key={`notifications:${route.path}`} />}
      </div>
    </>
  );
}
export default function SiteLayout({ route, children }) {
  const original = layoutDefinitions[route.path] || layoutDefinitions['/index.html'];
  const layout = interactionStyles[route.path] ? { ...original, styles: [...original.styles, interactionStyles[route.path]] } : original;
  return <LoadedLayout key={route.path} route={route} layout={layout}>{children}</LoadedLayout>;
}
