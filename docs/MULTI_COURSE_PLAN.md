# Multi-Course Implementation Plan

Goal: turn LanguageStudio from an Italian-only prototype into an engine + course packs platform, where every language ships its own vocabulary, grammar, exercises, and lessons.

> How to use this document: tell the AI "do step N in docs/MULTI_COURSE_PLAN.md". Each step is self-contained, leaves the site working, and ends with a "Done when" checklist. Do steps in order. Tick the box in the progress list when a step is finished.

## Progress

- [x] Step 1: Schemas and folder layout
- [x] Step 2: Course state and namespaced storage
- [x] Step 3: Shared layout (nav, footer, profile modal)
- [x] Step 4: Vocabulary to JSON
- [x] Step 5: Grammar to JSON blocks
- [x] Step 6: Exercises to JSON
- [x] Step 7: Units page and home page from course data
- [x] Step 8: Generic lesson engine
- [x] Step 9: Generic lesson engine
- [x] Step 10: Course switcher and per-course settings
- [x] Step 11: Second course (Spanish) to test the schema
- [x] Step 12: Validation script and authoring guide

---

## Ground rules (apply to every step)

1. Italian must look and behave the same after every step. Refactor, don't redesign.
2. Stay static: vanilla HTML/CSS/JS, no build step, no framework. Data loads with fetch(). Note: fetch() does not work from file://, so test with a local server (npx serve or python -m http.server) and document this in the README.
3. Two language axes, never mixed:
   - Target language = the course (it, es, ...).
   - Source language = the interface/translation language (uk, en), already handled in js/app.js.
4. Localized text is always an object { "uk": "...", "en": "..." }. One helper L(value) returns the current source-language text, falling back uk → en → plain string. Reuse/generalize getText from exercises.js.
5. No hard-coded language names ("Italian", "Італійська", "Milan") in engine code or shared HTML. They come from course.json.
6. IDs are stable strings (it-vocab-001, 1.1). Progress is stored by ID, never by array index.
7. Keep existing localStorage data working (migration in Step 2).
8. Each step ends with a manual smoke test: open every page, switch theme, switch source language, complete one exercise.

---

## Step 1: Schemas and folder layout

Goal: agree on the data shapes before moving any content.

Do:
1. Create the folder structure (empty files are fine for now):
   courses/
     index.json
     it/
       course.json
       vocab.json
       grammar.json
       exercises.json
       lessons/
2. Write docs/schemas.md documenting the shapes below.
3. Keep the schema generic so another course can use the same files.

Done when:
- [x] All files and folders exist.
- [x] docs/schemas.md documents the course shapes.
- [x] No page changes yet; the site still works.

---

## Step 2: Course state and namespaced storage

Goal: the app always knows the current course, and per-course data cannot collide.

Do:
1. Create js/course.js (load it before app.js on every page) exposing:
   - getCourseId()
   - setCourseId(id)
   - loadCourse()
   - loadCourseData(name)
   - L(value)
2. Create js/storage.js with courseKey(name) -> ls_<courseId>_<name> and thin getJSON/setJSON wrappers with try/catch.
3. Decide and document what is global vs per course.
4. Add a one-time migration for legacy keys.
5. Replace direct localStorage use for per-course data in app.js, dictionary.js, flashcards.js, exercises.js, and lesson code with the helpers.

Done when:
- [x] Existing Italian progress, custom words, and XP still appear after the change.
- [x] ?course=xx with an unknown id falls back to the default without errors.
- [x] No page reads or writes per-course data through a raw key anymore.

---

## Step 3: Shared layout (nav, footer, profile modal)

Goal: stop copy-pasting the header, mobile drawer, and footer into every page.

Do:
1. Create js/layout.js that renders into placeholders.
2. Nav content is built from course.json (features, paths, grammar topics, etc.).
3. Replace duplicated nav/footer HTML across pages with the placeholders.
4. Move click wiring to layout.js.
5. Remove hard-coded language strings and hide entries when features are disabled.
6. Fix mixed Ukrainian/English labels.

Done when:
- [x] Every page has exactly one nav/footer source.
- [x] Changing a nav label requires editing one file.
- [x] Mobile drawer, dropdowns, theme toggle, profile modal, and tests.html navigation all work.

---

## Step 4: Vocabulary to JSON

Goal: one vocabulary source for dictionary, flashcards, and dictionary quizzes.

Do:
1. Build courses/it/vocab.json by merging existing vocabulary sources.
2. Update dictionary.js, flashcards.js, and getAllDictWords() in exercises.js to read from loadCourseData('vocab').
3. Make filters data-driven from values present in the data/course.json.
4. Keep custom words in the per-course store and use the same shape.
5. Delete the legacy vocabulary arrays from JS files.

Done when:
- [x] Dictionary, flashcards, and the generated quiz use the same source data.
- [x] Adding, learning, and deleting custom words still works.
- [x] No vocabulary arrays remain in JS files.

