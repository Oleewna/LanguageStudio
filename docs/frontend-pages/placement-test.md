# Placement Test Page (`pages/placement-test.html`)

- **File Path**: [`frontend/public/pages/placement-test.html`](../../frontend/public/pages/placement-test.html)
- **Routes**: `/placement-test` or `/pages/placement-test.html`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/layout.js`, `js/placement-test.js`
- **Styles**: `css/main.css`, `css/tests.css`, `css/studio.css`

---

## 1. Overview & Purpose

The **Placement Test Page** is the primary onboarding and diagnostic funnel for new learners. It identifies the learner's baseline proficiency (CEFR level A1, A2, etc.), determines their personal learning objectives (Travel, Reading, Business, or Fundamentals), and generates a tailored course recommendation that connects directly into the monetization flow (`pricing.html`).

---

## 2. Key Sections & 3-Step Architecture

```
[Navigation: data-component="navbar"]

[Main Container: .placement-test-shell]

  ├── [STEP 0: Goal & Path Selection (#stepGoals)]
  │     ├── Header: "КРОК 1 З 3" / "Що ви хочете вивчити?"
  │     ├── Description: "Оберіть одну або кілька цілей — ми підберемо навчальний план..."
  │     ├── Goals Grid (#goalGrid):
  │     │     ├── Goal 1: Short Stories & Reading ([data-goal="reading"])
  │     │     ├── Goal 2: Travel & Conversation ([data-goal="travel"])
  │     │     ├── Goal 3: Grammar & Fundamentals ([data-goal="grammar"])
  │     │     └── Goal 4: Work & Business ([data-goal="business"])
  │     ├── Footer Controls: Selection Hint (#goalsHint) & Next Button (#goalsNextBtn)
  │     └── Meta Chips: "Для початківців" / "Без реєстрації"
  │
  ├── [STEP 1: 5-Question Proficiency Quiz (#stepQuiz)] (hidden initially)
  │     ├── Header: "ВИЗНАЧЕННЯ РІВНЯ" / "Швидка перевірка перед початком"
  │     ├── Card Topline: Question Counter (#quizCounter: "Питання 1 з 5"), Difficulty Badge (#quizDifficulty)
  │     ├── Flag Badge (#quizFlag: "Italiano")
  │     ├── Question Prompt (#quizQuestionText)
  │     ├── Options Grid (#quizOptions): 4 selectable choice cards
  │     └── Footer Controls: Progress Note & Next Question Button (#quizNextBtn)
  │
  └── [STEP 2: Personalized Results Screen (#stepResults)] (hidden initially)
        ├── Header: "ВАШ РЕЗУЛЬТАТ" / "Ваш рівень визначено!"
        ├── Results Card (.pt-results-card):
        │     ├── Level Badge Block: CEFR Level Badge (#resultBadge: e.g. "A1", "A2")
        │     ├── Level Details (#resultLevelLabel: "Початківець", #resultLevelDesc: "A1 — Elementary")
        │     ├── Chosen Paths Block (#resultPathsList: Badges for selected goals)
        │     ├── Accuracy Score (#resultScore: e.g. "4 з 5 правильних відповідей")
        │     └── Primary CTA (#resultCtaBtn: "Розблокувати мій навчальний план" ──► pages/pricing.html)
        └── Restart Action: "Пройти тест знову" (#restartBtn)

[Footer: data-component="footer"]
[Profile Modal: data-component="profile-modal"]
```

---

## 3. Step Execution Lifecycle

```
[Step 0: Select Goals]
   │ Learner picks 1 or more target paths (e.g. Travel + Reading)
   │ - Clicks "Далі" (#goalsNextBtn)
   │ - Stores selected goals into sessionStorage: ls_pt_goals
   ▼
[Step 1: Diagnostic Quiz]
   │ Runs through 5 calibrated linguistic questions:
   │ 1. Basic greeting / formulaic reply
   │ 2. Definite article selection
   │ 3. Essential verb conjugation (essere / avere)
   │ 4. Situational comprehension (ordering in a cafe)
   │ 5. Short dialogue reading comprehension
   │ - Tracks correct / incorrect tally
   ▼
[Step 2: Scoring & Recommendation]
   │ Calculates proficiency:
   │ - 0–2 correct: A1 Beginner
   │ - 3–4 correct: A1+ Elementary
   │ - 5 correct: A2 Intermediate
   │ Stores level into sessionStorage: ls_pt_level
   │ - Populates result badges and personalized learning summary
   │ - Configures CTA link: pages/pricing.html?course=it&tier=recommended
```

---

## 4. State Handoff to Pricing & Checkout

The goals and level determined on this page persist in the client session:
- `sessionStorage.setItem('ls_pt_goals', JSON.stringify(selectedGoals))`
- `sessionStorage.setItem('ls_pt_level', determinedLevel)`

When the learner clicks `#resultCtaBtn`, they are redirected to `pages/pricing.html`:
- `pricing.html` reads `ls_pt_goals`.
- Dynamically highlights the **Targeted Path Pass** matching the learner's chosen goals.
- Pre-populates the checkout payload with those specific learning paths.

---

## 5. User Workflows

- **First-Time Visitor**: Lands from `index.html`, completes the 2-minute diagnostic, discovers their baseline level, and receives a curated roadmap without needing an account.
- **Retake Assessment**: Learner clicks "Пройти тест знову" to reset answers and recalibrate their proficiency score.
