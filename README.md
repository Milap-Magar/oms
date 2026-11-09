# Ordiva: Order Management (Frontend)

A landing page, login and register for a simple order management system.
Built with **Bun + React 19**, plain CSS, no UI framework, and system fonts, so it stays small and fast (~73 KB gzipped JS).

## Run

```bash
bun install
cp .env.example .env     # set API_URL to your Spring Boot server
bun run dev              # http://localhost:3000  (hot reload)
```

| Script              | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `bun run dev`       | Dev server with HMR, proxies `/api/*` to `API_URL`    |
| `bun run start`     | Same server in production mode                        |
| `bun run build`     | Static build to `dist/` (host on any static host)     |
| `bun run typecheck` | TypeScript check                                      |

## Pages

| Route        | File                       |
| ------------ | -------------------------- |
| `/`          | `src/pages/Landing.tsx`    |
| `/login`     | `src/pages/Login.tsx`      |
| `/register`  | `src/pages/Register.tsx`   |
| `/dashboard` | `src/pages/Dashboard.tsx` (placeholder, needs login) |

Routing lives in `src/main.tsx` (a tiny router in `src/lib/router.tsx`, no dependency).
To add a page, add a `case` to the switch in `main.tsx`.

## Backend contract (Spring Boot)

The frontend calls `/api/*` on its own origin. In dev, `server.ts` proxies these to `API_URL`
(default `http://localhost:8080`), so **no CORS config is needed in development**.

### `POST /api/auth/register`
```json
{ "fullName": "Jane Doe", "companyName": "Acme Store", "email": "jane@acme.io", "password": "Secret123!" }
```
`companyName` is optional.

### `POST /api/auth/login`
```json
{ "email": "jane@acme.io", "password": "Secret123!" }
```

### Both return `200`
```json
{ "token": "<JWT>", "user": { "id": 1, "fullName": "Jane Doe", "email": "jane@acme.io", "companyName": "Acme Store" } }
```

### Errors
- `401` wrong credentials, `409` email already registered, `400` validation.
- Body: `{ "message": "..." }`. Field errors are shown under the matching input if you send either
  `{ "errors": { "email": "..." } }` or Spring's `{ "errors": [{ "field": "email", "defaultMessage": "..." }] }`.

Every later request sends `Authorization: Bearer <token>` automatically (`src/lib/api.ts`).
Use `api<T>("/api/orders")` for new endpoints.

## Deploying to Cloudflare

`wrangler.jsonc` serves `dist/` from Cloudflare's CDN, and `worker/index.ts` forwards `/api/*`
to your backend, so it stays same-origin (no CORS) like in development.

In Cloudflare → Workers & Pages → Create → Import a repository:

| Setting         | Value                 |
| --------------- | --------------------- |
| Build command   | `bun run build`       |
| Deploy command  | `npx wrangler deploy` |
| Root directory  | `/`                   |

Then set the variable **`API_URL`** (Settings → Variables and secrets) to your public Spring Boot URL,
e.g. `https://api.yourdomain.com`. Until it's set, login/register show "The server isn't connected yet."

Test locally: `bun run build && bunx wrangler dev --var API_URL:http://localhost:8080`

## Deploying elsewhere

- **Same domain (recommended):** serve `dist/` and route `/api/*` to Spring Boot (e.g. Nginx, Caddy),
  or run `bun run start` next to the backend. The host must fall back to `index.html` for unknown paths (SPA).
- **Different domain:** set `window.ORDIVA_API_URL = "https://api.example.com"` in `index.html`
  before the app script, and enable CORS for your frontend origin in Spring Boot.
