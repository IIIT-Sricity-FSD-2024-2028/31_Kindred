function selectFPRole(btn) {
  document.querySelectorAll('#fp-role-list .role-list-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('fp-role-error').style.display = 'none';
}

function sendFPOTP() {
  const phone     = document.getElementById('fp-phone').value.trim().replace(/\s/g,'');
  const phoneWrap = document.getElementById('fp-phone-wrap');
  const phoneErr  = document.getElementById('fp-phone-error');
  const roleErr   = document.getElementById('fp-role-error');
  const roleBtn   = document.querySelector('#fp-role-list .role-list-item.active');

  // Reset
  phoneWrap.style.borderColor = '';
  phoneErr.style.display = 'none';
  roleErr.style.display  = 'none';

  let valid = true;

  if (!phone || !/^\d{10}$/.test(phone)) {
    phoneWrap.style.borderColor = '#ef4444';
    phoneErr.textContent = 'Please enter a valid 10-digit mobile number';
    phoneErr.style.display = 'block';
    valid = false;
  }
  if (!roleBtn) {
    roleErr.textContent = 'Please select your role to continue';
    roleErr.style.display = 'block';
    valid = false;
  }

  if (valid) {
    const role = roleBtn.dataset.role;
    // Pass phone + role to OTP page
    window.location = `forgot-otp.html?phone=${encodeURIComponent(phone)}&role=${encodeURIComponent(role)}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // digits only
  const inp = document.getElementById('fp-phone');
  inp.addEventListener('input', () => {
    inp.value = inp.value.replace(/\D/g,'').slice(0,10);
  });
  inp.addEventListener('keydown', e => { if(e.key==='Enter') sendFPOTP(); });
});
