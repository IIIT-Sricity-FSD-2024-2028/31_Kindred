document.addEventListener('DOMContentLoaded', () => {
  // Read URL params
  const params = new URLSearchParams(window.location.search);
  const role  = params.get('role')  || 'volunteer';
  const phone = params.get('phone') || 'your phone';
  const dashMap = { volunteer:'Volunteer', donor:'Donor', beneficiary:'Beneficiary' };

  const dispEl = document.getElementById('phone-display-num');
  if (dispEl) dispEl.textContent = '+91 ' + phone;

  const dashEl = document.getElementById('dash-text');
  if (dashEl) dashEl.textContent = `After verification, you'll go directly to your ${dashMap[role] || 'User'} Dashboard`;

  // OTP box behaviour
  const inputs = document.querySelectorAll('.otp-input');
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/\D/g, '');
      if (inp.value.length === 1) {
        inp.classList.add('filled');
        if (i < inputs.length - 1) inputs[i + 1].focus();
      } else {
        inp.classList.remove('filled');
      }
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && inp.value === '' && i > 0) {
        inputs[i - 1].classList.remove('filled');
        inputs[i - 1].focus();
      }
    });
  });
});

function verifyOTP() {
  const inputs = document.querySelectorAll('.otp-input');
  const code = Array.from(inputs).map(i => i.value).join('');
  if (code.length < 6) {
    inputs.forEach(i => { i.classList.add('error'); i.classList.remove('filled'); });
    setTimeout(() => inputs.forEach(i => i.classList.remove('error')), 1500);
    return;
  }
  document.body.innerHTML += '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:#10b981;z-index:9999;">✅ Done Verify</div>';
  setTimeout(() => window.history.back(), 1500);
}
