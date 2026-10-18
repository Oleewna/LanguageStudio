# LanguageStudio

LanguageStudio is a static, multi-course language learning platform built around a shared front-end and course-specific content packs. It is designed to help learners study a language through structured lessons, goal-based learning paths, vocabulary tools, interactive practice, and progress tracking without hard-coding a single course into the app.

## Overview

The project is organized around a reusable learning engine and isolated course data:

- `frontend/public/` contains the app shell, shared UI, all pages, and JavaScript modules.
- `courses/<id>/` stores the actual language course data for each language pack.
- `courses/index.json` declares all available courses and the default course.
- `course.json` defines course metadata, paths, feature flags, and exercise categories.
- `vocab.json`, `grammar.json`, and `exercises.json` provide course-specific learning content.
- `lessons/<lessonId>.json` contains lesson blocks used by the generic lesson renderer.
- `docs/` includes authoring guides, schemas, and project notes.

The platform is intentionally generic: new languages should be addable by creating a new course pack and reusing the same front-end logic and lesson engine.

## Supported functionality

LanguageStudio includes a full set of learning and practice tools for each active course.

### 1. Course-based learning experience

- Multiple language packs can coexist in the repository.
- Each course is loaded dynamically from the `courses/` folder.
- Course choice is handled through the app shell and course metadata.
- The UI can show course-specific text, lessons, exercises, and configuration without hard-coded front-end logic.

### 2. Goal-based learning paths

- Learners can browse a roadmap of units and lessons.
- Courses are organized into paths such as communications, daily situations, travel, work, shopping, or other practical themes.
- Each lesson can have additional sublessons and practice exercises.
- Progress is represented through lesson status and optional XP/reward metadata.

### 3. Lesson system

- Lessons are rendered from reusable JSON lesson blocks.
- The lesson engine supports structured educational content instead of writing page-specific layouts for every lesson.
- Course content is separated from the UI, making the system easier to extend.
- Lessons can include vocabulary, grammar, examples, exercises, and contextual learning tasks.

### 4. Vocabulary and dictionary tools

- Users can save and review vocabulary items.
- The dictionary is designed as a personal study companion.
- Words can be organized per course and reused across lesson activities.
- Vocabulary data is isolated by course and stored locally in the browser.

### 5. Grammar reference

- Grammar is available as a dedicated learning section.
- Grammar content is course-specific and kept in structured JSON.
- The app supports reference-based study of rules and patterns.
- Grammar topics are grouped by category and integrated into the broader lesson flow.

### 6. Interactive exercises

The exercise system supports multiple formats, including:

- multiple-choice questions
- blank-fill exercises
- matching tasks
- reorder activities
- listening-based exercises
- dialogue tasks
- dictation-style exercises

This makes the app suitable for both basic drill practice and real-world communication scenarios.

### 7. Flashcards

- Learners can review core vocabulary and phrases quickly.
- Flashcards support repetition-based learning patterns.
- Course flashcards can be enabled or disabled via feature flags in `course.json`.

### 8. Tests and progress checks

- The app includes dedicated test pages for checking progress.
- Progress can be tracked at the course and lesson level.
- Users can revisit exercises, review lessons, and continue learning from where they left off.

### 9. Local personalization and settings

- The app uses `localStorage` to keep course and learner data on the device.
- Settings pages support theme selection, course preferences, and local app configuration.
- Profiles and account-style UI patterns are available in the app shell, even in the static/local-first configuration.

### 10. Auth and account UX

- The front-end includes login and registration screens.
- The auth UI is presented as a lightweight static flow for front-end use.
- This supports the user journey even though the project remains primarily a client-side learning platform.

### 11. Theming and presentation

- Shared CSS and layout files power the app shell.
- The project supports light/dark theming through dedicated theme scripts.
- Typography, layout, cards, responsive sections, and navigation are shared across pages.
- The app uses modular component include patterns for the navbar, footer, profile modal, and auth header.

## Course configuration model

Each course contains a `course.json` with metadata like:

- language code and display name
- target locale and script configuration
- tagline and localized text
- enabled features
- exercise categories
- learning path structure
- lesson definitions and sublesson data

This allows each course to define its own learning roadmap without changing the underlying engine.

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

These checks cover:

- course folder structure
- valid JSON files
- localized text fields
- course registry consistency
- lesson references and exercise formats
- icon references and legacy icon symbols
- inline SVG validation
- icon registry mapping and unused icon detection

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
│       ├── assets/
│       ├── components/
│       ├── config/
│       ├── css/
│       ├── js/
│       │   └── data/
│       ├── pages/
│       ├── testers/
│       └── index.html
├── scripts/
│   ├── validate-courses.mjs
│   └── check-icons.mjs
├── README.md
├── .gitignore
└── package.json (if present in the root environment)
```

## Development notes

- UI text is localized with objects such as `{ "uk": "...", "en": "..." }`.
- Course data is plain JSON and loaded dynamically at runtime.
- The app is intentionally generic: a new course should work without special-case front-end logic.
- Shared logic is designed to handle partial or missing data gracefully.
- Validation scripts help keep course metadata, lesson references, and icon registrations consistent.
- The platform is designed to stay flexible for new course additions and future learning modules.

## Documentation

See the [documentation index](docs/INDEX.md) for a complete project map and references. Useful starting points:

- [Adding a course](docs/ADDING_A_COURSE.md) explains how to create and register a course pack.
- [Adding a path](docs/ADDING_A_PATH.md) covers organizing course paths and sublessons.
- [Adding an icon](docs/ADDING_AN_ICON.md) explains how to add and map SVG or asset icons.
- [Course data schemas](docs/schemas.md) documents the JSON structures used across the app.
- [Missing icons guide](docs/MISSING_ICONS_GUIDE.md) helps resolve missing or placeholder icon issues.
- [Settings page plan](docs/SETTINGS_PAGE_PLAN.md) describes the design and implementation plan for app settings.
- [Problems and working notes](docs/Problems.txt) lists current issues and cleanup tasks.

## Summary

LanguageStudio is a reusable language-learning platform with a practical, task-oriented course model. It combines structured lessons, course packs, path-based learning, live-style practice tools, vocabulary support, grammar references, and progress tracking into one shared front-end. Its design keeps the app generic enough to support additional languages while preserving a polished learner experience for the active course.
