# Practice & Exercises Hub (`pages/exercises.html`)

- **File Path**: [`frontend/public/pages/exercises.html`](../../frontend/public/pages/exercises.html)
- **Routes**: `/exercises` or `/pages/exercises.html` (supports `?mode=exercises` and `?mode=flashcards`)
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/course.js`, `js/storage.js`, `js/progress-store.js`, `js/progress.js`, `js/layout.js`, `js/app.js`, `js/user-vocab.js`, `js/exercises.js`
- **Styles**: `css/main.css`, `css/exercises.css`, `css/flashcards.css`, `css/studio.css`

---

## 1. Overview & Purpose

The **Practice Hub** is LanguageStudio's consolidated training arena. It combines interactive targeted exercise drills and the 3D spaced repetition flashcard memory trainer into a unified, responsive interface with dual practice modes. 

Learners can switch seamlessly between comprehensive quiz challenges (multiple choice, fill-in-the-blank, word matching, sentence reordering, audio listening, and dialogues) and interactive flashcard vocabulary drills, all without leaving the page.

---

## 2. Dual-Mode Architecture & Mode Switcher

The top of the page features a prominent mode switcher that toggles between the two practice systems:

```html
<nav class="practice-mode-nav" id="practiceModeNav" aria-label="Practice mode">
  <button type="button" class="practice-mode-tab active" data-practice-mode="exercises" onclick="switchPracticeMode('exercises')">
    <span data-icon="exercises"></span>
    <span data-i18n="exercises.tabExercises">Exercises</span>
  </button>
  <button type="button" class="practice-mode-tab" data-practice-mode="flashcards" onclick="switchPracticeMode('flashcards')">
    <span data-icon="flashcards"></span>
    <span data-i18n="exercises.tabFlashcards">Flashcards</span>
  </button>
</nav>
```

- **URL Parameter Support**: Navigating to `exercises.html?mode=flashcards` automatically activates the Flashcards view on load.
- **State Persistence**: Switching modes updates the active class, hides the inactive container (`#mode-exercises` or `#mode-flashcards`), and reinitializes the relevant trainer.

---

## 3. Exercises Mode (`#mode-exercises`)

### 3.1 Exercise Type Tabs
Exercises are categorized into 7 distinct practice types accessible via `#exTabsNav`:

| Tab Key | Exercise Type | Description |
|---|---|---|
| `mcq` | **Multiple Choice** | Standard 4-option translation and comprehension questions. |
| `blank` | **Fill in the Blank** | Complete sentences by selecting or typing missing words. |
| `match` | **Word Matching** | Match Italian words to Ukrainian/English translations in pairs. |
| `reorder` | **Sentence Builder** | Assemble scrambled word chips into grammatically correct sentences. |
| `listen` | **Listening Practice** | Listen to native speech audio and identify or transcribe the phrase. |
| `dialogue` | **Dialogue Completion** | Contextual conversation bubbles testing conversational responses. |
| `dict` | **From Dictionary** | Drills generated directly from the learner's personal saved dictionary notebook. |

### 3.2 Panel Containers
Each tab maps to a dedicated container panel (`#panel-mcq`, `#panel-blank`, etc.) dynamically populated by `js/exercises.js`:
- Real-time validation checks answers immediately.
- Explanatory feedback hints illustrate grammatical reasoning.
- Correct answers award XP (+2 XP per drill) synced with `progress-store.js` and daily goals.

---

## 4. Flashcards Mode (`#mode-flashcards`)

The flashcard engine provides a full 3D interactive flip card memory trainer (consolidating the former standalone `flashcards.html` page).

### 4.1 DOM Structure & Controls

```
[Flashcards Mode: #mode-flashcards]
  ├── [3D Flip Card Stage: .fc-stage]
  │     └── Rotator Card (#fcInner)
  │           ├── [Front Face: .fc-front]
  │           │     ├── Metadata Tags: Unit (#fcUnitTag), Topic (#fcTopicTag)
  │           │     ├── Target Word: #fcWord (e.g. "Buongiorno")
  │           │     ├── Pronunciation: #fcPronunciation (e.g. "[bwon-DJOR-no]")
  │           │     └── Flip Cue: <span data-icon="tap">
  │           │
  │           └── [Back Face: .fc-back]
  │                 ├── Translation: #fcTrans (Ukrainian / English)
  │                 ├── Example Context: #fcExample (Sentence with translation)
  │                 └── Flip Back Cue
  │
  ├── [Deck Empty Banner: #fcEmptyNote] (Shown when no cards are due or match criteria)
  │
  ├── [Playback Controls: .fc-controls]
  │     ├── Previous Button ([data-icon="arrow-left"])
  │     ├── Deck Counter Badge: #fcCounter (e.g. "12 / 48")
  │     ├── Next Button ([data-icon="arrow-right"])
  │     ├── Audio Pronunciation Button: .audio-btn ([data-icon="audio"])
  │     └── Shuffle Deck Button: .fc-shuffle-btn ([data-icon="shuffle"])
  │
  └── [Mastery Review Controls: .fc-review-controls]
        └── "Mark as learned" Toggle Button (#fcMarkLearned)
```

### 4.2 Spaced Repetition Mechanics
- **Flip Interaction**: Tapping the card toggles `.flipped` with 3D CSS transform (`transform: rotateY(180deg)`). Keyboard shortcuts `Space` or `Enter` flip; `ArrowLeft` and `ArrowRight` navigate.
- **Audio Speech**: The audio button triggers native `SpeechSynthesis` (`it-IT`) or plays audio assets from `courses/{courseId}/audio/`.
- **Mastery Tracking**: Marking a card as learned increments `correctCount` in `progress_wordstats` and doubles the review interval (`intervalDays = intervalDays * 2`), auto-synced via `POST /api/progress/sync`.

---

## 5. Internationalization (i18n) Integration

The page is fully localized using `data-i18n` attributes across both modes:
- Page title: `data-i18n="exercises.pageTitle"`
- Hero tags: `data-i18n="exercises.heroLabel"`, `data-i18n="exercises.heroTitle"`, `data-i18n="exercises.heroDesc"`
- Mode tabs: `data-i18n="exercises.tabExercises"`, `data-i18n="exercises.tabFlashcards"`
- Exercise tabs: `data-i18n="exercises.tabMcq"`, `data-i18n="exercises.tabMatch"`, etc.
- Flashcard actions: `data-i18n="exercises.fcShuffle"`, `data-i18n="exercises.fcMarkLearned"`, etc.

---

## 6. User Workflows

1. **Targeted Grammar Drill**: Learner selects "Exercises" mode, clicks "Sentence Builder" (`reorder`), and reconstructs Italian phrases.
2. **Daily Vocabulary Retention**: Learner opens `exercises.html?mode=flashcards` from the home dashboard or navbar, flips through due words, listens to pronunciation, and marks mastered items.
3. **Personal Dictionary Practice**: Learner switches to the "From Dictionary" tab (`dict`) to exclusively test words bookmarked during lesson reading.
