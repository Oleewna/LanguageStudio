# Auth Service

- **Port**: `3007` (default, configurable via `PORT`)
- **Directory**: [`backend/auth-service/`](../../backend/auth-service/)
- **Entrypoint**: `src/server.js`
- **Primary Dependencies**: `express` (^5.2.1), `google-auth-library` (^11.3.4), `dotenv` (^18.0.9)

---

## 1. Overview & Purpose

The **Auth Service** is a dedicated microservice designed to isolate third-party OAuth 2.0 flows, particularly Google Single Sign-On (SSO). It manages identity negotiation with Google's authorization servers, tokens validation, and user profile resolution.

> **Architectural Note**: As documented in `ARCHITECTURE.md`, while the full microservice topology allows `auth-service` to run independently on port `3007`, authentication flows and MongoDB session handling have also been consolidated natively within `backend/service` (port `3006`) under unified `ls.sid` session cookies to streamline single-process deployments. The standalone `auth-service` remains fully operational for dedicated microservice environments.

---

## 2. Configuration & Environment Variables

Configuration is resolved in `config/env.js`:

| Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | Integer | `3007` | Port on which the auth service listens. |
| `HOST` | String | `127.0.0.1` | Network interface to bind. |
| `GOOGLE_CLIENT_ID` | String | `""` | Google Cloud OAuth 2.0 Client ID. |
| `GOOGLE_CLIENT_SECRET` | String | `""` | Google Cloud OAuth 2.0 Client Secret. |
| `GOOGLE_REDIRECT_URI` | URL | `http://localhost:3005/api/v1/auth/google/callback` | Callback URL registered in Google Cloud Console. |
| `APP_URL` | URL | `http://localhost:3005` | Base client application URL for final redirection. |

---

## 3. Endpoints & Route Definitions

| Method | Path | Target Controller | Description |
|---|---|---|---|
| `GET` | `/health` | Inline handler | Returns `{ status: "ok", service: "auth" }`. |
| `GET` | `/google` | `googleRedirect` | Root alias initiating Google OAuth redirection. |
| `GET` | `/api/auth/google` | `googleRedirect` | Standard API path initiating Google OAuth flow. |
| `GET` | `/google/callback` | `googleCallback` | Root alias handling Google authorization code exchange. |
| `GET` | `/api/auth/google/callback` | `googleCallback` | Standard API callback path handling code exchange. |

---

## 4. Google OAuth 2.0 Flow Lifecycle

```
[Browser]
   │
   │ 1. Click "Sign in with Google" on /pages/auth.html
   ▼
[Gateway :3005] ──► Proxies to Auth Service (:3007 or :3006)
                       │
                       ├─► Generates secure cryptographic state nonce
                       ├─► Stores returnUrl (if provided) in session
                       └─► 302 Redirect to https://accounts.google.com/o/oauth2/v2/auth
                             ▼
                    [Google Login Screen]
                             │ User authenticates & approves scopes:
                             │ - openid
                             │ - profile
                             │ - email
                             ▼
[Auth Service Callback] (:3007/api/auth/google/callback)
   │
   ├─► Validates state parameter to prevent CSRF attacks
   ├─► Exchanges authorization code with Google token endpoint
   ├─► Verifies Google ID token via google-auth-library
   ├─► Extracts: googleId, email, name, picture
   ├─► Resolves user via UserStore (or MongoDB User model)
   ├─► Establishes authenticated session
   └─► 302 Redirect to /pages/home.html (or stored returnUrl)
```

---

## 5. Storage Fallback (`src/utils/userStore.js`)

When operating in offline or standalone development mode without a cloud database connection:
- Users are persisted in a local JSON storage file (`data/users.json`).
- Stores Google profile attributes, creation timestamp, and last login date.
- Emulates MongoDB user ID generation so client code operates identically.

---

## 6. Local Development & Testing

```bash
# Start Auth Service
cd backend/auth-service
npm install
npm start

# Run tests
npm test
```
When running properly, output displays:
```
LanguageStudio auth service running at http://localhost:3007
```
