# Kindred frontend

React application with Vite. Source code is in `src/`; shared styling and static assets are in `src/styles/` and `public/`. Tests are in `tests/`.

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:5173. See the [project README](../README.md) for backend setup and verification commands.

Set `VITE_API_BASE_URL` in `.env.local` to override the default API address, `http://localhost:3000`. `.env.example` contains the public configuration template.

Production hosting must serve `index.html` for frontend routes, including direct page loads and refreshes.

## Redux and persistence

Application data, forms and selections use Redux Toolkit. See [the architecture and evaluation guide](REDUX_ARCHITECTURE.md) for the complete repository-to-slice mapping, thunk exports, data flow, and verification commands. Run the backend on Node.js 24 or later.
