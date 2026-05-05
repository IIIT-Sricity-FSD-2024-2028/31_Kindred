// ===== DATA =====

var organizations = [
  { name: 'HopeConnect', joined: 'Joined Jan 2024', focus: 'Disaster Relief', status: 'active', volunteers: '1,240', beneficiaries: '15,400', rating: 4.8, color: '#6366f1' },
  { name: 'MyTrust Foundation', joined: 'Joined Feb 2024', focus: 'Community Development', status: 'active', volunteers: '1,850', beneficiaries: '12,800', rating: 4.7, color: '#ec4899' },
  { name: 'GreenEarth Initiative', joined: 'Joined Mar 2024', focus: 'Environment', status: 'active', volunteers: '990', beneficiaries: '8,200', rating: 4.6, color: '#22c55e' },
  { name: 'EduBridge', joined: 'Joined Feb 2024', focus: 'Education', status: 'active', volunteers: '2,130', beneficiaries: '32,000', rating: 4.9, color: '#f59e0b' },
  { name: 'MedReach', joined: 'Joined Nov 2024', focus: 'Healthcare', status: 'active', volunteers: '760', beneficiaries: '6,800', rating: 4.5, color: '#ef4444' },
  { name: 'FoodFirst Alliance', joined: 'Joined Apr 2024', focus: 'Food Security', status: 'active', volunteers: '1,580', beneficiaries: '22,000', rating: 4.7, color: '#14b8a6' },
  { name: 'ShelterHope', joined: 'Joined Jul 2024', focus: 'Housing', status: 'active', volunteers: '430', beneficiaries: '3,200', rating: 3.9, color: '#8b5cf6' },
  { name: 'CareBridge', joined: 'Joined Aug 2024', focus: 'Elder Care', status: 'active', volunteers: '520', beneficiaries: '4,100', rating: 4.3, color: '#06b6d4' },
  { name: 'GlobalAid Network', joined: 'Joined Jan 2024', focus: 'International Aid', status: 'active', volunteers: '3,200', beneficiaries: '45,000', rating: 4.8, color: '#84cc16' },
  { name: 'PathFinders', joined: 'Joined Sep 2024', focus: 'Youth Empowerment', status: 'active', volunteers: '980', beneficiaries: '7,600', rating: 4.4, color: '#f97316' },
  { name: 'EcoTrust Foundation', joined: 'Joined Oct 2024', focus: 'Sustainability', status: 'active', volunteers: '870', beneficiaries: '5,200', rating: 4.2, color: '#10b981' },
  { name: 'BrightFutures', joined: 'Joined Jan 2024', focus: 'Child Welfare', status: 'active', volunteers: '1,120', beneficiaries: '9,800', rating: 4.6, color: '#a855f7' }
];

var emergencyRequests = [
  { id: 'ER-2401', title: 'Cyclone Relief', location: 'Odisha', severity: 'high', label: 'High Priority' },
  { id: 'ER-2702', title: 'Medical Emergency', location: 'Bihar', severity: 'high', label: 'High Priority' },
  { id: 'ER-0203', title: 'Flood Damage', location: 'Assam', severity: 'medium', label: 'Medium' }
];

// ===== RENDER ORG TABLE =====

function renderOrgTable(filter) {
  var tbody = document.getElementById('orgTableBody');
  if (!tbody) return;

  var filtered = organizations;
  if (filter) {
    var q = filter.toLowerCase();
    filtered = organizations.filter(function (org) {
      return org.name.toLowerCase().indexOf(q) !== -1 || org.focus.toLowerCase().indexOf(q) !== -1;
    });
  }

  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    var org = filtered[i];
    var initial = org.name.charAt(0);
    html += '<tr>';
    html += '<td><div class="org-info"><div class="org-avatar" style="background:' + org.color + '">' + initial + '</div><div><div class="org-name">' + org.name + '</div><div class="org-joined">' + org.joined + '</div></div></div></td>';
    html += '<td>' + org.focus + '</td>';
    html += '<td><span class="status-badge active">active</span></td>';
    html += '<td>' + org.volunteers + '</td>';
    html += '<td>' + org.beneficiaries + '</td>';
    html += '<td>' + org.rating + '</td>';
    html += '<td><div class="action-btns"><button class="action-btn" title="View">👁</button><button class="action-btn" title="Analytics">📊</button></div></td>';
    html += '</tr>';
  }
  tbody.innerHTML = html;
}

