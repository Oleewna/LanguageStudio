# LanguageStudio Backend Services

LanguageStudio backend is structured into modular microservices and data services:

| Service | Port | Directory | Purpose | Documentation |
|---|---|---|---|---|
| **Gateway** | `3005` | [`gateway/`](./gateway/) | Public-facing reverse proxy, static file server, and CORS handler | [Gateway README](./gateway/README.md) |
| **Content & API Service** | `3006` | [`service/`](./service/) | Core data API: vocabulary, lesson content, progress, payments, SQLite database | [Service README](./service/README.md) |
| **MongoDB Service** | `3008` | [`mongodb-service/`](./mongodb-service/) | Dedicated MongoDB persistence layer: connection lifecycle, schemas, models (User, Progress, Entitlement), and decentralized data services | [MongoDB Service README](./mongodb-service/README.md) |
| **Auth Service (Legacy)** | `3007` | [`auth-service/`](./auth-service/) | Dedicated authentication service (auth is also integrated directly in `service/`) | [Auth Service README](./auth-service/README.md) |

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
