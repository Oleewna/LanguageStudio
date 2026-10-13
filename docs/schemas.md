# Course schema reference

This document describes the JSON contracts used by the course-engine architecture. Each language course is loaded from `courses/<id>/...` and uses localized text objects in the form `{ "uk": "...", "en": "..." }`.

## 1) `courses/index.json`

Lists the available courses and the default course.

```json
{
  "default": "it",
  "courses": [
    {
      "id": "it",
      "name": { "uk": "Італійська", "en": "Italian" },
      "native": "Italiano",
      "flag": "flag-it",
      "status": "active"
    }
  ]
}
```

Notes:
- `default` is the fallback when no course is selected.
- `status` can be `active`, `soon`, or `locked`.
- `name` should always include `uk` and `en`.
- `flag` is a semantic name registered in `frontend/public/assets/icons/icons.json`.

## 2) `courses/<id>/course.json`

Describes the learning structure and feature set for one course.

```json
{
  "id": "it",
  "target": {
    "code": "it",
    "name": { "uk": "Італійська", "en": "Italian" },
    "tts": "it-IT",
    "script": "latin",
    "rtl": false
  },
  "tagline": { "uk": "Італійська для реальних ситуацій", "en": "Italian for real-life situations" },
  "features": {
    "flashcards": true,
    "dictionary": true,
    "exercises": true,
    "grammar": true,
    "tests": true,
    "exerciseFormats": ["mcq", "blank", "match", "reorder", "listen", "dialogue", "dict"]
  },
  "exerciseCategories": [
    {
      "id": "articles",
      "group": "grammar",
      "icon": "pin",
      "name": { "uk": "Іменники & Артиклі", "en": "Nouns & Articles" }
    }
  ],
  "paths": [
    {
      "id": "foundations",
      "icon": "greeting",
      "locked": false,
      "defaultOpen": true,
      "title": { "uk": "Основи спілкування", "en": "Communication basics" },
      "subtitle": { "uk": "...", "en": "..." },
      "units": [
        {
          "id": "foundations-1",
          "title": { "uk": "Перші кроки", "en": "First steps" },
          "lessons": [
            {
              "id": "1.1",
              "num": { "uk": "Урок 1", "en": "Lesson 1" },
              "title": { "uk": "Привітання", "en": "Greetings" },
              "description": { "uk": "...", "en": "..." },
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

Notes:
- `target.code` is the course language code such as `it` or `es`.
- `exerciseFormats` is the whitelist of formats available for the course.
- `paths` controls the roadmap and lesson grouping in the app.
- Every `icon` value is a semantic name registered in `frontend/public/assets/icons/icons.json`; do not use filenames, emoji, or inline markup.

## 3) `courses/<id>/vocab.json`

Array of vocabulary rows used by dictionary, flashcards, and quiz generation.

```json
[
  {
    "id": "it-001",
    "word": "ciao",
    "phon": { "uk": "[ча-о]", "en": "[chow]" },
    "trans": { "uk": "привіт / бувай", "en": "hello / goodbye" },
    "example": {
      "text": "Ciao! Come stai?",
      "trans": { "uk": "...", "en": "..." }
    },
    "lesson": "1.1",
    "path": "foundations",
    "topic": "greetings",
    "category": "greetings",
    "type": "greeting"
  }
]
```

## 4) `courses/<id>/grammar.json`

Grammar topics and the blocks they contain.

```json
{
  "topics": [
    {
      "id": "articoli",
      "icon": "article",
      "title": { "uk": "Артиклі", "en": "Articles" },
      "blocks": [
        {
          "type": "table",
          "head": [
            { "uk": "Рід / Число", "en": "Gender / Number" },
            "il",
            "lo"
          ],
          "rows": [
            [
              { "uk": "Чоловічий (однина)", "en": "Masculine (singular)" },
              "**il** ragazzo",
              "**lo** studente"
            ]
          ]
        },
        {
          "type": "note",
          "icon": "lightbulb",
          "title": { "uk": "Зверніть увагу:", "en": "Note:" },
          "text": { "uk": "...", "en": "..." }
        }
      ]
    }
  ]
}
```

Allowed block types:
- `table`
- `note`
- `examples`
- `rules`

## 5) `courses/<id>/exercises.json`

Exercise bank for the course. Exercise items keep the same basic shape as the previous TASK_BANK, with localized text and stable IDs.

```json
[
  {
    "id": "es-mcq-01",
    "format": "mcq",
    "category": "greetings",
    "question": { "uk": "Що означає «¿Cómo estás?» ?", "en": "What does “¿Cómo estás?” mean?" },
    "options": [
      { "text": { "uk": "А) Як тебе звати?", "en": "A) What is your name?" }, "correct": false },
      { "text": { "uk": "Б) Як справи?", "en": "B) How are you?" }, "correct": true }
    ],
    "explanation": { "uk": "...", "en": "..." },
    "xp": 15
  }
]
```

Notes:
- `format` is a course-level allowed value from `features.exerciseFormats`.
- `category` must match an entry in `course.json` -> `exerciseCategories`.
- For `match` items, pairs are normalized to `trans: { "uk": "...", "en": "..." }`.

## 6) `courses/<id>/lessons/<lessonId>.json`

Lesson content is a separate JSON file referenced by `course.json` and rendered by the generic lesson engine.

```json
{
  "id": "1.1",
  "title": { "uk": "Привітання", "en": "Greetings" },
  "blocks": [
    { "type": "dialogue", "lines": [ "A: Hola!", "B: ¡Hola!" ] },
    { "type": "vocab", "items": ["hola", "buenos días"] },
    { "type": "takeaways", "items": ["Use Hola to greet someone."] }
  ]
}
```

## Shared rules

- Localized text is always an object with `uk` and `en` keys.
- IDs are stable strings and never array indices.
- Course data is loaded via `fetch()` from the active course folder.
- All course `icon` and `flag` fields use registered semantic names; emoji are not allowed in these fields.
- The app must work when a course is missing or has a partial data set; invalid or empty sections should fail gracefully.
