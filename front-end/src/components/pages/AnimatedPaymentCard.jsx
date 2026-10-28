import { usePage } from '../../pages/runtime/PageContext.js';
import '../../styles/payment-card.css';

export default function AnimatedPaymentCard({ prefix = '' }) {
  const { values, state } = usePage();
  const number = String(values[`${prefix}card-number`] || '').replace(/\D/g, '');
  const holder = values[`${prefix}card-holder-name`];
  const expiry = values[`${prefix}card-expiry`];
  const cvv = values[`${prefix}card-cvv`];
  const preview = (number + '•'.repeat(Math.max(0, 16 - number.length))).match(/.{1,4}/g)?.join(' ');
  return <div className="animated-payment-card" aria-label="Animated payment card preview">
    <div className="card-scene"><div className={`card-3d${state.cardFlipped ? ' flipped' : ''}`}>
      <div className="card-face card-front"><div className="card-front-top"><span className="card-chip" aria-hidden="true">▥</span><span className="card-network-logo">{number.startsWith('4') ? 'VISA' : number.startsWith('5') ? 'Mastercard' : 'Kindred'}</span></div><div className="card-number-display">{preview}</div><div className="card-front-bottom"><div><div className="card-label-sm">CARDHOLDER</div><div className="card-holdername">{holder || 'YOUR NAME'}</div></div><div><div className="card-label-sm">EXPIRES</div><div className="card-expiry-display">{expiry || 'MM/YY'}</div></div></div></div>
      <div className="card-face card-back"><div className="card-stripe" /><div className="card-cvv-area"><span className="card-label-sm">CVV</span><span className="card-cvv-display">{'•'.repeat(String(cvv || '').length || 3)}</span></div><span className="card-label-sm">Kindred · Card demonstration</span></div>
    </div></div>
  </div>;
}
