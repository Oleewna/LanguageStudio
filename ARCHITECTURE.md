# LanguageStudio Backend Architecture & Internal Call Flow

This document provides a comprehensive technical breakdown of **LanguageStudio's** backend architecture, service boundaries, data stores, middleware pipeline, and end-to-end request lifecycles ("what calls what").

---

## 1. High-Level Architecture

LanguageStudio employs a modular backend architecture comprising an edge reverse proxy (**Gateway**), a core application and content service (**Content & API Service**), dual data storage layers (**MongoDB Atlas** and **SQLite**), and isolated filesystem-backed lesson repositories.

```
                              ┌─────────────────────────────┐
                              │    Client / Web Browser     │
                              │ (Vanilla JS, CSS, HTML5)    │
                              └──────────────┬──────────────┘
                                             │ HTTP / HTTPS (:3005)
                                             ▼
                              ┌─────────────────────────────┐
                              │       Gateway Service       │
                              │       (Port 3005)           │
                              │  - Reverse Proxy (CORS)     │
                              │  - Static Asset Delivery    │
                              │  - Content Protection Guard │
                              └──────────────┬──────────────┘
                                             │ Internal Proxy (:3006)
                                             ▼
    ┌────────────────────────────────────────────────────────────────────────┐
    │                       Content & API Service (Port 3006)                │
    │                                                                        │
    │  Middleware Pipeline:                                                  │
    │  [Helmet] ──► [express.json] ──► [Session (ls.sid)] ──► [RateLimit]   │
    │                                                                        │
    │  Route Handlers & Controllers:                                         │
    │  ├── /api/auth          ──► authController ──► User model, Argon2/Zod  │
    │  ├── /api/courses       ──► courseLessons  ──► Entitlement validation │
    │  ├── /api/progress      ──► progressRouter ──► Conflict resolution     │
    │  ├── /api/payments      ──► paymentsRouter ──► Payment provider engine │
    │  ├── /api/vocab         ──► vocabRouter    ──► SQLite / JSON cache     │
    │  └── /                  ──► pageRouter     ──► HTML page serving       │
    └─────────────────┬───────────────────────────────┬──────────────────────┘
                      │                               │
                      ▼                               ▼
       ┌────────────────────────────┐   ┌────────────────────────────┐
       │       MongoDB Atlas        │   │    SQLite (data/vocab.db)  │
       │  - Users & Credentials     │   │  - Canonical dictionary    │
       │  - Persistent Sessions     │   │  - Translation pairs       │
       │  - Progress & Stats        │   │  - Normalized search index │
       │  - Purchased Entitlements  │   └────────────────────────────┘
       └────────────────────────────┘
                      ▲
                      │ Server-side entitlement gate
       ┌──────────────┴─────────────┐
       │   Isolated Filesystems     │
       │  - courses/ (Free JSON)    │
       │  - paid-content/ (Gated)   │
       └────────────────────────────┘
```

---

## 2. Microservice Topology

| Service | Port | Directory | Role & Responsibility |
|---|---|---|---|
| **Gateway** | `3005` | `backend/gateway/` | Public entry point. Serves static frontend files (`frontend/public/`), blocks raw `.json` file downloads, enforces CORS headers, and proxies `/api/*` traffic upstream to port 3006. |
| **Content & API Service** | `3006` | `backend/service/` | Core application engine. Houses session management, MongoDB models, SQLite database connections, authentication controller, progress synchronization, and payment verification. |
| **Auth Service (Legacy)** | `3007` | `backend/auth-service/` | *Retired / Deprecated.* Authentication and Google OAuth 2.0 flows have been consolidated directly into `backend/service` under unified session cookies (`ls.sid`). |

---

## 3. Data Layers & Persistence Strategy

LanguageStudio uses a purpose-driven persistence model:

### 3.1 MongoDB Atlas (User & State Layer)
Configured via `MONGODB_URI` in `backend/service/.env`. Used for stateful, per-user, and transactional information:
- **`User` (`backend/service/src/models/User.js`)**: User accounts, Argon2-hashed passwords, email verification tokens, password reset tokens, Google OAuth IDs (`googleId`), and profile metadata.
- **`sessions` collection**: Managed via `connect-mongo`. Stores server-side session payloads keyed by the signed `ls.sid` HTTP-only cookie.
- **`Progress` (`backend/service/src/models/Progress.js`)**: Multi-collection progress records:
  - `progress_profiles`: Overall XP, level, daily streak, and last active timestamp.
  - `progress_daily`: Daily activity log and daily target tracking.
  - `progress_lessons`: Per-lesson completion status, best scores, attempt counts, and unlocked vocabulary flags.
  - `progress_wordstats`: Spaced repetition word mastery (correct/wrong counts, interval data).
  - `progress_positions`: Last active course, unit, and lesson IDs.
  - `progress_customwords`: User-added vocabulary lists.
