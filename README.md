# LanguageStudio

A multi-course language learning web app with Italian and Spanish courses, interactive exercises, and optional cloud-synced progress.

## Features

- Learning paths, lessons, vocabulary, grammar, and exercises (multiple choice, fill-in, matching, reorder, listening, dialogue, dictation)
- Course dictionary and flashcards, light/dark themes, localized UI (`en` / `uk`)
- Login and registration with HTTP-only session cookies; progress syncs to MongoDB when configured
- Paid content with entitlement checks; falls back gracefully when MongoDB is unavailable

## Requirements

- Node.js ≥ 18
- npm

## Setup

1. **Copy `.env` files** (see [Configuration](#configuration) below)
2. **Install dependencies** — from the repo root:
   ```bat
   install.bat
   ```
   This runs `npm install` in `backend\service`, `backend\auth-service`, and `backend\gateway`. No database setup step is needed.
3. **Start all services**:
   ```bat
   start.bat
   ```
   Opens three terminal windows (service on :3006, auth-service on :3007, gateway on :3005).
4. **Open the app**: [http://localhost:3005/](http://localhost:3005/)

## Configuration

### `backend/service/.env` (required)

```env
SESSION_SECRET=your_secret_here        # required
MONGODB_URI=mongodb+srv://...          # optional — enables cloud auth/progress sync
```

- Without `MONGODB_URI`, sessions are stored in memory and progress is not synced.

### `backend/.env` (optional)

Legacy gateway/shared settings; largely unused now. Create from `.env.example` if needed.

## Project Layout

```
courses/              # JSON course content (Italian: it, Spanish: es)
paid-content/         # Paid lesson files (entitlement-gated)
frontend/public/      # App pages, styles, scripts
backend/service/      # Main API, auth, and static frontend server (port 3006)
backend/auth-service/ # Legacy auth service (port 3007)
backend/gateway/      # Public entry point and API proxy (port 3005)
scripts/              # Maintenance and validation scripts
```

## Scripts

Run from the repo root:

| Script | Purpose |
|---|---|
| `node scripts/validate-courses.mjs` | Validate all course JSON files |
| `node scripts/check-icons.mjs` | Check for missing icons referenced in course data |
| `import_vocab.bat` | Import CSV vocabulary into the SQLite user-word database |

## Tests

From `backend\service`:

```bat
npm test
```

Runs the built-in Node.js test runner on `test/*.test.js`.