// ===== SEARCH =====

var searchInput = document.getElementById('searchOrgs');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    renderOrgTable(this.value);
  });
}

// ===== RENDER EMERGENCY REQUESTS =====

function renderEmergencyRequests() {
  var container = document.getElementById('emergencyRequests');
  if (!container) return;

  var html = '';
  for (var i = 0; i < emergencyRequests.length; i++) {
    var er = emergencyRequests[i];
    var dotClass = er.severity === 'high' ? 'red' : 'orange';
    html += '<div class="emergency-card ' + er.severity + '">';
    html += '<div class="emergency-info">';
    html += '<h4>' + er.id + ' · ' + er.title + '</h4>';
    html += '<p><span class="emergency-dot ' + dotClass + '"></span>' + er.location + '</p>';
    html += '</div>';
    html += '<span class="emergency-priority ' + er.severity + '">' + er.label + '</span>';
    html += '</div>';
  }
  container.innerHTML = html;
}

// ===== REQUEST ACTIONS =====

function approveRequest(id) {
  var card = document.getElementById(id);
  if (card) {
    card.style.transition = 'opacity 0.4s, transform 0.4s';
    card.style.opacity = '0';
    card.style.transform = 'translateX(40px)';
    setTimeout(function () {
      card.remove();
      updateRequestCount();
    }, 400);
  }
}

function rejectRequest(id) {
  var card = document.getElementById(id);
  if (card) {
    card.style.transition = 'opacity 0.4s, transform 0.4s';
    card.style.opacity = '0';
    card.style.transform = 'translateX(-40px)';
    setTimeout(function () {
      card.remove();
      updateRequestCount();
    }, 400);
  }
}

function updateRequestCount() {
  var list = document.getElementById('requestsList');
  var count = 0;
  if (list) {
    count = list.querySelectorAll('.request-card').length;
  }
  var badge = document.getElementById('requestBadge');
  if (badge) {
    badge.textContent = count + ' pending';
  }
  var tabRequests = document.getElementById('tab-requests');
  if (tabRequests) {
    tabRequests.textContent = 'Requests (' + count + ')';
  }
}



// ===== INIT =====

document.addEventListener('DOMContentLoaded', function () {
  renderOrgTable();
  renderEmergencyRequests();
  renderCampaigns();
  renderPartners();
  renderTestimonials();
  animateCounters();
  initStarRating();
  initOtpInputs();
  initFeedbackForm();
  initEmergencyVerify();
  initEmergencyRequestForm();
});

// ===== HOME PAGE DATA =====

var campaigns = [
  {
    org: 'HopeConnect',
    orgColor: '#6366f1',
    title: 'Cyclone Relief Fund for Odisha',
    desc: 'Providing shelter, food, and medical aid to families affected by the recent cyclone.',
    raised: 850000,
    goal: 1200000,
    color: '#00c9a7',
    donors: 342
  },
  {
    org: 'EduBridge',
    orgColor: '#f59e0b',
    title: 'Books & Tablets for Rural Schools',
    desc: 'Equipping 50 rural schools with digital learning resources.',
    raised: 430000,
    goal: 800000,
    color: '#3b82f6',
    donors: 189
  },
  {
    org: 'MedReach',
    orgColor: '#ef4444',
    title: 'Free Eye Camp in Bihar',
    desc: 'Conducting free eye checkups and surgeries in remote villages.',
    raised: 290000,
    goal: 500000,
    color: '#8b5cf6',
    donors: 156
  },
  {
    org: 'GreenEarth',
    orgColor: '#22c55e',
    title: 'Plant 10,000 Trees Campaign',
    desc: 'Restoring green cover in deforested areas across Karnataka.',
    raised: 180000,
    goal: 350000,
    color: '#059669',
    donors: 275
  }
];

