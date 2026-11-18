# Content & API Service

- **Port**: `3006` (default, configurable via `PORT`)
- **Directory**: [`backend/service/`](../../backend/service/)
- **Entrypoint**: `src/server.js`
- **Primary Dependencies**: `express` (^5.2.1), `better-sqlite3` (^13.0.3), `mongoose` (^9.12.2), `connect-mongo` (^6.0.0), `argon2` (^0.45.2), `zod` (^4.6.7), `helmet` (^8.3.0), `express-session` (^1.19.0), `google-auth-library` (^11.3.4)

---

## 1. Overview & Purpose

The **Content & API Service** is the central backend engine of LanguageStudio. It manages all stateful domain logic, database persistence, session security, curriculum authorization, payment processing, and linguistic queries.

### Key Responsibilities
1. **Curriculum & Lesson Delivery**: Serves free course curricula and gates premium lesson definitions (`paid-content/`) behind server-side entitlement checks.
2. **Dual Database Management**:
   - **SQLite (`data/vocab.db`)**: Ultra-fast, indexed lexical dictionary with diacritic-normalized search.
   - **MongoDB Atlas**: User accounts, Argon2-hashed passwords, session persistence, multi-collection progress trees, and purchased entitlements.
3. **Session & Security Infrastructure**: Express session management keyed to signed `ls.sid` HTTP-only cookies, Helmet security headers, CSRF tokens, and Argon2 password hashing.
4. **Progress Synchronization**: Handles offline-first client synchronizations with a 3-way high-water mark conflict resolution engine.
5. **Monetization & Webhooks**: Provider-agnostic payment orchestrator (Mock, Stripe, Paddle) with cryptographically validated webhooks granting and revoking entitlements.
6. **Clean URL Routing**: Resolves friendly paths (`/home`, `/lesson`, `/dictionary`) to their static HTML counterparts.

---

## 2. Configuration & Environment Variables

Configuration is loaded in `config/env.js`:

| Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | Integer | `3006` | HTTP listening port for the service. |
| `HOST` | String | `127.0.0.1` | Network interface binding. |
| `MONGODB_URI` | String | `""` | MongoDB connection string. If omitted, activates in-memory session/storage fallback. |
| `SESSION_SECRET` | String | (Dev secret) | Secret string for signing session cookies. |
| `NODE_ENV` | String | `development` | Environment mode (`development`, `production`, `test`). |
| `GOOGLE_CLIENT_ID` | String | `""` | Google OAuth 2.0 Client ID for Google SSO. |
| `GOOGLE_CLIENT_SECRET` | String | `""` | Google OAuth 2.0 Client Secret. |
| `PAYMENT_PROVIDER` | String | `mock` | Active payment provider adapter (`mock`, `stripe`, `paddle`). |
| `PAYMENT_WEBHOOK_SECRET`| String | `""` | Secret key used to sign and verify incoming payment webhooks. |

---

## 3. Database Architecture & Models

### 3.1 SQLite (`backend/service/data/vocab.db`)
Created and migrated via `src/db/init.js` and `src/db/schema.sql`.
- **Primary Table**: `vocab_words`
  - Columns: `id`, `word`, `translation_uk`, `translation_en`, `pronunciation`, `part_of_speech`, `level`, `category`, `unit`, `lesson_id`, `normalized_word`.
  - Normalization: Diacritics removed (e.g. `caffè` → `caffe`), lowercase normalized, and indexed via B-Tree index for instantaneous substring and prefix search.
  - Concurrency: Write-Ahead Logging (`WAL` mode) enabled with foreign keys enforced.

### 3.2 MongoDB Atlas (Mongoose Models)
Located in `src/models/`:

#### A. User (`src/models/User.js`)
- `email`: Normalized lowercase string, unique index.
- `passwordHash`: Argon2id hashed password string.
- `googleId`: Google profile unique identifier for OAuth SSO users.
- `displayName`: Learner's public screen name.
- `role`: Role string (`'user'` or `'admin'`). Users with `'admin'` role bypass all content paywalls and entitlement restrictions.
- `avatar`: Profile image URL.
- `isEmailVerified`: Boolean status flag.
- `verificationToken`, `resetPasswordToken`, `resetPasswordExpires`: Security tokens.
- `profile`: Embedded subdocument storing learner settings and global achievements:
  - `timezone`: Learner's local timezone string (e.g. `'UTC'`).
  - `sourceLanguage`: Interface language code (`'uk'` or `'en'`).
  - `activeCourseId`: Identifier of currently active course (`'it'`).
  - `dailyGoalXp`: Daily XP target number (`10`, `20`, `50`).
  - `effectsEnabled`: Boolean sound and animation effects toggle.
  - `totalXp`: Total lifetime XP accumulated across all courses.
  - `lastCelebratedLevel`: Highest level achieved and acknowledged.
  - `schemaVersion`: Schema version integer.
  - `createdAt`, `updatedAt`: Timestamps.

