# Kindred backend

NestJS API. Application source is in `src/`, and integration tests are in `test/`.

```powershell
npm ci
npm run build
npm run start:prod
```

The API runs at http://localhost:3000. Interactive documentation is available at http://localhost:3000/api/docs.

See the [project README](../README.md) for frontend setup, local data behaviour, and test commands.

## Persistent repositories

Use Node.js 24 or later. Records are stored in encrypted SQLite rows in `.run/kindred.sqlite`, with atomic rollback before failed responses. Existing encrypted server snapshots are imported on the first normal startup. See [the architecture guide](../front-end/REDUX_ARCHITECTURE.md) for repository mapping and verification.