var partners = [
  { name: 'HopeConnect', focus: 'Disaster Relief', color: '#6366f1' },
  { name: 'MyTrust Foundation', focus: 'Community Dev', color: '#ec4899' },
  { name: 'GreenEarth Initiative', focus: 'Environment', color: '#22c55e' },
  { name: 'EduBridge', focus: 'Education', color: '#f59e0b' },
  { name: 'MedReach', focus: 'Healthcare', color: '#ef4444' },
  { name: 'FoodFirst Alliance', focus: 'Food Security', color: '#14b8a6' },
  { name: 'ShelterHope', focus: 'Housing', color: '#8b5cf6' },
  { name: 'BrightFutures', focus: 'Child Welfare', color: '#a855f7' }
];

var testimonials = [
  {
    text: 'Joining Kindred as a volunteer has been a transformative experience. I\'ve been able to contribute to disaster relief efforts and see real impact in communities.',
    name: 'Arjun Mehta',
    role: 'Volunteer, Mumbai',
    color: '#6366f1',
    stars: 5
  },
  {
    text: 'As an NGO, Kindred helped us connect with over 500 volunteers in just 3 months. The platform is incredibly well-designed and easy to use.',
    name: 'Priya Sharma',
    role: 'NGO Admin, Delhi',
    color: '#00c9a7',
    stars: 5
  },
  {
    text: 'I\'ve donated to multiple campaigns on Kindred and love how transparent the fund utilization reports are. I know my money is making a real difference.',
    name: 'Rajesh Patel',
    role: 'Donor, Ahmedabad',
    color: '#f59e0b',
    stars: 5
  }
];

// ===== RENDER CAMPAIGNS =====

function renderCampaigns() {
  var container = document.getElementById('campaignsGrid');
  if (!container) return;

  var html = '';
  for (var i = 0; i < campaigns.length; i++) {
    var c = campaigns[i];
    var pct = Math.round((c.raised / c.goal) * 100);
    var raisedStr = '₹' + formatNumber(c.raised);
    var goalStr = '₹' + formatNumber(c.goal);
    html += '<div class="campaign-card">';
    html += '<div class="campaign-org"><div class="campaign-org-avatar" style="background:' + c.orgColor + '">' + c.org.charAt(0) + '</div><span class="campaign-org-name">' + c.org + '</span></div>';
    html += '<div class="campaign-title">' + c.title + '</div>';
    html += '<div class="campaign-desc">' + c.desc + '</div>';
    html += '<div class="campaign-progress-bar"><div class="campaign-progress-fill" style="width:' + pct + '%;background:' + c.color + '"></div></div>';
    html += '<div class="campaign-progress-info"><span><strong>' + raisedStr + '</strong> raised</span><span>' + pct + '% of ' + goalStr + '</span></div>';
    html += '<a href="#" class="btn-campaign-donate" style="background:' + c.color + '">💛 Donate Now</a>';
    html += '</div>';
  }
  container.innerHTML = html;
}

function formatNumber(n) {
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

// ===== RENDER PARTNERS =====

function renderPartners() {
  var container = document.getElementById('partnersGrid');
  if (!container) return;

  var html = '';
  for (var i = 0; i < partners.length; i++) {
    var p = partners[i];
    html += '<div class="partner-card">';
    html += '<div class="partner-avatar" style="background:' + p.color + '">' + p.name.charAt(0) + '</div>';
    html += '<div><div class="partner-name">' + p.name + '</div><div class="partner-focus">' + p.focus + '</div></div>';
    html += '</div>';
  }
  container.innerHTML = html;
}

// ===== RENDER TESTIMONIALS =====

function renderTestimonials() {
  var container = document.getElementById('testimonialsGrid');
  if (!container) return;

  var html = '';
  for (var i = 0; i < testimonials.length; i++) {
    var t = testimonials[i];
    var starsHtml = '';
    for (var s = 0; s < t.stars; s++) starsHtml += '★';
    html += '<div class="testimonial-card">';
    html += '<div class="testimonial-quote">"</div>';
    html += '<p class="testimonial-text">' + t.text + '</p>';
    html += '<div class="testimonial-author">';
    html += '<div class="testimonial-avatar" style="background:' + t.color + '">' + t.name.charAt(0) + '</div>';
    html += '<div><div class="testimonial-name">' + t.name + '</div><div class="testimonial-role">' + t.role + '</div><div class="testimonial-stars">' + starsHtml + '</div></div>';
    html += '</div>';
    html += '</div>';
  }
  container.innerHTML = html;
}

// ===== ANIMATED COUNTERS =====

function animateCounters() {
  var numbers = document.querySelectorAll('.impact-number');
  if (numbers.length === 0) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'));
        var duration = 1500;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target.toLocaleString();
          }
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  numbers.forEach(function (num) {
    observer.observe(num);
  });
}

