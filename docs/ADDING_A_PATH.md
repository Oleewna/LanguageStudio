# Adding a Path, Lessons, and Sublessons

This guide explains how to organize course paths and add independently navigable sublessons without introducing course-specific engine behavior.

## 1) Organize a path

Paths live in `courses/<id>/course.json`. A path contains units, and each unit contains the main lessons shown in the learning roadmap.

```json
{
  "id": "foundations",
  "title": { "uk": "Основи спілкування", "en": "Communication basics" },
  "units": [
    {
      "id": "foundations-1",
      "title": { "uk": "Перші кроки", "en": "First steps" },
      "lessons": []
    }
  ]
}
```

Keep path, unit, and lesson IDs stable. Titles and descriptions shown in the interface must include both `uk` and `en` values.

## 2) Add a main lesson

Add a lesson entry to the appropriate unit's `lessons` array and create `courses/<id>/lessons/<lesson-id>.json`. The filename and the JSON `id` must match the course entry. See [Adding a Course](ADDING_A_COURSE.md) for the complete course setup.

## 3) Add an optional sublesson

Add a `sublessons` array to a main lesson entry. A sublesson is a separate lesson page nested beneath its parent in the path. It has its own completion state and XP reward; it does not gate or replace the parent lesson.

```json
{
  "id": "communication-basics-1",
  "num": { "uk": "Урок 1", "en": "Lesson 1" },
  "title": { "uk": "Знайомство", "en": "Introductions" },
  "description": {
    "uk": "Навчіться знайомитися і представлятися.",
    "en": "Learn how to meet people and introduce yourself."
  },
  "time": { "uk": "20 хв", "en": "20 min" },
  "status": "available",
  "sublessons": [
    {
      "id": "communication-basics-1-practice",
      "num": { "uk": "Додаткова практика", "en": "Extra practice" },
      "title": { "uk": "Знайомство: більше фраз", "en": "Introductions: more phrases" },
      "description": {
        "uk": "Потренуйте фрази для знайомства.",
        "en": "Practice phrases for meeting someone."
      },
      "time": { "uk": "8 хв", "en": "8 min" },
      "status": "available",
      "xpReward": 20
    }
  ]
}
```

Sublessons use the same `lessons/` directory as main lessons. IDs must be unique across all main lessons and sublessons in the course. Nesting is limited to one level: a sublesson cannot contain another `sublessons` array. Supported statuses are `available`, `locked`, and `soon`.

## 4) Write story-free practice content

Create one JSON file per sublesson, for example `courses/it/lessons/communication-basics-1-practice.json`. Use the sublesson ID as the JSON `id`. The existing lesson engine supports dialogue, reading text (`story_text`), vocabulary/example lists, takeaways, and interactive tasks. A dialogue can omit its `story` field. Keep practice focused: vary useful phrases, use a short functional text such as a profile or message, then check comprehension or recall.

Localize all interface-facing content in Ukrainian and English. Italian examples and dialogue stay in Italian, with Ukrainian and English translations. Use the same task formats as other lesson files:

```json
{
  "id": "communication-basics-1-practice",
  "title": { "uk": "Знайомство: більше фраз", "en": "Introductions: more phrases" },
  "xpReward": 20,
  "blocks": [
    {
      "type": "dialogue",
      "title": { "uk": "Короткий діалог", "en": "Short dialogue" },
      "lines": [
        {
          "speaker": "A",
          "text": "Ciao! Come ti chiami?",
          "trans": { "uk": "Привіт! Як тебе звати?", "en": "Hi! What's your name?" }
        }
      ]
    },
    {
      "type": "story_text",
      "title": { "uk": "Короткий профіль", "en": "Short profile" },
      "paragraphs": [
        {
          "it": "Mi chiamo Elena. Sono di Kyiv.",
          "translations": { "uk": "Мене звати Олена. Я з Києва.", "en": "My name is Elena. I'm from Kyiv." }
        }
      ]
    },
    {
      "type": "tasks",
      "title": { "uk": "Перевір себе", "en": "Check yourself" },
      "items": [
        {
          "kind": "choice",
          "id": "where-from",
          "q": { "uk": "Як запитати «Звідки ти?»", "en": "How do you ask “Where are you from?”" },
          "options": [
            { "text": { "uk": "Di dove sei?", "en": "Di dove sei?" }, "correct": true },
            { "text": { "uk": "Come ti chiami?", "en": "Come ti chiami?" }, "correct": false }
          ]
        }
      ]
    }
  ]
}
```

## 5) Validate and review

From the repository root, run:

```bash
node scripts/validate-courses.mjs
```

Then open the path and sublesson in both Ukrainian and English. Check that the child appears beneath the correct parent, opens as its own page, and can be completed independently.