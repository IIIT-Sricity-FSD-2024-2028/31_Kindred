# Redux architecture and evaluation guide

The existing React pages now read business records from Redux Toolkit. All HTTP interactions run inside asynchronous thunks. The backend commits encrypted records to SQLite before returning success, and failed writes restore both the database transaction and its materialized service state. The dashboard CSS, route structure, and domain validation rules are retained.

## Runtime and startup

Use **Node.js 24 or later**. The backend uses Node's built-in `node:sqlite`; no database service or additional database credentials are required.

In `back-end/`:

```powershell
npm ci
npm run build
npm run start:prod
```

In another terminal, in `front-end/`:

```powershell
npm ci
npm run dev
```

The normal API address is `http://localhost:3000`; the frontend is `http://127.0.0.1:5173`. `PORT` changes the backend port. `VITE_API_BASE_URL` changes the frontend API address.

The default database is `.run/kindred.sqlite`. `KINDRED_DATABASE` can select a different file. On the first normal startup, the backend imports an existing `.run/server-state.enc` (or portable variant) before serving requests. The encrypted legacy file is retained. Existing service bootstrap records are preserved when installing without saved records; this refactor adds no application fixtures, mock endpoints, or new hardcoded business records.

## Updated folder structure

```text
back-end/src/common/
|-- local-state-codec.ts              # Existing encryption, also used for migration
|-- repositories/
   |-- definitions.ts                # Authoritative service/repository mapping
   |-- sqlite.repository.ts          # Encrypted row CRUD per aggregate/collection/id
   |-- database.ts                   # Transactions, restoration, migration, revisions
   |-- database.spec.ts              # Real HTTP + SQLite restart and failure tests
   |-- verification-attempt.exception.ts # Explicit rejected-attempt audit marker
front-end/src/store/
|-- store.js                         # configureStore, middleware, DevTools, preferences
|-- repositories.js                  # Matching frontend repository/API definitions
|-- registry.js                      # All repository reducers and thunk collections
|-- repositorySlice.js               # Shared createSlice/createAsyncThunk implementation
|-- normalization.js                 # Canonical records and cross-repository references
|-- requests.js                      # Dispatch adapter, not an HTTP client
|-- selectors.js                     # Memoized repository selectors
|-- hooks.js                         # useSelector/useDispatch forms, queries, selections
|-- resultReferences.js              # Query references for workflow projections
|-- slices/
    |-- schedulingSlice.js
    |-- participationSlice.js
    |-- usersSlice.js
    |-- organizationsSlice.js
    |-- volunteersSlice.js
    |-- programsSlice.js
    |-- requestsSlice.js
    |-- incomingSlice.js
    |-- tasksSlice.js
    |-- hourLogsSlice.js
    |-- resourceDonationsSlice.js
    |-- programAssignmentsSlice.js
    |-- programApplicationsSlice.js
    |-- subtasksSlice.js
    |-- sellersSlice.js
    |-- productsSlice.js
    |-- ordersSlice.js
    |-- donationsSlice.js
    |-- notificationsSlice.js
    |-- replacementsSlice.js
    |-- volunteerRequestsSlice.js
    |-- fulfillmentSlice.js
    |-- proofsSlice.js
    |-- authSlice.js
    |-- uiSlice.js
    |-- preferencesSlice.js
    |-- syncSlice.js
back-end/scripts/verify-migration.cjs
front-end/scripts/verify-redux-live.mjs
front-end/tests/unit/redux-architecture.test.js
front-end/tests/apiBase.js
front-end/tests/e2e/redux-evaluation.spec.js
```

## Repository-to-slice mapping and implemented CRUD thunks

Each row represents exactly one persistent backend repository instance and exactly one registered frontend entity reducer. Slice files are under `front-end/src/store/slices/`. Every supported operation uses `createAsyncThunk` and pending/fulfilled/rejected reducers. Additional UI/authentication slices are not entity repositories.

