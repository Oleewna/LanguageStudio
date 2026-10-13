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
| `es` | Spanish | active |

## Local run instructions

Because the app uses `fetch()` to load course JSON, it must be served over a local HTTP server rather than opened as `file://`.

From the project root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/frontend/public/
```

Alternative:

```bash
npx serve .
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
│   ├── ADDING_A_COURSE.md
│   ├── MULTI_COURSE_PLAN.md
│   ├── schemas.md
│   └── ...
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

## Authoring a course

See [docs/ADDING_A_COURSE.md](docs/ADDING_A_COURSE.md) for a step-by-step walkthrough.
