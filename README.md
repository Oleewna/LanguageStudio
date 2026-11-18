# LanguageStudio

An immersive, modular, full-stack language learning web platform designed for acquiring real-world communicative fluency through structured learning paths, multi-format exercises, contextual dialogues, spaced repetition vocabulary, and grammar study.

---

## 🌟 Project Presentation

**LanguageStudio** bridges the gap between casual vocabulary memorization and genuine conversational comprehension. Rather than drilling words in a vacuum, the platform guides learners through thematic, real-life communicative situations — greeting neighbors, ordering at a café, navigating cities, and reading authentic dialogues — supported by structured grammar references, diagnostic placement tests, and interactive review tools.

Built with a lightweight, accessible frontend and a resilient Node.js microservice architecture, LanguageStudio works seamlessly as a standalone offline guest app or as a fully synchronized cloud platform with user accounts, progress persistence, and tiered access to premium content.

### Core Pedagogical Pillars

- **Communicative Context First**: Vocabulary and grammar are taught within authentic conversational scenarios rather than isolated flashcard drills.
- **Multimodal Interactive Practice**: 7+ specialized exercise formats challenge reading, listening, writing, and syntactic composition.
- **Cognitive Reinforcement**: Integrated course dictionary with spaced repetition tracking (SRS) and custom word saving.
- **Adaptive Progression**: Clear milestones from beginner (A1/A2) foundations upward, validated by diagnostic placement and unit review tests.
- **Zero-Friction Access**: Start learning immediately as a guest in offline mode; optionally log in or connect with Google to sync progress across devices.

---

## 🌍 Available Languages

| Language | Course Code | Status | Coverage & Features |
|---|---|---|---|
| **Italian** (*Italiano*) | `it` | **Active / Production-Ready** | Full learning paths (*Communication Basics*, *Reading & Everyday Life*), 7+ exercise drill formats, situational dialogues, audio/TTS pronunciation (`it-IT`), comprehensive grammar reference, dictionary, flashcards, placement testing, and tiered free/premium units. |
| **Spanish** (*Español*) | `es` | **Staging / In Development** | Structured course foundation (`courses/es/course.json`), core vocabulary, grammar rules, exercise templates, dialogue models, and audio/TTS configuration (`es-ES`). |

### 🌐 Dual Interface Localization (Locales)
The entire platform user interface — navigation, exercise instructions, grammar explanations, modals, and error prompts — is fully localized with instant on-the-fly switching:
- **English (`en`)**: Complete internationalized UI.
- **Ukrainian (`uk`)**: Complete localized UI with native Cyrillic translations for all lessons and exercise types.

---

## 🎨 Style, Aesthetics & UI/UX Design

LanguageStudio departs from noisy, hyper-gamified language apps in favor of a **warm, tactile editorial design language** reminiscent of European literary ateliers, classical linguistics handbooks, and Mediterranean study spaces.

```
Light Mode Palette:
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Cream Canvas    │ Pine / Sage     │ Tuscan Gold     │ Ink Typography  │
│ #F6F5EF         │ #4F7A6A         │ #C9A25B         │ #25302B         │
│ (--bg)          │ (--primary)     │ (--accent)      │ (--text)        │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘

Dark Mode Palette:
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Charcoal Moss   │ Muted Pine      │ Soft Amber Gold │ Soft Ink Text   │
│ #0F1412         │ #7FB09C         │ #D8B873         │ #E4EAE5         │
│ (--bg)          │ (--primary)     │ (--accent)      │ (--text)        │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### Key Design System Elements

- **Refined Typography**:
  - **Headings & Accents**: *Lora* — an elegant contemporary serif typeface with brushed curves, lending literary gravitas to lesson headers and vocabulary entries.
  - **Body & Interactive UI**: *Nunito Sans* — a clean, highly legible geometric sans-serif optimized for reading speed and exercise drills across all viewport sizes.
- **Thoughtful Palette & Design Tokens**:
  - Warm parchment base (`#F6F5EF`) paired with deep forest sage (`#4F7A6A`) and warm Tuscan ochre gold (`#C9A25B`).
  - Dark ink typography (`#25302B`) ensuring high contrast and reduced eye fatigue during long reading sessions.
  - Unambiguous semantic indicators: vibrant emerald green (`#2E9E6B`) for successful answers and ruby red (`#D64545`) for errors.
