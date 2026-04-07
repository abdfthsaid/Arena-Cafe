# Arena Cafe Station Frontend

Temporary single-station React/Vite frontend for testing Arena Cafe Mogadishu
against the current Render `UsersBackend`.

- Station code: `62`
- Backend: same-origin `/api/*` proxy to `https://usersbackend-6yhs.onrender.com`
- Flow: Waafi preauthorization, HeyCharge unlock, Waafi commit/cancel

Vercel routes `/api/*` to Render through `vercel.json`, so production browsers do not call Render directly.

Optional local environment variables:

```bash
VITE_USERS_BACKEND_URL=https://usersbackend-6yhs.onrender.com
VITE_STATION_CODE=62
```

Run locally:

```bash
npm install
npm run dev
```
