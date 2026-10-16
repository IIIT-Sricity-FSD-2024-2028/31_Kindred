import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from '../../routes/navigation.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import usePageData from '../../hooks/usePageData.js';
import { layoutDefinitions } from '../../layouts/layoutDefinitions.js';
import fields from './pageFields.json';
import { authActions } from '../actions/authActions.js';
import { contributionActions } from '../actions/contributionActions.js';
import { managementActions } from '../actions/managementActions.js';
import { filterRecords } from '../../services/pageData.js';
import { readStored as stored, writeStored } from '../../services/storage.js';
import { profileSkillValues } from '../../services/skills.js';
import { localDate } from '../../services/validation.js';

function initialValues(path, session) {
  const values = Object.fromEntries(Object.entries(fields[path] || {}).map(([name, item]) => [name, item.default]));
  Object.assign(values, { 'pf-name': session?.name || '', 'pf-email': session?.email || '', 'pf-role': session?.role || '', 'pf-org': session?.org || '',
    'pf-phone': session?.phone || '', 'pf-bio': session?.bio || '',
    fullName: session?.name || '', 'donor-name': session?.name || '', 'donor-email': session?.email || '',
    'custom-amount': '500', 'log-date': localDate(),
  });
  const edit = path === '/create-program.html' ? stored('kindred_edit_program') : null;
  const request = path === '/create-program.html' ? stored('kindred_resource_program_request') : null;
  if (request && new URLSearchParams(window.location.search).get('request') === request.id) Object.assign(values, { programTitle: `${request.resource} Collection`, programDesc: `${request.reason}\nResources needed: ${request.resource}, quantity ${request.quantity}.`, programLocation: request.address, programBudget:'0', volunteerGoal:'1' });
  if (edit && new URLSearchParams(window.location.search).get('edit') === edit.id) Object.assign(values, { programTitle: edit.name, programLocation: edit.location, programBudget: String(edit.budget), programEndDate: edit.endDate, volunteerGoal: String(edit.volunteerGoal), programDesc: edit.description, progOpenApps: String(edit.openForApplications), requestPublicListing: false });
  return values;
}

function cardNumberPreview(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 16);
  return (digits + '•'.repeat(16 - digits.length)).match(/.{1,4}/g).join(' ');
}

