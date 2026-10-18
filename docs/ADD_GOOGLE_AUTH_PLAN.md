# Google Auth + Cloud Progress: Implementation Plan

Target repo: **LanguageStudio** (Express 5 backend in `backend/service`, static frontend in `frontend/public`, course data in `courses/`).

Goal: a learner signs in with Google, and their progress (XP, streak, lesson results, word stats, dictionary, settings) is saved on the server and restored on any device. Guests keep working exactly as today (localStorage only).

Suggested location in the repo: `docs/GOOGLE_AUTH_PLAN.md` (also add a line to `docs/INDEX.md`).

---

## 0. Rules for the AI implementing this

Read these first and follow them in every step.

1. Work **one step at a time**. After each step run the checks listed in that step, then stop and summarize what changed before starting the next one.
2. Do not break guest mode. With no login and no network, the app must behave as it does today.
3. Project conventions that must be kept:
   - UI strings are localized objects `{ "uk": "...", "en": "..." }`. Default language is Ukrainian. Never hard-code one language only.
   - **No emoji, no icon glyphs (arrows, check marks, stars), no inline `<svg>`** in `.html`, `.js`, `.css`, `.json` files. Icons come from the registry: `<span data-icon="name"></span>` or `getIconSvg('name')`. `node scripts/check-icons.mjs` enforces this. New icon names must be added to `frontend/public/assets/icons/icons.json` (map to `_placeholder.svg` and list in `MISSING.md` if no asset exists).
   - No course-specific code (`if (course === 'es')`). Progress code stays generic.
   - Backend is CommonJS (`require`), Express 5.
   - Windows is the main dev environment: scripts are `.bat`; avoid shell-specific tooling in npm scripts.
4. Never log tokens, cookies, or full ID tokens. Never return secrets to the client.
5. Validation commands to run when relevant: `node scripts/validate-courses.mjs`, `node scripts/check-icons.mjs`, plus the new tests added in Step 12.

---

## 1. Decisions (already made, do not re-debate)

| Topic | Decision | Why |
| --- | --- | --- |
| Google flow | **Google Identity Services (GIS) ID-token flow**. The browser gets a signed ID token (JWT); the backend verifies it with `google-auth-library`. | Simplest, no redirect handling, no client secret needed. |
| Session | Server-side session stored in the DB, random 32-byte id in an `httpOnly`, `SameSite=Lax` cookie (`Secure` in production). Only the SHA-256 hash of the id is stored. | Revocable, no JWT-in-localStorage risk. |
| Database | **SQLite via `better-sqlite3`**, file `backend/service/data/app.db`. | One file, no server to install on Windows. Schema maps 1:1 to the future tables in `docs/schemas.md`. |
| Progress storage | Generic table `progress_records(user_id, collection, record_id, data JSON, updated_at)`. | Matches the existing `store.get/set/list` adapter shape; avoids 6 migrations now. |
| Sync model | **Local-first**: the app keeps writing to localStorage instantly; a sync layer pushes changes to the server and pulls on login. | Works offline, zero UI latency. |
| Conflict policy | Exactly the one in `docs/schemas.md`: newer `updatedAt` wins for scalars, counters keep the max, `bestScore` keeps the max. | Already documented by the project. |

---

## 2. Step 1: Google Cloud setup (manual, human does this)

The AI must write these instructions into `docs/GOOGLE_AUTH_SETUP.md` (short, with the exact values) and **stop** until the human confirms the client ID exists.

1. Google Cloud Console, create/select a project.
2. APIs & Services, OAuth consent screen: user type External, app name `LanguageStudio`, scopes `openid`, `email`, `profile` (no sensitive scopes).
3. Credentials, Create OAuth client ID, type **Web application**.
4. Authorized JavaScript origins: `http://localhost:3005` (add the production origin later). No redirect URIs are needed for the ID-token flow.
5. Copy the **Client ID** (ends with `.apps.googleusercontent.com`).
6. Create `backend/service/.env`:
   ```
   PORT=3005
   NODE_ENV=development
   GOOGLE_CLIENT_ID=<paste client id>
   SESSION_TTL_DAYS=30
   ALLOWED_ORIGINS=http://localhost:3005
   ```
