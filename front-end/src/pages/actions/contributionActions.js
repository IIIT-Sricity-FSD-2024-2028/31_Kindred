import { FieldError, validateField, requireFields, validateCard, validateEmail, validatePhone, localDate, validateDate } from '../../services/validation.js';

import { readStored, writeStored } from '../../services/storage.js';

export function contributionActions(ui) {
  const { values: v, state, session, api, update, setValues, navigate } = ui;
  function clearCard(prefix = '') {
    return { [`${prefix}card-number`]: '', [`${prefix}card-holder-name`]: '', [`${prefix}card-expiry`]: '', [`${prefix}card-cvv`]: '' };
  }
  function validateDonation() {
    requireFields(v, ['donor-name', 'donor-email', 'custom-amount']);
    validateField('donor-email', validateEmail, v['donor-email']);
    if (!Number.isFinite(Number(v['custom-amount'])) || Number(v['custom-amount']) < 100) throw new FieldError('custom-amount', 'Minimum donation amount is INR 100.');
    if (v['donor-pan'] && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v['donor-pan'].trim().toUpperCase())) throw new FieldError('donor-pan', 'Enter a valid PAN in the format ABCDE1234F.');
  }
  function validateCheckout() {
    requireFields(v, ['checkout-name', 'checkout-email', 'checkout-phone', 'checkout-address']);
    validateField('checkout-email', validateEmail, v['checkout-email']); validateField('checkout-phone', validatePhone, v['checkout-phone']);
    if (!state.product) throw new Error('Please select a product.');
    if (!Number.isInteger(Number(v['checkout-qty'])) || Number(v['checkout-qty']) < 1 || Number(v['checkout-qty']) > state.product.quantity) throw new FieldError('checkout-qty', 'Please select a valid quantity within the available stock.');
  }
  function openDonation(org, programId = '') {
    if (!session) return navigate(`/signup?role=donor&redirect=${encodeURIComponent(programId ? '/programs' : '/organizations')}`);
    ui.clearFile('donation-proof');
    setValues({ 'custom-amount': '500', 'donor-name': session?.name || '', 'donor-email': session?.email || '', 'donor-pan': '', 'save-card-check': false, ...clearCard() });
    update({ editor: { type: 'cardDonation', title: `Donate to ${org}` }, modal: null, donationOrg: org, donationProgramId: programId, donationStep: 1, receipt: null, frequency: 'one-time', cardFlipped: false });
  }
  async function donation() {
    validateDonation();
    const card = validateCard(v);
    const receipt = await api.post('/donations', { org: state.donationOrg, amount: Number(v['custom-amount']),
      frequency: state.frequency, donor: v['donor-name'].trim(), email: session?.email || v['donor-email'].trim(), programId: state.donationProgramId || new URLSearchParams(ui.location?.search || '').get('program') || undefined, pan: (v['donor-pan'] || '').trim().toUpperCase() || undefined, ...card, status: 'paid' });
    update({ receipt, donationStep: 'success', editor: null }); ui.toast({ type: 'success', title: 'Demo card donation recorded', body: `Recipient: ${receipt.org}. No money was transferred.` });
    // Persist only the backend receipt and masked card/PAN metadata; never raw PAN/CVV.
    const key = `kindred_react_donations:${v['donor-email'].toLowerCase()}`;
    writeStored(key, [receipt, ...readStored(key, [], 'localStorage')], 'localStorage');
    if (v['save-card-check']) {
      const key = `kindred_react_cards:${v['donor-email'].toLowerCase()}`;
      writeStored(key, [...readStored(key, [], 'localStorage'), { id: crypto.randomUUID(), ...card, holder: v['card-holder-name'], expiry: v['card-expiry'] }], 'localStorage');
    }
    setValues({ 'card-number': '', 'card-cvv': '' }); ui.refresh();
  }
  async function resourceDonation() {
    if (!session || !['donor', 'admin', 'superuser'].includes(session.role)) throw new Error('Sign in as a donor to arrange a resource donation.');
    const dashboard = ui.path === '/donor-dashboard.html';
    const fields = dashboard ? ['rd-name', 'rd-phone', 'rd-category', 'rd-desc', 'rd-address', 'rd-date', 'rd-timeslot'] : ['res-donor-name', 'res-donor-email', 'res-donor-phone', 'res-category', 'res-items', 'res-address', 'res-date', 'res-timeslot'];
    requireFields(v, fields);
    const items = dashboard ? state.items.map((item) => ({ name: item.name.trim(), quantity: Number(item.quantity), condition: item.condition })) : [{ name: v['res-items'], quantity: 1, condition: 'New' }];
    if (!items.length) throw new Error('Add at least one donation item.');
    if (dashboard) for (const [index,item] of items.entries()) {
      if (!item.name) throw new FieldError(`item-${state.items[index].id}-name`, 'Enter an item name.');
      if (!Number.isInteger(item.quantity) || item.quantity < 1) throw new FieldError(`item-${state.items[index].id}-quantity`, 'Enter a whole-number quantity of at least 1.');
    }
    const phone = dashboard ? v['rd-phone'] : v['res-donor-phone']; validateField(dashboard ? 'rd-phone' : 'res-donor-phone', validatePhone, phone);
    if (!dashboard) validateField('res-donor-email', validateEmail, v['res-donor-email']);
    const date = dashboard ? v['rd-date'] : v['res-date'];
    validateDate(date, { field: dashboard ? 'rd-date' : 'res-date', min: localDate() });
    const program = ui.data('programs').find((p) => p.id === v['rd-program']);
    const org = ui.data('organizations').find((o) => o.id === v['res-org']) || ui.data('organizations').find((o) => o.name === session.org);
    if (!org && !program) throw new Error('Select the organization that should receive these resources.');
    if (org && program && program.org !== org.name) throw new Error('Select a program belonging to the recipient organization.');
    let image;
    if (state.files['resource-photo']) { const upload = new FormData(); upload.append('file',state.files['resource-photo']); image = (await api.post('/resource-donations/upload-image',upload)).url; }
    await api.post('/resource-donations', {
      donorName: dashboard ? v['rd-name'] : v['res-donor-name'], donorEmail: dashboard ? session.email : v['res-donor-email'], donorPhone: phone,
      category: dashboard ? v['rd-category'] : v['res-category'], items, image,
      description: dashboard ? v['rd-desc'] : v['res-items'], pickupAddress: dashboard ? v['rd-address'] : v['res-address'], pickupDate: date,
      pickupTimeSlot: dashboard ? v['rd-timeslot'] : v['res-timeslot'], programId: program?.id || '', programName: program?.name || '',
      orgId: org?.id || '', orgName: org?.name || program?.org || '',
    });
    setValues(Object.fromEntries(Object.keys(v).filter((key) => /^(rd-|res-)/.test(key)).map((key) => [key, ''])));
    ui.clearFile('resource-photo');
    update({ modal: null, items: [{ id: crypto.randomUUID(), name: '', quantity: 1, condition: 'New' }] }); ui.refresh(); ui.toast({ type: 'success', title: 'Resource donation submitted', body: 'Your pickup request is awaiting assignment.' });
  }
  async function submitIncoming(kind) {
    if (kind !== 'emergencyRequestForm' && !['beneficiary', 'admin', 'superuser'].includes(session?.role)) throw new Error('The existing backend requires a beneficiary or administrator account for this submission. Sign in before submitting; your request has not been sent.');
    let body, destination;
    if (kind === 'contactForm') {
      requireFields(v, ['cf-fname', 'cf-lname', 'cf-email', 'cf-subject', 'cf-message']); validateField('cf-email', validateEmail, v['cf-email']); if (v['cf-phone']) validateField('cf-phone', validatePhone, v['cf-phone']);
      body = { name: `${v['cf-fname']} ${v['cf-lname']}`, type: `Contact: ${v['cf-subject']}`, desc: `${v['cf-message']}\nEmail: ${v['cf-email']}`, phone: v['cf-phone'] || '' };
      destination = '/contact-success.html';
    } else if (kind === 'feedbackForm') {
      requireFields(v, ['feedbackName', 'feedbackEmail', 'feedbackCategory', 'feedbackText']); validateField('feedbackEmail', validateEmail, v.feedbackEmail); if (v.feedbackPhone) validateField('feedbackPhone', validatePhone, v.feedbackPhone);
      if (!Number.isInteger(Number(v.ratingValue)) || Number(v.ratingValue) < 1 || Number(v.ratingValue) > 5) throw new Error('Please select a star rating.');
      if (v.feedbackText.trim().length < 20) throw new FieldError('feedbackText', 'Please provide at least 20 characters of feedback.');
      body = { name: v.feedbackName, type: `Feedback: ${v.feedbackCategory}`, desc: `Rating: ${v.ratingValue}/5\n${v.feedbackText}\nEmail: ${v.feedbackEmail}`, phone: v.feedbackPhone || '' };
      destination = '/feedback-thankyou.html';
    } else if (kind === 'emergencyRequestForm') {
      requireFields(v, ['er-name', 'er-phone', 'er-location', 'selectedEmergencyType', 'er-desc']); validateField('er-phone', validatePhone, v['er-phone']);
      body = { name: v['er-name'], type: `Emergency: ${v.selectedEmergencyType}`, desc: v['er-desc'], urgency: 'high', location: v['er-location'], phone: v['er-phone'] };
      destination = '/emergency-success.html';
    } else {
      requireFields(v, ['fullName', 'phone', 'location', 'type', 'description']); validateField('phone', validatePhone, v.phone);
      body = { name: v.fullName, type: v.type, desc: v.description, urgency: state.urgency, location: v.location, phone: v.phone, beneficiaryEmail: session.email };
      destination = '/page4-broadcast-sent.html';
    }
    const emergencyPhoto = kind === 'emergencyRequestForm' ? state.files['emergency-request-41'] : null;
    const payload = emergencyPhoto ? new FormData() : body;
    if (emergencyPhoto) {
      Object.entries(body).forEach(([key, value]) => payload.append(key, value));
      payload.append('file', emergencyPhoto);
    }
    const saved = await api.post('/incoming', payload);
    writeStored('kindred_last_request', saved);
    navigate(destination);
  }
  async function checkout() {
    validateCheckout();
    const card = validateCard(v, 'shop-');
    const product = state.product;
    if (!product) throw new Error('Please select a product.');
    const receipt = await api.post('/orders', { productId: product.id, quantity: Number(v['checkout-qty']),
      buyerName: v['checkout-name'], buyerEmail: v['checkout-email'], buyerPhone: v['checkout-phone'], address: v['checkout-address'], ...card });
    update({ shopStep: 'success', receipt }); setValues({ 'shop-card-number': '', 'shop-card-cvv': '' }); ui.refresh();
  }
  return {
    openDonation: ([org, programId]) => openDonation(org || ui.organization?.name || 'Kindred Verified NGO', programId),
    selectAmount: ([amount]) => setValues({ 'custom-amount': String(amount) }),
    selectFrequency: ([frequency]) => update({ frequency }),
    proceedDonation: () => { validateDonation(); update({ donationStep: 2 }); },
    backDonation: () => update({ donationStep: 1 }), executeDonation: donation,
    openResourceDonateModal: () => { if (!session) return navigate('/signin.html', { state: { from: ui.path } }); setValues({ 'res-donor-name': session.name, 'res-donor-email': session.email }); update({ modal: 'resource-donate-modal' }); },
    openResourceDonationModal: () => { setValues({ 'rd-name': session?.name || '' }); update({ modal: 'resourceDonationModal' }); },
    closeResourceDonateModal: () => update({ modal: null }), closeResourceDonationModal: () => update({ modal: null }),
    submitResourceDonation: resourceDonation,
    addDonationItem: () => update({ items: [...state.items, { id: crypto.randomUUID(), name: '', quantity: 1, condition: 'New' }] }),
    submitIncoming: ([kind]) => submitIncoming(kind),
    broadcastRequest: () => submitIncoming('request-form'),
    currentLocation: () => new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocation is unavailable. Please enter your location.'));
      navigator.geolocation.getCurrentPosition((position) => { setValues({ 'er-location': `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}` }); resolve(); }, () => reject(new Error('Location access was denied. Please enter your location.')), { timeout: 10000 });
    }),
    openProductDetailModal: ([id]) => update({ product: ui.data('products').find((p) => p.id === id), modal: 'shopDetailModal' }),
    openCheckoutModal: ([id]) => { const product = ui.data('products').find((p) => p.id === id); if (!product || product.quantity < 1) throw new Error('This product is out of stock.'); update({ product, modal: 'checkoutModal', shopStep: 1, receipt: null, cardFlipped: false }); setValues({ ...clearCard('shop-'), 'checkout-address': '', 'checkout-phone': session?.phone || '', 'checkout-qty': '1', 'checkout-name': session?.name || '', 'checkout-email': session?.email || '', 'checkout-prod-id': id }); },
    closeShopDetailModal: () => update({ modal: null }), closeCheckoutModal: () => update({ modal: null }),
    proceedToShopPayment: () => { validateCheckout(); update({ shopStep: 2 }); },
    backToShopStep1: () => update({ shopStep: 1 }), executeShopPayment: checkout, updateCheckoutTotal: () => {},
    registerNgo: async () => { requireFields(v, ['register-ngo-13', 'register-ngo-16', 'register-ngo-28', 'register-ngo-41', 'register-ngo-44', 'register-ngo-47']); validateField('register-ngo-44', validateEmail, v['register-ngo-44']);
      await api.post('/organizations/register', { name: v['register-ngo-13'], focus: v['register-ngo-16'], email: v['register-ngo-44'], phone: '', city: v['register-ngo-47'] });
      update({ registeredNgo: true });
    },
  };
}