- **`Entitlement` (`backend/service/src/models/Entitlement.js`)**: Commercial access grants per user, course, and learning path (`full_course` or specific `pathId`), with active/revoked states and expiration handling.

> **Offline/Memory Fallback**: When `MONGODB_URI` is omitted, the service automatically falls back to Express `MemoryStore` for sessions and local mock storage, allowing development without external dependencies.

### 3.2 SQLite (Relational Vocabulary & Linguistic Data)
Located at `backend/service/data/vocab.db` (managed via `better-sqlite3` and `src/db/init.js`):
- High-performance, read-optimized search table: `vocab_words`.
- Normalized search tokens: diacritics removed (e.g. `caffè` → `caffe`), lowercase normalized, and indexed.
- Foreign keys enabled, `WAL` (Write-Ahead Logging) journal mode enabled for concurrency.

### 3.3 File-Based Course Hierarchy
- **`courses/{courseId}/`**: Publicly cataloged structure containing `course.json` (metadata, path and unit breakdown), `vocab.json`, `grammar.json`, `exercises.json`, and free lesson JSON definitions (`courses/{courseId}/lessons/*.json`).
- **`paid-content/courses/{courseId}/lessons/*.json`**: Premium lessons held completely outside the public web root. These files cannot be requested by file path; they are served exclusively through backend API authorization.

---

## 4. End-to-End Request Lifecycles: "What Calls What"

This section traces the internal call stack and module interactions across primary application scenarios.

---

### 4.1 Static Frontend Page Request & Asset Routing