7. Create `backend/service/.env.example` with the same keys and empty values (this one is committed).

Acceptance: `.env` exists locally, `.env.example` is committed.

---

## 3. Step 2: Remove the insecure demo auth

Current state: `backend/service/src/controllers/authController.js` accepts `admin` / `1234` and **echoes the submitted password back in the HTML response**. `routes/auth.js` exposes it at `POST /login`. `auth.html` posts the login form to `/login`.

Tasks:
1. Delete the hard-coded credential logic and the password echo. Delete `authController.js` content (it will be replaced in Step 5) and remove `router.post('/login', ...)`.
2. Update `.gitignore`: it is a Unity template. Append:
   ```
   .env
   backend/service/data/
   *.db
   *.db-journal
   ```
3. Remove `action="/login" method="post"` from the login form in `frontend/public/pages/auth.html` (the forms are replaced in Step 8).

Acceptance: `POST /login` returns 404; grep for `1234` and `admin@example.com` finds nothing.

---

## 4. Step 3: Backend foundation

Files: `backend/service/package.json`, `backend/service/src/server.js`, new `src/config.js`.

Tasks:
1. Install: `npm i better-sqlite3 google-auth-library dotenv` in `backend/service`. (Express 5 already ships `express.json()`; `body-parser` can stay or be replaced.)
2. Create `src/config.js`: loads `dotenv`, validates required vars (`GOOGLE_CLIENT_ID`), exports a frozen config object (`port`, `isProd`, `googleClientId`, `sessionTtlMs`, `allowedOrigins`). If `GOOGLE_CLIENT_ID` is missing, the server must still start and the auth endpoints must reply `503` with a clear JSON error (guest mode keeps working).
3. In `server.js`:
   - require `config` first; use `config.port`.
   - add `app.disable('x-powered-by')`.
   - add a tiny `securityHeaders` middleware (or `helmet`): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy: same-origin-allow-popups` (**required** so the Google popup/one-tap can talk back).
   - mount `app.use('/api', apiRouter)` **before** the static handlers; unknown `/api/*` returns JSON 404.
   - add a JSON error handler (`{ error: 'code' }`, never stack traces).
4. Do **not** add a restrictive CSP yet unless it allows: `script-src https://accounts.google.com/gsi/client`, `frame-src https://accounts.google.com/gsi/`, `connect-src 'self' https://accounts.google.com/gsi/`, `style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style https://fonts.googleapis.com`, `font-src https://fonts.gstatic.com`. The pages currently use inline `onclick` handlers, so a strict CSP is out of scope.

Acceptance: `start_server.bat` boots; `GET /api/health` returns `{ ok: true }`; existing pages still load.

---

## 5. Step 4: Database layer

New files: `src/db/index.js`, `src/db/schema.sql` (or inline in `index.js`).

Tasks:
1. `index.js` opens `data/app.db` (create the folder if missing), sets `PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;`, runs the schema idempotently (`CREATE TABLE IF NOT EXISTS`), and exports prepared statements / small helpers (no ORM).
2. Schema:
   ```sql
   CREATE TABLE IF NOT EXISTS users (
     id            TEXT PRIMARY KEY,           -- crypto.randomUUID()
     google_sub    TEXT NOT NULL UNIQUE,       -- stable Google account id
     email         TEXT NOT NULL,
     email_verified INTEGER NOT NULL DEFAULT 0,
     name          TEXT,
     picture       TEXT,
     created_at    TEXT NOT NULL,
     last_login_at TEXT NOT NULL
   );

   CREATE TABLE IF NOT EXISTS sessions (
     id_hash     TEXT PRIMARY KEY,             -- sha256 of the cookie value
     user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     created_at  TEXT NOT NULL,
     expires_at  TEXT NOT NULL,
     user_agent  TEXT
   );
   CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

   CREATE TABLE IF NOT EXISTS progress_records (
     user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     collection TEXT NOT NULL,                 -- profile|daily|lessonProgress|wordStats|position|customWords
     record_id  TEXT NOT NULL,                 -- same ids as the local adapter, e.g. "it:communication-basics-1"
     data       TEXT NOT NULL,                 -- JSON
     updated_at TEXT NOT NULL,                 -- ISO, copied from data.updatedAt
     PRIMARY KEY (user_id, collection, record_id)
   );
   ```
3. Add a periodic cleanup of expired sessions (on startup and every few hours via `setInterval(...).unref()`).

Acceptance: starting the server twice does not error; `data/app.db` is git-ignored.

---

## 6. Step 5: Auth API

New files: `src/services/session.js`, `src/middleware/auth.js`, `src/routes/auth.js` (rewrite), `src/controllers/authController.js` (rewrite).

Endpoints:

| Method | Path | Behavior |
| --- | --- | --- |
| `GET` | `/api/auth/config` | `{ googleClientId }` so the frontend never hard-codes the ID. `503` if not configured. |
| `POST` | `/api/auth/google` | Body `{ credential }` (the GIS ID token). Verify, upsert user, create session, set cookie, return `{ user }`. |
| `GET` | `/api/auth/me` | `{ user }` or `401`. |
| `POST` | `/api/auth/logout` | Delete session row, clear cookie, `204`. |

Tasks:
1. `POST /api/auth/google`:
   - `new OAuth2Client(config.googleClientId).verifyIdToken({ idToken, audience: config.googleClientId })`.
   - Reject if payload is missing, `email_verified !== true`, or `sub` missing. Return `401 { error: 'invalid_token' }` (generic).
   - Upsert by `google_sub` (never by email). Update `email`, `name`, `picture`, `last_login_at`.
   - Create session: `crypto.randomBytes(32).toString('base64url')`, store `sha256` hex, expiry = now + `SESSION_TTL_DAYS`.
   - Cookie `ls_session`: `httpOnly`, `sameSite: 'lax'`, `secure: isProd`, `path: '/'`, `maxAge` = TTL. Parse cookies manually (`req.headers.cookie`) or add `cookie-parser`.
   - Response user object: `{ id, email, name, picture }` only.
2. `middleware/auth.js`: `attachUser` (reads cookie, looks up unexpired session, sets `req.user`) and `requireUser` (`401` if none). Use `attachUser` globally under `/api`.
3. CSRF protection for all state-changing `/api` requests (`POST`, `PUT`, `PATCH`, `DELETE`): require `Content-Type: application/json` and, if an `Origin` header is present, it must be in `config.allowedOrigins`. Reject with `403`.
4. Simple in-memory rate limiter on `/api/auth/google` (for example 20 requests per 10 minutes per IP).
5. Rolling expiry: if a session has less than half its TTL left, extend it.

Acceptance (test with a mocked verifier, see Step 12): valid token creates a session and a user; replaying the cookie on `/api/auth/me` returns the user; logout invalidates it; wrong audience returns 401.

---

## 7. Step 6: Progress API

New files: `src/routes/progress.js`, `src/services/progressMerge.js`.

Endpoints (all `requireUser`):

| Method | Path | Behavior |
| --- | --- | --- |
| `GET` | `/api/progress` | Full snapshot `{ collection: { recordId: record } }`, same shape as `Progress.exportProgress()` in `progress.js`. |
| `POST` | `/api/progress/sync` | Body = a snapshot (same shape) or `{ changes: [{collection,id,record}] }`. Server **merges** each record with the stored one using the merge rules and returns the merged snapshot of the touched records. This is the main endpoint. |
| `PUT` | `/api/progress/:collection/:id` | Merge a single record, return it. |
| `DELETE` | `/api/progress/:collection/:id` | Only allowed for `customWords`. |

Validation (important, the client is untrusted):
1. `collection` must be in the allowlist: `profile, daily, lessonProgress, wordStats, position, customWords`.
2. `id` max 200 chars; record must be a plain JSON object; max 32 KB per record; max 500 records per sync call; max 5 MB request body (`express.json({ limit: '5mb' })`).
3. Never trust `userId` from the body; always use `req.user.id`.
4. Sanity-clamp numeric fields: XP and counters must be finite numbers `>= 0`; `bestScore/lastScore` in `[0,1]`; dates must parse as ISO. Reject or drop invalid records, never crash.
5. Cheating limits are out of scope (client-authoritative learning app), but cap `totalXp` jump per sync to a sane value (for example, no more than +5000 per call) to catch bugs.

`progressMerge.js` (pure functions, unit-tested), per collection, implementing the `docs/schemas.md` policy:

- **profile**: scalars (`sourceLanguage`, `activeCourseId`, `dailyGoalXp`, `effectsEnabled`, `timezone`) take the side with the newer `updatedAt`; `totalXp` = max; `lastCelebratedLevel` = max; `createdAt` = earliest.
- **daily**: `xp`, `lessonsCompleted`, `wordsLearned`, `exercisesAnswered`, `exercisesCorrect` = max; `xpByCourse` = per-course max; `goalMet` = OR; `goalXp` newer wins.
- **lessonProgress**: `state` completed > in_progress > not_started; `attempts` = max; `bestScore`, `bestXp` = max; `lastScore` newer wins; `firstOpenedAt` earliest, `lastOpenedAt` latest; `completedAt` earliest non-null.
- **wordStats**: `learned` OR; `correct`, `wrong`, `correctInRow` follow the newer record for `correctInRow` and `lastResult`, max for totals; `lastSeenAt`, `lastWrongAt` latest.
- **position**: newer `at` wins.
- **customWords**: union by id; same id, newer `updatedAt` wins. Support a `deleted: true` tombstone so deletes propagate (client hides tombstoned words).

Always set merged `updatedAt` = max of both.

Known limitation to document in code comments: `totalXp = max` can under-count if two devices earn XP offline at the same time. Optional improvement: recompute `totalXp` as the sum of `daily.xp` over all days when daily records exist.

Acceptance: unit tests for every merge function (Step 12); merging is idempotent and commutative (`merge(a,b)` equals `merge(b,a)`).

---

## 8. Step 7: Frontend auth module

New file `frontend/public/js/auth.js`, loaded **after** `storage.js` and before `app.js` on all pages (add to `components.js`-driven pages, `lesson.html`, `settings.html`, `index.html`, etc.; keep the existing script order convention).

`window.Auth` API:
- `Auth.init()` fetches `/api/auth/me` once on page load (credentials: `same-origin`), caches the result in memory, dispatches `auth:changed` (`CustomEvent`, detail `{ user | null }`). Must fail silently when the server is unreachable (guest mode).
- `Auth.getUser()`, `Auth.isSignedIn()`.
- `Auth.loadGoogleScript()` injects `https://accounts.google.com/gsi/client` once (async, defer).
- `Auth.renderGoogleButton(containerEl)`: fetch `/api/auth/config`, call `google.accounts.id.initialize({ client_id, callback: handleCredential, auto_select: false, ux_mode: 'popup' })`, then `google.accounts.id.renderButton(containerEl, { theme, size: 'large', text: 'continue_with', shape: 'pill', locale })`. Theme follows the current app theme; `locale` follows `getSourceLanguage()`; re-render on `themeChanged` and `sourceLanguageChanged`.
- `handleCredential({ credential })`: `POST /api/auth/google`, on success call `Progress.onLogin(user)` (Step 9), dispatch `auth:changed`, then redirect to `?next=` target (validated: same-origin relative paths only) or `index.html`.
- `Auth.signOut()`: `POST /api/auth/logout`, `google.accounts.id.disableAutoSelect()`, call `Progress.onLogout()`, dispatch `auth:changed`.
- All `fetch` calls use `credentials: 'same-origin'` and `headers: { 'Content-Type': 'application/json' }`.
- Error states shown with localized text (network error, invalid token, not configured). Never show raw server errors.

Acceptance: on `auth.html` a Google button renders; clicking it logs in; refreshing the page keeps the session; `Auth.getUser()` returns the profile.

---

## 9. Step 8: UI changes (keep within the icon rules)

1. `pages/auth.html`
   - Replace the email/password forms with a single card: title, short localized explanation, a `<div id="googleButton"></div>`, and a "Continue as guest" link to `../index.html`.
   - Keep the tab markup out unless email login is planned. The existing `auth.css` classes (`auth-card`, `auth-panel`, `auth-title`, `auth-sub`, `auth-note-box`) can be reused; remove unused tab CSS only if nothing else uses it.
   - Add localized strings to `UI_I18N` in `app.js` for every new visible string (uk and en).
   - Include the new `auth.js` script and call `Auth.renderGoogleButton`.
   - If the user is already signed in, show their name/avatar/email and a "Sign out" button instead of the Google button.
2. Profile modal (`components/profile-modal.html`, the `EMBEDDED_COMPONENTS['profile-modal']` string in `components.js`, and `ensureProfileModal()` + `getStudentProfilePresentation()` in `app.js`):
   - Replace the `LOCAL_STUDENT_PROFILE` constant with a function reading `Auth.getUser()`.
   - Signed out: current text ("Guest profile, progress is saved on this device") + "Sign in or register" link.
   - Signed in: name, email, avatar image (`referrerpolicy="no-referrer"`, fall back to the first letter of the name in `.pm-avatar`), status text "Progress is synced to your account", and a "Sign out" button instead of the sign-in link.
   - Re-render on `auth:changed`.
3. Navbar `student-widget`: the avatar letter `S` becomes the user's initial (or picture) when signed in.
4. `pages/settings.html`: in the Profile section, show account info and Sign out/Sign in; make the Payments section unchanged.
5. New icon names (if used): `logout`, `sync`. Add to `icons.json`; if no asset, map to `_placeholder.svg` and list in `MISSING.md`. Run `node scripts/check-icons.mjs`.
6. Add a small sync status indicator (text only, localized): "Synced", "Syncing...", "Offline, will sync later". Use `aria-live="polite"`.

Acceptance: both languages, both themes, mobile width; `check-icons` passes.

---

## 10. Step 9: Make progress sync-capable (the core step)

Current problem: progress is split across two systems.
- **New system**: `progress-store.js` + `progress.js` (`window.Progress`, collections `profile`, `daily`, `lessonProgress`, `wordStats`, `position`, `customWords`, user-scoped keys `ls_local_<collection>_<id>`).
- **Legacy writers that bypass it**: `app.js` (`addXP` writes `ls_xp`), `lesson-engine.js` (`ls_completed_lessons`, `ls_xp`), `dictionary.js` (`ls_<course>_dict_learned`, `ls_<course>_custom_dict`), `exercises.js` (calls `addXP` only, no `wordStats`), `app.js` settings keys (`ls_source_language`, `ls_course`, `ls_theme`), and `settings.html` (`ls_notification_preferences`).

A. Route everything through `Progress` first (works for guests too, no server involved yet):
1. `addXP(amount)` in `app.js` calls `Progress.recordXp({ courseId: getTargetCourse(), amount, source })` and keeps the `ls_xp` key updated only as a **read cache** for `updateXPDisplay()` until the display is switched to `profile.totalXp`. Keep the signature so existing callers (`exercises.js`, `dictionary.js`) keep working.
2. `lesson-engine.js`:
   - `markLessonCompleted` / `awardXP` call `Progress.recordLessonResult(courseId, lessonId, { score: percentage / 100, xp })` (pass the course id from `lesson.courseId`).
   - `isLessonCompleted` reads `lessonProgress` (fall back to the legacy `ls_completed_lessons` for old users).
   - Call `Progress.recordLessonOpened` when a lesson page renders.
3. `dictionary.js`: `toggleLearned` calls `Progress.setWordLearned(courseId, vocabId, bool)`; custom words move to the `customWords` collection (keep the old key as a migration source). Use `tombstone` deletes.
4. `exercises.js`: after each graded answer call `Progress.recordWordResult(...)` for each id in `task.vocabRefs` (documented in `docs/schemas.md`) and update `daily.exercisesAnswered/exercisesCorrect`.
5. Settings (source language, active course, notification prefs, theme) are stored in the `profile` record (`sourceLanguage`, `activeCourseId`, plus a new `preferences` object `{ notifications, theme }`). `localStorage` keys stay as the fast cache read at page start (theme must be applied before paint, see `theme.js`).
6. Fix id inconsistencies found while doing this: `migrateLegacyProgress()` uses lesson id `1.1` and `lesson.html?id=` URLs, but real lesson ids are `communication-basics-1` etc. Update the migration and `recordLessonOpened`'s URL (`pages/lesson.html?course=<id>&lesson=<id>`). Also `updateProfileStats()` reads `ls_<course>_lesson_<id>_best_xp`; switch it to `lessonProgress`.
7. Update `index.js`/`path.js` only if they need completed-state badges (optional, use `Progress.getLessonDisplayState`).

B. Add the server adapter (`progress-store.js`):
1. Keep `LocalStorageAdapter` unchanged. Add `SyncedAdapter` that **wraps** it:
   - `get/list`: read local (sync, instant).
   - `set/update/remove`: write local, then enqueue `{ collection, id }` in a persisted dirty set (`ls_sync_queue_<userId>` in localStorage).
   - `flush()`: debounced (about 2 s after the last change, also on `visibilitychange: hidden` and `pagehide` using `fetch(..., { keepalive: true })`), sends dirty records to `POST /api/progress/sync`, writes the **merged result** back to local, clears the queue on success. On failure keep the queue and retry with exponential backoff (cap 5 min) and on the `online` event.
   - `pull()`: `GET /api/progress`, merge with local using the **same merge functions** as the server. Put the pure merge code in a shared file `frontend/public/js/progress-merge.js` and have `src/services/progressMerge.js` either duplicate it with tests proving equivalence, or load the same file (UMD wrapper: `module.exports` for Node, `window.ProgressMerge` for the browser). Prefer the single shared UMD file, with the backend `require`-ing it via a relative path (the server already serves `frontend/public`).
2. `progress.js`: replace `const store = new LocalStorageAdapter(...)` with a factory:
   - signed out: plain `LocalStorageAdapter('local')` (today's behavior).
   - signed in: `SyncedAdapter` using the same local key space.
3. Dispatch `progress:synced` / `progress:syncError` events for the UI indicator.

C. Login/logout lifecycle: `Progress.onLogin(user)` and `Progress.onLogout()`
1. `onLogin(user)`:
   - Take the current local data (guest progress) and **upload everything** via `/api/progress/sync` (the server merges it with the account's existing data), then replace local with the merged snapshot. This means a guest who studied before signing in never loses progress, and a returning user gets their cloud progress on a fresh device.
   - Re-render XP/streak widgets (`updateXPDisplay`, `updateProfileStats`, path badges) and fire `progress:changed`.
   - If the server already had data AND the local guest data was non-empty and different, show a one-time localized toast: "Your progress was combined with your account."
2. `onLogout()`:
   - Flush the queue first (best effort, 2 s timeout).
   - Then **clear the local progress cache** (all `ls_local_*` progress keys, the legacy progress keys, and the sync queue) so the next person on a shared device does not see this account's data. Keep non-account preferences (`ls_theme`, `ls_source_language`, `ls_course`).
   - Dispatch `auth:changed` and re-render.
3. If the session expires (`401` from any sync call): stop syncing, keep local data, mark the user as signed out in the UI, and ask to sign in again via a toast. Never discard unsynced local data on a 401.

Acceptance scenarios (all must pass manually, and the data-layer ones automatically):
1. Guest earns XP and completes a lesson, signs in: progress is kept and now appears in the DB.
2. Sign out, then sign in on a second browser profile: same XP, completed lessons, learned words, dictionary words.
3. Earn XP offline, reconnect: queue flushes, server has the new XP.
4. Two devices both earn XP the same day: result is the merge (no decrease in any counter).
5. Sign out: local progress cache is cleared, guest mode starts empty.

---

## 11. Step 10: Account deletion and privacy

1. `DELETE /api/account` (`requireUser`, CSRF-checked): deletes the user row (cascade removes sessions and progress), clears the cookie, `204`.
2. UI: in `settings.html` Profile section, a "Delete account and data" button with a confirmation dialog (typed confirmation not needed; a clear two-step confirm is enough). Localized uk/en. Add a "Download my data" button that calls `GET /api/progress` and downloads it as a JSON file (use `Progress.exportProgress()` shape).
3. Add a short privacy note on `auth.html`: what is stored (Google id, email, name, picture, learning progress), why, and how to delete it.
4. Store only what is needed. Do not request additional Google scopes.

---

## 12. Step 11: Tests and tooling

The repo has no test runner. Use Node's built-in `node:test` (no new dependency).

1. `backend/service/test/progressMerge.test.js`: every collection, plus idempotent and commutative properties.
2. `backend/service/test/auth.test.js`: start the Express app on an ephemeral port with an in-memory SQLite DB and a **stubbed verifier** (inject the verifier function into the auth controller so tests do not hit Google). Cover: valid token, wrong audience, unverified email, expired token, session cookie flags, logout, `me` without cookie, CSRF origin rejection, rate limit.
3. `backend/service/test/progressApi.test.js`: allowlist, size limits, user isolation (user A cannot read or write user B's records), merge on sync.
4. Add `"test": "node --test test/"` to `backend/service/package.json`.
5. Extend `scripts/validate-courses.mjs`? Not needed. But **run** `node scripts/check-icons.mjs` and `node scripts/validate-courses.mjs` at the end.

---

## 13. Step 12: Documentation

1. `docs/GOOGLE_AUTH_SETUP.md` (Step 1 content).
2. Update `README.md`: new "Accounts and sync" section (env vars, how guests vs signed-in users behave, `npm test`), and the project structure tree.
3. Update `docs/schemas.md`: server API section, `preferences` in `profile`, `deleted` tombstone for `customWords`, final merge rules.
4. Update `docs/INDEX.md` with the new docs.
5. Update `docs/Problems.txt` (currently empty) with known limitations (XP merge by max, client-authoritative progress, no email/password login, SQLite single-node).

---

## 14. Security checklist (verify before calling it done)

- [ ] ID token verified server-side with the correct `audience`; `email_verified` required; users keyed by `sub`.
- [ ] Session cookie is `httpOnly`, `SameSite=Lax`, `Secure` in production; only a hash is stored.
- [ ] No endpoint accepts or trusts a client-supplied user id.
- [ ] CSRF: JSON content type and `Origin` allowlist on all state-changing endpoints.
- [ ] Rate limit on `/api/auth/google`.
- [ ] Request size limits and per-record limits on progress sync; collection allowlist.
- [ ] No passwords, tokens, or cookies in logs or error responses.
- [ ] `.env` and `*.db` are git-ignored; `.env.example` is committed.
- [ ] Old demo credentials and password echo are gone.
- [ ] Logout clears the server session and the local progress cache.
- [ ] `?next=` redirects accept same-origin relative paths only (no open redirect).
- [ ] Google avatar `<img>` uses `referrerpolicy="no-referrer"`.

---

## 15. Definition of done

1. A new visitor can use the whole app as a guest (unchanged).
2. A visitor can click "Continue with Google", and from then on XP, streak, lesson completion, learned words, custom dictionary words, and settings are saved to the server automatically.
3. Signing in on another device restores everything.
4. Guest progress made before signing in is preserved.
5. Signing out leaves no account data on the device.
6. All tests pass (`npm test` in `backend/service`), `check-icons` and `validate-courses` pass, UI works in Ukrainian and English, light and dark themes, desktop and mobile.

---

## 16. Suggested commit sequence

1. `chore: remove demo auth, update .gitignore`
2. `feat(api): config, security headers, error handler`
3. `feat(db): sqlite schema and helpers`
4. `feat(auth): google id-token login, sessions, csrf, rate limit`
5. `feat(progress): server API and shared merge module (+ tests)`
6. `feat(ui): auth page, profile modal, settings account section`
7. `refactor(progress): route legacy writers through Progress`
8. `feat(progress): synced adapter, login merge, logout cleanup`
9. `feat(account): delete account, export data, privacy note`
10. `docs: setup guide, schemas, README`