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
      "flag": "🇮🇹",
      "status": "active"
    }
  ]
}
```

Notes:
- `default` is the fallback when no course is selected.
- `status` can be `active`, `soon`, or `locked`.
- `name` is shown in the UI and should always include `uk` and `en`.

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
    "games": ["greeting-traffic-light"],
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
      "icon": "👋",
      "locked": false,
      "defaultOpen": true,
      "title": { "uk": "Основи спілкування", "en": "Communication basics" },
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
- `features.games` is a list of enabled game ids.
- `exerciseFormats` is the whitelist of formats available for the course.
- `paths -> units -> lessons` follows the renderer contract used by the unit pages.

## 3) `courses/<id>/vocab.json`

A shared vocabulary list used by the dictionary, flashcards, and dictionary quiz.

```json
[
  {
    "id": "it-001",
    "word": "ciao",
    "phon": { "uk": "[ча-о]", "en": "[chow]" },
    "trans": { "uk": "привіт / бувай", "en": "hello / goodbye" },
    "example": {
      "text": "Ciao! Come stai?",
      "trans": { "uk": "Привіт! Як справи?", "en": "Hi! How are you?" }
    },
    "lesson": "1.1",
    "path": "foundations",
    "topic": "greetings",
    "category": "greetings",
    "type": "greeting"
  }
]
```

Notes:
- `id` must be stable and unique within the course.
- `phon`, `example`, `category`, and `type` are optional.
- `trans` is localized as `{ "uk": ..., "en": ... }`.

## 4) `courses/<id>/grammar.json`

Defines grammar topics and block content.

```json
{
  "topics": [
    {
      "id": "articoli",
      "icon": "newspaper",
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

Markup support:
- `**bold**` → bold text
- `*italic*` → italic text
- all other text is escaped safely

## 5) `courses/<id>/exercises.json`

Stores all exercise items for a course, including category metadata and format-specific data.

```json
[
  {
    "id": "it-ex-001",
    "format": "mcq",
    "category": "articles",
    "prompt": { "uk": "Виберіть правильний артикль.", "en": "Choose the correct article." },
    "options": [
      { "text": { "uk": "il", "en": "il" }, "correct": true },
      { "text": { "uk": "lo", "en": "lo" }, "correct": false }
    ],
    "xp": 10
  }
]
```

Notes:
- `format` is one of the allowed exercise types such as `mcq`, `blank`, `match`, `reorder`, `listen`, `dialogue`, or `dict`.
- `match` items use `trans: { "uk": ..., "en": ... }` for pairs.
- Every item should include `id`, `format`, and `category`.

## 6) `courses/<id>/games.json`

Defines games that are enabled for a course.

```json
{
  "games": [
    {
      "id": "greeting-traffic-light",
      "type": "situation-choice",
      "title": { "uk": "Світлофор грубих вітань", "en": "Greeting traffic light" },
      "rounds": [
        {
          "icon": "sun",
          "situation": { "uk": "Ви зустрічаєте вчителя вранці.", "en": "You meet a teacher in the morning." },
          "options": [
            { "text": { "uk": "Buongiorno!", "en": "Good morning!" }, "correct": true },
            { "text": { "uk": "Buonasera!", "en": "Good evening!" }, "correct": false }
          ],
          "correct": 0
        }
      ]
    }
  ]
}
```

Notes:
- `games` is an array so a course can expose zero or more playable mini-games.
- `type` is the runner type used by the generic game engine.

## 7) `courses/<id>/lessons/*.json`

One lesson file contains the lesson card, its blocks, and task data.

```json
{
  "id": "1.1",
  "title": { "uk": "Привітання", "en": "Greetings" },
  "hero": {
    "label": { "uk": "Урок 1", "en": "Lesson 1" },
    "text": { "uk": "Знайомство з базовими вітаннями", "en": "Meet the basics of greetings" },
    "image": "assets/images/communication-basics.jpg"
  },
  "blocks": [
    {
      "type": "dialogue",
      "story": { "uk": "Зустріч двох друзів", "en": "Two friends meet" },
      "lines": [
        { "speaker": "Sara", "side": "a", "text": "Buongiorno!", "trans": { "uk": "Доброго дня!", "en": "Good morning!" } }
      ]
    }
  ]
}
```

Notes:
- The lesson file is identified by `course.json` entries under `paths -> units -> lessons`.
- The engine loads a lesson by `?course=<id>&lesson=<id>`.
- Lesson content may include dialogue, vocab, culture, takeaways, and task blocks.

## Shared rules

- Use only stable string IDs (for example: `it-vocab-001` or `1.1`).
- Never store array indexes as the source of truth for progress.
- All interface text uses localized objects rather than hard-coded language strings.
- Keep target-language data separate from source-language UI translations.

## Validation checklist for Step 1

- [ ] `courses/` exists with the required structure.
- [ ] All JSON files parse correctly.
- [ ] All localized objects contain both `uk` and `en`.
- [ ] Course metadata is driven by `courses/index.json` and `course.json` rather than hard-coded page logic.
