# Grammar Guide Page (`pages/grammar.html`)

- **File Path**: [`frontend/public/pages/grammar.html`](../../frontend/public/pages/grammar.html)
- **Routes**: `/grammar` or `/pages/grammar.html`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/course.js`, `js/storage.js`, `js/progress-store.js`, `js/progress.js`, `js/layout.js`, `js/app.js`, `js/blocks.js`, `js/grammar.js`
- **Styles**: `css/main.css`, `css/grammar.css`, `css/studio.css`

---

## 1. Overview & Purpose

The **Grammar Guide Page** is the central grammatical reference handbook for LanguageStudio. Rather than burying linguistic rules inside sequential lesson flows, this reference hub provides clean, color-coded tables, cheat sheets, and practical usage tips covering the structural fundamentals of Italian (articles, auxiliary verbs, regular verb conjugations, prepositions, and formal etiquette).

---

## 2. Key Sections & DOM Architecture

```
[Navigation: data-component="navbar"]

[Hero: .page-hero]
  ├── Eyebrow: "Граматичні шпаргалки"
  ├── Title: "Довідник граматики"
  └── Description: "Швидкий доступ до основних правил італійської мови: артиклі, форми дієслів та етикетні вирази."

[Main Stage: .page-container]
  └── [Grammar Card: .grammar-card]
        ├── [Tabs Header: #grammarTabs]
        │     └── Dynamically generated tab buttons:
        │           ├── Tab 1: Articles ("Артиклі: il, lo, la, i, gli, le")
        │           ├── Tab 2: Verbs ("Дієслова: Essere та Avere")
        │           ├── Tab 3: Regular Conjugations ("-are, -ere, -ire")
        │           ├── Tab 4: Prepositions ("Прийменники: di, a, da, in, con, su, per, tra/fra")
        │           └── Tab 5: Polite Speech ("Формальне спілкування (Lei)")
        │
        └── [Grammar Body: #grBody]
              └── Rendered by js/grammar.js & js/blocks.js:
                    ├── Rule Explanation Banner
                    ├── Structural Table (Color-coded stems, endings, gender markers)
                    ├── Example Sentences (Italian phrase + Ukrainian/English meaning)
                    └── Direct Lesson Link ("Practice this in Lesson 3" ──► pages/lesson.html)

[Footer: data-component="footer"]
[Profile Modal: data-component="profile-modal"]
```

---

## 3. Data Structure & Modular Rendering

1. **Grammar Data Loading (`js/grammar.js`)**:
   - Reads `courses/{courseId}/grammar.json`.
   - Parses sections, each having `id`, `title`, `summary`, `tables`, and `examples`.
2. **Visual Table Generation (`js/blocks.js`)**:
   - Compiles structured Markdown or JSON data into styled HTML tables.
   - Highlights inflectional suffixes (e.g. `parl-o`, `parl-i`, `parl-a`, `parl-iamo`, `parl-ate`, `parl-ano`).
   - Uses contrasting colors to distinguish masculine (`il`, `lo`, `un`) and feminine (`la`, `una`) markers.
3. **Tab State & URL Persistence**:
   - Tab switching updates the URL hash (e.g. `pages/grammar.html#verbs`) so learners can bookmark specific rules or link to them directly from lessons.

---

## 4. User Workflows

- **Quick Consultation During Study**: Learner encounters an unfamiliar verb ending while doing an exercise, opens Grammar Guide in a new tab, verifies the conjugation table, and returns to their exercise.
- **Systematic Grammar Review**: Learner reads through the Prepositions tab to understand articulated prepositions (`in + il = nel`, `a + la = alla`).
- **Jump to Practice**: Learner finishes reading a rule and clicks the embedded link to practice that specific topic in `pages/exercises.html` or `pages/lesson.html`.