| Backend repository owner -> Redux key | Slice file | Exported CRUD/read thunks |
|---|---|---|
| `SchedulingService` -> `scheduling` | `schedulingSlice.js` | Internal workflow state; no public CRUD API |
| `ParticipationService` -> `participation` | `participationSlice.js` | `createParticipation`, `fetchParticipation`, `updateParticipation` |
| `UsersService` -> `users` | `usersSlice.js` | `createUsers`, `fetchUsers`, `updateUsers`, `deleteUsers` |
| `OrganizationsService` -> `organizations` | `organizationsSlice.js` | `createOrganizations`, `fetchOrganizations`, `updateOrganizations`, `deleteOrganizations` |
| `VolunteersService` -> `volunteers` | `volunteersSlice.js` | `createVolunteers`, `fetchVolunteers`, `updateVolunteers`, `deleteVolunteers` |
| `ProgramsService` -> `programs` | `programsSlice.js` | `createPrograms`, `fetchPrograms`, `updatePrograms`, `deletePrograms` |
| `RequestsService` -> `requests` | `requestsSlice.js` | `fetchRequests`, `createRequests`, `deleteRequests`, `updateRequests` |
| `IncomingService` -> `incoming` | `incomingSlice.js` | `createIncoming`, `fetchIncoming`, `updateIncoming`, `deleteIncoming` |
| `TasksService` -> `tasks` | `tasksSlice.js` | `createTasks`, `fetchTasks`, `updateTasks`, `deleteTasks` |
| `HourLogsService` -> `hourLogs` | `hourLogsSlice.js` | `createHourLogs`, `fetchHourLogs`, `updateHourLogs`, `deleteHourLogs` |
| `ResourceDonationsService` -> `resourceDonations` | `resourceDonationsSlice.js` | `createResourceDonations`, `fetchResourceDonations`, `updateResourceDonations`, `deleteResourceDonations` |
| `ProgramAssignmentsService` -> `programAssignments` | `programAssignmentsSlice.js` | `createProgramAssignments`, `fetchProgramAssignments`, `updateProgramAssignments`, `deleteProgramAssignments` |
| `ProgramApplicationsService` -> `programApplications` | `programApplicationsSlice.js` | `createProgramApplications`, `fetchProgramApplications`, `updateProgramApplications`, `deleteProgramApplications` |
| `SubtasksService` -> `subtasks` | `subtasksSlice.js` | `createSubtasks`, `fetchSubtasks`, `updateSubtasks`, `deleteSubtasks` |
| `SellersService` -> `sellers` | `sellersSlice.js` | `createSellers`, `fetchSellers`, `updateSellers`, `deleteSellers` |
| `ProductsService` -> `products` | `productsSlice.js` | `createProducts`, `fetchProducts`, `updateProducts`, `deleteProducts` |
| `OrdersService` -> `orders` | `ordersSlice.js` | `createOrders`, `fetchOrders`, `updateOrders` |
| `DonationsService` -> `donations` | `donationsSlice.js` | `createDonations`, `fetchDonations`, `updateDonations` |
| `NotificationsService` -> `notifications` | `notificationsSlice.js` | `createNotifications`, `fetchNotifications`, `updateNotifications` |
| `ReplacementsService` -> `replacements` | `replacementsSlice.js` | `createReplacements`, `fetchReplacements`, `updateReplacements` |
| `VolunteerRequestsService` -> `volunteerRequests` | `volunteerRequestsSlice.js` | `createVolunteerRequests`, `fetchVolunteerRequests`, `deleteVolunteerRequests`, `updateVolunteerRequests` |
| `FulfillmentService` -> `fulfillment` | `fulfillmentSlice.js` | `createFulfillment`, `fetchFulfillment`, `updateFulfillment` |
| `ProofStore` -> `proofs` | `proofsSlice.js` | `createProofs`, `fetchProofs`, `updateProofs` |

Product deletion retains the existing archival behavior: the confirmed item disappears from live catalogs, while its archived database record remains available to order history.

The shared factory creates the reducers and lifecycle handling; each module has its own file, action namespace, reducer, and exported thunks. A registry test compares the backend definitions against the frontend map and checks every supported CRUD export.

### Existing workflow restrictions

Complete CRUD is exposed where the existing API supports it. This refactor does not invent delete endpoints for financial, audit, evidence, or workflow history, or bypass the domain's transition checks.

