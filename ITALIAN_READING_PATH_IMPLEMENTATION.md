# Italian Reading Path: Implementation Steps

## Goal

Create a beginner Italian reading path that helps learners decode common Italian spelling patterns and use them in words and short texts. Keep each rule lesson focused, with listening, useful vocabulary, guided reading, and active practice. This path complements the existing Communication Basics unit; do not replace or rewrite it.

## How to Use This Document

Implement only the numbered step requested. Steps 1–12 each add one lesson using the lesson ID listed below. Step 13 connects the lessons to the Reading path. Step 14 adds the rules-button prototype. Step 15 performs the final integration and quality check. Do not implement later steps unless asked.

Use the existing data-driven lesson engine and its supported section types. Keep the course lesson IDs, unit ID, section types, and navigation metadata as specified here. “Step” means implementation order, not a lesson type.

## Shared Lesson Requirements

Every lesson must:

- Be suitable for a beginner and take approximately 10–15 minutes, except the cumulative reading lesson, which may take 15–20 minutes.
- Have a short, accurate rule explanation with Italian examples; avoid presenting exceptions as universal rules.
- Include listenable Italian examples using the current audio controls, a short useful vocabulary set, and at least one short text that practices the target pattern. The intro lesson may use a word list and micro-text rather than a rule explanation.
- Include a quiz or active practice. Questions must assess content taught in that lesson and accept reasonable spelling/capitalization variants when applicable. A score of 70% or higher continues to count as completion, using the existing lesson engine behavior.
- Provide Ukrainian and English for all user-facing explanations, headings, prompts, feedback, vocabulary meanings, and image descriptions. Italian examples remain Italian in both interface languages.
- Avoid ad-hoc transliterations. Do not use the current shared `phonetic` field for a Ukrainian-only or English-only pronunciation approximation. Prefer audio and clear sound descriptions.
- Keep the reading text natural, comprehensible, and short. Introduce or explain any vocabulary needed to understand it.

For audio, use the lesson engine's existing audio buttons and `window.speak` behavior. Do not add an audio service or audio files as part of this path. Verify that playback speaks the exact Italian text and uses an Italian voice where the browser provides one.

## Lesson Sequence

All lessons belong to `unitId: 'italian-reading'`. Use sequential lesson numbers and previous/next IDs as listed. Suggested IDs are new and must be checked for collisions before implementation.

### Lesson 1: Vowels, Consonants, and Syllables

**Implementation step:** Step 1  
**Lesson ID:** `italian-reading-1`  
**Title:** Vocali, consonanti e sillabe / Vowels, consonants, and syllables

Assume the learner may have no prior Italian phonics knowledge. Introduce the five written vowels and their clear Italian vowel sounds, then the dependable sound values of common consonants (B, D, F, L, M, N, P, R, T, and V) with audio and simple consonant-vowel blends. Introduce S and Z through a few common spoken examples without implying they always have one sound. Explain that letter names are not the same as the sounds used while reading. Preview that C and G change sound depending on the following letter, but leave their patterns to Lessons 2–5. Mention H only as a letter whose reading behavior will appear in those patterns, not as a sound to pronounce on its own. Show how to blend taught sounds and divide simple words into syllables, without teaching detailed stress rules yet. Use only words whose spelling patterns have been introduced, then build a short micro-text from that controlled vocabulary; do not use *casa* or other C-pattern words before teaching C.

**Learner outcome:** Blend familiar consonant-vowel combinations and read simple, fully taught words aloud, identifying their vowels and syllable boundaries.

### Lesson 2: Hard C

**Implementation step:** Step 2  
**Lesson ID:** `italian-reading-2`  
**Title:** La C dura: ca, co, cu / Hard C: ca, co, cu

Teach the hard C sound in `ca`, `co`, and `cu`, using common words such as *casa*, *cosa*, and *cucina*. Contrast the spelling pattern with the familiar English letter name only if useful; do not imply Italian C always has one sound.

**Learner outcome:** Read words containing `ca`, `co`, and `cu` and identify their shared hard C sound.

### Lesson 3: Soft C and CH

**Implementation step:** Step 3  
**Lesson ID:** `italian-reading-3`  
**Title:** La C dolce: ce, ci, che, chi / Soft C: ce, ci, che, chi

Teach `ce` and `ci` as soft C. Then show that adding H in `che` and `chi` preserves the hard C sound. Use paired examples so learners can hear and read the contrast, for example *cena/che*, *cinema/chi*, and carefully selected complete words.