// ===== STAR RATING =====

function initStarRating() {
  var container = document.getElementById('starRating');
  if (!container) return;

  var stars = container.querySelectorAll('.star');
  var ratingInput = document.getElementById('ratingValue');
  var currentRating = 0;

  for (var i = 0; i < stars.length; i++) {
    (function (star) {
      star.addEventListener('mouseenter', function () {
        var val = parseInt(this.getAttribute('data-value'));
        highlightStars(stars, val);
      });

      star.addEventListener('mouseleave', function () {
        highlightStars(stars, currentRating);
      });

      star.addEventListener('click', function () {
        currentRating = parseInt(this.getAttribute('data-value'));
        if (ratingInput) ratingInput.value = currentRating;
        highlightStars(stars, currentRating);
      });
    })(stars[i]);
  }
}

function highlightStars(stars, count) {
  for (var i = 0; i < stars.length; i++) {
    var val = parseInt(stars[i].getAttribute('data-value'));
    if (val <= count) {
      stars[i].textContent = '\u2605';
      stars[i].classList.add('active');
    } else {
      stars[i].textContent = '\u2606';
      stars[i].classList.remove('active');
    }
  }
}

// ===== OTP INPUT =====

function initOtpInputs() {
  var inputs = document.querySelectorAll('.otp-input');
  if (inputs.length === 0) return;

  for (var i = 0; i < inputs.length; i++) {
    (function (input, index) {
      input.addEventListener('input', function () {
        var value = this.value.replace(/[^0-9]/g, '');
        this.value = value;
        if (value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && this.value === '' && index > 0) {
          inputs[index - 1].focus();
          inputs[index - 1].value = '';
        }
      });

      input.addEventListener('paste', function (e) {
        e.preventDefault();
        var paste = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        for (var j = 0; j < paste.length && j < inputs.length; j++) {
          inputs[j].value = paste[j];
        }
        var nextIndex = Math.min(paste.length, inputs.length - 1);
        inputs[nextIndex].focus();
      });
    })(inputs[i], i);
  }
}

// ===== FEEDBACK FORM =====

function initFeedbackForm() {
  var form = document.getElementById('feedbackForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var rating = document.getElementById('ratingValue');
    if (rating && parseInt(rating.value) === 0) {
      alert('Please select a star rating.');
      return;
    }

    var feedbackText = document.getElementById('feedbackText');
    if (feedbackText && feedbackText.value.length < 20) {
      alert('Please provide at least 20 characters of feedback.');
      return;
    }

    window.location.href = 'feedback-thankyou.html';
  });
}

// ===== EMERGENCY VERIFY =====

function initEmergencyVerify() {
  var verifyBtn = document.getElementById('verifySubmitBtn');
  if (!verifyBtn) return;

  verifyBtn.addEventListener('click', function () {
    var inputs = document.querySelectorAll('.otp-input');
    var otp = '';
    for (var i = 0; i < inputs.length; i++) {
      otp += inputs[i].value;
    }

    if (otp.length < 6) {
      alert('Please enter the complete 6-digit code.');
      return;
    }

    window.location.href = 'emergency-success.html';
  });

  var resendLink = document.getElementById('resendLink');
  if (resendLink) {
    resendLink.addEventListener('click', function (e) {
      e.preventDefault();
      this.textContent = 'Sent!';
      this.style.color = '#059669';
      var link = this;
      setTimeout(function () {
        link.textContent = 'Resend';
        link.style.color = '';
      }, 3000);
    });
  }
}

