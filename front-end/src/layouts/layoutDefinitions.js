// Original stylesheet order and shared layout differences, extracted from the reference.
export const layoutDefinitions = {
  "/about.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/admin-inbox.html": {
    "styles": [
      "/style1.css",
      "/styles/pages/admin-inbox-1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "overview.html",
        "label": "Overview",
        "to": "/overview.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "organizations.html",
        "label": "Organizations",
        "to": "/organizations.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "requests.html",
        "label": "Requests",
        "to": "/requests.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "admin-users.html",
        "label": "User Management",
        "to": "/admin-users.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "admin-inbox.html",
        "label": "Inbox",
        "to": "/admin-inbox.html",
        "className": "tab",
        "defaultActive": true
      },
      {
        "id": "analytics.html",
        "label": "Analytics",
        "to": "/analytics.html",
        "className": "tab",
        "defaultActive": false
      }
    ]
  },
  "/admin-users.html": {
    "styles": [
      "/style1.css",
      "/styles/pages/admin-users-1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "overview.html",
        "label": "Overview",
        "to": "/overview.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "organizations.html",
        "label": "Organizations",
        "to": "/organizations.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "requests.html",
        "label": "Requests",
        "to": "/requests.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "admin-users.html",
        "label": "User Management",
        "to": "/admin-users.html",
        "className": "tab",
        "defaultActive": true
      },
      {
        "id": "admin-inbox.html",
        "label": "Inbox",
        "to": "/admin-inbox.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "analytics.html",
        "label": "Analytics",
        "to": "/analytics.html",
        "className": "tab",
        "defaultActive": false
      }
    ]
  },
  "/analytics.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "overview.html",
        "label": "Overview",
        "to": "/overview.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "organizations.html",
        "label": "Organizations",
        "to": "/organizations.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "requests.html",
        "label": "Requests (1)",
        "to": "/requests.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "admin-users.html",
        "label": "User Management",
        "to": "/admin-users.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "admin-inbox.html",
        "label": "Inbox",
        "to": "/admin-inbox.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "analytics.html",
        "label": "Analytics",
        "to": "/analytics.html",
        "className": "tab",
        "defaultActive": true
      }
    ]
  },
  "/beneficiary-dashboard.html": {
    "styles": [
      "/shared.css",
      "/styles/pages/beneficiary-dashboard-1.css",
      "/style1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": true,
    "tabs": [
      {
        "id": "overview",
        "label": "Overview",
        "to": null,
        "className": "tab-btn",
        "defaultActive": true
      },
      {
        "id": "requests",
        "label": "Requests",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      }
    ]
  },
  "/contact-success.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/contact.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/create-program.html": {
    "styles": [
      "/styles1.css",
      "/style1.css",
      "/styles/pages/create-program-1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": true,
    "notifications": true,
    "tabs": []
  },
  "/demo-login.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap",
      "/styles/pages/demo-login-1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "none",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/donate.html": {
    "styles": [
      "/style1.css",
      "/styles/pages/donate-1.css",
      "/styles/pages/donate-2.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": true,
    "tabs": []
  },
  "/donor-dashboard.html": {
    "styles": [
      "/shared.css",
      "/style1.css",
      "/styles/pages/donor-dashboard-1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": true,
    "tabs": [
      {
        "id": "overview",
        "label": "Overview",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "mypayments",
        "label": "My Payments",
        "to": null,
        "className": "tab-btn",
        "defaultActive": true
      },
      {
        "id": "resources",
        "label": "📦 Resource Donations",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "programs",
        "label": "Active Programs",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "savedcards",
        "label": "Saved Cards",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      }
    ]
  },
  "/emergency-request.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700&display=swap",
      "/styles.css?v=2",
      "/styles/pages/emergency-request-1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/emergency-success.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/emergency-verify.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/feedback-thankyou.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/feedback.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/forgot-otp.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/styles/pages/forgot-otp-1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/forgot-password.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/styles/pages/forgot-password-1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/fundraising.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/incoming.html": {
    "styles": [
      "/styles1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "site",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "new-requests",
        "label": "New Requests",
        "to": null,
        "className": "tab-btn",
        "defaultActive": true
      },
      {
        "id": "accepted",
        "label": "Accepted",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "declined",
        "label": "Declined",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      }
    ]
  },
  "/index.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/join-volunteer.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/styles/pages/join-volunteer-1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/ngo-success.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/org-admin-organizations.html": {
    "styles": [
      "/styles1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "dashboard.html",
        "label": "Dashboard",
        "to": "/donor-dashboard.html#overview",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "org-admin-organizations.html",
        "label": "Organizations",
        "to": "/org-admin-organizations.html",
        "className": "tab-btn",
        "defaultActive": true
      },
      {
        "id": "donations.html",
        "label": "Donations",
        "to": "/donor-dashboard.html#mypayments",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "impact.html",
        "label": "Impact",
        "to": "/donor-dashboard.html#overview",
        "className": "tab-btn",
        "defaultActive": false
      }
    ]
  },
  "/org-admin-overview.html": {
    "styles": [
      "/styles1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "org-admin-overview.html",
        "label": "Overview",
        "to": "/org-admin-overview.html",
        "className": "tab-btn",
        "defaultActive": true
      },
      {
        "id": "volunteers.html",
        "label": "Volunteers",
        "to": "/volunteers.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "org-admin-programs.html",
        "label": "Programs",
        "to": "/org-admin-programs.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "resources.html",
        "label": "Resources",
        "to": "/resources.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "org-admin-requests.html",
        "label": "Requests",
        "to": "/org-admin-requests.html",
        "className": "tab-btn",
        "defaultActive": false
      }
    ]
  },
  "/org-admin-programs.html": {
    "styles": [
      "/styles1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "org-admin-overview.html",
        "label": "Overview",
        "to": "/org-admin-overview.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "volunteers.html",
        "label": "Volunteers",
        "to": "/volunteers.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "org-admin-programs.html",
        "label": "Programs",
        "to": "/org-admin-programs.html",
        "className": "tab-btn",
        "defaultActive": true
      },
      {
        "id": "resources.html",
        "label": "Resources",
        "to": "/resources.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "org-admin-requests.html",
        "label": "Requests",
        "to": "/org-admin-requests.html",
        "className": "tab-btn",
        "defaultActive": false
      }
    ]
  },
  "/org-admin-requests.html": {
    "styles": [
      "/styles1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "org-admin-overview.html",
        "label": "Overview",
        "to": "/org-admin-overview.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "volunteers.html",
        "label": "Volunteers",
        "to": "/volunteers.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "org-admin-programs.html",
        "label": "Programs",
        "to": "/org-admin-programs.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "resources.html",
        "label": "Resources",
        "to": "/resources.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "org-admin-requests.html",
        "label": "Requests",
        "to": "/org-admin-requests.html",
        "className": "tab-btn",
        "defaultActive": true
      }
    ]
  },
  "/org-admin.html": {
    "styles": [
      "/style1.css",
      "/styles/pages/org-admin-1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": true,
    "notifications": true,
    "tabs": [
      {
        "id": "overview",
        "label": "📊 Overview",
        "to": null,
        "className": "tab-btn",
        "defaultActive": true
      },
      {
        "id": "volunteers",
        "label": "👥 Volunteers",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "programs",
        "label": "📋 Programs",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "resources",
        "label": "📦 Resources & Donations",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "requests",
        "label": "📥 Beneficiary Requests",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      }
    ]
  },
  "/organization-details.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/style1.css",
      "/styles/pages/organization-details-1.css",
      "/styles/pages/organization-details-2.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/organizations.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/otp-verify.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/overview.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "overview.html",
        "label": "Overview",
        "to": "/overview.html",
        "className": "tab",
        "defaultActive": true
      },
      {
        "id": "organizations.html",
        "label": "Organizations",
        "to": "/organizations.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "requests.html",
        "label": "Requests (1)",
        "to": "/requests.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "admin-users.html",
        "label": "User Management",
        "to": "/admin-users.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "admin-inbox.html",
        "label": "Inbox",
        "to": "/admin-inbox.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "analytics.html",
        "label": "Analytics",
        "to": "/analytics.html",
        "className": "tab",
        "defaultActive": false
      }
    ]
  },
  "/page2-new-request-modal.html": {
    "styles": [
      "/shared.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "overview",
        "label": "Overview",
        "to": null,
        "className": "tab-btn",
        "defaultActive": true
      },
      {
        "id": "requests",
        "label": "Requests",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      }
    ]
  },
  "/page4-broadcast-sent.html": {
    "styles": [
      "/shared.css",
      "/styles/pages/page4-broadcast-sent-1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/page5-connected-notification.html": {
    "styles": [
      "/shared.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "overview",
        "label": "Requests",
        "to": null,
        "className": "tab-btn",
        "defaultActive": true
      },
      {
        "id": "sent",
        "label": "Sent Requests",
        "to": null,
        "className": "tab-btn",
        "defaultActive": false
      }
    ]
  },
  "/phone-entry.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/platform-admin.html": {
    "styles": [
      "/style1.css",
      "/styles/pages/platform-admin-1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": true,
    "notifications": true,
    "tabs": [
      {
        "id": "overview",
        "label": "📊 Overview",
        "to": null,
        "className": "tab",
        "defaultActive": true
      },
      {
        "id": "requests",
        "label": "⏳ Requests",
        "to": null,
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "users",
        "label": "👥 User Management",
        "to": null,
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "shop",
        "label": "🛍️ Shop Management",
        "to": null,
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "inbox",
        "label": "📥 Inbox",
        "to": null,
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "analytics",
        "label": "📈 Analytics",
        "to": null,
        "className": "tab",
        "defaultActive": false
      }
    ]
  },
  "/profile.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      "/style1.css",
      "/styles/pages/profile-1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/program-success.html": {
    "styles": [
      "/style1.css",
      "/styles/pages/program-success.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/programs.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/register-ngo.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/registration-pending.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/styles/pages/registration-pending-1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/requests.html": {
    "styles": [
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "overview.html",
        "label": "Overview",
        "to": "/overview.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "organizations.html",
        "label": "Organizations",
        "to": "/organizations.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "requests.html",
        "label": "Requests (1)",
        "to": "/requests.html",
        "className": "tab",
        "defaultActive": true
      },
      {
        "id": "admin-users.html",
        "label": "User Management",
        "to": "/admin-users.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "admin-inbox.html",
        "label": "Inbox",
        "to": "/admin-inbox.html",
        "className": "tab",
        "defaultActive": false
      },
      {
        "id": "analytics.html",
        "label": "Analytics",
        "to": "/analytics.html",
        "className": "tab",
        "defaultActive": false
      }
    ]
  },
  "/reset-password.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/styles/pages/reset-password-1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/reset-success.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/styles/pages/reset-success-1.css",
      "/style1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/resources.html": {
    "styles": [
      "/styles1.css",
      "/style1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "org-admin-overview.html",
        "label": "Overview",
        "to": "/org-admin-overview.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "volunteers.html",
        "label": "Volunteers",
        "to": "/volunteers.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "org-admin-programs.html",
        "label": "Programs",
        "to": "/org-admin-programs.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "resources.html",
        "label": "Resources",
        "to": "/resources.html",
        "className": "tab-btn",
        "defaultActive": true
      },
      {
        "id": "org-admin-requests.html",
        "label": "Requests",
        "to": "/org-admin-requests.html",
        "className": "tab-btn",
        "defaultActive": false
      }
    ]
  },
  "/seller-dashboard.html": {
    "styles": [
      "/style1.css",
      "/styles/pages/seller-dashboard-1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": true,
    "notifications": true,
    "tabs": []
  },
  "/shop.html": {
    "styles": [
      "/style1.css",
      "/styles/pages/shop-1.css",
      "/styles/pages/shop-2.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": true,
    "notifications": false,
    "tabs": []
  },
  "/signin.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/styles/pages/signin-1.css",
      "/style1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/signup.html": {
    "styles": [
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@400;600;700&display=swap",
      "/styles.css",
      "/style1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/volunteer-dashboard.html": {
    "styles": [
      "/shared.css",
      "/style1.css",
      "/styles/pages/volunteer-dashboard-1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": true,
    "tabs": []
  },
  "/volunteer-portal.html": {
    "styles": [
      "/shared.css",
      "/style1.css",
      "/styles/pages/volunteer-portal-1.css"
    ],
    "showShop": false,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": []
  },
  "/volunteers.html": {
    "styles": [
      "/styles1.css",
      "/style1.css"
    ],
    "showShop": true,
    "footer": "premium",
    "footerShop": false,
    "notifications": false,
    "tabs": [
      {
        "id": "org-admin-overview.html",
        "label": "Overview",
        "to": "/org-admin-overview.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "volunteers.html",
        "label": "Volunteers",
        "to": "/volunteers.html",
        "className": "tab-btn",
        "defaultActive": true
      },
      {
        "id": "org-admin-programs.html",
        "label": "Programs",
        "to": "/org-admin-programs.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "resources.html",
        "label": "Resources",
        "to": "/resources.html",
        "className": "tab-btn",
        "defaultActive": false
      },
      {
        "id": "org-admin-requests.html",
        "label": "Requests",
        "to": "/org-admin-requests.html",
        "className": "tab-btn",
        "defaultActive": false
      }
    ]
  }
};
