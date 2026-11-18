# Frontend Pages Architecture & Overview

LanguageStudio's frontend is constructed as a modern, lightweight, vanilla JavaScript single/multi-page hybrid architecture. It does not require complex build tools (Webpack, Vite) or runtime frameworks (React, Vue), allowing instantaneous file serving, zero compilation lag, and clean, transparent client state.

---

## 1. Page Directory & Route Mapping

All pages are located under `frontend/public/` and are accessible both via clean URLs (rewritten by the backend Gateway and Content Service) and explicit `.html` file paths:

| Page Document | Clean URL | File Path | Primary Function |
|---|---|---|---|
| **[index.md](./index.md)** | `/` | `frontend/public/index.html` | Public landing page, product introduction, interactive chat preview, and onboarding entry. |
| **[home.md](./home.md)** | `/home` | `frontend/public/pages/home.html` | Learner dashboard: daily XP goal, streak counter, roadmap preview, and practice tool hub. |
| **[courses.md](./courses.md)** | `/courses` | `frontend/public/pages/courses.html` | Course catalog: switch active language courses while isolating progress data. |
| **[path.md](./path.md)** | `/path` | `frontend/public/pages/path.html` | Interactive learning path roadmap: visual units, SVG connectors, lesson nodes, and locks. |
| **[lesson.md](./lesson.md)** | `/lesson` | `frontend/public/pages/lesson.html` | Interactive lesson runner: step-by-step dialogues, drills, quizzes, and XP rewards. |
| **[exercises.md](./exercises.md)** | `/exercises` | `frontend/public/pages/exercises.html` | Consolidated Practice Hub: dual-mode trainer with 7 exercise types (MCQ, blank, match, reorder, listen, dialogue, dict) and embedded 3D flashcards (`?mode=flashcards`). |
| **[flashcards.md](./flashcards.md)** | `/flashcards` | *(Deprecated / Merged)* | Spaced repetition trainer: formerly standalone, now integrated directly into `pages/exercises.html?mode=flashcards`. |
| **[dictionary.md](./dictionary.md)** | `/dictionary` | `frontend/public/pages/dictionary.html` | Lexical dictionary: diacritic search, categories, and custom saved word notebook. |
| **[grammar.md](./grammar.md)** | `/grammar` | `frontend/public/pages/grammar.html` | Grammar cheat sheet: articles, verb tables, pronouns, and formal speech reference. |
| **[placement-test.md](./placement-test.md)** | `/placement-test` | `frontend/public/pages/placement-test.html` | Diagnostic placement test: goal selection, 5-question test, CEFR scoring, and plan match. |
| **[tests.md](./tests.md)** | `/tests` | `frontend/public/pages/tests.html` | Assessment hub: access placement testing and final path milestone examinations. |
| **[pricing.md](./pricing.md)** | `/pricing` | `frontend/public/pages/pricing.html` | Monetization tiers: lifetime access, targeted path passes, and checkout trigger. |
| **[checkout.md](./checkout.md)** | `/checkout` | `frontend/public/pages/checkout.html` | Hosted payment provider sandbox: simulates Stripe/Paddle webhooks and unlock grants. |
| **[auth.md](./auth.md)** | `/auth` | `frontend/public/pages/auth.html` | User authentication: Google OAuth 2.0 sign-in and security callback handling. |
| **[settings.md](./settings.md)** | `/settings` | `frontend/public/pages/settings.html` | User configuration: profile, target course, daily XP goals, theme, and cloud sync. |

---

## 2. Shared Client Architecture & Modules

The frontend relies on a shared library of vanilla ES6 modules located in `frontend/public/js/`:

```
frontend/public/js/
├── theme.js              # Theme manager (light/dark/auto), loaded synchronously in <head>
├── icons.js              # SVG icon registration & DOM rendering engine (data-icon)
├── components.js         # Shared custom components (navbar, footer, profile modal, auth header)
├── layout.js             # Shell layout and responsive navigation drawer logic
├── course.js             # Course configuration, course switching, and metadata loading
├── storage.js            # localStorage abstraction layer with versioning and prefixes
├── progress-store.js     # Unified progress store: profiles, XP, streaks, completed lessons
├── progress.js           # Progress calculations, high-water mark checks, and level formulas
├── app.js                # Global application initializer, session checking, and auth sync
└── user-vocab.js         # Client-side custom vocabulary manager
```

---

## 3. Client Storage Strategy

LanguageStudio employs an offline-first storage model using the browser's `localStorage` and `sessionStorage`:

| Key | Storage | Description |
|---|---|---|
| `ls_theme` | `localStorage` | UI theme preference (`'light'`, `'dark'`, `'auto'`). |
| `ls_course` | `localStorage` | Currently active course ID (default: `'it'`). |
| `ls_source_language` | `localStorage` | Interface translation language (`'en'` or `'uk'`). |
| `ls_italian_progress` | `localStorage` | Full course progress object (lessons completed, XP, streak). |
| `ls_pt_goals` | `sessionStorage` | Selected learning goals chosen during placement test. |
| `ls_pt_level` | `sessionStorage` | Calculated CEFR level from placement test. |
| `ls_daily_goal` | `localStorage` | Target daily XP (e.g. `20`, `50`). |

---

## 4. UI Component Ingestion (`components.js`)

Pages declare placeholders for shared UI components using `data-component` attributes:
- `<div data-component="navbar"></div>`: Injects the top navigation bar with active course pill, streak badge, XP counter, and profile menu.
- `<div data-component="footer"></div>`: Injects the standard LanguageStudio footer.
- `<div data-component="profile-modal"></div>`: Injects the user profile, level details, and account modal.
- `<div data-component="auth-header"></div>`: Injects the streamlined header on authentication screens.

When `components.js` runs on `DOMContentLoaded`, it replaces these tags with compiled HTML and binds their reactive event listeners.

---

## 5. Individual Page Documentation

Explore detailed architectural breakdowns, DOM layouts, event flows, and API integrations for every page:
- [Landing Page (`index.html`)](./index.md)
- [Home Dashboard (`home.html`)](./home.md)
- [Course Catalog (`courses.html`)](./courses.md)
- [Learning Path (`path.html`)](./path.md)
- [Lesson Runner (`lesson.html`)](./lesson.md)
- [Practice Exercises & Flashcards (`exercises.html`)](./exercises.md)
- [Flashcards (`flashcards.html` - Deprecated / Merged into exercises)](./flashcards.md)
- [Dictionary (`dictionary.html`)](./dictionary.md)
- [Grammar Guide (`grammar.html`)](./grammar.md)
- [Placement Test (`placement-test.html`)](./placement-test.md)
- [Tests Hub (`tests.html`)](./tests.md)
- [Pricing & Plans (`pricing.html`)](./pricing.md)
- [Checkout Simulator (`checkout.html`)](./checkout.md)
- [Authentication (`auth.html`)](./auth.md)
- [Settings & Profile (`settings.html`)](./settings.md)
