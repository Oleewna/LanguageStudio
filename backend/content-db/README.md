# Shared content database

This package owns the SQLite schema, database file, migrations, repository, and backups. The content API service serves requests; it does not initialize or manage the database. Course content is stored only in SQLite. Learner progress remains in browser storage, while accounts remain in the separate auth service.

## Data model

Numbered SQL migrations define the schema:

- `courses`, `learning_paths`, `learning_units`, and `lessons` store the course hierarchy, IDs, order, and relationships.
- `vocabulary`, `grammar_topics`, `exercises`, and `exercise_categories` store indexed attributes and references.
- Flexible localized text and lesson/exercise blocks are stored as validated JSON payloads in SQLite.
- `content_meta` stores the default course; `schema_migrations` records applied schema versions.

Foreign keys and application validation protect the hierarchy and references. The public content API reconstructs its stable learner-facing response format from these rows.

The learner-facing vocabulary catalog is projected from the vocabulary blocks in lesson content. Existing vocabulary rows can enrich matching lesson words with metadata, but cannot add unrelated words to the catalog. Flashcards, word-based exercises, and lesson vocabulary therefore share the same lesson-backed source.

## Initialize and edit

Install backend dependencies and initialize the database:

```bat
backend\install.bat
cd backend\content-db
npm run db:setup
```

`db:setup` creates a new local database from `seeds/initial-content.sqlite` when no database exists, then applies pending migrations. It will not overwrite an existing database or content. The seed contains the initial Italian and Spanish catalog and is only for first-time setup.

To edit, start the backend services, sign in with an administrator account, and open **Content editor** from the app navigation (or `/pages/admin-editor.html`). The editor loads the current catalog from the database, validates changes, and writes the full catalog in one SQLite transaction. Course index metadata, courses, paths, units, lessons, vocabulary metadata, grammar, and exercises are managed there; add or remove learner-facing words in lesson vocabulary blocks so they stay aligned with lesson content.

New public accounts always receive the `learner` role. Grant or remove administrator access for an existing account from `backend\auth-service`:

```bat
npm run user:role -- learner@example.com admin
npm run user:role -- learner@example.com learner
```

Only administrators can read or write the editor catalog API. Keep administrator access limited to trusted accounts.

Schema changes must be added as a new numbered SQL file in `migrations/` and applied explicitly. Running the web server never migrates or imports content.

## Database location and backups

`CONTENT_DATABASE_FILE` is read from `backend/.env`; the example uses `./service/data/content.sqlite`, relative to `backend/`. Keep the database on persistent writable storage. SQLite is intended for a single backend instance; use a different persistence design for multiple instances or shared concurrent writes.

Create a consistent backup while the content service is running:

```bat
cd backend\content-db
npm run db:backup
```

An optional path relative to `backend/` can be passed, for example:

```bat
npm run db:backup -- .\data\backups\before-edit.sqlite
```

The default destination is `backend/data/backups/`. Verify backups before destructive maintenance and retain them outside the application host for recovery.
