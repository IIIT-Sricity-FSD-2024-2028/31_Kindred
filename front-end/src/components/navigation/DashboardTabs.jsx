import { cleanPath } from '../../routes/cleanPaths.js';
import { Link, useLocation } from '../../routes/navigation.jsx';

export default function DashboardTabs({ items, activeId, onChange, panelId }) {
  const location = useLocation();
  const localTabs = items.every((item) => !item.to);
  if (!items.length) return null;
  function moveFocus(event, index) {
    const directions = { ArrowRight: 1, ArrowLeft: -1, Home: -index, End: items.length - 1 - index };
    if (!(event.key in directions)) return;
    event.preventDefault();
    const nextIndex = (index + directions[event.key] + items.length) % items.length;
    event.currentTarget.parentElement.children[nextIndex]?.focus();
  }
  return <div className="tabs" role={localTabs ? 'tablist' : 'navigation'} aria-label="Dashboard navigation">
    {items.map((item, index) => {
      const active = item.to ? location.pathname === cleanPath(item.to.split('#')[0]) : item.id === activeId;
      const className = `${item.className}${item.to ? '' : ' shared-tab-action'}${active ? ' active' : ''}`;
      return item.to ? <Link key={item.id} to={item.to} className={className} aria-current={active ? 'page' : undefined}>{item.label}</Link> :
        <button key={item.id} type="button" id={`dashboard-tab-${item.id}`} className={className} role="tab" aria-selected={active} aria-controls={typeof panelId === 'function' ? panelId(item.id) : panelId} tabIndex={active ? 0 : -1} onKeyDown={(event) => moveFocus(event, index)} onClick={() => onChange(item.id)}>{item.label}</button>;
    })}
  </div>;
}
