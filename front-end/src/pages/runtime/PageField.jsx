import { useEffect, useRef } from 'react';
import { usePage } from './PageContext.js';

export default function PageField({ as: Tag = 'input', field, spec, children }) {
  const ui = usePage();
  const type = spec.type;
  const otp = spec.className?.includes('otp');
  const ref = useRef(null);
  const error = ui.state.fieldErrors[field];
  const inputRef = (element) => { ref.current = element; ui.registerField(field, element); };
  useEffect(() => {
    if (error && ref.current && !ref.current.disabled) {
      ref.current.scrollIntoView({ block: 'center' });
      ref.current.focus({ preventScroll: true });
    }
  }, [error, ui.state.busy]);
  const fieldId = spec.id || (type === 'radio' ? `${field}-${spec.radioValue}` : field);
  let value = ui.values[field] ?? '';
  const attrs = { ...spec, id: fieldId, ref: inputRef, 'aria-label': spec['aria-label'] || spec.placeholder || field.replaceAll('-',' '),
    disabled: spec.disabled || ui.state.busy,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': [spec['aria-describedby'], error ? `${fieldId}-validation` : null].filter(Boolean).join(' ') || undefined,
    onChange: (event) => {
      if (type === 'file') return ui.selectFile(field, event.target.files?.[0]);
      let next = type === 'checkbox' ? event.target.checked : event.target.value;
      if (otp) next = String(next).replace(/\D/g,'').slice(-1);
      ui.change(field, next);
      const placeholder = String(spec.placeholder || '').toLowerCase();
      let collection = { searchOrgs: 'organizations', searchUsers: 'users', searchInbox: 'inbox', volunteerSearch: 'volunteers', requestSearch: 'incoming', 'portal-search': 'programs', 'platform-admin-96': 'users', 'platform-admin-131': 'shop', 'platform-admin-162': 'inbox' }[field];
      if (!collection && /search/i.test(placeholder)) collection = /user/.test(placeholder) ? 'users' : /inbox|message|submission/.test(placeholder) ? 'inbox' : /product|artisan/.test(placeholder) ? 'catalog' : /volunteer/.test(placeholder) ? 'volunteers' : /program/.test(placeholder) ? 'programs' : 'organizations';
      if (collection) ui.update({ searches: { ...ui.state.searches, [collection]: next } });
      if (field === 'editor-program') ui.setValues({ 'editor-volunteer': '' });
      if (otp && next) ui.focusOtp(field, 1);
    },
    onKeyDown: (event) => {
      if (event.key === 'Enter' && /custom-skill/.test(field)) { event.preventDefault(); ui.addSkill(field); }
      else if (event.key === 'Enter' && Tag === 'input' && !['checkbox','radio','file','button','submit'].includes(type) && !otp && !event.nativeEvent.isComposing) {
        const form = event.currentTarget.closest('form[data-react-form]');
        if (form) { event.preventDefault(); form.requestSubmit(); }
      }
      if (otp && event.key === 'Backspace' && !value) ui.focusOtp(field, -1);
    },
  };
  if (type === 'file') {
    const originalClick = attrs.onClick;
    attrs.onClick = (event) => {
      // The input sits inside a clickable drop zone. Without this guard, its
      // synthetic click bubbles to the parent and recursively reopens itself.
      event.stopPropagation();
      originalClick?.(event);
    };
  }
  delete attrs.radioValue;
  delete attrs.actionLabel;
  if (type === 'file') return <><Tag {...attrs} />{error && <span className="field-validation" id={`${fieldId}-validation`}>{error}</span>}</>;
  if (type === 'checkbox') { attrs.checked = Boolean(value); delete attrs.value; }
  else if (type === 'radio') { attrs.value = spec.radioValue; attrs.checked = value === spec.radioValue; }
  else attrs.value = value;
  if (type === 'password' && ui.state.visiblePasswords[field]) attrs.type = 'text';
  if (field.endsWith('card-cvv')) { attrs.onFocus = () => ui.update({ cardFlipped: true }); attrs.onBlur = () => ui.update({ cardFlipped: false }); }
  if (otp) attrs.onPaste = (event) => { event.preventDefault(); ui.pasteOtp(event.clipboardData.getData('text').replace(/\D/g,'')); };
  if (Tag === 'select') {
    const collection = { 'res-org': 'organizations', 'rd-program': 'programs', 'vt-prog': 'programs' }[field];
    if (collection) children = <><option value="">{collection === 'programs' ? 'Select a program (optional)' : 'Select Organization'}</option>{ui.data(collection).filter((record) => field !== 'vt-prog' || ui.data('assignments').some((a) => a.programId === record.id && a.status === 'active')).map((record) => <option key={record.id} value={record.id}>{record.name}</option>)}</>;
    if (field === 'rd-category') children = <><option value="">— Select Category —</option>{['Clothing','Food','Medical Supplies','Electronics','Furniture','Books & Stationery','Blankets & Bedding','Hygiene Kits','Other'].map((category) => <option key={category}>{category}</option>)}</>;
    if (field === 'portal-skill-filter') children = <><option value="">All Skills</option>{[...new Set(ui.data('programs').flatMap((p) => p.requiredSkills || []))].sort().map((skill) => <option key={skill}>{skill}</option>)}</>;
  }
  return <><Tag {...attrs}>{Tag === 'input' ? undefined : children}</Tag>{error && <span className="field-validation" id={`${fieldId}-validation`}>{error}</span>}</>;
}