- `incoming`: update requires an `action`, such as `accept`, `assign-volunteer`, `resolve`, or `decline`.
- `orders`: update defaults to `delivery-status`; supply `action: 'cancel'`, `received`, or another supported transition when appropriate. There is no order deletion API.
- `donations`: update issues a thank-you certificate. Monetary receipts are not editable/deletable records.
- `notifications`: update marks a notification as read. There is no delete API.
- `replacements`: update defaults to `status`; workflow paths support approve, reject, offer, receipt, and delivery actions. History is retained.
- `volunteerRequests`: update defaults to `status`; `respond` is an existing alternate action. Delete is supported.
- `proofs`: create accepts multipart `FormData`; update requires `decision: 'approve'` or `'reject'`. Evidence is not deleted.
- `fulfillment`: the default create/read path is `deliveries`; update performs a delivery action. Explicit paths select requests, receipts, inventory, candidates, or address/collection plans. These are collections/projections of one aggregate repository.
- `participation`: read with a program id loads its workspace; create sends a message by default (or a rating with `action: 'ratings'`); update withdraws a membership by default (or performs handover). Certificates use their existing explicit path. Audit history is retained.
- `scheduling`: an internal repository for commitments, maintained by program and delivery workflows. It has no public CRUD endpoint and no exposed CRUD thunk.

All thunk arguments accept `{ path, body }` for an existing specialized endpoint. Standard entity operations also accept `{ id, body }`. `fetchPrograms({path: '/programs/manage'})` uses the management listing while `fetchPrograms()` uses the public listing. The dispatcher chooses the correct repository and operation automatically for existing action modules. Direct thunk `unwrap()` returns the normalized confirmed payload (`records`, `snapshots`, `result`, `path`, `serverRevision`); the dispatcher resolves entity references for existing action modules.

## Database-first data flow

1. A form edits its draft in `uiSlice`; `useSelector` supplies its current values.
2. The submit handler invokes the shared dispatch adapter. Its `useDispatch` hook dispatches the owning repository's asynchronous thunk. The compatibility property named `api` in the old action modules is this adapter, not a transport client.
3. The thunk calls the injected API client. `services/api.js` is the sole HTTP transport. HTTP failures and `success: false` responses reject the thunk.
4. The existing controller and domain service validate authorization, schedules, stock, membership, proof, and transition rules.
5. The repository boundary serializes requests and begins a SQLite transaction. It retains an undo snapshot of the existing service materialization.
6. Changed aggregate rows and their related effects (for example, task plus notification) are written in the same transaction. The backend commits before sending the successful response and `X-Kindred-Revision` header.
7. A rejected database operation rolls back SQL and restores all affected service records. The API sends an error. Domain validation errors also restore records, with one explicit exception: an incorrect verification code retains only its attempt audit, preserving the existing lockout rule. Database failure while saving that audit also rolls it back.
8. Only fulfilled thunk reducers insert/update/remove entity records. Pending actions affect operation metadata only; rejected actions retain existing records and expose errors.
9. Confirmed writes invalidate active page reads. `useSelector` automatically renders the confirmed records; no component performs a speculative entity edit.

## State ownership and synchronization fixes

- Removed the page-local record cache from `usePageData`; it now dispatches read thunks and selects repository queries.
- Moved workflow forms, filters, candidate selections, modals, messages, ratings, delivery reviews, account state, and notifications into Redux-backed hooks/slices.
- Complete server records replace their prior snapshot, clearing removed optional fields. Candidate, brief and nested projections merge into their canonical owners without discarding unrelated entity details.
- Canonical entities are keyed by id. Public/management/member listings and compound program briefs refer to the same records instead of maintaining copied lists.
- Query results retain their request/session scope. Candidate eligibility is query-specific metadata rather than an overwrite of the canonical volunteer.
- Selected records use entity/query references; editable drafts remain separate UI values. Browser file handles stay outside serializable state, with Redux holding only handles' ids.
- Removed the manual checkout stock subtraction; stock reloads from the saved backend result.
- Removed the notification component's independent record list and manual read-state rewrite. A failed mark-read request leaves the confirmed notification unchanged.
- Removed the standalone authentication API singleton. Sign-in and all domain requests now run through thunks using the current Redux session.
- Removed browser-stored donation receipts and program/request record copies. Saved cards contain only optional masked metadata; their displayed source is `preferencesSlice`.
- Program edit and collection-request forms can reconstruct their defaults from backend data after a refresh, using their URL ids.
- Write response caches include the HTTP method, so a POST result cannot replace a GET listing for the same URL.
- Confirmed writes automatically invalidate active reads and notify other tabs; removed redundant refresh dispatches after successful form submissions.
- Shared reads are deduplicated, effect requests cancel on teardown, and stale reads cannot replace confirmed newer writes. Server revisions prevent older responses from overwriting newer entity versions.
- Session changes clear repository caches, preventing data from a previous actor from appearing under the next actor.
- Rejected verification attempts retain their lockout audit across restarts; failed entity operations still restore their prior records.
- SQLite persists across backend restarts. Record payloads remain encrypted using the existing codec. Database files and keys are ignored by Git.
- The only remaining React `useState` in application source is an animated presentation counter in `PageElements.jsx`; its target comes from Redux and it does not hold entity records or form state.

