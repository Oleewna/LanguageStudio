# LanguageStudio

LanguageStudio is a static multi-course language learning platform. The app loads one course pack at a time from the `courses/` folder, reuses a shared web front-end, and keeps per-course data isolated in localStorage.

## Architecture at a glance

- `frontend/public/` contains the app shell, shared layout, pages, and JS modules.
- `courses/<id>/` contains the full course data for each language pack.
- `course.json` defines the course metadata, lesson roadmap, and feature toggles.
- `vocab.json`, `grammar.json`, and `exercises.json` provide course-specific learning content.
- `lessons/<lessonId>.json` stores lesson blocks for the generic lesson renderer.
- `courses/index.json` lists all available courses and the default course.
- `docs/ADDING_A_COURSE.md` explains how to add a new language pack.

## Current course list

| Course id | Name | Status |
| --- | --- | --- |
| `it` | Italian | active |
| `es` | Spanish | inactive (present, not currently used) |

## Local run instructions

Run the backend scripts from the project root in Command Prompt or PowerShell. Install dependencies once:

```bat
cd backend\service
install.bat
```

Then start the app:

```bat
cd backend\service
start_server.bat
```

Open the URL printed by the server:

```text
http://localhost:3005/
```

## Validation

Before shipping or adding a new course, run the validator:

```bash
node scripts/validate-courses.mjs
node scripts/check-icons.mjs
```

This checks:
- course folder structure
- valid JSON files
- localized text fields
- course registry consistency
- lesson references and exercise formats
- icon references, legacy icon symbols, and inline SVG markup
- icon registry entries mapped to placeholders and unused icon files

## Project structure

```text
LanguageStudio/
├── backend/
│   └── service/
│       └── src/
├── courses/
│   ├── index.json
│   ├── it/
│   │   ├── course.json
│   │   ├── vocab.json
│   │   ├── grammar.json
│   │   ├── exercises.json
│   │   └── lessons/
│   └── es/
│       ├── course.json
│       ├── vocab.json
│       ├── grammar.json
│       ├── exercises.json
│       └── lessons/
├── docs/
│   ├── INDEX.md
│   ├── ADDING_A_COURSE.md
│   ├── ADDING_A_PATH.md
│   ├── ADDING_AN_ICON.md
│   ├── MISSING_ICONS_GUIDE.md
│   ├── SETTINGS_PAGE_PLAN.md
│   ├── schemas.md
│   └── Problems.txt
├── frontend/
│   └── public/
│       ├── components/
│       ├── css/
│       ├── js/
│       ├── pages/
│       └── index.html
├── scripts/
│   └── validate-courses.mjs
├── README.md
└── .gitignore
```

## Development notes

- UI text uses localized objects in the form `{ "uk": "...", "en": "..." }`.
- Course data remains in JSON and is loaded dynamically.
- The app is designed to stay generic: a new course should load without special-case code in the front-end.
- The shared engine should handle missing or partial content gracefully.

## Documentation

See the [documentation index](docs/INDEX.md) for the full list of project notes and guides. Useful starting points:

- [Adding a course](docs/ADDING_A_COURSE.md) explains how to create a language pack.
- [Adding a path](docs/ADDING_A_PATH.md) covers course paths and sublessons.
- [Adding an icon](docs/ADDING_AN_ICON.md) covers adding and registering icon assets.
- [Course data schemas](docs/schemas.md) describes the expected JSON structures.
- [Missing icons guide](docs/MISSING_ICONS_GUIDE.md) explains how to investigate icon gaps.
- [Settings page plan](docs/SETTINGS_PAGE_PLAN.md) records the settings page design and implementation plan.
- [Problems and working notes](docs/Problems.txt) tracks current issues and cleanup tasks.
