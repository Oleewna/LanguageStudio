# Multi-Course Implementation Plan

Goal: turn LanguageStudio from an Italian-only prototype into an **engine + course packs** platform, where every language ships its own vocabulary, grammar, exercises, games, and lessons.

> **How to use this document:** tell the AI "do step N in docs/MULTI_COURSE_PLAN.md". Each step is self-contained, leaves the site working, and ends with a "Done when" checklist. Do steps in order. Tick the box in the progress list when a step is finished.

## Progress

- [x] Step 1: Schemas and folder layout
- [x] Step 2: Course state and namespaced storage
- [x] Step 3: Shared layout (nav, footer, profile modal)
- [x] Step 4: Vocabulary to JSON
- [x] Step 5: Grammar to JSON blocks
- [x] Step 6: Exercises to JSON
- [x] Step 7: Units page and home page from course data
- [ ] Step 8: Generic lesson engine
- [ ] Step 9: Course switcher and per-course settings
- [ ] Step 10: Second course (Polish) to test the schema
- [ ] Step 11: Validation script and authoring guide

---

## Ground rules (apply to every step)

1. **Italian must look and behave the same after every step.** Refactor, don't redesign.
2. **Stay static:** vanilla HTML/CSS/JS, no build step, no framework. Data loads with `fetch()`. Note: `fetch` does not work from `file://`, so test with a local server (`npx serve` or `python -m http.server`) and document this in the README.
3. **Two language axes, never mixed:**
   - *Target language* = the course (`it`, `es`, ...).
   - *Source language* = the interface/translation language (`uk`, `en`), already handled in `js/app.js`.
4. **Localized text** is always an object `{ "uk": "...", "en": "..." }`. One helper `L(value)` returns the current source-language text, falling back `uk` → `en` → plain string. Reuse/generalize `getText` from `exercises.js`.
5. **No hard-coded language names** ("Italian", "Італійська", "Milan") in engine code or shared HTML. They come from `course.json`.
6. **IDs are stable strings** (`it-vocab-001`, `1.1`). Progress is stored by ID, never by array index.
7. Keep existing localStorage data working (migration in Step 2).
8. Each step ends with a manual smoke test: open every page, switch theme, switch source language, complete one exercise.

---

## Step 1: Schemas and folder layout

**Goal:** agree on the data shapes before moving any content.

**Do:**
1. Create the folder structure (empty files are fine for now):
```
courses/
  index.json                  # list of available courses
  it/
    course.json
    vocab.json
    grammar.json
    exercises.json
    games.json
    lessons/                  # 1.1.json etc. (Step 9)
docs/
  schemas.md
```
2. Write `docs/schemas.md` documenting the shapes below (with one short example each).

**`courses/index.json`**
```json
{
  "default": "it",
  "courses": [
    { "id": "it", "name": { "uk": "Італійська", "en": "Italian" }, "native": "Italiano", "flag": "🇮🇹", "status": "active" }
  ]
}
```

**`courses/<id>/course.json`**
```json
{
  "id": "it",
  "target": { "code": "it", "name": { "uk": "Італійська", "en": "Italian" }, "tts": "it-IT", "script": "latin", "rtl": false },
  "tagline": { "uk": "Італійська для реальних ситуацій", "en": "Italian for real-life situations" },
  "features": {
    "flashcards": true, "dictionary": true, "exercises": true, "grammar": true, "tests": true,
    "games": ["greeting-traffic-light"],
    "exerciseFormats": ["mcq", "blank", "match", "reorder", "listen", "dialogue", "dict"]
  },
  "exerciseCategories": [
    { "id": "articles", "group": "grammar", "icon": "pin", "name": { "uk": "Іменники & Артиклі", "en": "Nouns & Articles" } }
  ],
  "paths": [
    {
      "id": "foundations", "icon": "👋", "locked": false, "defaultOpen": true,
      "title": { "uk": "Основи спілкування", "en": "Communication basics" },
      "subtitle": { "uk": "...", "en": "..." },
      "units": [
        { "id": "foundations-1", "title": { "uk": "...", "en": "..." },
          "lessons": [
            { "id": "1.1", "num": { "uk": "Урок 1", "en": "Lesson 1" }, "title": { "uk": "...", "en": "..." },
              "description": { "uk": "...", "en": "..." }, "time": "~15 min", "status": "available" }
          ] }
      ]
    }
  ]
}
```
`paths → units → lessons` matches the existing renderer in `units.js` (single-unit paths skip the unit header).