// ===== EMERGENCY REQUEST FORM =====

function initEmergencyRequestForm() {
  var form = document.getElementById('emergencyRequestForm');
  if (!form) return;

  var pills = document.querySelectorAll('.pill-btn');
  var typeInput = document.getElementById('selectedEmergencyType');

  for (var i = 0; i < pills.length; i++) {
    pills[i].addEventListener('click', function () {
      for (var j = 0; j < pills.length; j++) { pills[j].classList.remove('active'); }
      this.classList.add('active');
      if (typeInput) typeInput.value = this.textContent.trim();
      var typeErr = document.getElementById('er-type-err');
      if (typeErr) typeErr.style.display = 'none';
    });
  }

  var locLink = document.getElementById('currentLocationLink');
  if (locLink) {
    locLink.addEventListener('click', function (e) {
      e.preventDefault();
      var locInput = document.getElementById('er-location') || this.previousElementSibling;
      if (locInput) {
        locInput.value = 'Finding location...';
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function() { locInput.value = 'Connaught Place, New Delhi'; },
            function() { locInput.value = 'Connaught Place, New Delhi'; }
          );
        } else {
          setTimeout(function() { locInput.value = 'Connaught Place, New Delhi'; }, 800);
        }
      }
    });
  }

  // Add error placeholder elements
  function addErrEl(afterId, errId) {
    var inp = document.getElementById(afterId);
    if (inp && !document.getElementById(errId)) {
      var p = document.createElement('p');
      p.id = errId; p.style.cssText = 'color:#ef4444;font-size:.75rem;margin-top:3px;display:none';
      inp.insertAdjacentElement('afterend', p);
    }
  }
  addErrEl('er-name', 'er-name-err');
  addErrEl('er-phone', 'er-phone-err');
  addErrEl('er-location', 'er-loc-err');
  addErrEl('er-desc', 'er-desc-err');

  // Add type error after pills
  var pillGroup = document.getElementById('emergencyTypePills');
  if (pillGroup && !document.getElementById('er-type-err')) {
    var typeErr = document.createElement('p');
    typeErr.id = 'er-type-err'; typeErr.style.cssText = 'color:#ef4444;font-size:.75rem;margin-top:3px;display:none';
    typeErr.textContent = 'Please select an emergency type';
    pillGroup.insertAdjacentElement('afterend', typeErr);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    var nameEl = document.getElementById('er-name');
    var phoneEl = document.getElementById('er-phone');
    var locEl = document.getElementById('er-location');
    var descEl = document.getElementById('er-desc');

    // Reset
    [nameEl,phoneEl,locEl,descEl].forEach(function(el){ if(el) el.style.borderColor=''; });
    ['er-name-err','er-phone-err','er-loc-err','er-desc-err','er-type-err'].forEach(function(id){
      var el = document.getElementById(id); if(el) el.style.display='none';
    });

    if (!nameEl || !nameEl.value.trim() || nameEl.value.trim().length < 2) {
      if(nameEl) nameEl.style.borderColor='#ef4444';
      var e1=document.getElementById('er-name-err'); if(e1){e1.textContent='Full name is required (min 2 chars)';e1.style.display='block';}
      valid=false;
    }
    if (!phoneEl || !/^[+]?[\d\s\-()]{7,15}$/.test(phoneEl.value.trim())) {
      if(phoneEl) phoneEl.style.borderColor='#ef4444';
      var e2=document.getElementById('er-phone-err'); if(e2){e2.textContent='Valid phone number is required';e2.style.display='block';}
      valid=false;
    }
    if (!locEl || !locEl.value.trim()) {
      if(locEl) locEl.style.borderColor='#ef4444';
      var e3=document.getElementById('er-loc-err'); if(e3){e3.textContent='Location is required';e3.style.display='block';}
      valid=false;
    }
    if (!typeInput || !typeInput.value) {
      var e4=document.getElementById('er-type-err'); if(e4){e4.style.display='block';}
      valid=false;
    }
    if (!descEl || descEl.value.trim().length < 15) {
      if(descEl) descEl.style.borderColor='#ef4444';
      var e5=document.getElementById('er-desc-err'); if(e5){e5.textContent='Please describe the emergency (min 15 chars)';e5.style.display='block';}
      valid=false;
    }

    if (valid) window.location.href = 'emergency-verify.html';
  });
}

