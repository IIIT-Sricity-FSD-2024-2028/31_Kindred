function sendOTP() {
  const phoneInput = document.getElementById('phone-input');
  const phoneWrap  = phoneInput.closest('.phone-wrap');
  const phone      = phoneInput.value.trim().replace(/\s+/g, '');

  // Clear previous error
  phoneWrap.style.borderColor = '';
  const existingErr = document.getElementById('phone-error');
  if (existingErr) existingErr.remove();

  // Validate — must be 10 digits
  if (!phone || !/^\d{10}$/.test(phone)) {
    phoneWrap.style.borderColor = '#ef4444';
    const err = document.createElement('p');
    err.id = 'phone-error';
    err.style.cssText = 'color:#ef4444;font-size:.75rem;margin-top:6px';
    err.textContent = 'Please enter a valid 10-digit phone number';
    phoneWrap.parentElement.appendChild(err);
    phoneInput.focus();
    return;
  }

  // Navigate to OTP page with role + phone in URL
  const role = new URLSearchParams(window.location.search).get('role') || 'volunteer';
  window.location = `otp-verify.html?role=${encodeURIComponent(role)}&phone=${encodeURIComponent(phone)}`;
}

// Allow only digits in the phone field
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone-input');
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  });
  phoneInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendOTP();
  });
});