**`vocab.json`** (one list shared by dictionary, flashcards, and the dictionary quiz)
```json
[
  { "id": "it-001", "word": "ciao",
    "phon": { "uk": "[ча-о]", "en": "[chow]" },
    "trans": { "uk": "привіт / бувай", "en": "hello / goodbye" },
    "example": { "text": "Ciao! Come stai?", "trans": { "uk": "...", "en": "..." } },
    "lesson": "1.1", "path": "foundations", "topic": "greetings", "category": "greetings", "type": "greeting" }
]
```
`phon`, `example`, `category`, `type` are optional.

**`grammar.json`** (topics are declared per course, built from generic blocks)
```json
{
  "topics": [
    { "id": "articoli", "icon": "newspaper", "title": { "uk": "Артиклі", "en": "Articles" },
      "blocks": [
        { "type": "table",
          "head": [ { "uk": "Рід / Число", "en": "Gender / Number" }, "il", "lo" ],
          "rows": [ [ { "uk": "Чоловічий (однина)", "en": "Masculine (singular)" }, "**il** ragazzo", "**lo** studente" ] ] },
        { "type": "note", "icon": "lightbulb", "title": { "uk": "Зверніть увагу:", "en": "Note:" },
          "text": { "uk": "...", "en": "..." } }
      ] }
  ]
}
```
Allowed block types: `table`, `note`, `examples`, `rules`. Text supports a tiny markup subset: `**bold**`, `*italic*` (everything else is escaped).

**`exercises.json`**: same item shapes as the current `TASK_BANK` (formats `mcq`, `blank`, `match`, `reorder`, `listen`, `dialogue`), with these normalizations: match pairs use `trans: {uk,en}` instead of `ua`/`en`; every item has `id`, `format`, `category`.

**`games.json`**: `{ "games": [ { "id": "greeting-traffic-light", "type": "situation-choice", "title": {...}, "rounds": [ { "icon": "sun", "situation": {...}, "options": [...], "correct": 0 } ] } ] }`

**Done when:**
- [x] All files and folders exist.
- [x] `docs/schemas.md` documents every shape above.
- [x] No page changes yet; the site still works.

---

## Step 2: Course state and namespaced storage

**Goal:** the app always knows the current course, and per-course data can't collide.

**Do:**
1. Create `js/course.js` (load it before `app.js` on every page) exposing:
   - `getCourseId()`: order of priority: `?course=` in URL → `localStorage.ls_course` → `index.json` default.
   - `setCourseId(id)`: saves and reloads/re-renders.
   - `loadCourse()`: fetches and caches `course.json` (returns a Promise).
   - `loadCourseData(name)`: fetches `courses/<id>/<name>.json` (`vocab`, `grammar`, ...). Resolve the base path correctly from `/`, `/pages/`, and `/lessons/`.
   - `L(value)`: localized-text helper (see ground rule 4).
2. Create `js/storage.js` with `courseKey(name)` → `ls_<courseId>_<name>` and thin `getJSON/setJSON` wrappers with try/catch.
3. Decide and document what is **global** vs **per course**:
   - Global: `ls_theme`, `ls_italian_source_language` (rename to `ls_source_language`), XP, streak.
   - Per course: custom dictionary, learned words, lesson best scores.
4. Add a one-time migration: if old keys exist (`ls_custom_dict`, `ls_dict_learned`, `ls_unit_1_lesson_1_best_xp`) copy them to the `it` namespace, then leave the originals untouched.
5. Replace direct `localStorage` use for per-course data in `app.js`, `dictionary.js`, `flashcards.js`, `exercises.js`, `communication-basics-lesson-1.js` with the helpers (`DICT_KEY` usage included).

