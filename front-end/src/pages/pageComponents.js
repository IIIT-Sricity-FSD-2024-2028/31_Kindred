import { layoutDefinitions } from '../layouts/layoutDefinitions.js';

const pageModules = import.meta.glob('./content/*Page.jsx', {
  eager: true,
  import: 'default',
});

function componentFileFor(path) {
  const name = path
    .replace(/^\//, '')
    .replace(/\.html$/, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `./content/${name}Page.jsx`;
}

export const pageComponents = Object.fromEntries(
  Object.keys(layoutDefinitions).map((path) => {
    const file = componentFileFor(path);
    const Component = pageModules[file];
    if (!Component) throw new Error(`Missing page component for ${path}: ${file}`);
    return [path, Component];
  }),
);
