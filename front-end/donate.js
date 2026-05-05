/* =====================================================
   Kindred — Donate.js  (Payment Gateway v2)
   Multi-step: Step1 (amount) → Step2 (card) → Success
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── DOM References ─── */
  const donateButtons      = document.querySelectorAll('.btn-outline-sm');
  const modalOverlay       = document.getElementById('donation-modal-overlay');
  const closeBtn           = document.getElementById('close-donate-modal');
  const closeSuccessBtn    = document.getElementById('close-success-btn');
  const step1              = document.getElementById('donate-step-1');
  const step2              = document.getElementById('donate-step-2');
  const stepLoading        = document.getElementById('donate-step-loading');
  const stepSuccess        = document.getElementById('donate-step-success');
  const orgNameDisplay     = document.getElementById('donate-org-name');
  const displayTotal       = document.getElementById('display-total');
  const payAmountDisplay   = document.getElementById('pay-amount-display');
  const freqBtns           = document.querySelectorAll('.freq-btn');
  const amountBtns         = document.querySelectorAll('.amount-btn');
  const customAmountInput  = document.getElementById('custom-amount');
  const proceedBtn         = document.getElementById('proceed-donate-btn');
  const backBtn            = document.getElementById('back-to-step1');
  const payNowBtn          = document.getElementById('pay-now-btn');

  /* Card preview DOM */
  const card3d             = document.getElementById('card-3d');
  const cardNumberDisplay  = document.getElementById('card-number-display');
  const cardHolderDisplay  = document.getElementById('card-holdername-display');
  const cardExpiryDisplay  = document.getElementById('card-expiry-display');
  const cardCvvDisplay     = document.getElementById('card-cvv-display');
  const cardNetworkLogo    = document.getElementById('card-network-logo');

  /* Card fields */
  const cardNumberInput    = document.getElementById('card-number');
  const cardNameInput      = document.getElementById('card-holder-name');
  const cardExpiryInput    = document.getElementById('card-expiry');
  const cardCvvInput       = document.getElementById('card-cvv');

  let currentAmount  = 500;
  let currentFreq    = 'one-time';
  let currentOrg     = '';

  // Expose setter so external scripts can set the org name (e.g. auto-open from donor dashboard)
  window._setDonateOrg = function(name) { currentOrg = name; };

  /* ─────────────────────────────────────────────
     CARD UTILITY FUNCTIONS
  ───────────────────────────────────────────── */

  /** Luhn algorithm for card number validation */
  function luhnCheck(num) {
    return true; // Mod 10 check disabled
  }

  /** Detect card network from number prefix — only Visa (4) and Mastercard (51,52) accepted */
  function detectCardType(num) {
    const n = num.replace(/\s/g, '');
    if (/^4/.test(n))           return { name: 'Visa',       icon: '💳', color: '#1434CB', supported: true };
    if (/^5[12]/.test(n))       return { name: 'Mastercard', icon: '🔴', color: '#EB001B', supported: true };
    if (n.length > 0)           return { name: 'Unsupported', icon: '❌', color: '#ef4444', supported: false };
    return { name: '', icon: '💳', color: '#94a3b8', supported: true };
  }

  let cardPrefixValid = false;

  /** Format card number with spaces every 4 digits */
  function formatCardNumber(val) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }

  /** Mask card number for display: •••• •••• •••• 1234 */
  function maskCardNumber(formatted) {
    const raw = formatted.replace(/\s/g, '');
    if (raw.length < 4) return '•••• •••• •••• ••••';
    const last4 = raw.slice(-4);
    const visible = formatted.replace(/\d(?=(?:[\s\d]*\d){4})/g, '•');
    return visible || '•••• •••• •••• ' + last4;
  }

  /** Format expiry MM/YY */
  function formatExpiry(val) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    if (digits.length === 2) return digits + '/';
    return digits;
  }

  /** Validate expiry is in the future */
  function isExpiryValid(val) {
    const [mm, yy] = val.split('/');
    if (!mm || !yy || mm.length !== 2 || yy.length !== 2) return false;
    const month = parseInt(mm, 10);
    const year  = parseInt('20' + yy, 10);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const exp = new Date(year, month - 1);
    return exp >= new Date(now.getFullYear(), now.getMonth());
  }

  function setWrapState(wrapId, state) {  // state: 'valid' | 'invalid' | ''
    const el = document.getElementById(wrapId);
    if (!el) return;
    el.classList.remove('valid', 'invalid');
    if (state) el.classList.add(state);
  }
  function setError(errorId, msg) {
    const el = document.getElementById(errorId);
    if (el) el.textContent = msg || '';
  }

  /* ─────────────────────────────────────────────
     CARD FIELD LIVE EVENTS
  ───────────────────────────────────────────── */

  // Card Number
  cardNumberInput.addEventListener('input', function () {
    const formatted = formatCardNumber(this.value);
    this.value = formatted;
    const raw = formatted.replace(/\s/g, '');

    // Preview
    cardNumberDisplay.textContent = maskCardNumber(formatted);

    // Card type
    const type = detectCardType(formatted);
    cardNetworkLogo.textContent = type.icon;
    document.getElementById('card-type-icon').textContent = type.icon;

    // Prefix indicator
    const prefixIndicator = document.getElementById('card-prefix-indicator');
    if (prefixIndicator) {
      if (raw.length === 0) {
        prefixIndicator.innerHTML = '';
        cardPrefixValid = false;
      } else if (type.supported && type.name) {
        prefixIndicator.innerHTML = '<span style="color:#16a34a;">✓ ' + type.name + ' card detected</span>';
        cardPrefixValid = true;
      } else if (!type.supported) {
        prefixIndicator.innerHTML = '<span style="color:#ef4444;">❌ Unsupported card — Please use Visa (starts with 4) or Mastercard (starts with 51 or 52)</span>';
        cardPrefixValid = false;
      } else {
        prefixIndicator.innerHTML = '';
        cardPrefixValid = false;
      }
    }

    // Validation feedback
    if (raw.length === 16) {
      if (!type.supported) {
        setWrapState('card-num-wrap', 'invalid');
        setError('card-num-error', 'Only Visa and Mastercard are accepted.');
      } else {
        setWrapState('card-num-wrap', 'valid');
        setError('card-num-error', '');
      }
    } else if (raw.length > 0) {
      if (!type.supported) {
        setWrapState('card-num-wrap', 'invalid');
        setError('card-num-error', 'Only Visa and Mastercard are accepted.');
      } else {
        setWrapState('card-num-wrap', '');
        setError('card-num-error', '');
      }
    }
  });

  // Cardholder Name
  cardNameInput.addEventListener('input', function () {
    cardHolderDisplay.textContent = this.value.toUpperCase() || 'YOUR NAME';
    if (this.value.trim().length >= 2) {
      setWrapState('card-name-wrap', 'valid');
      setError('card-name-error', '');
    } else {
      setWrapState('card-name-wrap', '');
    }
  });

  // Expiry
  cardExpiryInput.addEventListener('input', function () {
    const formatted = formatExpiry(this.value);
    this.value = formatted;
    cardExpiryDisplay.textContent = formatted || 'MM/YY';

    if (formatted.length === 5) {
      if (isExpiryValid(formatted)) {
        setWrapState('card-exp-wrap', 'valid');
        setError('card-exp-error', '');
      } else {
        setWrapState('card-exp-wrap', 'invalid');
        setError('card-exp-error', 'Card has expired or date is invalid.');
      }
    } else {
      setWrapState('card-exp-wrap', '');
      setError('card-exp-error', '');
    }
  });

  // CVV – flip card
  cardCvvInput.addEventListener('focus', () => card3d.classList.add('flipped'));
  cardCvvInput.addEventListener('blur',  () => card3d.classList.remove('flipped'));
  cardCvvInput.addEventListener('input', function () {
    const val = this.value.replace(/\D/g, '').slice(0, 4);
    this.value = val;
    cardCvvDisplay.textContent = '•'.repeat(val.length) || '•••';
    if (val.length >= 3) {
      setWrapState('card-cvv-wrap', 'valid');
      setError('card-cvv-error', '');
    } else {
      setWrapState('card-cvv-wrap', '');
    }
  });

  /* ─────────────────────────────────────────────
     STEP 1 LOGIC
  ───────────────────────────────────────────── */

  // Open Modal
  donateButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = e.target.closest('.small-org-card');
      const orgName = card ? card.querySelector('h4').textContent : 'Kindred Verified NGO';
      currentOrg = orgName;
      orgNameDisplay.textContent = orgName;
      resetModalState();

      // Auto-fill user info if logged in
      const session = sessionStorage.getItem('kindred_session');
      if (session) {
        try {
          const user = JSON.parse(session);
          document.getElementById('donor-name').value  = user.name  || '';
          document.getElementById('donor-email').value = user.email || '';
        } catch (e) {}
      }

      modalOverlay.style.display = 'flex';
    });
  });

  // Frequency Toggle
  freqBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      freqBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFreq = this.dataset.freq;
    });
  });

  // Preset Amounts
  amountBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      customAmountInput.value = '';
      amountBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentAmount = parseInt(this.dataset.amount);
      updateTotalDisplay();
    });
  });

  // Custom Amount
  customAmountInput.addEventListener('input', function () {
    amountBtns.forEach(b => b.classList.remove('active'));
    currentAmount = this.value && !isNaN(this.value) ? parseInt(this.value) : 0;
    updateTotalDisplay();
  });

  function updateTotalDisplay() {
    const fmt = `₹${currentAmount.toLocaleString('en-IN')}`;
    displayTotal.textContent      = fmt;
    if (payAmountDisplay) payAmountDisplay.textContent = fmt;
    proceedBtn.disabled = currentAmount < 100;
  }

  // Proceed to card step
  proceedBtn.addEventListener('click', function () {
    const name  = document.getElementById('donor-name').value.trim();
    const email = document.getElementById('donor-email').value.trim();
    if (!name) { alert('Please enter your full name.'); return; }
    if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
    if (currentAmount < 100) { alert('Minimum donation amount is ₹100.'); return; }

    // Pre-fill cardholder name from donor name
    if (!cardNameInput.value) {
      cardNameInput.value = name.toUpperCase();
      cardHolderDisplay.textContent = name.toUpperCase();
    }

    step1.style.display = 'none';
    step2.style.display = 'block';
    if (payAmountDisplay) payAmountDisplay.textContent = `₹${currentAmount.toLocaleString('en-IN')}`;
  });

  /* ─────────────────────────────────────────────
     STEP 2 LOGIC — Pay Now
  ───────────────────────────────────────────── */

  backBtn.addEventListener('click', function () {
    step2.style.display = 'none';
    step1.style.display = 'block';
  });

  payNowBtn.addEventListener('click', function () {
    // Run all validations
    let isValid = true;

    const cardRaw = cardNumberInput.value.replace(/\s/g, '');
    const cardType = detectCardType(cardRaw);
    if (cardRaw.length !== 16) {
      setWrapState('card-num-wrap', 'invalid');
      setError('card-num-error', 'Please enter a valid 16-digit card number.');
      isValid = false;
    } else if (!cardType.supported) {
      setWrapState('card-num-wrap', 'invalid');
      setError('card-num-error', 'Only Visa (starts with 4) and Mastercard (starts with 51 or 52) are accepted.');
      isValid = false;
    }

    if (cardNameInput.value.trim().length < 2) {
      setWrapState('card-name-wrap', 'invalid');
      setError('card-name-error', 'Please enter the cardholder name as on card.');
      isValid = false;
    }

    const expiry = cardExpiryInput.value;
    if (expiry.length !== 5 || !isExpiryValid(expiry)) {
      setWrapState('card-exp-wrap', 'invalid');
      setError('card-exp-error', 'Enter a valid future expiry date (MM/YY).');
      isValid = false;
    }

    const cvv = cardCvvInput.value;
    if (cvv.length < 3) {
      setWrapState('card-cvv-wrap', 'invalid');
      setError('card-cvv-error', 'CVV must be 3–4 digits.');
      isValid = false;
    }

    if (!isValid) return;

    // Show loading
    step2.style.display = 'none';
    stepLoading.style.display = 'block';

    // Simulate payment
    setTimeout(() => {
      const txnId  = 'KND' + Date.now().toString().slice(-8).toUpperCase();
      const last4  = cardRaw.slice(-4);
      const type   = detectCardType(cardRaw);
      const donorName  = document.getElementById('donor-name').value.trim();
      const donorEmail = document.getElementById('donor-email').value.trim();
      const saveCard   = document.getElementById('save-card-check').checked;

      // Build donation record
      const donation = {
        id:         txnId,
        org:        currentOrg,
        amount:     currentAmount,
        frequency:  currentFreq,
        date:       new Date().toISOString(),
        donor:      donorName,
        email:      donorEmail,
        cardLast4:  last4,
        cardType:   type.name,
        status:     'paid'
      };

      // Save donation to localStorage
      const existing = JSON.parse(localStorage.getItem('kindred_donations') || '[]');
      existing.unshift(donation);
      localStorage.setItem('kindred_donations', JSON.stringify(existing));

      // Optionally save card
      if (saveCard) {
        const cards = JSON.parse(localStorage.getItem('kindred_saved_cards') || '[]');
        const cardRecord = { last4, type: type.name, icon: type.icon, expiry: cardExpiryInput.value, holder: cardNameInput.value };
        if (!cards.some(c => c.last4 === last4)) cards.unshift(cardRecord);
        localStorage.setItem('kindred_saved_cards', JSON.stringify(cards.slice(0, 5)));
      }

      // Update success screen
      document.getElementById('success-amount').textContent = `₹${currentAmount.toLocaleString('en-IN')}`;
      document.getElementById('success-org').textContent    = currentOrg;
      document.getElementById('success-txn-id').textContent = txnId;
      document.getElementById('success-card-mask').textContent = `${type.icon} ${type.name} •••• ${last4}`;

      stepLoading.style.display = 'none';
      stepSuccess.style.display  = 'block';
    }, 2200);
  });

  /* ─────────────────────────────────────────────
     CLOSE / RESET
  ───────────────────────────────────────────── */

  function closeModal() { modalOverlay.style.display = 'none'; }
  closeBtn.addEventListener('click', closeModal);
  closeSuccessBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  function resetModalState() {
    step1.style.display      = 'block';
    step2.style.display      = 'none';
    stepLoading.style.display = 'none';
    stepSuccess.style.display = 'none';

    amountBtns.forEach(b => b.classList.remove('active'));
    amountBtns[0].classList.add('active');
    customAmountInput.value = '';
    currentAmount = 500;
    updateTotalDisplay();

    // Reset card fields
    cardNumberInput.value = '';
    cardNameInput.value   = '';
    cardExpiryInput.value = '';
    cardCvvInput.value    = '';
    cardNumberDisplay.textContent = '•••• •••• •••• ••••';
    cardHolderDisplay.textContent = 'YOUR NAME';
    cardExpiryDisplay.textContent = 'MM/YY';
    cardCvvDisplay.textContent    = '•••';
    cardNetworkLogo.textContent   = '';
    card3d.classList.remove('flipped');

    ['card-num-wrap','card-name-wrap','card-exp-wrap','card-cvv-wrap'].forEach(id => setWrapState(id, ''));
    ['card-num-error','card-name-error','card-exp-error','card-cvv-error'].forEach(id => setError(id, ''));
  }
});