**Done when:**
- [x] Existing Italian progress, custom words, and XP still appear after the change.
- [x] `?course=xx` with an unknown id falls back to the default without errors.
- [x] No page reads/writes per-course data through a raw key anymore.

---

## Step 3: Shared layout (nav, footer, profile modal)

**Goal:** stop copy-pasting the header, mobile drawer, and footer into every page (a nav change currently means editing ~10 files).

**Do:**
1. Create `js/layout.js` that renders into placeholders:
   - `<div id="app-nav"></div>` (topbar + dropdowns + mobile drawer)
   - `<div id="app-footer"></div>`
   - Profile modal (move `ensureProfileModal` here).
2. Nav content is built from `course.json` (`features`, `paths`, `grammar` topics, `games`), with correct relative paths from `/`, `/pages/`, `/lessons/`. The active item is highlighted by current page.
3. Replace the duplicated nav/footer HTML in: `index.html`, all files in `pages/`, and the lesson page, with the placeholders.
4. Replace the generated `data-external-handler-*` click wiring for nav/theme/profile with listeners attached once in `layout.js`. Delete those handler blocks from each page's JS.
5. Remove hard-coded language strings: footer tagline, `<title>` suffix, hero subtitle on `index.html`, "Основи спілкування" in the profile modal. They come from `course.json`.
6. Hide nav entries when the feature is disabled in `features`.
7. Fix the mixed Ukrainian/English nav labels while here (some pages are `lang="en"` with Ukrainian labels). Interface text still goes through the existing `UI_TRANSLATIONS` mechanism.

**Done when:**
- [x] Every page has exactly one nav/footer source (`layout.js`).
- [x] Changing a nav label requires editing one file.
- [x] Mobile drawer, dropdowns, theme toggle, profile modal, and `tests.html` navigation all work on every page.

---

## Step 4: Vocabulary to JSON

**Goal:** one vocabulary source for dictionary, flashcards, and dictionary quizzes.

**Do:**
1. Build `courses/it/vocab.json` by merging `DICT_BASE` (dictionary.js), `FC_DATA` (flashcards.js), and `DICT_BASE_TASKS` (exercises.js). Keep all 13 words; add `id`, `trans {uk,en}` (take English from `SOURCE_TRANSLATIONS['flashcards.*']`), `phon {uk,en}` (English phonetics exist in `UI_TRANSLATIONS`), `example` from `FC_DATA.ex`.
2. Update `dictionary.js`, `flashcards.js`, and `getAllDictWords()` in `exercises.js` to read from `loadCourseData('vocab')`.
3. Make filters data-driven: flashcard "track" and "topic" chips and the dictionary filter options are built from the values present in the data/`course.json` (no fixed `foundations/tourist/business`).
4. Custom words stay in the per-course store (Step 2) and use the same shape (`trans` can be a plain string for user-entered words).
5. Delete `DICT_BASE`, `FC_DATA`, `DICT_BASE_TASKS`, and the `flashcards.*` keys in `SOURCE_TRANSLATIONS`.

**Done when:**
- [ ] Dictionary, flashcards, and the "From dictionary" quiz show the same 13 words in both uk and en.
- [ ] Adding, learning, and deleting custom words still works.
- [ ] No vocabulary arrays remain in JS files.

---

## Step 5: Grammar to JSON blocks

**Goal:** each language defines its own grammar topics; one renderer draws them all.

**Do:**
1. Create `js/blocks.js` with `renderBlocks(blocks)` and renderers for `table`, `note`, `examples`, `rules` (plus the markup helper from Step 1). Reuse existing classes (`gr-table`, `gr-note-box`).
2. Convert `GR_DATA` (`articoli`, `verbi`, `cortesia`) into `courses/it/grammar.json`, including the localized note texts currently hard-coded with `getSourceLanguage()` ternaries.
3. Rewrite `grammar.js`: tabs are generated from `topics`; `?tab=<topicId>` selects one; unknown tab → first topic.
4. Nav "Довідник" dropdown (Step 3) is generated from the same topics.