#### B. Progress (`src/models/Progress.js`)
Progress tracking is structured across dedicated sub-collections with high-water mark conflict resolution:
- **Profile Consolidation**: User profile and global gamification state is embedded directly within `User.profile` in the `users` collection. The legacy standalone `profiles` collection is automatically migrated on first access via `checkAndMigrateLegacyProfile()`.
- `progress_daily`: Daily XP breakdown and goal completion timestamps.
- `progress_lessons`: `lessonId`, `completed`, `bestScore`, `attempts`, `unlockedVocab`, `updatedAt`.
- `progress_wordstats`: Spaced repetition tracking per word (`correctCount`, `wrongCount`, `lastReviewed`, `intervalDays`).
- `progress_positions`: Active course ID, last active unit, and last active lesson ID.
- `progress_customwords`: User-saved custom vocabulary notebook.

#### C. Entitlement (`src/models/Entitlement.js`)
- `userId`: Reference to User `_id`.
- `courseId`: Associated course identifier (e.g. `it`, or wildcard `'*'` for admin bypass).
- `scope`: `'full_course'` or specific `'path'` access.
- `pathId`: Specific learning path ID (if scope is `'path'`).
- `status`: `'active'`, `'revoked'`, or `'expired'`.
- `provider`: Provider name (`mock`, `stripe`, `mock-dev`).
- `providerPaymentId`: External transaction identifier.
- `grantedAt`, `expiresAt`: Access validity window.
- **Admin Access**: `hasEntitlement()` first verifies if the user's role is `'admin'`. If true, access is immediately granted without requiring an explicit purchase record.

---

## 4. API Endpoints & Routes Specification

### 4.1 Authentication (`/api/auth`, `/api/v1/auth`)
Defined in `src/routes/auth.js` and `src/controllers/authController.js`:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/csrf-token` | Returns `{ csrfToken: "..." }` stored in session for state-changing POST requests. | No |
| `POST` | `/register` | Registers user with email and password (Argon2 hashed). | No |
| `POST` | `/login` | Validates credentials, sets signed `ls.sid` session cookie. | No |
| `POST` | `/logout` | Destroys server-side session and clears cookie. | Yes |
| `GET` | `/me` | Returns active user profile, email, display name, and entitlements. | Optional |
| `GET` | `/google` | Initiates Google OAuth 2.0 redirection flow. | No |
| `GET` | `/google/callback` | Exchanges Google auth code, finds/creates User, logs in user. | No |
| `POST` | `/forgot-password`| Generates password reset token and dispatches email. | No |
| `POST` | `/reset-password` | Resets password using verification token. | No |

### 4.2 Courses & Lessons (`/api/courses`, `/api/v1/courses`, `/api/content/courses`)
Defined in `src/routes/courseLessons.js`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Returns global course catalog index (`courses/index.json`). |
| `GET` | `/course-index` | Dedicated alias returning global course catalog index (`courses/index.json`). |
| `GET` | `/:courseId` | Returns course structure (`course.json`), units, and path breakdown. Accepts `'course-index'` and `'index'` as courseId to return the global catalog. |
| `GET` | `/:courseId/:resource` | Serves specific course data files (`vocab`, `grammar`, `exercises`, `course`). |
| `GET` | `/:courseId/i18n/:locale/:resource` | Serves localized course translation JSON files for resources and lessons. |
| `GET` | `/:courseId/lessons/:lessonId` | Serves lesson JSON. **Entitlement Enforced**: If the lesson belongs to `paid-content/`, the endpoint verifies the user's active entitlement in MongoDB. Returns `401 Unauthorized` (if not logged in) or `403 Forbidden` (if not purchased). **Admin Bypass**: Users with `role === 'admin'` receive lesson content unconditionally. **Bidirectional Fallback**: Tries `courses/` and `paid-content/` directories interchangeably if content was relocated. |

#### Route Aliases & Proxy Mounts:
- `/api/content/courses` → `courseLessonsRoutes`
- `/api/v1/content/courses` → `courseLessonsRoutes`
- `/api/content/course-index` → Rewrites request to catalog index
- `/api/v1/content/course-index` → Rewrites request to catalog index

### 4.3 Progress & Sync (`/api/progress`, `/api/v1/progress`)
Defined in `src/routes/progress.js` and `src/services/progressConflict.js`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Retrieves complete user progress tree across all sub-collections for the active course. |
| `POST` | `/sync` | Receives client local progress, executes 3-way merge conflict resolution, updates MongoDB, and returns resolved progress tree. |

#### Conflict Resolution Rules (`src/services/progressConflict.js`):
- **XP & Streak**: Uses high-water mark (`Math.max(client, server)`).
- **Lessons Completed**: Union of completed lessons; highest score (`bestScore`) wins.
- **Word Stats**: Accumulates attempt counters; latest `lastReviewed` timestamp sets interval.
- **Positions**: Latest `updatedAt` timestamp dictates current active lesson.

### 4.4 Payments & Monetization (`/api/payments`, `/api/v1/payments`)
Defined in `src/routes/payments.js`:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/checkout` | Initializes payment session with provider (Mock, Stripe). Returns `providerPaymentId` and redirect URL. |
| `POST` | `/webhook` | Receives signed payment webhook (`x-signature` header verified). Handles `payment_success` (creates active `Entitlement`) and `payment_refunded` (sets entitlement to `revoked`). |
| `GET` | `/entitlements` | Returns list of currently active course and path unlocks for logged-in user, along with `isAdmin: boolean`. If admin, injects synthetic wildcard access `{ courseId: '*', selectedPaths: ['*'] }`. |
| `GET` | `/entitlement/:courseId` | Verifies access to a specific course. Returns `{ hasAccess, isFullCourse, selectedPaths, isAdmin }`. Admins receive full course access automatically. |
| `POST` | `/dev-unlock` | Developer testing utility. Unconditionally grants full wildcard access (`selectedPaths: ['*']`) for the active session user by issuing a `mock-dev` entitlement. Requires no authentication. |