- **First-Class Dark Theme**:
  - Implemented via semantic CSS variables (`[data-theme="dark"]`).
  - Deep charcoal-moss background (`#0F1412`) with luminescent sage accents (`#7FB09C`) and muted gold highlights (`#D8B873`), preserving visual hierarchy without harsh contrast spikes.
- **Micro-Interactions & Polish**:
  - Tactile card elevations, soft borders (`--radius-md`), smooth transition feedback on answer selection, and responsive layout scaling across mobile, tablet, and desktop screens.
  - Dedicated audio buttons with integrated browser SpeechSynthesis (TTS) tuned to native locales (`it-IT`, `es-ES`).

---

## ✨ Feature Highlights

- **Structured Learning Paths & Units**: Sequential pathways with bite-sized lessons, clear learning objectives, estimated completion times, and milestone checks.
- **7+ Interactive Exercise Engines**:
  1. *Multiple Choice (MCQ)*: Rapid recognition and contextual grammar queries.
  2. *Fill-in-the-Blank*: Sentence completion and verb conjugation drills.
  3. *Matching Pairs*: Dual-column lexical and definition pairing.
  4. *Sentence Reordering*: Interactive word-chip sequencing to build syntactic intuition.
  5. *Listening Comprehension*: Audio playback with transcription and comprehension questions.
  6. *Interactive Dialogues*: Multi-turn conversational roleplays with alternating turns.
  7. *Dictation*: Audio-driven spelling and typing exercises.
- **Dictionary & Spaced Repetition Flashcards**: Searchable course vocabulary backed by SQLite search, custom user word lists, and spaced review tracking.
- **Grammar Guide & Rules Handbook**: Standalone grammar browser organized by category (articles, pronouns, verbs, syntax, situational usage).
- **Placement & Diagnostic Testing**: Level assessment tests allowing learners to evaluate their proficiency and jump to relevant units.
- **Unified Authentication**:
  - Local email/password registration with Argon2 password hashing.
  - Google OAuth 2.0 social sign-in.
  - CSRF token protection, IP-based rate limiting, and secure HTTP-only cookies (`ls.sid`).
- **Offline-First Resilience & Cloud Sync**:
  - Guest mode saves progress locally in browser `localStorage`.
  - Logged-in mode uses write-through caching with an offline sync queue.
  - Smart server-side conflict resolution preserves maximum scores, cumulative XP, and latest timestamps on MongoDB Atlas.
- **Content Gating & Monetization**:
  - Free core lessons open to everyone.
  - Premium modules gated server-side behind user entitlements.
  - Pluggable payment provider architecture (Mock provider included, ready for Stripe or PayPal integration).

---

## 🧭 How to View, Navigate & Unlock Learning Paths

