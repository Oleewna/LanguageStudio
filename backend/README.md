# LanguageStudio Backend Services

LanguageStudio backend is structured into three microservices:

| Service | Port | Directory | Purpose | Documentation |
|---|---|---|---|---|
| **Gateway** | `3005` | [`gateway/`](./gateway/) | Public-facing reverse proxy, static file server, and CORS handler | [Gateway README](./gateway/README.md) |
| **Content Service** | `3006` | [`service/`](./service/) | Core data API: vocabulary, lesson content, progress, payments, SQLite & MongoDB | [Service README](./service/README.md) |
| **Auth Service** | `3007` | [`auth-service/`](./auth-service/) | Dedicated authentication service with Google OAuth 2.0 | [Auth Service README](./auth-service/README.md) |

## System Architecture

```
                       Browser (:3005)
                              │
                    ┌─────────▼─────────┐
                    │      Gateway      │ (:3005)
                    └─────────┬─────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
    Static Assets       /api/v1/auth/*       /api/v1/content/*
  (frontend/public,    (rewritten to        (rewritten to
      courses/)        /api/auth/*)         /api/content/*)
                              │                   │
                              ▼                   ▼
                      ┌───────────────┐   ┌───────────────┐
                      │  auth-service │   │    service    │
                      │    (:3007)    │   │    (:3006)    │
                      └───────────────┘   └───────────────┘
                       (Google OAuth,      (MongoDB, SQLite,
                        users.json)         progress, vocab)
```

## Quick Start (All Services)

To run the whole backend locally:

```bash
# 1. Start auth-service (port 3007)
cd backend/auth-service
npm install
npm start

# 2. In a second terminal, start content service (port 3006)
cd backend/service
npm install
npm start

# 3. In a third terminal, start gateway (port 3005)
cd backend/gateway
npm install
npm start
```

Or from the root directory, simply run:
```cmd
start.bat
```

Then visit [http://localhost:3005](http://localhost:3005) in your browser.
