# Home Dashboard (`pages/home.html`)

- **File Path**: [`frontend/public/pages/home.html`](../../frontend/public/pages/home.html)
- **Routes**: `/home` or `/pages/home.html`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/layout.js`, `js/course.js`, `js/storage.js`, `js/progress-store.js`, `js/progress.js`, `js/app.js`, `js/path-connectors.js`, `js/path-progress.js`, `js/index.js`
- **Styles**: `css/main.css`, `css/index.css`, `css/studio.css`

---

## 1. Overview & Purpose

The **Home Dashboard** is the daily cockpit for active learners. Upon returning to LanguageStudio, learners land here to inspect their daily streak, check progress against today's XP goal, pick up their next sequential lesson from the curriculum roadmap, or jump directly into practice drill modes.

---

## 2. Key Sections & DOM Architecture

```
[Navigation: data-component="navbar"]
  └── Injected by components.js (Course switcher, streak counter, total XP badge, profile avatar)

[Main Dashboard: .home-dashboard]
  ├── [1. Intro Banner: .dashboard-intro]
  │     ├── Eyebrow: "YOUR ITALIAN JOURNEY"
  │     ├── Title: "Your Italian learning space"
  │     └── Action Link: "Explore your learning path" ──► pages/path.html
  │
  ├── [2. Progress Metrics Grid: .dashboard-progress-grid]
  │     ├── Card 1: Today's Goal (#dashboardGoalCard)
  │     │     ├── XP Metric: e.g. "20 / 50 XP"
  │     │     ├── Progress Bar (#dashboardGoalBar, #dashboardGoalFill)
  │     │     └── Goal Note (#dashboardGoalNote: "30 XP to reach your goal")
  │     ├── Card 2: Current Streak (#dashboardStreakValue: e.g. "5 days")
  │     ├── Card 3: Lessons Completed (#dashboardLessonsValue: e.g. "8 / 24")
  │     └── Card 4: Total XP (#dashboardXpValue: e.g. "450 XP")
  │
  ├── [3. Course Roadmap Preview: #roadmapRoot]
  │     └── Injected dynamically by index.js and path-progress.js:
  │           - Visual lesson nodes connected by SVG arcs
  │           - "Resume Next Lesson" pulse button
  │
  └── [4. Practice Tools Hub: .home-practice]
        ├── Flashcards Card ──► pages/exercises.html?mode=flashcards
        ├── Exercises Card  ──► pages/exercises.html
        ├── My Dictionary   ──► pages/dictionary.html
        ├── Grammar Guide   ──► pages/grammar.html
        └── Tests Hub       ──► pages/tests.html

[Footer: data-component="footer"]
[Profile Modal: data-component="profile-modal"]
```

---

## 3. Dynamic Data Flow & Script Execution

1. **Course Resolution (`js/course.js`)**:
   - Inspects URL parameter `?course=...` or reads `localStorage.getItem('ls_course')` (defaulting to `'it'`).
   - Fetches course metadata from `courses/{courseId}/course.json` or `/api/courses/{courseId}`.
2. **Progress Hydration (`js/progress-store.js` & `js/progress.js`)**:
   - Loads offline user progress from `ls_{courseId}_progress` in `localStorage`.
   - Calculates today's earned XP by comparing timestamps against midnight.
   - Computes daily streak (incremented if active today or yesterday; reset if gap exceeds 48 hours).
   - If user is authenticated, dispatches asynchronous background sync to `/api/progress/sync`.
3. **Roadmap Node Rendering (`js/index.js`, `js/path-connectors.js`)**:
   - Queries completed lesson IDs from the progress store.
   - Identifies the first uncompleted lesson in sequence and marks it as `active`.
   - Draws SVG connection splines between lesson circles.
   - Clicking an active or completed lesson navigates to `pages/lesson.html?course=it&lesson={lessonId}`.

---

## 4. State Management & Storage Keys

| Key | Scope | Description |
|---|---|---|
| `ls_course` | `localStorage` | Active course ID (`'it'`). |
| `ls_italian_progress` | `localStorage` | Serialized progress object (lessons completed, XP total, daily XP logs). |
| `ls_daily_goal` | `localStorage` | Target daily XP goal (default: `50 XP`, editable in Settings). |
| `ls_streak` | `localStorage` | Active consecutive days streak counter. |

---

## 5. User Workflows

- **Continue Curriculum**: Learner clicks the prominent "Continue" lesson node in `#roadmapRoot` → Lands on `lesson.html`.
- **Review Vocabulary**: Learner clicks "Flashcards" card in Practice Hub → Lands on `pages/exercises.html?mode=flashcards`.
- **Targeted Practice**: Learner clicks "Exercises" card → Lands on `exercises.html`.
- **Inspect Account**: Learner clicks profile avatar in navbar → Opens Profile Modal showing level stats, badges, and cloud sync status.
