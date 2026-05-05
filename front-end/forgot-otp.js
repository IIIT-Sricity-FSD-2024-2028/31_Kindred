document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const phone  = params.get('phone') || 'XXXXX XXXXX';
  const role   = params.get('role')  || 'volunteer';

  // Show masked phone
  const masked = phone.slice(0,5).replace(/\d/g,'X') + ' ' + phone.slice(5);
  document.getElementById('fotp-phone').textContent = '+91 ' + masked;

  // OTP auto-advance
  const inputs = document.querySelectorAll('.otp4-input');
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/\D/g,'');
      if (inp.value.length === 1) {
        inp.classList.add('filled');
        if (i < inputs.length - 1) inputs[i+1].focus();
      } else {
        inp.classList.remove('filled');
      }
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && inp.value === '' && i > 0) {
        inputs[i-1].classList.remove('filled');
        inputs[i-1].focus();
      }
      if (e.key === 'Enter') verifyFOTP();
    });
  });
});

function resendOTP() {
  document.querySelectorAll('.otp4-input').forEach(i => {
    i.value=''; i.classList.remove('filled','error');
  });
  document.querySelectorAll('.otp4-input')[0].focus();
  const btn = document.querySelector('.resend-btn');
  btn.textContent = '✅ OTP Resent!';
  setTimeout(() => btn.innerHTML = `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg> Resend OTP`, 2000);
}

function verifyFOTP() {
  const inputs = document.querySelectorAll('.otp4-input');
  const code   = Array.from(inputs).map(i => i.value).join('');
  const errEl  = document.getElementById('fotp-error');

  inputs.forEach(i => i.classList.remove('error'));
  errEl.style.display = 'none';

  if (code.length < 4) {
    inputs.forEach(i => { if(!i.value) i.classList.add('error'); });
    errEl.textContent = 'Please enter the complete 4-digit OTP';
    errEl.style.display = 'block';
    return;
  }

  const role = new URLSearchParams(window.location.search).get('role') || 'volunteer';
  window.location = `reset-password.html?role=${encodeURIComponent(role)}`;
}
