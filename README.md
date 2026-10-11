# LanguageStudio

An interactive Italian learning platform that combines structured, teacher-curated lessons with modular practice tools — replacing disjointed vocab lists with a cohesive, linear curriculum.

---

## 💡 The Core Idea

Each lesson guides learners through a proven multi-step learning loop:
1. **Contextual Dialogue & Stories**: Authentic conversational Italian with pronunciation guides and localized translations.
2. **Grammar & Vocabulary Breakdown**: Structured conjugations, rule explanations, and interactive vocabulary hints.
3. **Cultural Context**: Curated cultural notes and etiquette insights.
4. **Interactive Checkpoint**: Integrated multi-format quizzes (multiple choice, true/false, fill-in-the-blank) with instant feedback and XP rewards.

Learners progress through units linearly, unlocking lessons, maintaining daily streaks, and building a personalized dictionary.

---

## ⚙️ How the System Works

### 1. Dynamic Block Lesson Engine
Rather than relying on static HTML files for every lesson, the platform uses a unified, data-driven lesson engine:
- **Lesson Registry (`frontend/public/js/data/lessons.js`)**: All lessons are defined in `window.LS_LESSONS` as structured configuration objects. Each lesson specifies metadata (`id`, `unitId`, `title`, `duration`, `xpReward`, `nextLessonId`, `prevLessonId`) and an array of modular `sections`.
- **Supported Section Types**:
  - `dialogue`: Multi-speaker conversations with avatars, audio playback, phonetics, and expandable translations.
  - `story_text`: Reading passages with inline vocabulary tooltips and explanations.
  - `vocab`: Essential terms with phonetics, example sentences, and audio triggers.
  - `grammar_rule`: Grammar explanations and formatted tables (conjugations, articles, pronouns).
  - `culture_note`: Contextual Italian cultural and etiquette notes.
  - `takeaways`: Key bullet-point lesson summaries.
  - `quiz`: Interactive checkpoint questions with auto-grading, explanations, and completion celebration.
- **Universal Page Renderer (`frontend/public/pages/lesson.html` & `js/lesson-engine.js`)**:
  - Lessons are loaded dynamically via URL parameter: `lesson.html?id=<lessonId>` (e.g., `lesson.html?id=communication-basics-1`).
  - The engine reads the lesson definition, dynamically renders the curriculum sidebar navigation, compiles the content blocks, and binds interactive handlers.

### 2. Multi-Language & Reactive Localization (i18n)
The application supports multiple native interface languages (Ukrainian `uk`, English `en`, Polish `pl`):
- **Lesson Content Localization**: All text fields in `lessons.js` support multilingual translation objects (`translations: { uk: "...", en: "...", pl: "..." }`). The lesson engine dynamically resolves text using `t(translatable)` based on the active language.
- **Global UI Localization (`js/app.js`)**:
  - Features a centralized bidirectional translation map (`UI_I18N`) and helper `getInterfaceTranslation()`.
  - DOM text nodes are updated via `TreeWalker`, preserving whitespace and UI layout integrity.
  - **Learning Content Isolation**: Target Italian content (e.g., `.dialogue-it`, `.dialogue-phon`, Italian examples) is strictly excluded from UI translation to preserve study material.
- **Event-Driven Reactivity**:
  - When the user changes their language in Settings, `setSourceLanguage(lang)` stores the preference and dispatches a global `sourceLanguageChanged` event.
  - The lesson engine, roadmap path (`path.js`), navigation bars, and modals subscribe to this event and re-render/translate instantly without requiring a page reload.

### 3. Modular Component Architecture
Reusable interface elements are organized as HTML partials under `frontend/public/components/`:
- `navbar.html`: Main navigation bar with dropdown menus, theme toggles, user streak/XP badges, and mobile drawer.
- `footer.html`: Global footer with section links and copyright.
- `mobile-nav.html`: Standalone responsive navigation drawer.
- `student-widget.html`: User progress, streak count, and XP counter.
- `profile-modal.html`: Modal dialog for student stats, learning streak, and language/theme preferences.
- `auth-header.html`: Clean header for login and registration screens.
- `head.html`: Shared meta tags, fonts, icons, and base stylesheet imports.

Components are included declaratively using `<div data-component="component-name"></div>` placeholders. Loaded by `frontend/public/js/components.js`, which handles:
- Automatic path depth resolution (`../` handling based on nesting level).
- Active route highlighting.
- Zero-FOUC (Flash of Unstyled Content) rendering.
- Offline and local `file:///` protocol compatibility.
- Dispatching `componentsLoaded` event so dynamic scripts and i18n run after partials mount.

### 4. Client State & Progress Tracking
- User progress, XP, completed lessons, streak count, and UI preferences (theme, interface language) are managed client-side using `localStorage`.
- Ready for backend synchronization with the Express authentication and user service.

---

## 📁 Project Structure

```text
LanguageStudio/
├── backend/
│   └── service/
│       └── src/
│           ├── server.js               # Express application entry point
│           ├── controllers/            # Auth and user controllers
│           └── routes/                 # API and page routes (/login, /)
├── frontend/
│   └── public/
│       ├── index.html                  # Landing page & learning tracks
│       ├── pages/
│       │   ├── lesson.html             # Universal dynamic lesson viewer
│       │   ├── path.html               # Learning roadmap / curriculum tree
│       │   ├── exercises.html          # Interactive practice exercise bank
│       │   ├── flashcards.html         # Vocabulary flashcards & spaced review
│       │   ├── dictionary.html         # Personal vocabulary dictionary
│       │   ├── grammar.html            # Reference grammar guides
│       │   ├── tests.html              # Unit tests & assessments
│       │   └── auth.html               # Login and registration
│       ├── components/                 # Modular HTML partials (navbar, footer, modal...)
│       ├── css/                        # Core stylesheets & design tokens
│       ├── js/
│       │   ├── app.js                  # Global application logic & i18n hub
│       │   ├── components.js           # Component loader & navigation controller
│       │   ├── lesson-engine.js        # Dynamic block lesson rendering engine
│       │   ├── path.js                 # Learning path roadmap logic
│       │   ├── theme.js                # Dark/light theme manager
│       │   └── data/
│       │       └── lessons.js          # Centralized registry of lessons & curriculum
│       └── assets/                     # Images, illustrations, and media
└── LESSON_ARCHITECTURE_PLAN.md         # Architecture blueprint & implementation specs
```