---

## Step 5: Grammar to JSON blocks

Goal: each language defines its own grammar topics; one renderer draws them all.

Do:
1. Create js/blocks.js with renderBlocks(blocks) and renderers for table, note, examples, and rules.
2. Convert GR_DATA into courses/it/grammar.json.
3. Rewrite grammar.js so tabs are generated from topics and ?tab=<topicId> works.
4. Generate nav entries from the same topics.

Done when:
- [x] The Italian grammar tabs look identical to before, in both languages.
- [x] Adding a fourth topic to grammar.json shows up in tabs and nav with no JS change.

---

## Step 6: Exercises to JSON

Goal: exercise content and categories live in the course.

Do:
1. Move TASK_BANK to courses/it/exercises.json and CATEGORIES_MAP into course.json -> exerciseCategories.
2. exercises.js renders category pills, filters, and format tabs from data.
3. Replace inline SVG inside category names with the icon field.
4. Generalize matching logic to use trans[sourceLang].
5. Compute hero stats from loaded data.
6. Keep per-exercise XP values with optional xp fields.

Done when:
- [x] All current exercises work in every format.
- [x] Empty categories/formats for a course are hidden, not broken.
- [x] TASK_BANK and CATEGORIES_MAP no longer exist in JS.

---

## Step 7: Units page and home page from course data

Goal: the roadmap and unit list come from course.json.

Do:
1. units.js uses course.paths instead of the inline array.
2. index.html generates the learning path roadmap from the same data.
3. Lesson links use lessons/lesson.html?course=<id>&lesson=<lessonId>.
4. Lesson counts are computed, not typed.

Done when:
- [x] units.html and the home page render the same content as before.
- [x] Editing course.json changes both pages.

---

## Step 8: Generic lesson engine

Goal: one lesson page renders any lesson of any course from JSON.

Do:
1. Create courses/it/lessons/1.1.json and a generic lesson renderer.
2. Create lessons/lesson.html and js/lesson.js.
3. Support dialogue, vocab, culture, takeaways, and task blocks.
4. Convert the old lesson content into JSON and delete the old legacy lesson page.
5. Add a friendly not-found/locked state.

Done when:
- [x] Lesson 1.1 looks and grades identically.
- [x] Opening lesson.html?course=it&lesson=9.9 shows a clean not-found message.
- [x] A new lesson = one new JSON file + one entry in course.json.

---

## Step 9: Course switcher and per-course settings

Goal: the learner can pick a course; each course configures its own quirks.

Do:
1. Add pages/courses.html listing courses/index.json.
2. Add a course select to the profile modal and a compact switcher in the header.
3. setCourseId re-renders the current page; per-course progress stays separate.
4. Apply per-course settings like target language, RTL, and TTS locale.
5. Implement speak(text, btn) with speechSynthesis and silence when no voice exists.
6. Profile modal stats are computed for the current course.

Done when:
- [x] Switching course changes nav, vocab, grammar, exercises, and lessons with no reload glitches.
- [x] Progress for each course is independent.

---

## Step 10: Course switcher and per-course settings

Goal: finish the user-facing course selection flow.

Do:
1. Confirm the current course is stored centrally and survives reloads.
2. Render the selected course consistently across the whole app.
3. Apply per-course settings like target language, RTL, and TTS locale.
4. Update the profile and header controls to reflect the active course.

Done when:
- [x] The learner can switch course without breaking the page state.
- [x] Progress is isolated by course.

---

## Step 11: Second course (Spanish) to test the schema

Goal: prove the engine is truly generic before scaling.

Do:
1. Create courses/es/ with a small but complete pack: about 15 words, 2 grammar topics that differ from Italian, around 12 exercises across at least 4 formats, one lesson, and one locked path.
2. Add it to courses/index.json.
3. Fix every place where the engine needed a code change; each fix belongs in the engine, never as an if (course === 'es').
4. Update docs/schemas.md if the schema had to change.

Done when:
- [x] Spanish works end to end with zero course-specific code in js/.
- [x] Italian is still unchanged.
- [x] Schema doc reflects any adjustments.

---

## Step 12: Validation script and authoring guide

Goal: make adding course #3 safe and easy.

Do:
1. Add scripts/validate-courses.mjs.
2. Add docs/ADDING_A_COURSE.md.
3. Update README.md with architecture, run instructions, validation steps, and the current course list.

Done when:
- [x] node scripts/validate-courses.mjs passes for it and es.
- [x] A new contributor can add a course using only the guide.

---

## Later / out of scope for now

- Moving UI strings from the Ukrainian-keyed UI_TRANSLATIONS to proper i18n/<lang>.json keys.
- Backend (accounts, synced progress, teacher dashboard).
- Course authoring tool.
- Non-Latin course stress tests for script and rtl support.
