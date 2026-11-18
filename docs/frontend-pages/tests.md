# Tests & Assessments Hub (`pages/tests.html`)

- **File Path**: [`frontend/public/pages/tests.html`](../../frontend/public/pages/tests.html)
- **Routes**: `/tests` or `/pages/tests.html`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/course.js`, `js/storage.js`, `js/progress-store.js`, `js/progress.js`, `js/layout.js`, `js/app.js`, `js/path-assessment.js`, `js/tests.js`
- **Styles**: `css/main.css`, `css/tests.css`, `css/studio.css`

---

## 1. Overview & Purpose

The **Tests & Assessments Hub** serves as the central directory for all testing instruments in LanguageStudio. It provides access to the entry-level diagnostic Placement Test as well as milestone-based **Final Path Assessments** that evaluate comprehension across entire completed learning tracks.

---

## 2. Key Sections & DOM Architecture

```
[Navigation: data-component="navbar"]

[Main Container: .tests-page]
  ├── [1. Diagnostic Assessments Grid: .assessment-type-grid]
  │     └── Placement Test Card (.placement-card)
  │           ├── Icon ([data-icon="target"])
  │           ├── Eyebrow: "ПЕРЕД НАВЧАННЯМ"
  │           ├── Title: "Тест на визначення рівня"
  │           ├── Description: "Пройдіть початкове оцінювання, щоб зрозуміти свій рівень..."
  │           └── Footer: Status Pill ("Доступно") & CTA Button ──► pages/placement-test.html
  │
  └── [2. Path Assessments Section: #path-assessments]
        ├── Section Heading: "ФІНАЛЬНА ПЕРЕВІРКА" / "Фінальні тести напрямків"
        └── Dynamic Assessment Grid: #pathAssessmentList
              └── Populated by js/tests.js & js/path-assessment.js:
                    ├── Unlocked Milestone Test Card (e.g. "Основи спілкування — Фінальний тест")
                    │     ├── Prerequisites Check: All Unit lessons completed
                    │     ├── Passing Criteria: 80% passing threshold
                    │     └── Action: "Розпочати тестування"
                    └── Locked Milestone Test Card
                          ├── Status: Locked (Padlock icon)
                          └── Note: "Завершіть усі уроки напрямку, щоб розблокувати"

[Footer: data-component="footer"]
[Profile Modal: data-component="profile-modal"]
```

---

## 3. Dynamic Milestone Discovery (`js/path-assessment.js`)

1. **Course Structure Inspection**:
   - Queries `courses/{courseId}/course.json` to discover all configured learning paths (e.g. `communication-basics`, `travel-situations`, `italian-reading`).
2. **Prerequisite Verification**:
   - Checks the user's completed lessons set (`progress_lessons` in `progress-store.js`).
   - If 100% of the lessons belonging to that path are marked `completed: true`, the final assessment card transitions to `active`.
   - If lessons are still pending, the card displays a progress bar (e.g. `"3 / 6 уроків пройдено"`) and remains disabled.
3. **Assessment Execution & Certification**:
   - Running the test presents a rigorous 15–20 question randomized exam.
   - Scoring ≥ 80% marks the path as **Mastered**, awards a milestone badge to the user's profile, and records the score in `progress_profiles`.

---

## 4. User Workflows

- **Initial Level Calibration**: Learner navigates from the home dashboard, clicks the Placement Test card, and completes the diagnostic assessment.
- **Milestone Graduation**: Learner completes the last lesson of "Travel & Conversation", visits the Tests page, takes the Final Travel Exam, passes with 90%, and unlocks their completion badge.
