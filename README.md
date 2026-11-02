# LanguageStudio

Multi-course language learning app with a shared responsive front end, SQLite content database, and backend API. Courses use reusable paths, lessons, vocabulary, grammar, and exercises; Italian Communication Basics currently includes separate greetings and practice lessons.

## Public showcase

The static LanguageStudio introduction website is published at [https://languagestudio.page.gd](https://languagestudio.page.gd). Its source files and publishing instructions are maintained in the separate [LanguageStudio-Showcase repository](https://github.com/Oleewna/LanguageStudio-Showcase). The showcase is available in English, Ukrainian, Italian, Spanish, French, and German, and includes a theme switch and screenshot gallery. It introduces the project but does not include the backend-powered learning app.

## Features

- Course selection, learning paths, lesson progress, tests, and interactive practice (multiple choice, fill-in, matching, reorder, listening, dialogue, and dictation).
- Course-based dictionary and flashcards, grammar references, light/dark themes, and localized UI (`uk` / `en`).
- Protected administrator editor for managing courses and all learning content. Changes are validated and saved transactionally.
- Login and registration with locally stored password hashes and HTTP-only session cookies. Progress and preferences stay in browser storage and do not sync to accounts.

## Setup and run

Requires Node.js and npm. From the repository root, install dependencies and initialize the local database:

```bat
backend\install.bat
cd backend\content-db
npm run db:setup
```

Start all three services in separate terminals with `npm start` from `backend\service`, `backend\auth-service`, and `backend\gateway`; or run `backend\start.bat` from the root. Open `http://localhost:3005/`.

The gateway serves the front end on port `3005` and routes `/api/v1/auth/*` and `/api/v1/content/*` to the auth service (`3007`) and content service (`3006`). Copy `.env.example` files to `.env` for local configuration; the shared database path is set in `backend/.env`. User records are stored in the Git-ignored `backend/auth-service/data/users.json`; sessions are in memory and end when the auth service restarts.

New accounts are learners. To grant or remove administrator access, run from `backend\auth-service`:

```bat
npm run user:role -- learner@example.com admin
npm run user:role -- learner@example.com learner
```

Sign in as an administrator and open **Content editor** from the app navigation to manage the database catalog. See the [content database guide](./backend/content-db/README.md) for setup, roles, migrations, and backups. Runtime content is in SQLite—not the Markdown lesson references in `lessons/`.

## Checks

Run backend tests with `npm test` from each of `backend\service`, `backend\auth-service`, and `backend\gateway`. Check icons from the repository root:

```bat
node scripts/check-icons.mjs
```

## Project layout

- `frontend/public/` — app pages, shared UI, styles, and scripts
- `backend/service/` — content API and static frontend server
- `backend/auth-service/` — accounts, roles, and sessions
- `backend/gateway/` — public entry point and API routing
- `backend/content-db/` — SQLite schema, migrations, seed, and backup tools
- `lessons/` — human-readable references; not runtime content

The database seed initially includes Italian (active) and Spanish (inactive). Course content and settings are managed in the administrator editor. Preserve localized `uk` and `en` text when editing.
