# Course Catalog Page (`pages/courses.html`)

- **File Path**: [`frontend/public/pages/courses.html`](../../frontend/public/pages/courses.html)
- **Routes**: `/courses` or `/pages/courses.html`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/course.js`, `js/storage.js`, `js/progress-store.js`, `js/progress.js`, `js/layout.js`, `js/app.js`, `js/courses.js`
- **Styles**: `css/main.css`, `css/studio.css`

---

## 1. Overview & Purpose

The **Course Catalog** is the multi-language curriculum directory for LanguageStudio. It displays all available language learning tracks, indicates their availability status (Active vs Coming Soon), and allows learners to switch their current active study language while guaranteeing that user progress, vocabulary banks, and XP remain cleanly isolated per course.

---

## 2. Key Sections & DOM Architecture

```
[Navigation: data-component="navbar"]

[Main Container: .course-page]
  ├── [Header: .course-page-header]
  │     ├── Eyebrow: "LanguageStudio"
  │     ├── Title: "Choose a language"
  │     └── Description: "Switch between course packs while keeping progress isolated by course."
  │
  └── [Course Grid: #courseList]
        └── Dynamically populated by courses.js:
              ├── Course Card (.course-card)
              │     ├── Head: Flag icon, Status pill ("Активний" / "Незабаром"), Language Name
              │     ├── Native Language Name (.course-native: e.g. "ITALIANO")
              │     ├── Meta: Course code (e.g. "IT"), Availability ("Готово" / "Заблоковано")
              │     └── Switch Button: [data-course-select="it"]
              └── Placeholder or error banner if course index cannot be retrieved.

[Footer: data-component="footer"]
[Profile Modal: data-component="profile-modal"]
```

---

## 3. Dynamic Behavior & Logic Flow

1. **Catalog Retrieval (`js/courses.js`)**:
   - Calls `window.loadCourseIndex()` (provided by `course.js`).
   - Retrieves `courses/index.json` or `/api/courses`.
   - Parses the list of courses with metadata: `id`, `name`, `native`, `flag`, `status`.
2. **Card Generation**:
   - Compares each course's `id` against the currently active course (resolved via `window.getCourseId()` or `localStorage.getItem('ls_course')`).
   - Active course card receives the `.active` CSS class and renders the button label: *"Поточний курс" (Current Course)*.
   - Inactive or locked courses render as disabled with badge *"Незабаром" (Coming Soon)*.
3. **Course Switching Execution**:
   - Clicking a course button triggers `window.setTargetCourse(nextCourse)`.
   - Saves `nextCourse` to `localStorage.setItem('ls_course', nextCourse)`.
   - Re-initializes progress stores with course-specific namespace `ls_{nextCourse}_progress`.
   - Redirects user to `pages/home.html?course={nextCourse}`.

---

## 4. Progress Isolation Strategy

A core architectural principle of LanguageStudio is strict data isolation between courses:
- Progress in Italian (`courseId: 'it'`) is stored under key `ls_italian_progress`.
- Progress in Spanish or French is stored under separate keys (e.g. `ls_es_progress`, `ls_fr_progress`).
- Switching courses does not wipe, mix, or overwrite streaks or vocabulary from other language tracks.

---

## 5. User Workflows

- **Browse Available Tracks**: Learner views catalog to see supported languages.
- **Switch Language**: Learner clicks "Перейти на цей курс" on another active language card → Interface immediately context-switches and redirects to the new course dashboard.
