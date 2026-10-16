# Kindred React frontend

All seven migration phases are complete. React renders all 53 original page URLs
and controls every migrated interaction. The frontend has one HTML entry,
`index.html`; obsolete standalone HTML/JavaScript and the temporary route screen
have been removed. See [the final report](../PHASE7_MIGRATION.md) for verification
and [Phase 5](../PHASE5_MIGRATION.md) for existing backend limitations.

## Start

Requires Node 20.19+ or 22.12+ (verified with Node 24.13.0).
Install dependencies with `npm ci` in `front-end` and `back-end` if necessary.
Build the backend with `npm run build` in `back-end` if `dist/main.js` is absent.
Double-click the root `START_PROJECT.bat` to start ready-checked servers and open
http://127.0.0.1:5173/. Logs are written to `.run/`.

For manual startup, run `npm run start:prod` in `back-end` and `npm run dev` in
`front-end`. Backend: http://localhost:3000; Swagger: http://localhost:3000/api/docs.
Open the React URL in a browser rather than opening HTML directly from disk.

## Configuration and routing

The default API address is `http://localhost:3000`. Copy `.env.example` to
`.env.local` and set `VITE_API_BASE_URL` to change it, then restart Vite.
Browser configuration is public; do not put secrets in VITE_ variables.

`src/routes/routeDefinitions.js` preserves original route metadata. `App.jsx`
exposes extension-free React routes such as `/signin`, `/programs`, and
`/donor-dashboard`; the homepage is `/`. All internal links and navigation use
these clean URLs. Old `.html` bookmarks redirect with query/hash preserved.
These are React routes, not physical HTML pages. Vite development/preview middleware
serves the React entry for direct loads and refresh. Production hosting must
rewrite document routes to `/index.html`. Query strings, dashboard hashes,
client navigation, history, and role guards remain supported.

The auth provider restores `kindred_session` from sessionStorage and excludes
passwords. The API client sends only the actual approved session's role, unwraps
`{ success, data, message }`, and handles HTTP/business/network errors, cancelled
requests, and multipart uploads. Existing role-header auth and in-memory backend
persistence are unchanged.

## Structure

- `src/pages/content/`: 53 editable functional React page components.
- `src/pages/runtime/`: context, controlled fields, tabs/modals, and page state.
- `src/pages/actions/`: auth, contribution, and management workflows.
- `src/components/`: reusable navigation, notifications, cards, editors, dialogs.
- `src/services/` and `src/hooks/`: actual API loading, validation, sessions,
  synchronization, storage, and workflow helpers.
- `public/`: original CSS, images, logo, hero MP4, and extracted page styles.
- `tests/`: unit, development browser, and production-route verification.

React loads route styles in the original order and cleans them up on navigation.
The homepage uses the preserved MP4 with autoplay, loop, muted, and inline playback.
There are no legacy UI script imports, runtime HTML parsers, injected HTML, or iframes.

## Checks

```powershell
npm run lint
npm test
npm run test:e2e
npm run test:production
```

Browser tests require the local backend on port 3000 and use installed Chrome or
Edge. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if necessary. Tests use synthetic
local records and demo payments. Records without API deletion endpoints may remain
in memory; upload tests leave small local image files because uploads have no
DELETE endpoint.

`node scripts/audit-pages.mjs` and `node scripts/audit-pages.mjs --mobile` inspect
all pages for runtime errors, control wiring, images, and overflow. Set
`KINDRED_AUDIT_DIR` to store output in a separate directory. For example:

```powershell
$env:KINDRED_AUDIT_DIR='../.migration/final-audit'
node scripts/audit-pages.mjs --no-screenshots
```

`python scripts/compare-page-screenshots.py` reproduces Phase 6 screenshot
measurements and overview sheets using Pillow. Original screenshots and manifests
remain under `.migration/reference/`. Original source is a verified ZIP archive,
not another runnable frontend tree. Temporary reference servers, HTML converters,
and legacy repair scripts have been removed. Phase reports are historical evidence.

Missing OTP/recovery, some role-specific profile updates, beneficiary tracking,
public submission permissions, seller organization linking, compliance/tax fields,
and real payments require separately agreed backend work. Unsupported actions show
explicit errors and do not fabricate success or records. Visual review does not
claim blanket pixel identity where actual backend data differs from old samples.