**Done when:**
- [ ] The three Italian grammar tabs look identical to before, in both languages.
- [ ] Adding a fourth topic to `grammar.json` shows up in tabs and nav with no JS change.

---

## Step 6: Exercises to JSON

**Goal:** exercise content and categories live in the course.

**Do:**
1. Move `TASK_BANK` to `courses/it/exercises.json` (normalize match pairs per Step 1). Move `CATEGORIES_MAP` into `course.json` → `exerciseCategories`.
2. `exercises.js` loads both, renders category pills, group filter, and format tabs from data; only formats listed in `features.exerciseFormats` are shown.
3. Replace inline SVG inside category names with the `icon` field rendered via `getIconSvg`.
4. Generalize `matchSelected` etc. to use `trans[sourceLang]`.
5. Fix the hero stats on `exercises.html` ("40+ exercises", "8 categories", "7 formats") to be computed from the loaded data.
6. Keep per-exercise XP values; move them to an optional `xp` field with the current numbers as defaults.

**Done when:**
- [ ] All current exercises work in every format.
- [ ] Empty categories/formats for a course are hidden, not broken.
- [ ] `TASK_BANK` and `CATEGORIES_MAP` no longer exist in JS.

---

## Step 7: Units page and home page from course data

**Goal:** the roadmap and unit list come from `course.json`.

**Do:**
1. `units.js`: replace the inline `categories` array with `course.paths`; keep the rendering functions. Remove the leftover `console.log(categories)`.
2. `index.html`: generate the "Learning paths" roadmap (the tree under "Communication basics" and the locked teasers) from the same data. Quick-link hub cards respect `features`.
3. Lesson links use `lessons/lesson.html?course=<id>&lesson=<lessonId>` (page arrives in Step 9; until then keep the old link for lesson 1.1).
4. Lesson counts ("1/5 lessons available") are computed, not typed.

**Done when:**
- [ ] `units.html` and the home page render the same content as before.
- [ ] Editing `course.json` changes both pages.

---

## Step 9: Generic lesson engine

**Goal:** one lesson page renders any lesson of any course from JSON.

**Do:**
1. Create `courses/it/lessons/1.1.json`:
```json
{
  "id": "1.1",
  "title": { "uk": "...", "en": "..." },
  "hero": { "label": {...}, "text": {...}, "image": "assets/images/communication-basics.jpg" },
  "blocks": [
    { "type": "dialogue", "story": {...}, "lines": [ { "speaker": "Sara", "side": "a", "text": "Buongiorno!", "phon": {...}, "trans": {...} } ] },
    { "type": "vocab", "title": {...}, "words": ["it-010", "it-011"], "notes": [ {...} ] },
    { "type": "culture", "paragraphs": [ {...} ] },
    { "type": "takeaways", "items": [ {...} ] },
    { "type": "tasks", "items": [
        { "kind": "choice", "q": {...}, "options": [ { "text": {...}, "correct": true } ] },
        { "kind": "truefalse", "q": {...}, "answer": true },
        { "kind": "text", "prompt": "Mi chiamo ___.", "answers": ["sara"] } ] }
  ]
}
```
2. Create `lessons/lesson.html` (single page) and `js/lesson.js`: reads `?course=&lesson=`, loads the file, renders blocks via `blocks.js` (add `dialogue`, `vocab`, `culture`, `takeaways`, `tasks` renderers). The sidebar comes from `course.paths`.
3. Generic grading replaces `gradeLessonTasks`: supports `choice`, `truefalse`, `text`; no hard-coded answer lists or "12 questions"; best-score XP key is `courseKey('lesson_<id>_best_xp')`.
4. Convert `communication-basics-lesson-1.html` content into `1.1.json`. Vocab rows reference vocab IDs so words are defined once.
5. Delete `communication-basics-lesson-1.html`, its `.js` and `.css`. Keep a tiny redirect stub at the old URL pointing to the new one so existing links don't break.
6. Locked/"soon" lessons show a friendly "not available yet" state if opened directly.