**Learner outcome:** Distinguish the soft C in `ce/ci` from the hard C in `che/chi` when reading words.

### Lesson 4: Hard G

**Implementation step:** Step 4  
**Lesson ID:** `italian-reading-4`  
**Title:** La G dura: ga, go, gu / Hard G: ga, go, gu

Teach the hard G sound in `ga`, `go`, and `gu` using common, beginner-friendly words such as *gatto*, *gomma*, and *gusto*. Keep `gue/gui` and other less basic combinations out of scope here.

**Learner outcome:** Read words containing `ga`, `go`, and `gu` with the hard G sound.

### Lesson 5: Soft G and GH

**Implementation step:** Step 5  
**Lesson ID:** `italian-reading-5`  
**Title:** La G dolce: ge, gi, ghe, ghi / Soft G: ge, gi, ghe, ghi

Teach `ge` and `gi` as soft G. Then show that H in `ghe` and `ghi` preserves the hard G sound. Use paired words and audio to make the contrast clear; include spelling examples such as *gelato*, *giraffa*, *spaghetti*, and *funghi*.

**Learner outcome:** Distinguish soft G in `ge/gi` from hard G in `ghe/ghi`.

### Lesson 6: The SC Patterns

**Implementation step:** Step 6  
**Lesson ID:** `italian-reading-6`  
**Title:** I suoni di SC / The sounds of SC

Teach `sca/sco/scu` as the consonant sequence /sk/ and `sce/sci` as the Italian sound heard in *scena* and *sci*. Then introduce `sche/schi` as the spelling that keeps /sk/ before E and I. Avoid relying on English respellings as the explanation; let audio and examples carry the contrast.

**Learner outcome:** Read and sort familiar `sc` words by their sound pattern, including `sche/schi`.

### Lesson 7: GN

**Implementation step:** Step 7  
**Lesson ID:** `italian-reading-7`  
**Title:** Il gruppo GN / The GN combination

Introduce `gn` as a single Italian consonant sound using common examples such as *bagno*, *lasagna*, and *signore*. Include syllable-aware reading practice and a short text with several familiar `gn` words.

**Learner outcome:** Recognize `gn` as one sound pattern and read common words that contain it.

### Lesson 8: GLI

**Implementation step:** Step 8  
**Lesson ID:** `italian-reading-8`  
**Title:** Il gruppo GLI / The GLI combination

Teach the pronunciation of `gli` in common words such as *famiglia*, *figlio*, and *aglio*. Explain that pronunciation can be challenging for beginners and use audio plus repetition rather than a misleading one-to-one English spelling.

**Learner outcome:** Recognize `gli` in familiar words and approximate its sound by listening and repeating.

### Lesson 9: QU

**Implementation step:** Step 9  
**Lesson ID:** `italian-reading-9`  
**Title:** QU nelle parole italiane / QU in Italian words

Teach the common `qu` spelling and /kw/ sound in words such as *quando*, *quanto*, and *questo*. Include short phrase-level reading and a listening discrimination task. Do not imply that every written U in Italian behaves the same way; keep this lesson to the common `qu` pattern.

**Learner outcome:** Read common `qu` words and recognize the pattern in short phrases.

### Lesson 10: Double Consonants

**Implementation step:** Step 10  
**Lesson ID:** `italian-reading-10`  
**Title:** Le consonanti doppie / Double consonants

Show that a doubled consonant is held longer and can distinguish words, using carefully selected pairs such as *pala/palla* and *casa/cassa*. Support the listening contrast and avoid claiming that every pair has the same meaning relationship.

**Learner outcome:** Notice written double consonants and hear/read the length contrast in familiar words.

### Lesson 11: Word Stress and Written Accents

**Implementation step:** Step 11  
**Lesson ID:** `italian-reading-11`  
**Title:** L'accento e gli accenti scritti / Word stress and written accents

Introduce the idea that Italian stress is part of pronunciation and is not always marked in writing. Teach the written accent through common examples such as *città*, *perché*, and *caffè*. Keep advanced stress-pattern terminology out of the explanation; mark stress clearly in the audio and practice content without adding an unverified phonetic notation.

**Learner outcome:** Read common accented words accurately and notice written accents in Italian text.

### Lesson 12: Read a Short Text

**Implementation step:** Step 12  
**Lesson ID:** `italian-reading-12`  
**Title:** Leggiamo un testo / Let's read a text

