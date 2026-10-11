# LanguageStudio

A concept for a structured Italian course that combines short lessons with 
interactive practice — instead of the scattered vocab lists and standalone quizzes 
most free language sites offer.

## The idea

Each lesson follows the same four-step loop: a real dialogue, a short grammar 
breakdown, guided drills, and a mini-game checkpoint. The goal is a linear, 
teacher-style curriculum rather than an open shelf of disconnected exercises — 
you unlock the next lesson instead of picking randomly.

Practice happens across a few connected tools that all pull from the same word/lesson 
data: flashcards, a multi-format exercise bank (multiple choice, fill-in-blank, 
matching, sentence building, listening, dialogue), a personal dictionary you can add 
words to, and a quick reaction-time game. XP and streaks tie it together.

## Structure

- `backend/service/` — Node.js / Express backend service
  - `src/server.js` — Main server entry point
  - `src/controllers/authController.js` — Authentication controller
  - `src/routes/auth.js` — Authentication POST route (`/login`)
  - `src/routes/pageroutes.js` — Page GET routes
- `frontend/public/` — Static client assets and pages
  - `index.html` — Home page / learning roadmap
  - `pages/` — Units, flashcards, tasks, dictionary, grammar, auth
  - `components/` — Modular reusable HTML components
  - `js/` — Client-side scripts and helpers
  - `css/` — Shared design system and per-page stylesheets
  - `assets/` — Images and icons

## Current state

- Express backend serving static client files and handling `/login` authentication
- One full lesson built (Communication basics); other tracks are structured
- Progress/XP/dictionary stored in browser `localStorage`, with backend auth route ready
## Component Architecture

Reusable UI parts are modularized into the `components/` directory:
- `components/navbar.html`: Main top navigation bar with dropdown menus, theme toggle, student profile widget, and mobile drawer.
- `components/footer.html`: Global footer with navigation links and copyright.
- `components/mobile-nav.html`: Standalone mobile drawer navigation.
- `components/student-widget.html`: Reusable streak and XP avatar badge.
- `components/profile-modal.html`: Standalone student profile settings & statistics modal dialog.
- `components/auth-header.html`: Minimal topbar for authentication pages.
- `components/head.html`: Shared meta tags, favicon, Google Fonts, and core stylesheets.

Components are loaded via `<div data-component="component-name"></div>` placeholders using `js/components.js`. It provides automatic directory-depth prefixing (`../`), active link highlighting, zero-FOUC instant rendering, and local `file:///` offline fallback support.