// ----------------------------------------------------
// CONTACT FORM SUBMISSION
// ----------------------------------------------------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  // Add error spans
  ['cf-fname','cf-lname','cf-email','cf-phone','cf-subject','cf-message'].forEach(function(id){
    var inp = document.getElementById(id);
    if (inp && !document.getElementById(id+'-err')) {
      var span = document.createElement('span');
      span.id = id + '-err';
      span.style.cssText = 'color:#ef4444;font-size:.74rem;display:none;margin-top:3px;';
      inp.parentNode.appendChild(span);
    }
  });

  function cfSetErr(id, msg) {
    var inp = document.getElementById(id);
    if (inp) inp.style.borderColor = '#ef4444';
    var err = document.getElementById(id+'-err');
    if (err) { err.textContent = msg; err.style.display = 'block'; }
  }
  function cfClearErr(id) {
    var inp = document.getElementById(id);
    if (inp) inp.style.borderColor = '';
    var err = document.getElementById(id+'-err');
    if (err) { err.style.display = 'none'; err.textContent = ''; }
  }

  ['cf-fname','cf-lname','cf-email','cf-phone','cf-message'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function(){ cfClearErr(id); });
  });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    ['cf-fname','cf-lname','cf-email','cf-phone','cf-subject','cf-message'].forEach(cfClearErr);
    var valid = true;

    var fname = document.getElementById('cf-fname');
    var lname = document.getElementById('cf-lname');
    var email = document.getElementById('cf-email');
    var phone = document.getElementById('cf-phone');
    var subj  = document.getElementById('cf-subject');
    var msg   = document.getElementById('cf-message');

    if (!fname || !fname.value.trim() || fname.value.trim().length < 2) {
      cfSetErr('cf-fname', 'First name is required (min 2 chars)'); valid = false;
    }
    if (!lname || !lname.value.trim() || lname.value.trim().length < 2) {
      cfSetErr('cf-lname', 'Last name is required (min 2 chars)'); valid = false;
    }
    if (!email || !email.value.trim()) {
      cfSetErr('cf-email', 'Email address is required'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      cfSetErr('cf-email', 'Enter a valid email address'); valid = false;
    }
    if (phone && phone.value.trim() && !/^[+]?[\d\s\-()]{7,16}$/.test(phone.value.trim())) {
      cfSetErr('cf-phone', 'Enter a valid phone number'); valid = false;
    }
    if (!subj || !subj.value.trim() || subj.value.trim().length < 3) {
      cfSetErr('cf-subject', 'Subject is required'); valid = false;
    }
    if (!msg || !msg.value.trim() || msg.value.trim().length < 10) {
      cfSetErr('cf-message', 'Message is required (min 10 characters)'); valid = false;
    }

    if (!valid) return;
    
    // Store in localStorage for Platform Admin to see
    var requestsList = JSON.parse(localStorage.getItem('Kindred_ContactRequests') || '[]');
    requestsList.push({
      id: 'MSG-' + Math.floor(Math.random() * 100000),
      fname: fname.value.trim(),
      lname: lname.value.trim(),
      email: email.value.trim(),
      phone: phone ? phone.value.trim() : '',
      subject: subj ? subj.value.trim() : '',
      message: msg.value.trim(),
      date: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('Kindred_ContactRequests', JSON.stringify(requestsList));

    window.location.href = 'contact-success.html';
  });
}
