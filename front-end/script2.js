document.addEventListener('DOMContentLoaded', function () {

    // ========== ORG AVATAR COLOR MAP ==========
    var orgAvatarColors = {
        hope: '#0f1a2e',
        edu: '#00c896',
        green: '#059669',
        med: '#8b5cf6',
        trust: '#1a2744',
        food: '#f59e0b'
    };

    var orgAvatarLetters = {
        hope: 'H',
        edu: 'E',
        green: 'G',
        med: 'M',
        trust: 'M',
        food: 'F'
    };

    // ========== USER DROPDOWN ==========
    var userMenu = document.getElementById('navbar-user-menu');
    var userDropdown = document.getElementById('user-dropdown');

    if (userMenu && userDropdown) {
        userMenu.addEventListener('click', function (e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function (e) {
            if (!userDropdown.contains(e.target) && !userMenu.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });

        var dashboardBtn = document.getElementById('dropdown-dashboard');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', function () {
                window.location.href = 'dashboard.html';
            });
        }

        var signoutBtn = document.getElementById('dropdown-signout');
        if (signoutBtn) {
            signoutBtn.addEventListener('click', function () {
                alert('Signed out successfully!');
                userDropdown.classList.remove('show');
            });
        }
    }

    // ========== ORG CARD CLICK → EXPAND DONATE PANEL ==========
    var orgCards = document.querySelectorAll('.org-card[data-org]');

    orgCards.forEach(function (card) {
        card.addEventListener('click', function (e) {
            if (e.target.closest('.donate-panel') || e.target.closest('.success-message')) {
                return;
            }

            var orgId = card.getAttribute('data-org');
            var panel = document.getElementById('donate-panel-' + orgId);
            if (!panel) return;

            document.querySelectorAll('.donate-panel.show').forEach(function (p) {
                if (p !== panel) {
                    p.classList.remove('show');
                    p.closest('.org-card').classList.remove('selected');
                }
            });

            panel.classList.toggle('show');
            card.classList.toggle('selected');

            var successMsg = document.getElementById('success-' + orgId);
            if (successMsg) {
                successMsg.classList.remove('show');
            }
        });
    });

    // ========== AMOUNT BUTTON SELECTION ==========
    document.querySelectorAll('.donate-panel').forEach(function (panel) {
        var amountBtns = panel.querySelectorAll('.amount-btn');
        var customInput = panel.querySelector('.custom-amount-input');

        amountBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                amountBtns.forEach(function (b) { b.classList.remove('selected'); });
                btn.classList.add('selected');
                if (customInput) customInput.value = '';
            });
        });

        if (customInput) {
            customInput.addEventListener('input', function () {
                if (customInput.value) {
                    amountBtns.forEach(function (b) { b.classList.remove('selected'); });
                }
            });
            customInput.addEventListener('click', function (e) { e.stopPropagation(); });
        }
    });

    // ========== DONATE BUTTON → OPEN MODAL ==========
    document.querySelectorAll('.donate-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();

            var panel = btn.closest('.donate-panel');
            var card = btn.closest('.org-card');
            var orgId = card.getAttribute('data-org');

            // Get selected amount from panel
            var selectedBtn = panel.querySelector('.amount-btn.selected');
            var customInput = panel.querySelector('.custom-amount-input');
            var amount = 0;

            if (selectedBtn) {
                amount = parseInt(selectedBtn.getAttribute('data-amount'));
            } else if (customInput && customInput.value) {
                amount = parseInt(customInput.value);
            }

            // Open the donate modal
            openDonateModal(card, orgId, amount);
        });
    });

    // ========== DONATE MODAL ==========
    var modalOverlay = document.getElementById('donate-modal-overlay');
    var modalClose = document.getElementById('modal-close');
    var modalDonateBtn = document.getElementById('modal-donate-btn');
    var modalAmountGrid = document.getElementById('modal-amount-grid');
    var modalPaymentGrid = document.getElementById('modal-payment-grid');
    var modalCardDetails = document.getElementById('modal-card-details');
    var currentModalOrg = null;

    function openDonateModal(card, orgId, preSelectedAmount) {
        if (!modalOverlay) return;

        currentModalOrg = orgId;

        // Populate modal with org info
        var orgName = card.getAttribute('data-org-name') || card.querySelector('.org-name').textContent;
        var orgCat = card.getAttribute('data-org-cat') || card.querySelector('.org-category').textContent;
        var campaign = card.getAttribute('data-org-campaign') || orgCat;

        var modalOrgName = document.getElementById('modal-org-name');
        var modalOrgCat = document.getElementById('modal-org-cat');
        var modalCampaign = document.getElementById('modal-campaign-name');
        var modalOrgAvatar = document.getElementById('modal-org-avatar');

        if (modalOrgName) modalOrgName.textContent = orgName;
        if (modalOrgCat) modalOrgCat.textContent = orgCat;
        if (modalCampaign) modalCampaign.textContent = campaign;
        if (modalOrgAvatar) {
            modalOrgAvatar.style.background = orgAvatarColors[orgId] || '#0f1a2e';
            modalOrgAvatar.textContent = orgAvatarLetters[orgId] || orgId.charAt(0).toUpperCase();
        }

        // Pre-select amount if one was chosen
        if (modalAmountGrid) {
            modalAmountGrid.querySelectorAll('.modal-amount-btn').forEach(function (b) {
                b.classList.remove('selected');
                if (preSelectedAmount && parseInt(b.getAttribute('data-amount')) === preSelectedAmount) {
                    b.classList.add('selected');
                }
            });
        }

        var modalCustom = document.getElementById('modal-custom-amount');
        if (modalCustom) modalCustom.value = '';

        // Reset form
        var modalNameInput = document.getElementById('modal-name');
        var modalEmailInput = document.getElementById('modal-email');
        if (modalNameInput) modalNameInput.value = '';
        if (modalEmailInput) modalEmailInput.value = '';

        // Show modal
        modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeDonateModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('show');
        document.body.style.overflow = '';
        currentModalOrg = null;
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeDonateModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                closeDonateModal();
            }
        });
    }

    // ESC key to close modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeDonateModal();
            if (userDropdown) userDropdown.classList.remove('show');
        }
    });

    // Modal amount selection
    if (modalAmountGrid) {
        modalAmountGrid.querySelectorAll('.modal-amount-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                modalAmountGrid.querySelectorAll('.modal-amount-btn').forEach(function (b) {
                    b.classList.remove('selected');
                });
                btn.classList.add('selected');
                var modalCustom = document.getElementById('modal-custom-amount');
                if (modalCustom) modalCustom.value = '';
            });
        });

        var modalCustom = document.getElementById('modal-custom-amount');
        if (modalCustom) {
            modalCustom.addEventListener('input', function () {
                if (modalCustom.value) {
                    modalAmountGrid.querySelectorAll('.modal-amount-btn').forEach(function (b) {
                        b.classList.remove('selected');
                    });
                }
            });
        }
    }

    // Payment method selection
    if (modalPaymentGrid) {
        modalPaymentGrid.querySelectorAll('.modal-payment-option').forEach(function (option) {
            option.addEventListener('click', function () {
                modalPaymentGrid.querySelectorAll('.modal-payment-option').forEach(function (o) {
                    o.classList.remove('selected');
                });
                option.classList.add('selected');

                // Show/hide card details
                var method = option.getAttribute('data-method');
                if (modalCardDetails) {
                    modalCardDetails.style.display = method === 'card' ? 'block' : 'none';
                }
            });
        });
    }

    // Modal donate button
    if (modalDonateBtn) {
        modalDonateBtn.addEventListener('click', function () {
            var selectedAmountBtn = modalAmountGrid ? modalAmountGrid.querySelector('.modal-amount-btn.selected') : null;
            var modalCustom = document.getElementById('modal-custom-amount');
            var amount = 0;

            if (selectedAmountBtn) {
                amount = parseInt(selectedAmountBtn.getAttribute('data-amount'));
            } else if (modalCustom && modalCustom.value) {
                amount = parseInt(modalCustom.value);
            }

            if (amount <= 0) {
                if (modalAmountGrid) {
                    modalAmountGrid.querySelectorAll('.modal-amount-btn').forEach(function (b) {
                        b.style.borderColor = '#ef4444';
                        setTimeout(function () { b.style.borderColor = ''; }, 1000);
                    });
                }
                return;
            }

            // Simulate donation
            modalDonateBtn.textContent = 'Processing...';
            modalDonateBtn.disabled = true;
            modalDonateBtn.style.opacity = '0.7';

            setTimeout(function () {
                // Close modal
                closeDonateModal();

                // Show success on the org card
                if (currentModalOrg) {
                    var successMsg = document.getElementById('success-' + currentModalOrg);
                    var card = document.getElementById('org-' + currentModalOrg);
                    var panel = document.getElementById('donate-panel-' + currentModalOrg);

                    if (panel) panel.classList.remove('show');
                    if (successMsg) successMsg.classList.add('show');

                    setTimeout(function () {
                        if (successMsg) successMsg.classList.remove('show');
                        if (card) card.classList.remove('selected');
                    }, 4000);
                }

                // Reset button
                modalDonateBtn.innerHTML = '❤ Donate Now';
                modalDonateBtn.disabled = false;
                modalDonateBtn.style.opacity = '';
            }, 1500);
        });
    }

    // ========== STAT CARDS: COUNT UP ANIMATION ==========
    var statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(function (el) {
        var text = el.textContent;
        var numMatch = text.match(/[\d,]+/);
        if (!numMatch) return;

        var targetNum = parseInt(numMatch[0].replace(/,/g, ''));
        var prefix = text.substring(0, text.indexOf(numMatch[0]));
        var suffix = text.substring(text.indexOf(numMatch[0]) + numMatch[0].length);
        var duration = 1200;
        var startTime = null;

        function animateCount(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * targetNum);
            el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
            if (progress < 1) {
                requestAnimationFrame(animateCount);
            } else {
                el.textContent = text;
            }
        }

        requestAnimationFrame(animateCount);
    });

    // ========== IMPACT VALUES: COUNT UP ==========
    var impactValues = document.querySelectorAll('.impact-value');
    impactValues.forEach(function (el) {
        var text = el.textContent;
        var numMatch = text.match(/[\d,]+/);
        if (!numMatch) return;

        var targetNum = parseInt(numMatch[0].replace(/,/g, ''));
        var prefix = text.substring(0, text.indexOf(numMatch[0]));
        var suffix = text.substring(text.indexOf(numMatch[0]) + numMatch[0].length);
        var duration = 1400;
        var startTime = null;

        function animateImpact(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * targetNum);
            el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
            if (progress < 1) {
                requestAnimationFrame(animateImpact);
            } else {
                el.textContent = text;
            }
        }

        requestAnimationFrame(animateImpact);
    });

    // ========== RECEIPT CLICK HANDLERS ==========
    document.querySelectorAll('.donation-receipt').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            alert('Receipt download will be available in your email.');
        });
    });

});
