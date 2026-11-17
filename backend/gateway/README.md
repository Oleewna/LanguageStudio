# gateway

Public-facing entry point for LanguageStudio. Serves the static frontend, reverse-proxies API calls to the appropriate backend service, and enforces CORS.

## Architecture

```
Browser (:3005)
  ├── /api/v1/auth/*   → auth-service (:3007)  [path rewritten to /api/auth/...]
  ├── /api/v1/content/* → service (:3006)       [path rewritten to /api/content/...]
  ├── /api/v1/progress/* → service (:3006)      [path rewritten to /api/progress/...]
  ├── /api/**          → service (:3006)
  ├── /courses/**      → static (courses/)
  ├── /               → static (frontend/public/)
  └── GET /health      → 200 OK
```

Start all three services before starting the gateway, or they will be unavailable at proxy time (the gateway will still start but upstream requests will fail until the services come up).

## Quick Start

```bash
# Start backends first
cd backend/auth-service && npm start &
cd backend/service      && npm start &

# Then start the gateway
cd backend/gateway
cp .env.example .env
npm install
npm start
```

Open `http://localhost:3005` in your browser.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3005` | Port the gateway listens on |
| `HOST` | `127.0.0.1` | Bind address |
| `SERVICE_URL` | `http://127.0.0.1:3006` | URL of the main service |
| `AUTH_SERVICE_URL` | `http://127.0.0.1:3007` | URL of the auth-service |
| `CORS_ORIGINS` | *(none)* | Comma-separated list of allowed CORS origins (e.g. `http://localhost:5500,http://127.0.0.1:5500`) |

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check — returns `200 OK` |
| `ANY` | `/api/v1/auth/*` | Proxied to auth-service, path rewritten to `/api/auth/*` |
| `ANY` | `/api/v1/content/*` | Proxied to service, path rewritten to `/api/content/*` |
| `ANY` | `/api/v1/progress/*` | Proxied to service, path rewritten to `/api/progress/*` |
| `ANY` | `/api/**` | Proxied to service (all other API routes) |
| `GET` | `/*` | Static frontend files (`frontend/public/`) |
| `GET` | `/courses/*` | Static course assets |

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the gateway |
| `npm test` | Run the test suite |

## Notes

- The gateway does **not** perform authentication itself — auth is delegated to auth-service and service.
- Leave `CORS_ORIGINS` unset to disable the CORS middleware (all origins rejected by browser for cross-origin requests).
- In production, put a TLS-terminating reverse proxy (nginx, Caddy, etc.) in front of the gateway and set `HOST=0.0.0.0`.