Provide a short, engaging beginner text that recycles patterns from Lessons 1–11. Include line- or sentence-level audio, useful vocabulary hints, a translation reveal, and comprehension questions. Do not introduce a new major spelling rule; use this lesson to combine and review.

**Learner outcome:** Read or listen to a short beginner text, use context and known spelling patterns, and answer basic comprehension questions.

## Implementation Step 13: Connect the Reading Path

Add the twelve lessons to the Italian lesson registry in `frontend/public/js/data/lessons.js`. Use the `italian-reading` unit ID, localized Ukrainian/English unit metadata, unique lesson IDs, and the sequence above. Set `lessonNum`, `prevLessonId`, and `nextLessonId` consistently; Lesson 1 has no previous lesson and Lesson 12 has no next lesson. Confirm the lesson sidebar groups these lessons together.

Add a dedicated Reading category or path to `frontend/public/js/path.js` with localized title, description, lesson names, descriptions, durations, and working links. Keep the path order aligned with the lesson sequence. Add at most a concise link from the home roadmap in `frontend/public/index.html`; do not duplicate all twelve lessons there. Use `frontend/public/js/app.js` translations where the path's static labels depend on the global translation map.

Do not add sequential lesson locks unless separately requested. The path order and previous/next navigation should guide the learner, while lesson availability follows existing application behavior.

## Implementation Step 14: Rules Button Prototype

Add a rules-button prototype to the existing top-right lesson actions for Lessons 2–11 only. Do not show it on the introductory vowel lesson or cumulative reading lesson.

- Before the current lesson is completed, show the button in a locked/disabled state.
- Once that same lesson is completed, update it to an unlocked prototype state. Use `LessonEngine.isLessonCompleted(lesson.id)` and the existing `lessonCompleted` event; completion is currently stored in `ls_completed_lessons` after a quiz score of at least 70%.
- On the unlocked prototype, a click may show a short localized notice that the rules reference is planned. Do not implement a reference panel, reveal lesson answers, or add another progress store.
- Provide Ukrainian and English accessible labels and tooltips. Ensure the action fits alongside previous/next navigation on narrow screens.

Use the existing lesson page/topbar and styles in `frontend/public/pages/lesson.html` and `frontend/public/css/lesson.css`. Change `frontend/public/js/lesson-engine.js` only if a small hook is necessary; prefer the existing public completion API and event.

## Implementation Step 15: Integration and Quality Check

Run the checks below for the completed path. Fix issues within the reading-path scope only.

- **Lesson structure:** All twelve IDs are unique; every previous/next ID resolves; the first and last lessons have correct boundary navigation; all section types have renderers in `frontend/public/js/lesson-engine.js`.
- **Italian content:** Check spelling, accents, examples, sound explanations, and word meanings. Verify that each text uses taught patterns and explains vocabulary needed for comprehension.
- **Translations:** Check every lesson and the path in both Ukrainian and English for meaning, missing text, mixed-language labels, and appropriate tone.
- **Audio:** Play representative examples and the cumulative text. Confirm the spoken Italian matches the displayed text and that audio is available without blocking lesson use.
- **Practice and completion:** Verify quizzes match taught content, incomplete answers are handled, and passing at 70% marks completion. For Lessons 2–11, confirm the prototype stays locked before completion and updates after passing, including on revisit.
- **Responsive behavior:** Check the path and lesson pages on desktop and mobile. Confirm the top bar, button, and navigation do not overlap or overflow.
- **JavaScript syntax:** Run `node --check` on each changed JavaScript file.

## Implementation Files

- `frontend/public/js/data/lessons.js` — lesson registry and localized lesson content.
- `frontend/public/js/lesson-engine.js` — existing block renderers, audio and quiz behavior, and completion API; only change if required for the prototype.
- `frontend/public/js/path.js` — data-driven learning path and links.
- `frontend/public/pages/lesson.html` — lesson header/topbar and page controller.
- `frontend/public/css/lesson.css` — lesson layout and responsive topbar styling.
- `frontend/public/js/app.js` — global Ukrainian/English interface translations if needed.
- `frontend/public/index.html` — optional concise link to the Reading path.

## Out of Scope

- Rewriting Communication Basics or other existing paths.
- Changing the quiz pass threshold or adding a new progress mechanism.
- Building the full browsable rules reference; this document specifies only its locked/unlocked button prototype.
- Adding a new audio vendor, backend service, or required audio assets.
- Adding advanced phonology or exceptions that are not necessary for beginner reading.
