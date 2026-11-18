# Lesson Runner Page (`pages/lesson.html`)

- **File Path**: [`frontend/public/pages/lesson.html`](../../frontend/public/pages/lesson.html)
- **Routes**: `/lesson` or `/pages/lesson.html?course={courseId}&lesson={lessonId}`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/course.js`, `js/storage.js`, `js/progress-store.js`, `js/progress.js`, `js/layout.js`, `js/app.js`, `js/lesson-engine.js`, `js/lesson.js`
- **Styles**: `css/main.css`, `css/lesson.css`, `css/studio.css`

---

## 1. Overview & Purpose

The **Lesson Runner** is the core instructional execution screen of LanguageStudio. It powers interactive, step-by-step language lessons designed around conversational utility. The runner coordinates dialogue simulations, reading passages, audio pronunciation playback, lexical drills, and comprehension checks, saving completed progress and awarding XP upon lesson finish.

---

## 2. Key Sections & DOM Architecture

```
[Lesson Shell: .lesson-shell]
  ├── [Top Bar: .lesson-top]
  │     ├── Exit Button (.close-button) ──► Returns to pages/path.html
  │     ├── Progress Bar (#lesson-step-progress, #lesson-step-progress-fill)
  │     ├── Step Counter (#lesson-step-progress-label: e.g. "Step 3 of 7")
  │     └── Grammar Rules Button (#btnLessonRules: Unlocks upon lesson completion)
  │
  ├── [Lesson Content: #lessonMain]
  │     ├── [Hero Intro: #lessonHero]
  │     │     ├── Category Eyebrow (#heroLabel)
  │     │     ├── Lesson Title (#heroTitle: e.g. "Primo Incontro")
  │     │     ├── Description (#heroDescription)
  │     │     └── Meta Chips (#heroMeta: estimated minutes, vocabulary count)
  │     │
  │     ├── [Table of Contents Drawer: #lessonIndex] (Collapsible step index)
  │     │
  │     ├── [Dynamic Lesson Body: #lessonBody]
  │     │     └── Rendered sequentially by lesson-engine.js:
  │     │           ├── Dialogue Step
  │     │           ├── Vocabulary Spotlight
  │     │           ├── Grammar Insight
  │     │           └── Interactive Exercises
  │     │
  │     └── [Bottom Navigation: #lessonBottomNav]
  │           ├── Previous Step / Lesson (#btnPrevLessonBottom)
  │           └── Next Step / Lesson (#btnNextLessonBottom)
  │
  └── [Lesson Footer: .lesson-footer]
        └── Exit link with session status
```

---

## 3. Supported Content Blocks & Step Types

`js/lesson-engine.js` parses the lesson JSON definition and renders multimodal interactive blocks:

### 3.1 Dialogue Block (`type: "dialogue"`)
- Renders conversational exchanges between named characters in speech bubbles.
- Italian text with optional hidden translations revealed on tap/click.
- Audio playback icon to listen to native pronunciation.

### 3.2 Vocabulary Spotlight (`type: "vocabulary"`)
- Highlights key target phrases introduced in the lesson.
- Displays phonetics, gender, grammatical role, and real-life context notes.
- Provides a "Save to Dictionary" button adding the item to `progress_customwords`.

### 3.3 Grammar Insight (`type: "grammar"`)
- Clear, concise linguistic cheat-sheets (e.g. subject pronouns, verb conjugations).
- Formatted tables with color-coded stems and endings.

### 3.4 Interactive Exercise Types (`type: "exercise"`)
- **Multiple Choice**: Select correct translation or reply from 3–4 choices.
- **Fill in the Blank (Cloze)**: Type missing conjugated verb or select missing article from inline dropdown.
- **Word Reordering**: Arrange scrambled word tiles into a grammatically correct Italian sentence.
- **Matching Pairs**: Match Italian vocabulary with Ukrainian/English counterparts.

---

## 4. Execution Lifecycle & Progression

```
[1. Load Lesson Definition]
       │ Fetches /api/courses/:courseId/lessons/:lessonId
       │ (Content Service checks entitlement if lesson is in paid-content/)
       ├─► 401 / 403 ──► Redirects user to pages/pricing.html
       └─► 200 OK ─────► Passes lesson JSON to lesson-engine.js
             ▼
[2. Interactive Step Progression]
       │ User completes step (reads dialogue, answers exercise)
       │ - Correct answer: plays success chime, awards step XP, advances progress bar
       │ - Incorrect answer: explains rule, provides retry option
             ▼
[3. Final Step Completion]
       │ - Computes final score percentage
       │ - Awards full lesson XP bonus (e.g. +25 XP)
       │ - Updates user streak
       │ - Writes completion to localStorage (ls_italian_progress)
       │ - Syncs with backend: POST /api/progress/sync
       │ - Unlocks "Grammar Rules" button (#btnLessonRules)
             ▼
[4. Completion Summary & Next Lesson]
       │ Displays celebration screen with score summary
       └─► "Continue to Next Lesson" button points to next sequential lesson ID
```

---

## 5. Security & Entitlement Enforcement

1. **Server-Side Gate**: Free lessons live in `courses/{courseId}/lessons/*.json`. Premium lessons live in `paid-content/courses/{courseId}/lessons/*.json`.
2. The browser cannot fetch premium lessons by direct URL because the Gateway blocks `.json` static requests.
3. `/api/courses/:courseId/lessons/:lessonId` inspects the active `ls.sid` session:
   - If user is anonymous or lacks entitlement for that path, the backend returns `403 Forbidden` with `{ error: "Course or lesson requires active entitlement." }`.
   - The frontend intercepts the 403 status and displays a modal directing the learner to `pricing.html`.
