import { FieldError, validateField, requireFields, validateEmail, validatePasswordFields, validatePhone } from '../../services/validation.js';
import { readStored, writeStored } from '../../services/storage.js';
import { safeNotificationLink } from '../../services/notifications.js';
import { apiClient } from '../../services/auth.js';

export const demoCredentials = {
  platform: ['super@kindred.org', 'Super@123'], org: ['admin@hopeconnect.org', 'Admin@123'],
  volunteer: ['volunteer@kindred.org', 'Vol@123'], donor: ['donor@kindred.org', 'Donor@123'],
  beneficiary: ['beneficiary@kindred.org', 'Ben@123'], seller: ['seller@kindred.org', 'Seller@123'],
  master: ['super@kindred.org', 'Super@123'], team1: ['admin1@kindred.org', 'Admin1@123'], team2: ['admin2@kindred.org', 'Admin2@123'],
};
export const authRole = (role) => ({ platform: 'superuser', org: 'admin' }[role] || role);

export function authActions(ui) {
  const { values: v, state, update, setValues, session, api, navigate, location } = ui;
  function selectRole(role) {
    update({ selectedRole: role, error: '', fieldErrors: {}, ...(role === 'platform' ? { team: 'master' } : {}) });
    const credentials = demoCredentials[role];
    if (credentials && ui.path === '/signin.html') setValues({ 'si-email': credentials[0], 'si-pass': credentials[1] });
  }
  async function signIn() {
    if (!state.selectedRole) throw new Error('Please select your role.');
    requireFields(v, ['si-email', 'si-pass']); validateField('si-email', validateEmail, v['si-email']);
    const user = await ui.signIn({ email: v['si-email'].trim(), password: v['si-pass'], role: authRole(state.selectedRole) });
    const params = new URLSearchParams(location?.search || '');
    const joinProgramId = params.get('joinProgram');
    if (joinProgramId) {
      if (['admin', 'superuser'].includes(user.role)) throw new Error('Sign in with a volunteer or community account to send this join request.');
      const program = await apiClient.get(`/programs/${encodeURIComponent(joinProgramId)}`);
      await apiClient.post('/program-applications', { programId: program.id, programName: program.name, volunteerEmail: user.email, volunteerName: user.name, message: 'I would like to join this program as a volunteer.' });
      ui.toast({ type: 'success', title: 'Join request submitted', body: 'The organization admin can now review your request.' });
    }
    const redirect = location.state?.from || params.get('redirect') || readStored('kindred_signup_destination');
    writeStored('kindred_signup_destination', null);
    navigate(safeNotificationLink(redirect) || user.dashboard, { replace: true });
  }
  async function register(role, prefix) {
    requireFields(v, [`${prefix}-name`, `${prefix}-email`, `${prefix}-phone`, `${prefix}-pass`, `${prefix}-pass2`]);
    if (v[`${prefix}-name`].trim().length < 2) throw new FieldError(`${prefix}-name`, 'Full name is required (min 2 characters)');
    validateField(`${prefix}-email`, validateEmail, v[`${prefix}-email`]); validatePasswordFields(v, `${prefix}-pass`, `${prefix}-pass2`);
    if (v[`${prefix}-phone`]) validateField(`${prefix}-phone`, validatePhone, v[`${prefix}-phone`]);
    requireFields(v, ['security-question-1', 'security-answer-1', 'security-question-2', 'security-answer-2']);
    if (v['security-question-1'] === v['security-question-2']) throw new FieldError('security-question-2', 'Choose a different question for each answer.');
    const body = { name: v[`${prefix}-name`].trim(), email: v[`${prefix}-email`].trim(), password: v[`${prefix}-pass`], role,
      securityQuestion1: v['security-question-1'], securityAnswer1: v['security-answer-1'].trim(),
      securityQuestion2: v['security-question-2'], securityAnswer2: v['security-answer-2'].trim(),
      phone: v[`${prefix}-phone`] || '', skills: Object.keys(v).filter((k) => k.startsWith('skill-') && v[k]).map((k) => k.slice(6)).concat(state.customSkills),
    };
    if (role === 'admin') {
      requireFields(v, ['org-name', 'org-admin', 'org-focus', 'org-loc', 'org-phone']);
      if (!state.files['org-cert-file']) throw new FieldError('org-cert-file', 'Please attach your organization registration certificate.');
      body.name = v['org-admin']; body.org = v['org-name'];
    }
    if (role === 'seller') requireFields(v, ['seller-business']);
    if (prefix === 'jv') { if (!state.gender || !state.availability) throw new Error('Please select your gender and availability.'); body.bio = `Gender: ${state.gender}. Availability: ${state.availability}.`; }
    const previous = state.registrationProgress;
    if (previous && (previous.email !== body.email || previous.role !== role)) throw new Error('An account was already created in this form. Finish its registration before changing email or role.');
    let certificate = previous?.certificate;
    if (role === 'admin' && !certificate) {
      const certificateForm = new FormData();
      certificateForm.append('file', state.files['org-cert-file']);
      certificate = await api.post('/organizations/upload-certificate', certificateForm);
      update({ registrationProgress: { ...previous, certificate, email: body.email, role } });
    }
    let user = previous?.user;
    if (!user) {
      const created = await api.post('/users/register', body);
      user = { id: created.id, name: created.name, email: created.email, role: created.role, status: created.status };
      update({ registrationProgress: { user, certificate, email: body.email, role, relatedComplete: false } });
    }
    // A separate seller record is required by the existing catalog API.
    if (role === 'seller' && !previous?.relatedComplete) {
      try {
        await api.post('/sellers', { name: body.name, email: body.email, phone: body.phone,
          businessName: v['seller-business'], businessDescription: v['seller-desc'] || '' });
      } catch (error) {
        throw new Error(`Your account was created, but the seller profile failed: ${error.message} Retry this form to finish the remaining step.`, { cause: error });
      }
    }
    if (role === 'admin' && !previous?.relatedComplete) {
      try {
        await api.post('/organizations/register', { name: body.org, focus: v['org-focus'], email: body.email, phone: v['org-phone'], city: v['org-loc'], certificateUrl: certificate?.url, certificateName: certificate?.originalName || certificate?.filename });
      } catch (error) { throw new Error(`Your account was created, but organization registration failed: ${error.message} Retry this form to finish the remaining step.`, { cause: error }); }
    }
    update({ registrationProgress: { user, certificate, email: body.email, role, relatedComplete: true } });
    if (user.status === 'approved') {
      const signedIn = await ui.signIn({ email: body.email, password: body.password, role });
      navigate(safeNotificationLink(new URLSearchParams(location?.search || '').get('redirect')) || signedIn.dashboard);
    } else {
      writeStored('kindred_signup_destination', safeNotificationLink(new URLSearchParams(location?.search || '').get('redirect')));
      writeStored('kindred_registration', { name: user.name, email: user.email, role: user.role });
      navigate('/registration-pending.html');
    }
  }
  async function saveProfile() {
    if (!['admin','superuser'].includes(session.role)) throw new Error('The current backend allows profile updates only for organization and platform administrators. Your changes have not been saved.');
    requireFields(v, ['pf-name']);
    if (v['pf-name'].trim().length < 2) throw new FieldError('pf-name', 'Enter a name of at least 2 characters.');
    if (v['pf-phone']) validateField('pf-phone', validatePhone, v['pf-phone']);
    const saved = await api.patch(`/users/${encodeURIComponent(session.id)}`, { name: v['pf-name'].trim(), phone: v['pf-phone'] || '', bio: v['pf-bio'] || '' });
    ui.updateSession(saved);
    ui.refresh(); ui.toast({ type: 'success', title: 'Profile saved' });
  }
  async function saveRecoveryQuestions() {
    if (!session?.id) throw new Error('Sign in to update your account recovery questions.');
    requireFields(v, ['pf-security-question-1', 'pf-security-answer-1', 'pf-security-question-2', 'pf-security-answer-2']);
    if (v['pf-security-question-1'] === v['pf-security-question-2']) throw new FieldError('pf-security-question-2', 'Choose a different question for each answer.');
    await api.patch(`/users/${encodeURIComponent(session.id)}/security-questions`, {
      securityQuestion1: v['pf-security-question-1'], securityAnswer1: v['pf-security-answer-1'].trim(),
      securityQuestion2: v['pf-security-question-2'], securityAnswer2: v['pf-security-answer-2'].trim(),
    });
    setValues({ 'pf-security-answer-1': '', 'pf-security-answer-2': '' });
    ui.toast({ type: 'success', title: 'Recovery questions saved' });
  }
  return {
    selectRole: (args, meta) => selectRole(args[0] || meta['data-role']),
    selectSignInRole: (_args, meta) => selectRole(meta['data-role']),
    selectAdminSubteam: ([team]) => { update({ team }); const credentials = demoCredentials[team]; setValues({ 'si-email': credentials[0], 'si-pass': credentials[1] }); },
    signIn, doSignIn: signIn,
    autoLogin: async ([role]) => { const credentials = demoCredentials[role === 'superuser' ? 'platform' : role === 'admin' ? 'org' : role]; const user = await ui.signIn({ email: credentials[0], password: credentials[1], role }); navigate(user.dashboard); },
    togglePass: ([field]) => update({ visiblePasswords: { ...state.visiblePasswords, [field]: !state.visiblePasswords[field] } }),
    selectGender: (_args, meta) => update({ gender: meta.label }),
    selectAvailability: (_args, meta) => update({ availability: meta['data-val'] || meta.label }),
    submitOrg: () => register('admin', 'org'), submitVolunteer: () => register('volunteer', 'vol'),
    submitDonor: () => register('donor', 'don'), submitBeneficiary: () => register('beneficiary', 'ben'),
    submitSeller: () => register('seller', 'seller'), submitVolunteerForm: () => register('volunteer', 'jv'),
    saveProfile, saveRecoveryQuestions,
    resetForm: () => setValues({ 'pf-name': ui.savedProfile.name || session.name, 'pf-phone': ui.savedProfile.phone || '', 'pf-bio': ui.savedProfile.bio || session.bio || '' }),
    saveSkills: async () => {
      if (!['admin','superuser'].includes(session.role)) throw new Error('The backend does not permit this role to update skills. Your changes have not been saved.');
      const skills = Object.keys(v).filter((k) => k.startsWith('pf-skill-') && v[k]).map((k) => k.slice(9)).concat(state.customSkills);
      await api.patch(`/users/${encodeURIComponent(session.id)}`, { skills }); ui.toast({ type: 'success', title: 'Skills saved' });
    },
    resetSkills: () => { update({ customSkills: ui.savedSkills.custom, customSkillsTouched: false, touchedFields: state.touchedFields.filter((field) => !field.startsWith('pf-skill-')) }); setValues(ui.savedSkills.checks); },
    changePassword: async () => {
      validatePasswordFields(v, 'pf-newpass', 'pf-newpass2');
      if (!['admin','superuser'].includes(session.role)) throw new Error('The backend has no password-change endpoint for this role. Your password has not changed.');
      await api.patch(`/users/${encodeURIComponent(session.id)}`, { password: v['pf-newpass'] }); setValues({ 'pf-newpass': '', 'pf-newpass2': '' }); ui.toast({ type: 'success', title: 'Password updated' });
    },
    addCustomSkillJV: () => ui.addSkill('jv-custom-skill'), addCustomSkillProfile: () => ui.addSkill('pf-custom-skill'),
    removeCert: () => ui.clearFile('org-cert-file'),
    sendOTP: () => { validateField('phone-input', validatePhone, v['phone-input']); throw new Error('Phone verification is unavailable: the backend has no OTP send/verify endpoints.'); },
    loadRecoveryQuestions: async () => {
      requireFields(v, ['fp-email', 'fp-role']); validateField('fp-email', validateEmail, v['fp-email']);
      const result = await api.post('/users/recovery-questions', { email: v['fp-email'].trim(), role: v['fp-role'] });
      update({ recoveryQuestions: result, recoveryEmail: v['fp-email'].trim(), recoveryRole: v['fp-role'] });
    },
    recoverPassword: async () => {
      if (!state.recoveryQuestions || state.recoveryEmail !== v['fp-email']?.trim() || state.recoveryRole !== v['fp-role']) throw new Error('Continue again to load the security questions for this account.');
      requireFields(v, ['fp-answer-1', 'fp-answer-2', 'rp-pass', 'rp-pass2']); validatePasswordFields(v, 'rp-pass', 'rp-pass2');
      await api.post('/users/recover-password', { email: v['fp-email'].trim(), role: v['fp-role'], securityAnswer1: v['fp-answer-1'], securityAnswer2: v['fp-answer-2'], newPassword: v['rp-pass'] });
      update({ recoveryQuestions: null }); setValues({ 'fp-answer-1': '', 'fp-answer-2': '', 'rp-pass': '', 'rp-pass2': '' });
      ui.toast({ type: 'success', title: 'Password updated', body: 'You can now sign in with your new password.' }); navigate('/signin.html');
    },
    selectFPRole: (_args, meta) => update({ selectedRole: meta['data-role'] }),
    resendOTP: () => { throw new Error('The backend has no OTP delivery endpoint. No code was sent.'); },
    verifyOTP: () => { throw new Error('The backend has no OTP verification endpoint.'); },
    verifyFOTP: () => { throw new Error('The backend has no password recovery verification endpoint.'); },
    resetPassword: () => { validatePasswordFields(v, 'rp-pass', 'rp-pass2'); throw new Error('Start password recovery from Forgot Password to verify your security answers.'); },
    checkStrength: () => {},
  };
}
