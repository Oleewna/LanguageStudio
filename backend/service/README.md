# service

Core data API for LanguageStudio. Provides endpoints for vocabulary, lesson content, user progress, courses, payments, and authentication. This is the central backend that the gateway proxies most traffic to.

## Architecture

```
Browser → Gateway (:3005) → service (:3006)
                          ↘ /api/v1/auth → auth-service (:3007)
```

The service owns two data layers:

- **MongoDB Atlas** — users, sessions, progress, entitlements
- **SQLite** — vocabulary (`data/vocab.db`) and lesson content (`data/content.sqlite`)

It also serves the frontend static files and course assets directly (duplicating the gateway's static serving, useful for development without the gateway).

## Quick Start

```bash
cd backend/service
cp .env.example .env   # fill in MONGODB_URI and SESSION_SECRET
npm install
npm start
```

If `MONGODB_URI` is not set the service falls back to an in-memory store (data is lost on restart).

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3006` | Port the service listens on |
| `HOST` | `127.0.0.1` | Bind address |
| `NODE_ENV` | `development` | Set to `production` in production |
| `MONGODB_URI` | *(none)* | MongoDB Atlas connection string; omit for in-memory fallback |
| `SESSION_SECRET` | *(required in prod)* | Secret for signing session cookies |
| `SESSION_COOKIE_NAME` | `ls.sid` | Name of the session cookie |
| `COOKIE_SECURE` | `false` | Set `true` in production when served over HTTPS |
| `ENABLE_RATE_LIMIT` | `true` | Enable per-IP rate limiting on API routes |

### MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Add a database user and whitelist your IP (or `0.0.0.0/0` for development).
3. Copy the **connection string** (Node.js driver format) into `MONGODB_URI` in your `.env`.

## API Endpoints

All routes are prefixed with `/api`. Many have a `/api/v1/` alias for gateway compatibility.

| Path | Description |
|---|---|
| `/api/auth` | Register, login, logout, session, password reset, email verify |
| `/api/v1/auth` | Alias for `/api/auth` |
| `/api/vocab` | Vocabulary lookup |
| `/api/user-words` | Per-user saved word lists |
| `/api/examples` | Example sentences |
| `/api/progress` / `/api/v1/progress` | Lesson progress tracking |
| `/api/payments` / `/api/v1/payments` | Payments and entitlements |
| `/api/courses` / `/api/v1/courses` | Course and lesson data |
| `/api/content` / `/api/v1/content` | Content proxy |

Static assets are served from `courses/` and `frontend/public/`.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the service |
| `npm test` | Run the test suite |
| `npm run import:vocab` | Import vocabulary data into the SQLite database |
| `npm run seed:vocab` | Seed initial vocabulary records |

## Notes

- The SQLite databases (`data/vocab.db`, `data/content.sqlite`) must be populated before vocabulary and content endpoints return data — run `npm run import:vocab` after first install.
- Rate limiting is on by default; set `ENABLE_RATE_LIMIT=false` during development if needed.
- `COOKIE_SECURE=true` requires HTTPS; leave it `false` for local development.
