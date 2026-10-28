# Kindred

Kindred is a community support platform that connects organizations, volunteers, donors, beneficiaries, and artisans. It brings assistance requests, community programs, donations, resource distribution, and shopping into one application.

## Member: Jaideep Datti (S20240010054)
**Primary responsibility:** Platform Administrator and Shop
**Shared responsibility:** Application setup, routing, navigation, layouts, and reusable interface controls.

## React features covered

- Platform administrator dashboard for reviewing organizations, users, public listings, and platform activity.
- Shop interface for browsing products, viewing details, entering checkout information, and displaying order confirmation.
- Seller dashboard for managing products and viewing orders.
- Reusable navigation, dashboard tabs, confirmation dialogs, and modal windows.
- Role-based frontend access and navigation between public pages and role-specific dashboards.
- A shared page layout that loads the appropriate navigation, footer, notifications, and page styles.

## Main React files

All paths below are relative to `front-end/`.

| File | Purpose |
|---|---|
| `src/pages/content/PlatformAdminPage.jsx` | Platform administration dashboard and management sections. |
| `src/pages/content/AdminUsersPage.jsx` | User management interface. |
| `src/pages/content/AdminInboxPage.jsx` | Administrator inbox interface. |
| `src/pages/content/AnalyticsPage.jsx` | Platform reporting interface. |
| `src/pages/content/ShopPage.jsx` | Product browsing, product details, and checkout interface. |
| `src/pages/content/SellerDashboardPage.jsx` | Seller product and order management interface. |
| `src/App.jsx` | Application routes, access wrappers, and fallback page. |
| `src/main.jsx` | React application entry point and provider setup. |
| `src/pages/PageView.jsx` | Connects the selected page to shared page context. |
| `src/pages/pageComponents.js` | Maps page routes to React page components. |
| `src/layouts/SiteLayout.jsx` | Shared site layout and page-style loading. |
| `src/layouts/layoutDefinitions.js` | Layout settings and dashboard tab definitions. |
| `src/routes/ProtectedRoute.jsx` | Frontend access checks for authenticated roles. |
| `src/routes/routeDefinitions.js` | Route metadata and permitted roles. |
| `src/components/navigation/Navbar.jsx` | Shared navigation and account menu. |
| `src/components/navigation/Footer.jsx` | Shared footer. |
| `src/components/navigation/DashboardTabs.jsx` | Reusable dashboard tab navigation. |
| `src/components/notifications/NotificationDock.jsx` | Notification interface. |
| `src/components/ui/Modal.jsx` | Reusable accessible modal window. |
| `src/components/ui/ConfirmDialog.jsx` | Confirmation interface for management actions. |

## React concepts used

- Functional components, JSX, component composition, and props.
- React Router for navigation, redirects, and protected page rendering.
- Context providers to supply authentication and page data to components.
- Hooks such as `useState`, `useRef`, `useId`, and `useLayoutEffect` in shared interface components.
- Conditional rendering based on the current role, route, and application state.
- Event handling, reusable components, and list rendering with stable keys.

## Supporting files

- `public/styles/pages/platform-admin-1.css`
- `public/styles/pages/admin-users-1.css`
- `public/styles/pages/admin-inbox-1.css`
- `public/styles/pages/shop-1.css`
- `public/styles/pages/shop-2.css`
- `public/styles/pages/seller-dashboard-1.css`
- `package.json`, `package-lock.json`, `vite.config.js`, and `eslint.config.js`

The pages use shared action handlers and API services maintained across the team. Frontend route checks complement backend authorization.
