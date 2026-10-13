# Adding a Course

This guide explains how to add a new language pack to LanguageStudio without changing the engine logic.

## 1) Decide the course ID and metadata

Choose a short stable ID such as `fr`, `de`, or `pt`.

Then add a record to `courses/index.json`:

```json
{
  "id": "fr",
  "name": { "uk": "Французька", "en": "French" },
  "native": "Français",
  "flag": "flag-fr",
  "status": "active"
}
```

Rules:
- `id` must match the folder name under `courses/`.
- `name` is always a localized object with `uk` and `en` keys.
- `flag` and all course `icon` fields use semantic names from `frontend/public/assets/icons/icons.json`, never emoji, filenames, or markup.
- `default` in the index file is only set once and should remain the current default course.
- If a course flag icon is missing, request the `flag-<course-id>` name and a matching asset; keep the name mapped to the placeholder and listed in `frontend/public/assets/icons/MISSING.md` until the asset is added.

## 2) Create the course folder

Create a folder with this structure:

```text
courses/
  fr/
    course.json
    vocab.json
    grammar.json
    exercises.json
    lessons/
      1.1.json
```

## 3) Fill the course metadata

Edit `courses/fr/course.json`.

At minimum, include:
- `id`
- `target.code`
- `target.name`
- `tagline`
- `features` with `exerciseFormats`
- `exerciseCategories`
- `paths` containing lesson references

A minimal valid example:

```json
{
  "id": "fr",
  "target": {
    "code": "fr",
    "name": { "uk": "Французька", "en": "French" },
    "tts": "fr-FR",
    "script": "latin",
    "rtl": false
  },
  "tagline": { "uk": "Французька для повсякденних розмов", "en": "French for everyday conversations" },
  "features": {
    "flashcards": true,
    "dictionary": true,
    "exercises": true,
    "grammar": true,
    "tests": true,
    "exerciseFormats": ["mcq", "blank", "match", "reorder", "dialogue"]
  },
  "exerciseCategories": [
    {
      "id": "greetings",
      "group": "situational",
      "icon": "globe",
      "name": { "uk": "Привітання", "en": "Greetings" }
    }
  ],
  "paths": [
    {
      "id": "foundations",
      "icon": "greeting",
      "locked": false,
      "defaultOpen": true,
      "title": { "uk": "Основи", "en": "Foundations" },
      "subtitle": { "uk": "Основні фрази", "en": "Basic phrases" },
      "units": [
        {
          "id": "foundations-1",
          "title": { "uk": "Перші кроки", "en": "First steps" },
          "lessons": [
            {
              "id": "1.1",
              "num": { "uk": "Урок 1", "en": "Lesson 1" },
              "title": { "uk": "Привітання", "en": "Greetings" },
              "description": { "uk": "Навчіться вітатися", "en": "Learn greetings" },
              "time": "~15 min",
              "status": "available"
            }
          ]
        }
      ]
    }
  ]
}
```

## 4) Add vocabulary

`courses/fr/vocab.json` should be an array of vocabulary items.

Each entry needs:
- `id`
- `word`
- `trans` with `uk` and `en`
- `lesson`
- `path`
- `category`

Example:

```json
[
  {
    "id": "fr-001",
    "word": "bonjour",
    "phon": { "uk": "[бон-жур]", "en": "[bohn-ZHOOR]" },
    "trans": { "uk": "добрий день", "en": "good day / hello" },
    "example": {
      "text": "Bonjour !",
      "trans": { "uk": "Добрий день!", "en": "Hello!" }
    },
    "lesson": "1.1",
    "path": "foundations",
    "topic": "greetings",
    "category": "greetings",
    "type": "greeting"
  }
]
```

## 5) Add grammar

`courses/fr/grammar.json` needs a `topics` array. Each topic has:
- `id`
- `title`
- `blocks`

Supported block types:
- `table`
- `note`
- `examples`
- `rules`

## 6) Add exercises

`courses/fr/exercises.json` is the course exercise bank.

Every exercise must:
- have a unique `id`
- use a `format` allowed by `course.features.exerciseFormats`
- belong to a category listed in the course config
- include the fields required by its format type

Common format requirements:
- `mcq`: `question`, `options`
- `blank`: `question`, `answers`
- `match`: `title`, `pairs`
- `reorder`: `clue`, `words`
- `dialogue`: `lineA`, `options`
- `listen`: `audioWord`, `instruction`, `options`

When a format depends on pairs or answers, keep the keys consistent with the existing engine.

## 7) Add lesson JSON files

Create one JSON file per lesson in `courses/fr/lessons/`.

Example:

```json
{
  "id": "1.1",
  "title": { "uk": "Привітання", "en": "Greetings" },
  "blocks": [
    { "type": "dialogue", "lines": ["A: Bonjour!", "B: Bonjour! "] },
    { "type": "vocab", "items": ["bonjour", "merci"] },
    { "type": "takeaways", "items": ["Use bonjour to greet someone in the morning."] }
  ]
}
```

The lesson file name must match the lesson id in `course.json` exactly.

## 8) Run validation

From the project root, run:

```bash
node scripts/validate-courses.mjs
```

If it passes, the course structure is valid.

## 9) Smoke-test in a browser

Use a local server so `fetch()` can load course data:

```bash
python -m http.server 8000
```

Then open:

- http://localhost:8000/frontend/public/
- http://localhost:8000/frontend/public/pages/courses.html
- a lesson page like http://localhost:8000/frontend/public/pages/lesson.html?course=fr&lesson=1.1

Check the app still works after switching languages and course settings.

## 10) Keep the engine generic

Avoid course-specific JavaScript checks like `if (course === 'es')`.
If the app needs a change, adjust the shared engine so all courses can use it.

## 11) Common mistakes

- Typo in the course id between `courses/index.json` and the folder name
- Missing `uk` / `en` localization objects
- Exercise category names not listed in course.json
- Lesson file missing from `courses/<id>/lessons/`
- Exercise format not present in `features.exerciseFormats`
- Course names or lesson names hard-coded in shared UI code

A good rule: if the data is course-specific, it belongs inside `courses/<id>/...`.