### 1. How to See and Access Learning Paths
- **Top Navigation**: Click **"Learning path"** in the top navigation bar from any page (on desktop, hover over it to see the path dropdown menu; on mobile, open the drawer menu).
- **Home Dashboard**: On [Home (`/pages/home.html`)](http://localhost:3005/pages/home.html), click **"Explore your learning path"** to jump straight into your current pathway.
- **Direct Page**: Open [`/pages/path.html`](http://localhost:3005/pages/path.html) directly to view all units, milestones, and lessons.
- **Path Hierarchy**: Each course is structured as `Course` ➔ `Learning Paths` (e.g., *Communication Basics*, *Reading*) ➔ `Units` ➔ `Lessons`.

### 2. Logging In vs. Unlocking Paths
- **What Logging In Does**: Signing in with Google or local auth connects your student profile and syncs your streak, total XP, lesson completions, and saved dictionary words across all devices.
- **Free vs. Premium Content**:
  - **Free Paths** (e.g. *Communication Basics*): Open immediately to guests and logged-in students without requiring any payment.
  - **Paid / Tiered Paths** (e.g. *Reading & Everyday Life*): Protected premium lessons (`paid-content/`) that require an active entitlement. Logging in alone does not grant paid entitlements.

### 3. How to Unlock Paid Paths
- **1-Click Developer / Testing Unlock**:
  - On the [Learning Path page (`/pages/path.html`)](http://localhost:3005/pages/path.html) or on any locked lesson screen, click the **"✨ Unlock all paths for testing"** button.
  - This calls `/api/payments/dev-unlock`, which instantly grants full course entitlement for your session and unlocks all lessons without going through external payment.
- **Mock Checkout Simulation**:
  - Visit [Pricing (`/pages/pricing.html`)](http://localhost:3005/pages/pricing.html) or click "Unlock Full Course" on any locked lesson.
  - The built-in mock payment provider simulates checkout and confirms the entitlement webhook automatically.

---

## 🛠️ System Architecture

LanguageStudio is organized into an edge reverse proxy and a unified core backend service:

```
                           Browser (:3005)
                                  │
                        ┌─────────▼─────────┐
                        │      Gateway      │ (:3005)
                        └─────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
        Static Assets       /courses/*.json        /api/*
      (frontend/public,   (Blocked / 403      (Proxied to
          courses/)          Forbidden)        Service :3006)
                                                      │
                                                      ▼
                                              ┌───────────────┐
                                              │    service    │ (:3006)
                                              └───────┬───────┘
                                                      │
                                  ┌───────────────────┴───────────────────┐
                                  ▼                                       ▼
                         MongoDB Atlas (Cloud)                   SQLite (Local)
                        - Users & Sessions (ls.sid)             - Dictionary & vocab
                        - User progress & stats                 - Word translations
                        - Entitlements (paid access)            - Normalized search
```

> 📖 **Deep-Dive Documentation**: For an in-depth breakdown of the backend call flow, request lifecycles, route controllers, models, and conflict resolution engine, please read [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 📋 Requirements

- **Node.js** ≥ 18.x
- **npm** (bundled with Node.js)
- *(Optional)* **MongoDB Atlas account** (free tier connection string for cloud auth and progress sync)

---

## 🚀 Quick Start

### 1. Configure Environment

Copy the example environment file for the core service:

```bash
cd backend/service
cp .env.example .env
```

Edit `backend/service/.env`:
```env
PORT=3006
SESSION_SECRET=your_long_random_secret_here   # Required for signed cookies
MONGODB_URI=mongodb+srv://...                 # Optional: enables MongoDB persistence
```

> **Note**: Without `MONGODB_URI`, the server automatically falls back to an in-memory session store and mock progress adapter. No external database setup is strictly required to run locally!

### 2. Install Dependencies

From the repository root:

```bat
install.bat
```

*This automatically installs dependencies in `backend/service` and `backend/gateway`.*

### 3. Start Services

From the repository root:

```bat
start.bat
```

*This launches both the **API Service** (port 3006) and the **Gateway Proxy** (port 3005) in dedicated terminal windows.*

### 4. Launch the App

Open your browser at:
👉 **[http://localhost:3005/](http://localhost:3005/)**

---

## 📁 Repository Structure

```
LanguageStudio/
├── ARCHITECTURE.md       # Detailed technical architecture & request call flow
├── README.md             # Main project documentation and presentation
├── install.bat           # Root dependency installation script
├── start.bat             # Root service launcher script
├── import_vocab.bat      # CLI batch tool to import CSV vocabulary into SQLite
│
├── backend/
│   ├── gateway/          # Reverse proxy, CORS enforcement & static file server (port 3005)
│   ├── service/          # Core REST API, auth, progress sync & payment engine (port 3006)
│   │   ├── config/       # Environment parsing & service configurations
│   │   ├── data/         # SQLite databases (vocab.db, content.sqlite)
│   │   └── src/          # Controllers, models, routes, middleware, and services
│   └── auth-service/     # Deprecated standalone service (consolidated into service/)
│
├── courses/              # Course definitions, grammar, vocab, and free lessons
│   ├── it/               # Italian course metadata, lessons, and i18n
│   ├── es/               # Spanish course metadata, lessons, and i18n
│   └── index.json        # Global catalog index of available courses
│
├── paid-content/         # Premium lesson definitions (isolated & entitlement-gated)
│   └── courses/          # Protected course lessons served only via /api/courses
│
├── frontend/
│   └── public/           # Client application assets
│       ├── css/          # Modular CSS (main.css, studio.css, lesson.css, etc.)
│       ├── js/           # Modern vanilla ES client logic (progress, auth, exercises)
│       ├── locales/      # UI translations (en.json, uk.json)
│       └── pages/        # Application views (home, lesson, dictionary, flashcards, etc.)
│
├── docs/                 # Complete technical documentation, guides, and specifications
│   ├── INDEX.md          # Master documentation index
│   ├── backend-services/ # Dedicated docs for every backend service (Gateway, Service, Auth)
│   └── frontend-pages/   # Dedicated docs for every frontend page (all 15 views)
└── scripts/              # Validation, course verification, and utility scripts
```

---

## 📚 Technical Documentation & Service Guides

Comprehensive, standalone reference documents are available in [`docs/`](./docs/INDEX.md) covering every layer of the application:

- **[Master Docs Index](./docs/INDEX.md)** — Complete catalog of all architectural, service, and page documents.
- **Backend Services**:
  - [Gateway Service (`:3005`)](./docs/backend-services/gateway.md)
  - [Content & Core API Service (`:3006`)](./docs/backend-services/content-service.md)
  - [Auth Service (`:3007`)](./docs/backend-services/auth-service.md)
- **Frontend Pages**:
  - [Landing Page (`index.html`)](./docs/frontend-pages/index.md)
  - [Home Dashboard (`pages/home.html`)](./docs/frontend-pages/home.md)
  - [Course Catalog (`pages/courses.html`)](./docs/frontend-pages/courses.md)
  - [Learning Path (`pages/path.html`)](./docs/frontend-pages/path.md)
  - [Lesson Runner (`pages/lesson.html`)](./docs/frontend-pages/lesson.md)
  - [Practice Exercises (`pages/exercises.html`)](./docs/frontend-pages/exercises.md)
  - [Flashcards (`pages/flashcards.html`)](./docs/frontend-pages/flashcards.md)
  - [Vocabulary Dictionary (`pages/dictionary.html`)](./docs/frontend-pages/dictionary.md)
  - [Grammar Guide (`pages/grammar.html`)](./docs/frontend-pages/grammar.md)
  - [Placement Test (`pages/placement-test.html`)](./docs/frontend-pages/placement-test.md)
  - [Tests & Assessments Hub (`pages/tests.html`)](./docs/frontend-pages/tests.md)
  - [Pricing & Plans (`pages/pricing.html`)](./docs/frontend-pages/pricing.md)
  - [Payment Simulator (`pages/checkout.html`)](./docs/frontend-pages/checkout.md)
  - [Authentication (`pages/auth.html`)](./docs/frontend-pages/auth.md)
  - [Settings & Profile (`pages/settings.html`)](./docs/frontend-pages/settings.md)

---

## 🧪 Testing & Validation

### Run Backend Test Suite

From `backend/service`:

```bash
npm test
```

Runs the built-in Node.js test runner across `test/*.test.js`, validating authentication, CSRF protection, lesson access gating, payment webhooks, and progress conflict merge algorithms.

### Content Validation Scripts

From the repository root:

```bash
# Validate course schema and JSON integrity
node scripts/validate-courses.mjs

# Verify all referenced icons exist
node scripts/check-icons.mjs
```

---

## 📄 License

This project is licensed under the MIT License.
