# auth-service (DEPRECATED)

> **Note:** Standalone `auth-service` has been retired. Google OAuth and local authentication have been consolidated directly into `backend/service` under unified MongoDB sessions (`ls.sid`).

Standalone authentication service for LanguageStudio. Handles user identity exclusively via **Google OAuth 2.0** — no passwords or registration forms.

## Architecture

```
Browser → Gateway (:3005) → /api/v1/auth/* → auth-service (:3007) /api/auth/*
```

The gateway proxies `/api/v1/auth` to this service, rewriting the path prefix. User records are stored in a local JSON file; sessions are held in an in-memory Map with an HttpOnly cookie.

## Quick Start

```bash
cd backend/auth-service
cp .env.example .env   # then fill in Google credentials
npm install
npm start
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3007` | Port the service listens on |
| `HOST` | `127.0.0.1` | Bind address |
| `AUTH_USERS_FILE` | `./data/users.json` | Path to the user store JSON file |
| `GOOGLE_CREDENTIALS_JSON` | *(optional)* | Path to a Google client secret JSON file |
| `GOOGLE_CLIENT_ID` | *(optional if JSON file provided)* | OAuth 2.0 client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | *(optional if JSON file provided)* | OAuth 2.0 client secret |
| `GOOGLE_REDIRECT_URI` | `http://localhost:3005/api/v1/auth/google/callback` | Authorized redirect URI (must match Google Console) |
| `SESSION_SECRET` | *(required in prod)* | Secret used to sign session identifiers |
| `NODE_ENV` | `development` | Set to `production` in production |

### Setting Up Google OAuth Credentials

You can supply credentials in **either of two ways**:

#### Option A: Using a Google credentials JSON file (Recommended)
Place your downloaded JSON file (e.g. `client_secret_*.json` or `credentials.json`) from Google Cloud Console into `backend/auth-service/` (or `backend/` or project root), or set `GOOGLE_CREDENTIALS_JSON=./path/to/file.json`. The service will automatically detect and load `client_id`, `client_secret`, and `redirect_uris` from it!

#### Option B: Using .env variables
1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**.
2. Create an **OAuth 2.0 Client ID** (Application type: **Web application**).
3. Add `http://localhost:3005/api/v1/auth/google/callback` to **Authorized redirect URIs**.
4. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `backend/auth-service/.env`.

## API Endpoints

All routes are mounted at `/api/auth` within this service (exposed externally as `/api/v1/auth` via the gateway).

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/auth/google` | Initiates the Google OAuth flow; redirects the browser to Google consent screen |
| `GET` | `/api/auth/google/callback` | OAuth callback — exchanges code for tokens, creates/links user, sets cookie, redirects to `/pages/home.html` |
| `GET` | `/api/auth/session` | Returns `{ authenticated: true, user }` or `{ authenticated: false }` |
| `GET` | `/api/auth/me` | Alias for `/api/auth/session` (for frontend compatibility) |
| `POST` | `/api/auth/logout` | Destroys current session and clears `ls_session` cookie |

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the service |
| `npm test` | Run the test suite |
| `npm run user:role` | CLI utility to change a user's role in the JSON store |

## Notes

- Sessions are **in-memory** — they are lost on restart. This is intentional for development simplicity; swap for a persistent store before deploying to production.
- The JSON user store (`data/users.json`) is created automatically if it does not exist.
- In production set `SESSION_SECRET` to a long random string and ensure the redirect URI uses `https`.
