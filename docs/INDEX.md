# LanguageStudio Documentation Index

Comprehensive technical documentation for all backend services and frontend pages. These documents describe functionality, schemas, endpoints, DOM architecture, and data lifecycles in complete detail, designed so an AI or human developer can be immediately up to speed without loading the entire codebase.

---

## Architecture & System Design
- [ARCHITECTURE.md](../ARCHITECTURE.md) — Complete backend architecture, service topology, and end-to-end request lifecycles ("what calls what").
- [PAYMENTS.md](PAYMENTS.md) — Monetization, payment provider abstraction, entitlement models, and webhook security.
- [schemas.md](schemas.md) — Shared course catalog and user vocabulary data schemas.
- [AUTH_SETUP.md](AUTH_SETUP.md) — Google OAuth 2.0 and session setup guide.

---

## Backend Services Documentation (`docs/backend-services/`)
- **[Backend Services Overview](backend-services/README.md)** — Microservice topology, port matrix, and communication flow.
- **[Gateway Service](backend-services/gateway.md)** — Reverse proxy, CORS termination, static asset delivery, and `.json` content protection guard (Port 3005).
- **[Content & API Service](backend-services/content-service.md)** — Core API engine: SQLite vocabulary database, MongoDB Atlas models, lesson gating, progress sync, and payments (Port 3006).
- **[Auth Service](backend-services/auth-service.md)** — Dedicated Google OAuth 2.0 authentication service and token broker (Port 3007).

---

## Frontend Pages Documentation (`docs/frontend-pages/`)
- **[Frontend Architecture Overview](frontend-pages/README.md)** — Client architecture, shared vanilla modules, component injection, and state persistence model.
- **[Landing Page (`index.html`)](frontend-pages/index.md)** — Public front door, interactive dialogue preview, and zero-friction onboarding entry.
- **[Home Dashboard (`home.html`)](frontend-pages/home.md)** — Learner dashboard: daily XP goal, streak counter, roadmap preview, and practice tool hub.
- **[Course Catalog (`courses.html`)](frontend-pages/courses.md)** — Multi-language course directory with isolated progress tracking.
- **[Learning Path (`path.html`)](frontend-pages/path.md)** — Interactive curriculum roadmap: hierarchical categories, units, SVG connectors, and lesson status nodes.
- **[Lesson Runner (`lesson.html`)](frontend-pages/lesson.md)** — Multimodal interactive study engine: dialogues, vocabulary spotlight, grammar, exercises, and XP awards.
- **[Practice & Exercises Hub (`exercises.html`)](frontend-pages/exercises.md)** — Consolidated practice arena with dual modes: 7 exercise drill types and embedded 3D flashcards (`?mode=flashcards`).
- **[Flashcards Trainer (`flashcards.html`)](frontend-pages/flashcards.md)** — *(Deprecated / Merged)* Spaced repetition memory trainer, now integrated natively inside `pages/exercises.html?mode=flashcards`.
- **[Vocabulary Dictionary (`dictionary.html`)](frontend-pages/dictionary.md)** — Lexicon lookup with diacritic-normalized search and custom saved word notebook.
- **[Grammar Guide (`grammar.html`)](frontend-pages/grammar.md)** — Structural grammar handbook with color-coded conjugation tables and usage rules.
- **[Placement Test (`placement-test.html`)](frontend-pages/placement-test.md)** — 3-step onboarding assessment: goal selection, 5-question test, CEFR scoring, and plan match.
- **[Tests Hub (`tests.html`)](frontend-pages/tests.md)** — Assessment directory for diagnostic tests and final path milestone examinations.
- **[Pricing & Plans (`pricing.html`)](frontend-pages/pricing.md)** — Monetization tiers: lifetime access, targeted path passes, and checkout integration.
- **[Payment Simulator (`checkout.html`)](frontend-pages/checkout.md)** — Offsite hosted payment sandbox for simulating Stripe/Paddle webhooks and refunds.
- **[Authentication (`auth.html`)](frontend-pages/auth.md)** — Google OAuth 2.0 Single Sign-On and security error banner handling.
- **[Settings & Profile (`settings.html`)](frontend-pages/settings.md)** — User control center: daily goals, language preferences, audio/theme toggles, and cloud sync.

---

## Developer Guides & How-Tos
- [ADDING_A_COURSE.md](ADDING_A_COURSE.md) — Step-by-step guide to adding a new language course.
- [ADDING_A_PATH.md](ADDING_A_PATH.md) — How to define a new learning path and unit structure.
- [ADDING_A_LOCALE.md](ADDING_A_LOCALE.md) — How to add a new UI translation locale.
- [ADDING_AN_ICON.md](ADDING_AN_ICON.md) — How to register custom SVG icons in `icons.js`.
- [ADDING_VOCABULARY.md](ADDING_VOCABULARY.md) — How to add or update vocabulary definitions via CSV.
