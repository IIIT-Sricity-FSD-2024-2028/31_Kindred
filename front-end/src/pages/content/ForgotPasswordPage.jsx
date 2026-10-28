import FormError from '../../components/pages/FormError.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField } from '../runtime/PageElements.jsx';

const questionText = { first_school: 'What was the name of your first school?', childhood_friend: 'What was the first name of your childhood best friend?', first_pet: 'What was the name of your first pet?', birth_city: 'In what city were you born?' };

export default function ForgotPasswordPage() {
  const ui = usePage();
  const questions = ui.state.recoveryQuestions;
  return <main {...ui.props('forgot-password-1', { 'data-react-page': '/forgot-password.html' })}>
    <div className="page-wrap" style={{ maxWidth: 480 }}>
      <img src="LOGO.jpeg" className="logo-pill-img" alt="Kindred" />
      <h1 className="screen-title">Forgot Password?</h1>
      <p className="screen-sub">Answer the security questions you chose at signup to reset your password.</p>
      <div className="card"><FormError />
        <div className="field"><label htmlFor="fp-email">Registered email</label><PageField field="fp-email" spec={{ id: 'fp-email', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' }} /></div>
        <div className="field"><label htmlFor="fp-role">Account role</label><PageField as="select" field="fp-role" spec={{ id: 'fp-role' }}><option value="">Choose your role</option><option value="admin">Organization Admin</option><option value="superuser">Platform Administrator</option><option value="volunteer">Volunteer</option><option value="donor">Donor</option><option value="beneficiary">Beneficiary</option><option value="seller">Seller / Artisan</option></PageField></div>
        {!questions ? <button className="btn-send" type="button" {...ui.props('fp-load-questions', { className: 'btn-send', type: 'button', actionLabel: 'Continue' }, { click: { name: 'loadRecoveryQuestions', args: [] } })}>Continue</button> : <>
          {[0, 1].map((index) => <div className="field" key={index}><label htmlFor={`fp-answer-${index + 1}`}>{questionText[questions[index]] || 'Security question'}</label><PageField field={`fp-answer-${index + 1}`} spec={{ id: `fp-answer-${index + 1}`, type: 'text', autoComplete: 'off', placeholder: 'Your answer' }} /></div>)}
          <div className="field"><label htmlFor="rp-pass">New password</label><PageField field="rp-pass" spec={{ id: 'rp-pass', type: 'password', autoComplete: 'new-password', placeholder: 'At least 8 characters' }} /></div>
          <div className="field"><label htmlFor="rp-pass2">Confirm new password</label><PageField field="rp-pass2" spec={{ id: 'rp-pass2', type: 'password', autoComplete: 'new-password', placeholder: 'Re-enter password' }} /></div>
          <button type="button" {...ui.props('fp-reset', { className: 'forgot-password-reset-button', type: 'button', actionLabel: 'Reset Password' }, { click: { name: 'recoverPassword', args: [] } })}>Reset Password</button>
        </>}
        <button className="btn-back" type="button" {...ui.props('fp-back', { className: 'btn-back', type: 'button', actionLabel: 'Back to Sign In' }, { click: { name: 'navigate', args: ['signin.html'] } })}>Back to Sign In</button>
      </div>
    </div><PageExtras inlineError />
  </main>;
}