```
[Browser]
   │
   │  1. GET /pages/home.html (or /pages/lesson.html?course=it&lesson=communication-basics-1)
   ▼
[Gateway :3005 (backend/gateway/src/gateway.js)]
   │
   ├─► CORS Check: Validates origin against config.corsOrigins
   │
   ├─► Direct Course JSON Guard:
   │     Checks if request matches `/courses/*.json`.
   │     If yes: IMMEDIATELY returns 403 Forbidden ("Direct access to course content files is not permitted").
   │
   ├─► Static Asset Matching:
   │     - checks `frontend/public/`
   │     - checks `courses/` (images, SVGs, audio)
   │     If found: Streams static asset with appropriate Content-Type.
   │
   └─► Non-asset Route Fallback:
         Proxies request to `http://127.0.0.1:3006` (Content Service).
            ▼
[Content Service :3006 (backend/service/src/server.js)]
   │
   ├─► Rewrite Middleware: rewrites `/lesson` to `/pages/lesson.html`
   ├─► Static Middleware: serves from `frontend/public`
   └─► Page Router (`src/routes/pageroutes.js`): sends requested HTML file.
```

---

### 4.2 User Authentication & Session Establishment

#### A. Email & Password Registration / Login

```
[Browser]
   │
   │  1. GET /api/auth/csrf-token
   ▼
[Gateway] ──(proxy)──► [Service: src/routes/auth.js]
                          └─► authController.getCsrf:
                                - Calls ensureCsrfToken()
                                - Generates crypto-random token stored in req.session.csrfSecret
                                - Returns { csrfToken }
   │
   │  2. POST /api/auth/login (Payload: { email, password }, Headers: { x-csrf-token, Cookie })
   ▼
[Gateway] ──(proxy)──► [Service: src/server.js]
                          │
                          ├─► helmet()
                          ├─► express.json()
                          ├─► createSessionMiddleware():
                          │     Retrieves or initializes session via connect-mongo (or MemoryStore)
                          │     using incoming `ls.sid` cookie.
                          │
                          ▼
                      [src/routes/auth.js]
                          │
                          ├─► strictAuthLimiter: express-rate-limit validates IP attempt frequency
                          ├─► csrfProtection: middleware/csrf.js verifies x-csrf-token against session secret
                          │
                          ▼
                      [src/controllers/authController.js -> login()]
                          │
                          ├─► authValidators.js (Zod Schema Validation):
                          │     loginSchema.safeParse({ email, password })
                          │     (Rejects malformed emails or short passwords with 400 Bad Request)
                          │
                          ├─► User.js (MongoDB Model):
                          │     User.findOne({ email: email.toLowerCase() })
                          │     If not found: returns 401 Unauthorized (generic error message)
                          │
                          ├─► Password Verification:
                          │     Calls user.verifyPassword(password)
                          │     Uses argon2.verify(user.passwordHash, password)
                          │     (Fallback to bcrypt if legacy hash format detected)
                          │
                          ├─► Session Regeneration:
                          │     req.session.userId = user._id.toString();
                          │     req.session.role = user.role;
                          │     req.session.email = user.email;
                          │     req.session.save();
                          │
                          └─► Response: 200 OK
                                Set-Cookie: ls.sid=<signed-cookie>; HttpOnly; SameSite=Lax
                                Body: { success: true, user: { id, email, displayName, role } }
```

#### B. Google OAuth 2.0 Flow

```
[Browser]
   │
   │  1. Clicks "Sign in with Google" -> Navigates to /api/auth/google
   ▼
[Gateway] ──(proxy)──► [Service: src/controllers/authController.js -> googleRedirect()]
                          │
                          ├─► loadGoogleConfig() (from src/utils/googleConfig.js or JSON credentials)
                          ├─► Instantiates OAuth2Client
                          ├─► Generates random `state` nonce and stores in `oauthStates` Map
                          └─► HTTP 302 Redirect to:
                                https://accounts.google.com/o/oauth2/v2/auth?client_id=...&state=...
   │
   │  2. User approves consent on Google Accounts
   │  3. Google redirects browser to: /api/auth/google/callback?code=AUTH_CODE&state=STATE
   ▼
[Gateway] ──(proxy)──► [Service: src/controllers/authController.js -> googleCallback()]
                          │
                          ├─► Validates `state` against memory store `oauthStates` (prevents CSRF)
                          ├─► client.getToken(code) -> Exchanges code for Google ID token
                          ├─► client.verifyIdToken() -> Extracts Google profile (sub, email, name, picture)
                          │
                          ├─► User.findOrCreateByGoogle({ googleId, email, displayName, avatarUrl }):
                          │     - Checks if user with googleId exists -> returns user
                          │     - Checks if user with matching email exists -> links googleId and returns user
                          │     - Else creates new User record with emailVerified: true
                          │
                          ├─► req.session.userId = user._id; req.session.save();
                          └─► HTTP 302 Redirect to `/pages/home.html` (with active `ls.sid` cookie)
```

---

### 4.3 Course Content Delivery & Paid Lesson Gating

How the platform prevents unauthorized access to premium learning materials:

```
[Browser: js/lesson.js]
   │
   │  GET /api/courses/it/lessons/italian-reading-2
   ▼
[Gateway (backend/gateway/src/gateway.js)]
   │
   │  Forwarded to http://127.0.0.1:3006/api/courses/it/lessons/italian-reading-2
   ▼
[Service: src/routes/courseLessons.js]
   │
   ├─► ID Validation: validId(courseId) && validId(lessonId) via regex `^[A-Za-z0-9_-]+$`
   │
   ├─► Read Course Definition:
   │     Reads `courses/it/course.json`
   │     Finds target lesson metadata via findLessonInCourse()
   │
   ├─► Access Determination: isLessonPaid(courseData, lessonDef, courseId, lessonId)
   │     Rule 1: If lessonDef.access === 'free'  -> FREE
   │     Rule 2: If lessonDef.access === 'paid'  -> PAID
   │     Rule 3: First lesson of a course defaults to FREE
   │     Rule 4: Check if file exists in `paid-content/courses/{courseId}/lessons/{lessonId}.json` -> PAID
   │
   ├─► Case A: Lesson is FREE
   │     └─► Reads `courses/it/lessons/italian-reading-2.json`
   │         Returns 200 OK with lesson payload.
   │
   └─► Case B: Lesson is PAID
         │
         ├─► Session Check:
         │     Is req.session.userId present?
         │     NO  ──► Returns 401 Unauthorized { error: 'Authentication required.', code: 'AUTH_REQUIRED' }
         │
         ├─► Entitlement Check:
         │     Calls `Entitlement.hasEntitlement(userId, 'it', pathId)`
         │     (Queries MongoDB `entitlements` collection for active, non-expired grant)
         │     FALSE ──► Returns 403 Forbidden { error: 'Entitlement required.', code: 'ENTITLEMENT_REQUIRED' }
         │
         └─► TRUE (User is authorized):
               Reads `paid-content/courses/it/lessons/italian-reading-2.json`
               Returns 200 OK with premium lesson payload.
```

---

### 4.4 Progress Tracking & Multi-Tier Synchronization

LanguageStudio supports guest mode (in-browser) and authenticated cloud synchronization with timestamped conflict resolution.

```
[Browser: js/progress.js]
   │
   ├─► User is Guest:
   │     LocalStorageAdapter writes state to window.localStorage synchronously.
   │
   └─► User is Logged In:
         ApiAdapter writes immediately to in-memory cache,
         then queues asynchronous background sync:
         PUT /api/progress/lessonProgress/it:communication-basics-1
         Body: { bestScore: 95, completed: true, updatedAt: "2026-11-18T14:30:00Z" }
            │
            ▼
[Gateway] ──(proxy)──► [Service: src/routes/progress.js]
                          │
                          ├─► requireAuth: Validates req.session.userId exists (401 if missing)
                          ├─► normalizeCollection('lessonProgress')
                          ├─► parsePrimaryKey('lessonProgress', id, req.body, userId)
                          │
                          ├─► Conflict Resolution Engine:
                          │     Calls `services/progressConflict.js -> mergeRecord(serverDoc, clientDoc)`
                          │     - Scalars (current step, status): Newer `updatedAt` wins.
                          │     - Scores (bestScore): Math.max(serverScore, clientScore) is preserved.
                          │     - Counters (xp, reviews, attempts): Cumulative max retained.
                          │     - Timestamps: Latest timestamp preserved.
                          │
                          ├─► Mongoose Model:
                          │     PROGRESS_MODELS.lessonProgress.findOneAndUpdate(
                          │       { userId, courseId: 'it', lessonId: 'communication-basics-1' },
                          │       mergedData,
                          │       { upsert: true, new: true }
                          │     )
                          │
                          └─► Response: 200 OK with merged authoritative record.
```

#### Guest-to-User Transition (On Login):
When a guest registers or logs in, the client calls `POST /api/progress/merge` with the entire offline `localStorage` snapshot. `progressConflict.js -> mergePayloads()` reconciles all collections at once without losing progress accumulated before authentication.

---

### 4.5 Vocabulary & Search Lookup

```
[Browser: js/dictionary.js or js/flashcards.js]
   │
   │  GET /api/vocab?course=it&ids=ciao,grazie
   ▼
[Gateway] ──(proxy)──► [Service: src/routes/vocab.js]
                          │
                          ├─► normalizeCourseCode('it')
                          │
                          ├─► In-Memory Cache Lookup:
                          │     Checks vocabCache Map for 'it'.
                          │     If miss: Reads and parses `courses/it/vocab.json`, sets cache.
                          │
                          ├─► Filter by IDs (if supplied):
                          │     Constructs Map of words, filters requested subset.
                          │
                          └─► Returns JSON array of matched vocabulary items.

   │
   │  GET /api/vocab/search?course=it&q=bello
   ▼
[Service: src/routes/vocab.js & src/db/init.js]
   │
   ├─► Calls SQLite database (`backend/service/data/vocab.db`)
   ├─► Prepared statement queries `vocab_words`:
   │     SELECT * FROM vocab_words
   │     WHERE courseId = ? AND normalizedWord LIKE ?
   │     ORDER BY score ASC LIMIT 50;
   └─► Returns ranked results with phonetic transcriptions and localized translations.
```

---

### 4.6 Payment & Entitlement Lifecycle

```
[Browser: pages/checkout.html]
   │
   │  1. POST /api/payments/checkout
   │     Body: { courseId: 'it', selectedPaths: ['italian-reading'], successUrl, cancelUrl }
   ▼
[Gateway] ──(proxy)──► [Service: src/routes/payments.js]
                          │
                          ├─► requireAuth: Ensures user is logged in
                          ├─► Entitlement.hasEntitlement(userId, 'it', 'italian-reading')
                          │     (If already owned, aborts with 409 Conflict)
                          │
                          ├─► Payment Provider Factory:
                          │     Calls `services/payments/index.js -> getPaymentProvider()`
                          │     Returns MockPaymentProvider (or production payment adapter)
                          │
                          ├─► provider.createCheckoutSession({ userId, courseId, selectedPaths, ... })
                          │     Generates checkout URL and session tracking ID
                          │
                          └─► Returns: { checkoutUrl: '/pages/checkout.html?session_id=...' }
   │
   │  2. Payment Provider completes transaction & sends Webhook:
   │     POST /api/payments/webhook (Signature header verified)
   ▼
[Service: src/routes/payments.js]
   │
   ├─► provider.verifyWebhookSignature(req)
   ├─► Event: 'payment_completed'
   │     Calls `Entitlement.grantEntitlement({
   │       userId,
   │       courseId: 'it',
   │       pathId: 'italian-reading',
   │       provider: 'mock',
   │       providerPaymentId: event.paymentId
   │     })`
   │     (Upserts into MongoDB `entitlements` collection idempotently)
   │
   └─► Subsequent requests to `/api/courses/it/lessons/...` now successfully pass access checks.
```

---

## 5. Security & Middleware Pipeline

Every HTTP request passing through `backend/service` navigates through this defined middleware hierarchy:

```
Incoming Request
   │
   ├── 1. Helmet (`helmet({ contentSecurityPolicy: false })`)
   │      Applies X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.
   │
   ├── 2. Body Parsers (`express.json({ limit: '5mb' })`, `urlencoded`)
   │
   ├── 3. Session Middleware (`createSessionMiddleware()`)
   │      Reads `ls.sid` cookie, decrypts signature using `SESSION_SECRET`,
   │      fetches session record from MongoDB Atlas (or MemoryStore), binds to `req.session`.
   │
   ├── 4. Rate Limiter (`src/middleware/rateLimiter.js`)
   │      - `apiLimiter`: General route protection against flooding.
   │      - `authLimiter`: Moderate throttling on `/api/auth/*`.
   │      - `strictAuthLimiter`: Strict threshold on credential attempts (prevents brute-force on `/login`, `/register`).
   │
   ├── 5. CSRF Defense (`src/middleware/csrf.js`)
   │      Validates `x-csrf-token` header against secret stored in `req.session.csrfSecret`
   │      for all state-changing HTTP verbs (`POST`, `PUT`, `DELETE`, `PATCH`).
   │
   ├── 6. Business Route Handlers & Controllers
   │      Validates input using Zod schemas (`validators/authValidators.js`).
   │
   └── 7. Global Error Handler (`server.js`)
          Catches unhandled exceptions, logs 500s internally,
          and sends sanitized `{ error: 'Unexpected server error.' }` to clients,
          preventing sensitive stack or database leaks.
```

---

## 6. Directory Map & File Responsibilities

```
backend/
├── gateway/                        # Edge Reverse Proxy (Port 3005)
│   ├── src/
│   │   ├── config/env.js           # Gateway environment configuration
│   │   └── gateway.js              # http-proxy-middleware rules, CORS, static serving
│   └── package.json
│
├── service/                        # Main API & Application Service (Port 3006)
│   ├── config/env.js               # Centralized config & environment variable parsing
│   ├── data/
│   │   ├── vocab.db                # SQLite database for dictionary & word translations
│   │   └── content.sqlite          # SQLite lesson cache
│   └── src/
│       ├── server.js               # Express application entry point & middleware mounting
│       ├── controllers/
│       │   └── authController.js   # Login, registration, password reset, OAuth callbacks
│       ├── db/
│       │   ├── init.js             # SQLite initialization, schema migration & text normalizer
│       │   ├── schema.sql          # DDL for SQLite tables (vocab_words, word_translations)
│       │   └── mongodb/index.js    # Mongoose connection manager with reconnection logic
│       ├── middleware/
│       │   ├── csrf.js             # CSRF token generation and validation
│       │   ├── rateLimiter.js      # Express rate limiters by route sensitivity
│       │   └── session.js          # Express-session + connect-mongo store setup
│       ├── models/
│       │   ├── Entitlement.js      # Commercial access grant schema & query helpers
│       │   ├── Progress.js         # User progress models across all 6 sub-collections
│       │   └── User.js             # User account schema, Argon2 password hashing & verification
│       ├── routes/
│       │   ├── auth.js             # /api/auth routing
│       │   ├── courseLessons.js    # /api/courses routing & lesson access gating
│       │   ├── examples.js         # /api/examples linguistic sentence routes
│       │   ├── pageroutes.js       # HTML page routing fallbacks
│       │   ├── payments.js         # /api/payments checkout & webhook routes
│       │   ├── progress.js         # /api/progress sync & conflict resolution routes
│       │   ├── userWords.js        # /api/user-words user saved word lists
│       │   └── vocab.js            # /api/vocab dictionary query & search routes
│       ├── services/
│       │   ├── emailService.js     # Verification & password reset email dispatcher
│       │   ├── progressConflict.js # Deterministic merge algorithms for progress sync
│       │   └── payments/           # Payment provider interfaces and MockPaymentProvider
│       ├── utils/
│       │   ├── constants.js        # Global constant definitions
│       │   └── googleConfig.js     # Google OAuth credentials loader (file or env)
│       └── validators/
│           └── authValidators.js   # Zod validation schemas for input sanitization
│
└── auth-service/                   # DEPRECATED: Standalone auth service (consolidated into service/)
```
