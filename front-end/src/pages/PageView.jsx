import { PageContext } from './runtime/PageContext.js';
import usePageModel from './runtime/usePageModel.js';
import { pageComponents } from './pageComponents.js';
import { useLayoutEffect } from 'react';

export default function PageView({ route, footer }) {
  const ui = usePageModel(route);
  const { pathname, search } = ui.location;
  useLayoutEffect(() => { window.scrollTo(0,0); }, [pathname,search]);
  const Component = pageComponents[route.path];
  return <PageContext.Provider value={ui}><Component footer={footer} /></PageContext.Provider>;
}
