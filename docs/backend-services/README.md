# Backend Services Architecture & Service Matrix

LanguageStudio's backend operates as a decoupled, multi-tier system composed of three specialized Node.js microservices. This document provides a high-level matrix, topology diagram, and communication guide for AI agents and human developers who need an immediate, accurate grasp of the backend without loading the entire codebase.

---

## Service Matrix

| Service | Port | Directory | Core Technologies | Primary Responsibilities |
|---|---|---|---|---|
| **[Gateway Service](./gateway.md)** | `3005` | [`backend/gateway/`](../../backend/gateway/) | Express 5, `http-proxy-middleware`, `dotenv` | Public reverse proxy, SSL/CORS termination, static asset delivery (`frontend/public/`), `.json` course protection guard, upstream load distribution. |
| **[Content & API Service](./content-service.md)** | `3006` | [`backend/service/`](../../backend/service/) | Express 5, `better-sqlite3`, Mongoose / MongoDB Atlas, `connect-mongo`, Argon2, Zod, Helmet | Core application engine: SQLite vocabulary dictionary, MongoDB persistent user profiles and progress, entitlement enforcement, course lessons delivery, payment webhooks. |
| **[Auth Service](./auth-service.md)** | `3007` | [`backend/auth-service/`](../../backend/auth-service/) | Express, Google Auth Library, Session storage | Dedicated OAuth 2.0 authentication service for Google SSO token exchange, session bridging, and credential federation. |

---

## Topology & Network Flow

```
                              ┌─────────────────────────────┐
                              │    Client / Web Browser     │
                              │ (Vanilla JS, CSS3, HTML5)   │
                              └──────────────┬──────────────┘
                                             │ HTTP / HTTPS (:3005)
                                             ▼
                              ┌─────────────────────────────┐
                              │       Gateway Service       │
                              │         (Port 3005)         │
                              │  - Reverse Proxy (CORS)     │
                              │  - Static Asset Delivery    │
                              │  - Course .json Guard       │
                              └──────────────┬──────────────┘
                                             │
             ┌───────────────────────────────┴──────────────────────────────┐
             │ Internal Proxy (:3006)                                       │ Direct OAuth Proxy (:3007 or :3006)
             ▼                                                              ▼
┌──────────────────────────────────────────────┐          ┌───────────────────────────────────┐
│        Content & API Service (:3006)         │          │        Auth Service (:3007)       │
│                                              │          │                                   │
│  - /api/courses (Lesson delivery & gating)   │          │  - /api/auth/google               │
│  - /api/progress (Sync & conflict resolution)│          │  - /google/callback (OAuth 2.0)   │
│  - /api/vocab (SQLite diacritic search)      │          │  - Dedicated SSO credential broker│
│  - /api/payments (Checkout & webhooks)       │          └───────────────────────────────────┘
│  - /api/auth (Unified session authentication)│
└──────────────┬───────────────────────────────┘
               │
      ┌────────┴───────────────────────────┐
      ▼                                    ▼
┌────────────────────────────┐    ┌────────────────────────────┐
│       MongoDB Atlas        │    │    SQLite (data/vocab.db)  │
│  - User accounts & Argon2  │    │  - Normalized dictionary   │
│  - Progress collections    │    │  - Diacritic-free search   │
│  - Entitlement grants      │    │  - Relational metadata     │
│  - Session store (ls.sid)  │    └────────────────────────────┘
└────────────────────────────┘
      ▲
      │ Server-side entitlement gate
┌─────┴──────────────────────┐
│    Protected Filesystem    │
│  - paid-content/ (Gated)   │
│  - courses/ (Free tier)    │
└────────────────────────────┘
```

---

## Shared Conventions Across All Services

1. **Environment Variables**: Every service loads configuration via `dotenv` from `config/env.js`. Port configurations use integer validation with fallback defaults.
2. **Session Cookies**:
   - Cookie Name: `ls.sid` (Content Service) / `connect.sid`
   - Signed with `SESSION_SECRET`
   - Attributes: `httpOnly: true`, `sameSite: 'lax'`, `secure: false` (in development) / `true` (in production).
3. **Graceful Fallbacks**:
   - If `MONGODB_URI` is omitted, the Content Service automatically switches to Express `MemoryStore` for sessions and local mock storage, allowing development without cloud dependencies.
   - If the payment provider is set to `mock`, payments and webhooks operate seamlessly without external API keys.
4. **Health Check Protocol**:
   - Every service implements `GET /health` returning JSON `{ "status": "ok", "service": "<name>" }`.

---

## Individual Service Deep-Dives

- [Gateway Service Documentation](./gateway.md)
- [Content & API Service Documentation](./content-service.md)
- [Auth Service Documentation](./auth-service.md)