export default function usePageModel(route) {
  const { session, api, signIn, updateSession } = useAuth();
  const toast = useToast(), navigate = useNavigate(), location = useLocation();
  const resources = usePageData(route.path, session, api);
  const [rawValues, replaceValues] = useState(() => initialValues(route.path, session));
  const [storedState, setState] = useState(() => {
    const edit = route.path === '/create-program.html' ? stored('kindred_edit_program') : null;
    const editing = edit && new URLSearchParams(location.search).get('edit') === edit.id;
    const requestedRole = new URLSearchParams(location.search).get('role');
    return { selectedRole: route.path === '/signup.html' ? ['org','volunteer','donor','beneficiary','seller'].includes(requestedRole) ? requestedRole : 'org' : '', team: 'master', modal: route.path === '/page2-new-request-modal.html' ? 'request-modal' : null, donationStep: 1, shopStep: 1,
      donationOrg: new URLSearchParams(location.search).get('org') || '', frequency: 'one-time', visiblePasswords: {},
      files: {}, customSkills: [], categories: editing ? [edit.focus].flat() : [], programSkills: editing ? edit.requiredSkills : [], editingProgram: editing ? edit.id : null, editingStartDate: editing ? edit.startDate : null,
      urgency: 'medium', hiddenNodes: [], filters: { users: 'all', inbox: 'all', shop: 'all', catalog: 'all' }, searches: {},
      items: [{ id: 'first-item', name: '', quantity: 1, condition: 'New' }], error: '', busy: false, editor: null, confirmation: null,
      selectedVolunteers: [],
      touchedFields: [], fieldErrors: {},
    };
  });
  const savedProfile = resources.data('profile')[0] || resources.data('volunteer')[0] || session || {};
  const savedSkills = profileSkillValues(resources.data('volunteer')[0]?.skills || resources.data('profile')[0]?.skills || session?.skills, Object.keys(fields['/profile.html']).filter((field) => field.startsWith('pf-skill-')));
  const state = { ...storedState, selectedVolunteers: storedState.editingProgram && !storedState.assignmentsTouched ? resources.data('assignments').filter((a) => a.programId === storedState.editingProgram && ['active', 'pending'].includes(a.status)).map((a) => a.volunteerEmail) : storedState.selectedVolunteers, customSkills: route.path === '/profile.html' && !storedState.customSkillsTouched ? savedSkills.custom : storedState.customSkills };
  const values = { ...rawValues };
  if (route.path === '/profile.html') for (const [field, checked] of Object.entries(savedSkills.checks)) if (!state.touchedFields.includes(field)) values[field] = checked;
  for (const item of state.items) for (const key of ['name','quantity','condition']) values[`item-${item.id}-${key}`] = item[key];
  if (route.path === '/profile.html') {
    for (const field of ['name','phone','bio']) if (!state.touchedFields.includes('pf-'+field)) values['pf-'+field] = savedProfile[field] ?? session?.[field] ?? '';
  }
  if (route.path === '/seller-dashboard.html') {
    const bank = resources.data('sellers').find((seller) => seller.email === session?.email)?.bankDetails;
    if (bank) for (const [field,key] of [['bank-acc-num','account'],['bank-ifsc','ifsc'],['bank-name','bankName']]) if (!state.touchedFields.includes(field)) values[field] = bank[key] || '';
  }
  const pending = useRef(false);
  const mounted = useRef(true);
  const fieldRefs = useRef({});
  const readers = useRef({});
  useEffect(() => { mounted.current = true; document.title = route.title; const activeReaders = readers.current; return () => { mounted.current = false; Object.values(activeReaders).forEach((reader) => reader.abort()); }; }, [route.title]);
  const setValues = (patch) => { if (mounted.current) replaceValues((previous) => ({ ...previous, ...patch })); };
  const update = (patch) => {
    if (!mounted.current) return;
    if ('modal' in patch && patch.modal !== state.modal) setValues({ 'card-number': '', 'card-cvv': '', 'shop-card-number': '', 'shop-card-cvv': '' });
    setState((previous) => ({ ...previous, ...(('modal' in patch || 'editor' in patch) ? { error: '', fieldErrors: {} } : {}), ...patch, ...('selectedVolunteers' in patch ? { assignmentsTouched: true } : {}), ...(route.path === '/profile.html' && 'customSkills' in patch && !('customSkillsTouched' in patch) ? { customSkillsTouched: true } : {}) }));
  };
  const tabs = layoutDefinitions[route.path].tabs.filter((item) => route.path !== '/platform-admin.html' ||
    (session?.team !== 'team1' || item.id !== 'shop') && (session?.team !== 'team2' || !['requests', 'users'].includes(item.id)));
  const requested = location.hash.slice(1);
  const activeTab = tabs.find((t) => !t.to && t.id === requested)?.id || tabs.find((t) => t.defaultActive)?.id || tabs[0]?.id;
  useEffect(() => {
    if (tabs.length && tabs.every((t) => !t.to) && requested && requested !== activeTab) navigate({ pathname: location.pathname, search: location.search, hash: activeTab }, { replace: true });
  }, [tabs, requested, activeTab, navigate, location.pathname, location.search]);
  const ui = { path: route.path, values, state, session, api, signIn, updateSession, navigate, location, toast, update, setValues,
    ...resources, tabs, activeTab, savedSkills, savedProfile,
    registerField: (field, element) => { fieldRefs.current[field] = element; },
    focusOtp: (field, direction) => { const keys = Object.keys(fieldRefs.current).filter((key) => fieldRefs.current[key]?.className?.includes('otp')); fieldRefs.current[keys[keys.indexOf(field)+direction]]?.focus(); },
    pasteOtp: (digits) => { const keys = Object.keys(fieldRefs.current).filter((key) => fieldRefs.current[key]?.className?.includes('otp')); setValues(Object.fromEntries(keys.map((key, i) => [key,digits[i] || '']))); fieldRefs.current[keys[Math.min(digits.length,keys.length-1)]]?.focus(); },
    organization: resources.data('organizations').find((o) => o.id === new URLSearchParams(location.search).get('id')),
    changeTab: (id) => navigate({ pathname: location.pathname, search: location.search, hash: id }),
    savedDonations: resources.data('donations'),
    savedCards: stored(`kindred_react_cards:${session?.email?.toLowerCase()}`, [], 'localStorage'),
    addSkill: (field) => { const skill = values[field]?.trim(); if (skill) { update({ customSkills: state.customSkills.some((item) => item.toLowerCase() === skill.toLowerCase()) ? state.customSkills : [...state.customSkills, skill] }); setValues({ [field]: '' }); } },
  };
  async function action(name, args = [], meta = {}) {
    // Native file pickers must be opened synchronously from the user's click.
    // Do not enter the shared busy state because that disables file inputs.
    if (name === 'chooseFile') {
      fieldRefs.current[args[0]]?.click();
      return;
    }
    if (pending.current) return;
  const handlers = { ...authActions(ui), ...contributionActions(ui), ...managementActions(ui),
    navigate: ([to]) => navigate(to.startsWith('/') || to.startsWith('#') ? to : '/'+to),
    openModal: ([id]) => update({ modal: id }), closeModal: ([id]) => { if (state.modal === id || !id) update({ modal: null }); else update({ hiddenNodes: [...state.hiddenNodes, id] }); },
    clearField: ([id]) => { setValues({ [id]: '' }); const collection = { searchOrgs: 'organizations', searchUsers: 'users', searchInbox: 'inbox' }[id] || id; update({ searches: { ...state.searches, [collection]: '' } }); },
    switchTab: ([id]) => ui.changeTab(({ 'tab-payments': 'mypayments', 'tab-cards': 'savedcards' }[id] || id.replace(/^tab-/, ''))),
    switchOrgTab: ([id]) => ui.changeTab(id), switchAdminTab: ([id]) => ui.changeTab(id),
    filterUsers: ([value]) => update({ filters: { ...state.filters, users: value } }),
    filterInbox: ([value]) => update({ filters: { ...state.filters, inbox: value } }),
    filterShopManagement: ([value]) => update({ filters: { ...state.filters, shop: value } }),
    filterShopCategory: ([value]) => update({ filters: { ...state.filters, catalog: value } }),
    selectUrgency: ([value]) => update({ urgency: value }),
    selectEmergencyType: ([value]) => setValues({ selectedEmergencyType: value }),
    selectRating: ([value]) => setValues({ ratingValue: String(value) }),
    showDetail: ([collection, id]) => update({ detail: ui.data(collection).find((row) => row.id === id), detailCollection: collection, modal: 'recordDetail' }),
    showStatistics: () => update({ modal: 'recordDetail', detail: { title: 'Statistics', organizations: ui.data('organizations').length, programs: ui.data('programs').length, volunteers: ui.data('volunteers').length, requests: ui.data('incoming').length, donations: ui.data('resources').length } }),
    focusSignIn: () => fieldRefs.current['si-email']?.focus(),
    exportIncoming: () => {
      const records = ui.data('incoming');
      const columns = ['id','name','type','desc','urgency','location','date','status'];
      const csv = [columns, ...records.map((record) => columns.map((key) => record[key] || ''))].map((row) => row.map((value) => '"'+String(value).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"').join(',')).join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'kindred-incoming.csv'; link.click(); URL.revokeObjectURL(url);
    },
    callHelpline: () => { window.location.href = 'tel:+919123456789'; },
    removeSavedCard: ([id]) => { if (!writeStored(`kindred_react_cards:${session.email.toLowerCase()}`, ui.savedCards.filter((card) => card.id !== id), 'localStorage')) throw new Error('Browser storage is unavailable. This saved card could not be removed.'); update({ cardRevision: Date.now() }); },
  };
    const handler = handlers[name];
    if (!handler) { update({ error: `This action (${name}) could not be completed. Please try again.` }); return; }
    pending.current = true; update({ busy: true, error: '', fieldErrors: {} });
    try { await handler(args, meta); }
    catch (error) { if (mounted.current) { update({ error: error.message, fieldErrors: error.field ? { [error.field]: error.message } : {} }); toast({ type: 'error', title: 'Action could not be completed', body: error.message, duration: 8000 }); } }
    finally { pending.current = false; if (mounted.current) update({ busy: false }); }
  }
  ui.action = action;
  ui.clearFile = (field) => {
    readers.current[field]?.abort();
    if (fieldRefs.current[field]) fieldRefs.current[field].value = '';
    update({ files: { ...state.files, [field]: null }, productPreview: field === 'prodPhotoInput' ? null : state.productPreview });
  };
  ui.selectFile = (field, file) => {
    if (!file || state.busy) return;
    readers.current[field]?.abort();
    const image = ['prodPhotoInput','op-image','program-photo','work-proof','emergency-request-41'].includes(field);
    const maxMb = field === 'emergency-request-41' ? 5 : image ? 4 : 5;
    const problem = file.size > maxMb * 1024 * 1024 ? `File size exceeds ${maxMb} MB limit.` : image && !file.type.startsWith('image/') ? 'Only image files are allowed.' : null;
    if (problem) { if (fieldRefs.current[field]) fieldRefs.current[field].value = ''; update({ files: { ...state.files, [field]: null }, productPreview: field === 'prodPhotoInput' ? null : state.productPreview, error: problem, fieldErrors: { [field]: problem } }); return; }
    update({ files: { ...state.files, [field]: file }, error: '', fieldErrors: {} });
    if (field === 'prodPhotoInput') {
      const reader = new FileReader(); readers.current[field] = reader;
      reader.onload = () => { if (mounted.current && readers.current[field] === reader) update({ productPreview: reader.result }); };
      reader.onerror = () => { if (mounted.current && readers.current[field] === reader) update({ error: 'This image could not be read. Please choose another file.' }); };
      reader.readAsDataURL(file);
    }
  };
  ui.change = (field, value) => {
    if (field.endsWith('card-number')) value = String(value).replace(/\D/g, '').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
    if (field.endsWith('card-expiry')) { const digits = String(value).replace(/\D/g,'').slice(0,4); value = digits.length > 2 ? digits.slice(0,2)+'/'+digits.slice(2) : digits; }
    if (field.endsWith('card-cvv')) value = String(value).replace(/\D/g,'').slice(0,4);
    setValues({ [field]: value });
    setState((previous) => { const fieldErrors = { ...previous.fieldErrors }; delete fieldErrors[field]; const itemField = /^item-(.+)-(name|quantity|condition)$/.exec(field); return { ...previous, ...(itemField ? { items: previous.items.map((item) => item.id === itemField[1] ? { ...item, [itemField[2]]: value } : item) } : {}), fieldErrors, error: previous.fieldErrors[field] || route.path === '/signin.html' && ['si-email','si-pass'].includes(field) ? '' : previous.error, touchedFields: [...new Set([...previous.touchedFields,field])] }; });
  };
  ui.props = (key, spec, actions = {}) => {
    const { actionLabel, pageForm, radioValueLabel, ...attrs } = spec;
    attrs.style = { ...attrs.style };
    const className = attrs.className || '';
    if (route.path === '/page2-new-request-modal.html' && [key === 'page2-new-request-modal-1', className.includes('btn-new-request')].some(Boolean)) { delete attrs.style.filter; delete attrs.style.pointerEvents; delete attrs.style.userSelect; }
    if (route.path.includes('beneficiary-dashboard') || route.path.includes('page5-connected-notification') || route.path.includes('page2-new-request-modal')) {
      if (className === 'stats-grid') attrs.hidden = activeTab !== 'overview';
    }
    const meta = { ...spec, label: actionLabel || '' };
    const events = { ...actions };
    if (pageForm) {
      const submit = { 'join-volunteer-12': ['submitVolunteerForm'], contactForm: ['submitIncoming','contactForm'], feedbackForm: ['submitIncoming','feedbackForm'], emergencyRequestForm: ['submitIncoming','emergencyRequestForm'], 'request-form': ['submitIncoming','request-form'], 'ngo-register-form': ['registerNgo'], resourceDonationForm: ['submitResourceDonation'], profileForm: ['saveProfile'], passForm: ['changePassword'], 'form-org': ['submitOrg'], 'form-volunteer': ['submitVolunteer'], 'form-donor': ['submitDonor'], 'form-beneficiary': ['submitBeneficiary'], 'form-seller': ['submitSeller'] }[key] || (route.path === '/signin.html' ? ['signIn'] : null);
      if (submit) { events.submit = { name: submit[0], args: submit.slice(1) }; attrs.noValidate = true; attrs['data-react-form'] = true; attrs['aria-busy'] = state.busy; }
    }
    const defaultActions = {
      'close-donate-modal': ['closeModal', 'donation-modal-overlay'], 'close-success-btn': ['closeModal', 'donation-modal-overlay'],
      'proceed-donate-btn': ['proceedDonation'], 'back-to-step1': ['backDonation'], 'pay-now-btn': ['executeDonation'],
      createProgramBtn: ['createProgram'], 'broadcast-btn': ['broadcastRequest'],
      currentLocationLink: ['currentLocation'], verifySubmitBtn: ['verifyOTP'], resendLink: ['resendOTP'],
      'tab-signin': ['focusSignIn'],
    };
    let implicit = defaultActions[key];
    if (attrs['data-close-modal']) implicit = ['closeModal', attrs['data-close-modal']];
    if (className.includes('btn-new-request') && key !== 'donor-dashboard-8') implicit = ['openModal','request-modal'];
    if (attrs['data-amount']) implicit = ['selectAmount', attrs['data-amount']];
    if (attrs['data-freq']) implicit = ['selectFrequency', attrs['data-freq']];
    if (className.includes('urgency-btn')) implicit = ['selectUrgency', actionLabel?.trim().toLowerCase()];
    if (className.includes('pill-btn')) implicit = ['selectEmergencyType', actionLabel?.trim()];
    if (className.split(' ').includes('star')) implicit = ['selectRating', attrs['data-value']];
    if (className.includes('btn-outline-sm') && route.path === '/organization-details.html') implicit = ['openDonation', ui.organization?.name];
    if (/Add Organization/.test(actionLabel || '')) implicit = ['openOrgModal'];
    if (/Add Volunteer/.test(actionLabel || '')) implicit = ['openVolunteerEditor'];
    if (/Export CSV/.test(actionLabel || '')) implicit = ['exportIncoming'];
    if (/Reports/.test(actionLabel || '') && attrs.href === '#') implicit = ['showStatistics'];
    if (/Resend/.test(actionLabel || '') && !events.click) implicit = ['resendOTP'];
    if (className === 'more-btn' || className === 'stat-more') implicit = ['showStatistics'];
    if (className === 'btn-call-helpline') implicit = ['callHelpline'];
    if (key === 'certDropZone' || key === 'prodPhotoDropZone') { const field = key === 'certDropZone' ? 'org-cert-file' : 'prodPhotoInput'; attrs.onDragOver = (event) => event.preventDefault(); attrs.onDrop = (event) => { event.preventDefault(); ui.selectFile(field,event.dataTransfer.files[0]); }; }
    if (implicit) events.click = { name: implicit[0], args: implicit.slice(1) };
    for (const [event, callback] of Object.entries(events)) {
      if (event === 'input' || event === 'change') continue;
      const reactEvent = { click: 'onClick', submit: 'onSubmit', keydown: 'onKeyDown' }[event];
      if (reactEvent) attrs[reactEvent] = (eventObject) => { if (event === 'keydown' && eventObject.key !== 'Enter') return; eventObject.preventDefault(); eventObject.stopPropagation(); action(callback.name, callback.args, meta); };
    }
    if (state.busy && (events.click || events.submit) && attrs.type) attrs.disabled = true;
    let selected;
    if (className.includes('role-list-item') || className.split(' ').includes('role-btn')) selected = attrs['data-role'] === state.selectedRole;
    if (className.includes('admin-subteam-btn')) {
      const team = { 'signin-48': 'master', 'signin-51': 'team1', 'signin-54': 'team2' }[key];
      selected = team === state.team;
      attrs.style.borderColor = selected ? '#6366f1' : '#e2e8f0';
      attrs.style.background = selected ? '#eef2ff' : '#fff';
      attrs.style.boxShadow = selected ? '0 0 0 2px rgba(99,102,241,.12)' : 'none';
      attrs['aria-pressed'] = selected;
    }
    if (className.includes('gender-btn')) selected = actionLabel === state.gender;
    if (className.includes('avail-btn')) selected = actionLabel === state.availability;
    if (attrs['data-amount']) selected = Number(attrs['data-amount']) === Number(values['custom-amount']);
    if (attrs['data-freq']) selected = attrs['data-freq'] === state.frequency;
    if (attrs['data-cat']) selected = attrs['data-cat'] === state.filters.catalog;
    if (selected !== undefined) attrs.className = className.replace(/\bactive\b/g,'').trim()+(selected ? ' active' : '');
    if (['filterUsers','filterInbox','filterShopManagement'].includes(events.click?.name)) { const key = { filterUsers: 'users', filterInbox: 'inbox', filterShopManagement: 'shop' }[events.click.name]; attrs.className = className.replace(/\bactive\b/g,'').trim()+(events.click.args[0] === state.filters[key] ? ' active' : ''); }
    if (className.includes('urgency-btn')) attrs.className = className.replace(/\bselected\b/g,'').trim()+(actionLabel?.toLowerCase() === state.urgency ? ' selected' : '');
    if (radioValueLabel) attrs.className = className.replace(/\bselected\b/g,'').trim()+(values.type === radioValueLabel ? ' selected' : '');
    if (className.includes('pill-btn')) attrs.className = className.replace(/\bactive\b/g,'').trim()+(actionLabel === values.selectedEmergencyType ? ' active' : '');
    if (className.split(' ').includes('star')) { attrs.className = 'star'+(Number(state.hoverRating || values.ratingValue) >= Number(attrs['data-value']) ? ' active' : ''); attrs.role = 'button'; attrs.tabIndex = 0; attrs['aria-label'] = `${attrs['data-value']} star${attrs['data-value'] === '1' ? '' : 's'}`; attrs.onMouseEnter = () => update({ hoverRating: attrs['data-value'] }); attrs.onMouseLeave = () => update({ hoverRating: null }); }
    if (events.click && !attrs.type && !attrs.href && !attrs.to) { attrs.role = attrs.role || 'button'; attrs.tabIndex = 0; attrs.onKeyDown = (event) => { if (['Enter',' '].includes(event.key)) { event.preventDefault(); action(events.click.name,events.click.args,meta); } }; }
    let visible;
    if (key === 'adminTeamSelector') visible = state.selectedRole === 'platform';
    if (key === 'hero-signin-btn' && session?.role === 'donor') { attrs.to = '/donor-dashboard.html'; }
    if (key.startsWith('form-') && route.path === '/signup.html') visible = key === 'form-'+state.selectedRole;
    if (key.startsWith('donate-step-')) visible = key === 'donate-step-'+state.donationStep;
    if (key.startsWith('shop-step-')) visible = key === 'shop-step-'+state.shopStep;
    const tabPanels = { 'tab-overview': 'overview', 'tab-payments': 'mypayments', 'tab-resources': 'resources', 'tab-programs': 'programs', 'tab-cards': 'savedcards' };
    if (route.path === '/donor-dashboard.html' && tabPanels[key]) visible = activeTab === tabPanels[key];
    if (key.startsWith('org-panel-')) visible = activeTab === key.replace('org-panel-','');
    if (key.startsWith('panel-') && route.path === '/platform-admin.html') visible = activeTab === key.replace('panel-','');
    if ((route.path === '/donor-dashboard.html' && tabPanels[key]) || key.startsWith('org-panel-') || key.startsWith('panel-')) { const id = tabPanels[key] || key.replace(/^(org-)?panel-/,''); attrs.role = 'tabpanel'; attrs['aria-labelledby'] = 'dashboard-tab-'+id; }
    if (attrs['data-tab-content']) visible = activeTab === attrs['data-tab-content'];
    if (key === 'orgSection') visible = session?.role === 'admin';
    if (key === 'skillsSection') visible = session?.role === 'volunteer';
    if (key === 'certUploadPrompt') visible = !state.files['org-cert-file'];
    if (key === 'certFilePreview') visible = Boolean(state.files['org-cert-file']);
    if (key === 'prodPhotoPrompt') visible = !state.productPreview;
    if (key === 'prodPhotoPreview') { visible = Boolean(state.productPreview); attrs.src = state.productPreview || undefined; }
    if (key === 'ngo-register-form') visible = !state.registeredNgo;
    if (key === 'ngo-success-msg') visible = Boolean(state.registeredNgo);
    if (['si-role-error','si-email-error','si-pass-error'].includes(key)) visible = false;
    if (state.hiddenNodes.includes(key)) visible = false;
    if (['org-connected-banner','org-response-banner'].includes(key)) visible = ['accepted','resolved'].includes(stored('kindred_last_request')?.status);
    if (visible !== undefined) { attrs.style.display = visible ? (spec.style?.display === 'none' ? '' : spec.style?.display) : 'none'; attrs.hidden = !visible; }
    if (key === 'skillsSection' || key === 'orgSection') attrs.style.display = visible ? 'block' : 'none';
    if (route.path === '/organization-details.html' && key === 'org-banner') { attrs.src = ui.organization?.image || '/images/ngo-placeholder.svg'; attrs.alt = ui.organization?.name || 'Organization'; }
    if (key === 'backLink') { delete attrs.href; attrs.to = session?.dashboard || '/index.html'; }
    if (attrs.to === '/signup.html' && /Seller/.test(actionLabel || '')) attrs.to = '/signup.html?role=seller';
    if (key === 'heroAvatar') attrs.style.background = session?.avatar;
    if (key === 'strength-bar') { const password = values['rp-pass'] || ''; const score = [password.length >= 8,/[A-Z]/.test(password),/[0-9]/.test(password),/[^A-Za-z0-9]/.test(password)].filter(Boolean).length; attrs.style.width = score*25+'%'; attrs.style.background = ['#e5e7eb','#ef4444','#f59e0b','#3b82f6','#10b981'][score]; }
    if (key === 'card-3d' || key === 'shop-card-3d') attrs.className = className+(state.cardFlipped ? ' flipped' : '');
    return attrs;
  };
  ui.content = (key, original) => {
    const org = ui.organization, receipt = state.receipt, seller = ui.data('sellers').find((s) => s.email === session?.email);
    const programs = session?.role === 'admin' ? ui.data('programs').filter((p) => p.org === session.org) : ui.data('programs');
    const volunteers = ui.data('volunteers').filter((p) => !session?.org || p.org === session.org);
    const counts = { 'stat-org-vols': volunteers.length, 'stat-org-progs': programs.filter((p) => p.status === 'active').length, 'stat-org-res': ui.data('resources').length,
      'stat-org-reqs': ui.data('incoming').filter((r) => r.status === 'pending').length, 'stat-total-orgs': ui.data('organizations').length, 'stat-total-vols': ui.data('volunteers').length,
      'stat-pending-reqs': ui.data('users').filter((u) => u.status === 'pending').length+ui.data('requests').filter((r) => r.status === 'pending').length,
      'stat-total-users': ui.data('users').length, 'stat-card-donations': '₹'+ui.data('donations').reduce((n,d) => n+Number(d.amount || 0),0).toLocaleString('en-IN'),
      'stat-today-donations': '₹'+ui.data('donations').filter((d) => d.date?.startsWith(new Date().toISOString().slice(0,10))).reduce((n,d) => n+Number(d.amount || 0),0).toLocaleString('en-IN'),
      'stat-hours': ui.data('hours').filter((h) => h.status === 'approved').reduce((n,h) => n+h.hours,0), 'stat-active': ui.data('assignments').filter((a) => a.status === 'active').length,
      'rstat-total': ui.data('resources').length, 'rstat-pending': ui.data('resources').filter((r) => r.status === 'pending').length,
      'rstat-active': ui.data('resources').filter((r) => ['assigned','picked_up','in_transit'].includes(r.status)).length, 'rstat-delivered': ui.data('resources').filter((r) => ['delivered','completed'].includes(r.status)).length,
      'stat-seller-total': ui.data('products').length, 'stat-seller-approved': ui.data('products').filter((p) => p.status === 'approved').length,
      'stat-seller-pending': ui.data('products').filter((p) => p.status === 'pending_approval').length, 'stat-seller-balance': '₹'+Number(seller?.salesBalance || 0).toLocaleString('en-IN'),
      'ben-stat-total': ui.data('incoming').length + ui.data('resourceRequests').length,
      'ben-stat-progress': [...ui.data('incoming'),...ui.data('resourceRequests')].filter((r) => ['accepted','assigned','in_progress','approved','partially_approved','waiting_stock','needs_information'].includes(r.status)).length,
      'ben-stat-submitted': [...ui.data('incoming'),...ui.data('resourceRequests')].filter((r) => ['pending','submitted'].includes(r.status)).length,
      'ben-stat-completed': [...ui.data('incoming'),...ui.data('resourceRequests')].filter((r) => ['resolved','completed','delivered'].includes(r.status)).length,
    };
    if (Object.hasOwn(counts,key)) return counts[key];
    if (/^(fc-|count-)/.test(key)) { const collection = /inbox/.test(route.path) ? 'incoming' : 'users'; const filter = key.replace(/^(fc-|count-)/,''); return filterRecords(ui.data(collection),'',filter).length; }
    if (key.startsWith('sfc-')) return filterRecords(ui.data('products'),'',key === 'sfc-pending' ? 'pending_approval' : key.slice(4)).length;
    const text = {
      orgAdminTitle: session?.org || 'Organization Dashboard', 'ben-welcome': `Welcome, ${session?.name?.split(' ')[0] || 'Beneficiary'}!`,
      'donor-welcome': `Welcome back, ${session?.name?.split(' ')[0] || 'Donor'}!`, 'welcome-msg': `Welcome back, ${session?.name?.split(' ')[0] || 'Volunteer'}!`,
      heroName: session?.name, heroEmail: session?.email, heroAvatar: session?.initials, heroBadgeRole: session?.role, heroBadgeStatus: session?.status,
      sellerBusinessName: seller?.businessName || session?.name, 'org-name-title': org?.name || 'Organization not found', 'org-focus-title': org?.focus,
      'org-focus-detail': org?.focus, 'org-city': org?.city, 'org-email': org?.email, 'org-phone': org?.phone,
      'org-description': org ? `${org.name} works in ${[org.focus].flat().join(', ')} to support communities in ${org.city}.` : 'Choose an organization from the directory to view its details.',
      'stat-volunteers': org?.volunteers, 'stat-beneficiaries': org?.beneficiaries, 'stat-rating': org?.rating,
      'donate-org-name': state.donationOrg, 'display-total': '₹'+Number(values['custom-amount'] || 0).toLocaleString('en-IN'), 'pay-amount-display': '₹'+Number(values['custom-amount'] || 0).toLocaleString('en-IN'),
      'card-number-display': cardNumberPreview(values['card-number']),
      'card-holdername-display': values['card-holder-name']?.toUpperCase() || 'YOUR NAME', 'card-expiry-display': values['card-expiry'] || 'MM/YY',
      'card-cvv-display': '•'.repeat(String(values['card-cvv'] || '').length) || '•••',
      'shop-card-number-display': cardNumberPreview(values['shop-card-number']),
      'shop-card-holdername-display': values['shop-card-holder-name']?.toUpperCase() || 'YOUR NAME', 'shop-card-expiry-display': values['shop-card-expiry'] || 'MM/YY',
      'shop-card-cvv-display': '•'.repeat(String(values['shop-card-cvv'] || '').length) || '•••',
      'checkout-total-btn': '₹'+(Number(values['checkout-qty'] || 1)*Number(state.product?.price || 0)).toLocaleString('en-IN'),
      'shop-pay-amount-display': '₹'+(Number(values['checkout-qty'] || 1)*Number(state.product?.price || 0)).toLocaleString('en-IN'),
      'success-amount': '₹'+Number(receipt?.amount || 0).toLocaleString('en-IN'), 'success-org': receipt?.org, 'success-txn-id': receipt?.id,
      'success-card-mask': receipt?.cardLast4 ? '•••• '+receipt.cardLast4 : '', 'success-prod-title': state.product?.title,
      'success-order-amount': '₹'+Number(receipt?.total || receipt?.amount || 0).toLocaleString('en-IN'), 'success-order-id': receipt?.id,
      'success-delivery-addr': receipt?.address || values['checkout-address'], programNameDisplay: stored('kindred_last_program')?.name || 'Your program',
      certFileName: state.files['org-cert-file']?.name, certFileSize: state.files['org-cert-file'] ? (state.files['org-cert-file'].size/1024).toFixed(1)+' KB' : '',
      adminTeamBadge: session?.team ? session.team === 'team1' ? 'Team 1' : 'Team 2' : 'Master Admin',
      shopProductCount: `${filterRecords(ui.data('products'),state.searches.catalog || '',state.filters.catalog).length} products found`,
      'hero-signin-btn': session?.role === 'donor' ? 'My Donor Dashboard' : original,
      'donate-hero-subtitle': session?.role === 'donor' ? 'Choose a partner organization and support the causes you care about.' : original,
      'strength-label': (values['rp-pass'] || '').length >= 8 && /[A-Z]/.test(values['rp-pass']) && /[0-9]/.test(values['rp-pass']) && /[^A-Za-z0-9]/.test(values['rp-pass']) ? 'Strong password' : (values['rp-pass'] || '').length ? 'Use 8+ characters with uppercase, numbers and symbols' : '',
    };
    return Object.hasOwn(text,key) && text[key] !== undefined ? text[key] : original;
  };
  return ui;
}
