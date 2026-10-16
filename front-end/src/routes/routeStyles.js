import { layoutDefinitions } from '../layouts/layoutDefinitions.js';
import interactionStyles from '../pages/runtime/interactionStyles.json';

const styleRecords = new Map();

function createStyleRecord(href) {
  const link = document.createElement('link');
  const record = { link, failed: false, ready: null };
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'not all';
  link.dataset.routeStyleCache = '';
  record.ready = new Promise((resolve) => {
    link.onload = () => resolve(record);
    link.onerror = () => { record.failed = true; resolve(record); };
  });
  document.head.append(link);
  styleRecords.set(href, record);
  return record;
}

function recordFor(href) {
  return styleRecords.get(href) || createStyleRecord(href);
}

export async function prepareRouteStyles() {
  const hrefs = new Set([
    ...Object.values(layoutDefinitions).flatMap((layout) => layout.styles),
    ...Object.values(interactionStyles),
  ]);
  const localStyles = [...hrefs]
    .filter((href) => href.startsWith('/'))
    .map((href) => recordFor(href).ready);

  // External font styles should not block the application shell.
  for (const href of hrefs) if (!href.startsWith('/')) recordFor(href);
  await Promise.all(localStyles);
}

export async function activateRouteStyles(hrefs) {
  const active = new Set(hrefs);
  for (const [href, { link }] of styleRecords) {
    const enabled = active.has(href);
    link.media = enabled ? 'all' : 'not all';
    link.toggleAttribute('data-route-style', enabled);
  }
  const activeRecords = hrefs.map(recordFor);
  await Promise.all(activeRecords.map(({ ready }) => ready));
  return activeRecords.some(({ failed }) => failed);
}