### 4.5 Vocabulary & Linguistic Data (`/api/vocab`, `/api/user-words`, `/api/examples`)
Defined in `src/routes/vocab.js`, `src/routes/userWords.js`, `src/routes/examples.js`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/vocab/search?q=:query` | Diacritic-insensitive SQLite full-text search across word and translation columns. |
| `GET` | `/api/vocab/words/:id` | Detailed lexical dictionary entry including grammar notes and audio reference. |
| `GET` | `/api/user-words` | Retrieves user's saved vocabulary list. |
| `POST` | `/api/user-words` | Saves word to user's personalized notebook. |
| `DELETE`| `/api/user-words/:id` | Removes word from user's notebook. |
| `GET` | `/api/examples?word=:word` | Returns usage example sentences for a specific vocabulary item. |

### 4.6 Page Routing (`src/routes/pageroutes.js`)
Maps human-readable clean paths to frontend static HTML templates:
- `/` → `frontend/public/index.html`
- `/home` → `frontend/public/pages/home.html`
- `/courses` → `frontend/public/pages/courses.html`
- `/path` → `frontend/public/pages/path.html`
- `/lesson` → `frontend/public/pages/lesson.html`
- `/exercises` → `frontend/public/pages/exercises.html`
- `/flashcards` → `frontend/public/pages/flashcards.html` (legacy route)
- `/dictionary` → `frontend/public/pages/dictionary.html`
- `/grammar` → `frontend/public/pages/grammar.html`
- `/placement-test` → `frontend/public/pages/placement-test.html`
- `/tests` → `frontend/public/pages/tests.html`
- `/pricing` → `frontend/public/pages/pricing.html`
- `/checkout` → `frontend/public/pages/checkout.html`
- `/auth` → `frontend/public/pages/auth.html`
- `/settings` → `frontend/public/pages/settings.html`

---

## 5. Middleware Pipeline

```
1. [Helmet]                  - Disables CSP for local scripts, sets X-Frame-Options, X-Content-Type-Options
2. [express.json]            - Parses JSON bodies with 5MB limit
3. [express.urlencoded]      - Parses URL-encoded form bodies with 16KB limit
4. [Session Middleware]      - express-session with MongoStore (or MemoryStore fallback), cookie name: ls.sid
5. [Rate Limiting]           - express-rate-limit applied to /api/auth endpoints
6. [CSRF Guard]              - Validates req.headers['x-csrf-token'] against session token on mutate requests
7. [API Routers]             - /api/auth, /api/courses, /api/payments, /api/vocab, /api/progress
8. [URL Rewriter]            - Rewrites /lesson to /pages/lesson.html
9. [Static File Handlers]    - Serves /courses and frontend/public
10.[Global Error Handler]    - Catches unhandled errors, sanitizes error messages, returns JSON 500
```

---

## 6. Local Development & Testing

```bash
# Start Content Service
cd backend/service
npm install
npm start

# Run automated tests
npm test

# Seed basic vocabulary into SQLite
npm run seed:vocab

# Import vocabulary from CSV
npm run import:vocab
```