**Done when:**
- [ ] Lesson 1.1 looks and grades identically.
- [ ] Opening `lesson.html?course=it&lesson=9.9` shows a clean not-found message.
- [ ] A new lesson = one new JSON file + one entry in `course.json`.

---

## Step 10: Course switcher and per-course settings

**Goal:** the learner can pick a course; each course configures its own quirks.

**Do:**
1. Add `pages/courses.html` ("Choose a language") listing `courses/index.json` (flag, name, status, progress summary). Locked/soon courses are visible but disabled.
2. Add a course select to the profile modal and a compact switcher in the header (flag + code).
3. `setCourseId` re-renders the current page; per-course progress stays separate.
4. Apply per-course settings: `document.documentElement.lang`/`dir` for content blocks (`rtl`), a CSS class `script-<name>` for font stacks (e.g. add a CJK font for `script: "cjk"`), and `target.tts`.
5. Implement `speak(text, btn)` with `speechSynthesis` using `target.tts` as the voice locale; keep a feature flag so it can stay disabled (it is currently a visual-only stub). Fall back silently when no voice exists.
6. Profile modal stats ("1/16 lessons", "13 words") are computed for the current course.

**Done when:**
- [ ] Switching course changes nav, vocab, grammar, exercises, games, and lessons with no reload glitches.
- [ ] Progress for each course is independent.

---

## Step 11: Second course (Polish) to test the schema

**Goal:** prove the engine is truly generic before scaling.

**Do:**
1. Create `courses/es/` with a small but complete pack: ~15 words, 2 grammar topics that **differ from Italian** (e.g. ser/estar, gendered articles), ~12 exercises across at least 4 formats, one game, one lesson, and one locked path.
2. Intentionally use differences: different grammar topic ids, a disabled exercise format, a different exercise category set, `games: []` or a different game.
3. Add it to `courses/index.json`.
4. Fix every place where the engine needed a code change; each fix belongs in the engine, never as an `if (course === 'es')`.
5. Update `docs/schemas.md` if the schema had to change.

**Done when:**
- [ ] Polish works end to end with **zero course-specific code** in `js/`.
- [ ] Italian is still unchanged.
- [ ] Schema doc reflects any adjustments.

---

## Step 12: Validation script and authoring guide

**Goal:** make adding course #3 safe and easy.

**Do:**
1. Add `scripts/validate-courses.mjs` (plain Node, no dependencies). It checks for every course:
   - JSON parses; required fields present.
   - IDs unique within each file; lesson `vocab.words` IDs exist in `vocab.json`.
   - Every localized field has all source languages (`uk`, `en`); report missing ones.
   - Every `lesson` referenced in `course.json` has a file when `status: "available"`.
   - Exercise items match their format's required fields; `correct` options exist.
   - Icons used exist in `js/icons.js`.
2. Add `docs/ADDING_A_COURSE.md`: step-by-step checklist (copy `courses/es`, edit `course.json`, fill vocab, grammar, etc., run the validator, add to `index.json`).
3. Update `README.md`: new architecture (engine + course packs), how to run locally with a server, how to validate, current course list.

**Done when:**
- [ ] `node scripts/validate-courses.mjs` passes for `it` and `es` and fails with clear messages on a deliberately broken file.
- [ ] A new contributor can add a course using only the guide.

---

## Later / out of scope for now

- Moving UI strings from the Ukrainian-keyed `UI_TRANSLATIONS` to proper `i18n/<lang>.json` keys, and adding more source languages.
- Backend (accounts, synced progress, teacher dashboard): the same JSON files can move into a database unchanged.
- Course authoring tool (form UI that edits the JSON).
- Non-Latin course (e.g. Japanese) to stress-test `script`, `rtl`, and reading aids (furigana/pinyin as optional `phon` styles).