## Evaluation and verification

From `front-end/`:

```powershell
npm test
npm run build
npm run test:redux:live
npm run test:e2e
```

`test:redux:live` requires a current backend build and creates a temporary database and real Nest server. It dispatches real create/read/update/delete thunks, checks pending and failed state, deliberately causes a real SQLite write error, recreates both the server and Redux store, verifies saved data, and removes the verification database afterward. It uses no mock API.

From `back-end/`:

```powershell
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run build
```

The existing encrypted snapshot can be checked without modifying it using `node scripts/verify-migration.cjs` from `back-end/`. Verification imports into a temporary database, checks every saved collection and id, and checks hashes of the original snapshot and key.

Backend persistence tests also inject a real SQLite failure after related service changes to verify full transaction restoration.

For an isolated browser run, start a backend with a separate `KINDRED_DATABASE` and `PORT=3001`, then run:

```powershell
$env:KINDRED_TEST_API_URL='http://localhost:3001'
$env:KINDRED_TEST_FRONTEND_URL='http://127.0.0.1:5175'
npm run test:e2e
```

The existing browser suite's test-only network fixtures remain test-only; no mock data source or fallback has been added to the application. The configurable addresses keep integration writes away from the working database.

Redux DevTools is enabled for development. Inspect `repositories/<module>/<operation>/pending`, `/fulfilled`, and `/rejected`, alongside `auth/*`, `ui/*`, and `sync/*`. Entity data stays unchanged at pending/rejected; confirmed records and operation status are visible at fulfilled. Browser checks also inspect the running store, confirm canonical entity references and UI filters, reload the app, and exercise a real rejected HTTP write.

### Completed checks

| Check | Result |
|---|---|
| Frontend unit tests | 44 passed |
| Frontend ESLint | Passed, no warnings |
| Frontend production build | Passed; Vite reports a bundle over 500 kB |
| Backend unit and repository tests | 65 passed |
| Backend API workflow tests | 17 passed |
| Backend production build | Passed |
| Real Redux -> HTTP -> SQLite verification | Create/read/update/delete, pending state, failed-write preservation, restart persistence, and separate read/write cache keys passed |
| Existing encrypted snapshot migration | 23 repositories and 63 saved records verified; original snapshot/key hashes unchanged |
| Redux DevTools | Enabled through configureStore; action/state lifecycles checked in reducer, live integration, and browser tests. The extension panel was not manually inspected. |
| Browser verification | All 163 cases verified: 158 passed in the complete run with 3 workers; five outdated assertions were corrected, with 4 passing in the targeted rerun and the final style case passing separately. No application change was needed for those assertion corrections. |

The browser assertions were updated for current controls, program scheduling, private management APIs, product archival, authenticated sessions and parallel CRUD activity. The full run used an isolated SQLite database; the working database was not used for integration writes. Temporary test servers were stopped after verification.

### Runtime and existing feature limits

- Node.js 24+ is required for the backend. Node currently labels its SQLite module experimental.
- The existing card-payment and identity-verification demonstrations remain demonstrations. This refactor adds no payment gateway, UIDAI integration, real SMS service, or replacement mock endpoint.
- Standalone legacy phone/OTP pages still report the existing missing send/verify API honestly. The current signup verification and security-question recovery flows retain their existing behavior.
- Existing upload URLs use `http://localhost:3000`; run the normal application on that API address. Isolated test backends share the local uploads directory. API JSON requests themselves use the configurable API address.
- Financial and evidence/history records keep their existing transition and retention rules, as detailed in the mapping above.
- Vite's large-bundle warning remains; the build succeeds.
