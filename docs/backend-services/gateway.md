# Gateway Service

- **Port**: `3005` (default, configurable via `PORT`)
- **Directory**: [`backend/gateway/`](../../backend/gateway/)
- **Entrypoint**: `src/gateway.js`
- **Primary Dependencies**: `express` (^5.2.1), `http-proxy-middleware` (^3.0.5), `dotenv` (^18.0.9)

---

## 1. Overview & Purpose

The **Gateway Service** is the public-facing reverse proxy and edge router for the LanguageStudio application. It is the sole service exposed directly to client browsers during normal operation. 

### Key Responsibilities
1. **Single Entry Point**: Directs browser traffic to static assets, core APIs, or authentication endpoints without cross-origin friction.
2. **CORS Termination**: Validates incoming `Origin` headers against allowed origins and handles preflight `OPTIONS` requests.
3. **Static Asset Delivery**: Serves client frontend files (`frontend/public/`) and media assets (`courses/*/images/`, `courses/*/audio/`).
4. **Course Content Protection**: Intercepts and blocks direct download attempts for proprietary course curriculum `.json` files.
5. **Upstream Request Forwarding**: Transparently proxies `/api/*` and unhandled page requests upstream to the Content Service (port `3006`).

---

## 2. Configuration & Environment Variables

Configuration is resolved in `src/config/env.js` from `backend/.env` (or process environment):

| Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | Integer | `3005` | Port on which the gateway listens for HTTP connections. |
| `HOST` | String | `127.0.0.1` | Network interface to bind. |
| `SERVICE_URL` | URL | `http://127.0.0.1:3006` | Base URL of the upstream Content & API Service. |
| `AUTH_SERVICE_URL` | URL | `http://127.0.0.1:3006` | Base URL of authentication service (or unified service). |
| `CORS_ORIGINS` | Comma-separated | `""` | Whitelist of allowed origins (e.g. `http://localhost:3000,http://127.0.0.1:3005`). |

---

## 3. Middleware & Routing Pipeline

Requests passing through the Gateway traverse the following sequential pipeline:

```
[Incoming HTTP Request]
       │
       ▼
[1. CORS & Preflight Middleware]
       │ - Matches Origin against config.corsOrigins
       │ - Sets Access-Control-Allow-Credentials: true
       │ - Returns 204 No Content for OPTIONS requests
       ▼
[2. Health Check: GET /health] ────► Returns { status: "ok", service: "gateway" }
       ▼
[3. Upstream API Proxy Rules (http-proxy-middleware)]
       ├─► /api/auth, /api/v1/auth     ──► Rewrites to /api/auth on :3006
       ├─► /api/courses, /api/v1/courses ─► Rewrites to /api/courses on :3006
       ├─► /api/content, /api/v1/content ─► Smart rewrite to /api/courses on :3006 (catalog / courses / subpaths)
       ├─► /api/vocab                  ──► Rewrites to /api/vocab on :3006
       ├─► /api/payments, /api/v1/payments ─► Rewrites to /api/payments on :3006
       └─► /api/v1/progress            ──► Rewrites to /api/progress on :3006
       ▼
[4. Course Protection Guard: /courses]
       │ - If req.path ends with '.json' ──► 403 Forbidden ("Direct access not permitted")
       │ - Otherwise ──► express.static(projectRoot/courses) (audio, svg, png)
       ▼
[5. Frontend Public Static Delivery]
       │ - express.static(projectRoot/frontend/public) (css, js, html, assets)
       ▼
[6. Fallback Upstream Proxy]
       └─► Proxies any unmatched path to config.serviceUrl (:3006) for page rewrites
```

---

## 4. Security & Guard Mechanisms

### 4.1 Course JSON Guard
To prevent learners or automated crawlers from downloading course answer keys, lesson curriculums, and paid content definitions directly:
```javascript
app.use('/courses', (req, res, next) => {
    if (req.path.endsWith('.json')) {
        return res.status(403).json({ 
            error: 'Direct access to course content files is not permitted.' 
        });
    }
    next();
});
```
Any access to course definitions must flow through `/api/courses/:courseId/lessons/:lessonId`, which performs server-side entitlement checks.

### 4.2 Upstream Failure Interception (502 Bad Gateway)
If upstream services are unavailable, down, or restarting, the proxy intercepts connection errors and returns a formatted JSON payload rather than hanging or leaking socket traces:
```json
{
  "error": "Course service is unavailable."
}
```

---

## 5. Endpoints & Route Definitions

| Method | Path | Target / Handling | Description |
|---|---|---|---|
| `GET` | `/health` | Handled locally | Gateway health check. Returns `200 OK`. |
| `ANY` | `/api/auth/*` | Upstream `:3006/api/auth/*` | Authentication operations (login, register, session, Google OAuth). |
| `ANY` | `/api/v1/auth/*` | Upstream `:3006/api/auth/*` | Versioned alias for authentication. |
| `ANY` | `/api/courses/*` | Upstream `:3006/api/courses/*` | Course metadata and authorized lesson content delivery. |
| `ANY` | `/api/content/*` | Upstream `:3006/api/courses/*` | Smart rewrite routing course catalog, individual courses, and subpaths to content service. |
| `ANY` | `/api/v1/content/*` | Upstream `:3006/api/courses/*` | Versioned smart alias for course content and catalog. |
| `ANY` | `/api/vocab/*` | Upstream `:3006/api/vocab/*` | Vocabulary search and lexical queries. |
| `ANY` | `/api/payments/*` | Upstream `:3006/api/payments/*` | Payment checkout and signed webhook reception. |
| `ANY` | `/api/v1/progress/*` | Upstream `:3006/api/progress/*` | User progress retrieval and three-way conflict sync. |
| `GET` | `/courses/*` (media) | Local `courses/` directory | Serves images, audio, illustrations. `.json` requests return `403`. |
| `GET` | `/*` (static) | Local `frontend/public/` | Serves HTML, CSS, client JS bundles, and static SVG icons. |
| `GET` | `/*` (unmatched) | Upstream `:3006/*` | Passes clean URLs (`/home`, `/lesson`, `/settings`) to service page router. |

---

## 6. Local Development & Testing

```bash
# Start Gateway individually
cd backend/gateway
npm install
npm start

# Run test suite
npm test
```
When running properly, output displays:
```
LanguageStudio gateway running at http://localhost:3005
```
