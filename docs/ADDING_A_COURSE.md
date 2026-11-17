# Adding a Course

LanguageStudio separates courses along two independent axes:
- **Target Language (Course)**: `courses/<courseId>/` (e.g., `it`, `es`, `fr`, `de`, `ja`)
- **Explanation / Interface Language (Locale)**: `i18n/<locale>/` (e.g., `uk`, `en`, `pl`, `es`)

This allows the project to scale to 10+ target languages and 5+ explanation languages without writing per-language code.

---

## 1. Directory Structure

A course directory is located at `courses/<courseId>/`:

```
courses/<courseId>/
├── course.json                           # Course and target language metadata
├── vocab.json                            # Base target-language vocabulary
├── grammar.json                          # Grammar topics, tables, and rules
├── exercises.json                        # Practice exercises with stable ids
├── lessons/                              # Lesson files
│   ├── communication-basics-1.json
│   └── ...
└── i18n/                                 # Translations by locale
    ├── uk/                               # Ukrainian translations
    │   ├── course.json
    │   ├── vocab.json
    │   ├── grammar.json
    │   ├── exercises.json
    │   └── lessons/
    │       └── communication-basics-1.json
    └── en/                               # English translations
        └── ...
```

---

## 2. Step-by-Step Guide

### Step 1: Register Course in `courses/index.json`

Add the course entry to `courses/index.json`:

```json
{
  "id": "de",
  "name": { "uk": "Німецька", "en": "German" },
  "native": "Deutsch",
  "flag": "flag-de",
  "status": "active"
}
```

Allowed statuses: `"active"`, `"inactive"`, `"soon"`, `"locked"`.

### Step 2: Configure `courses/<courseId>/course.json`

Define course and target language metadata:

```json
{
  "id": "de",
  "target": {
    "code": "de-DE",
    "name": "German",
    "tts": "de-DE",
    "script": "latin",
    "rtl": false
  },
  "tts": "de-DE",
  "script": "latin",
  "rtl": false,
  "availableLocales": ["uk", "en"],
  "tagline": "German for real-life situations",
  "features": {
    "flashcards": true,
    "dictionary": true,
    "exercises": true,
    "grammar": true,
    "tests": true,
    "exerciseFormats": ["mcq", "blank", "match", "reorder", "listen", "dialogue"]
  },
  "exerciseCategories": [],
  "paths": []
}
```

### Step 3: Author Base Learning Content

Base files hold **ONLY target-language content and stable IDs**. Use the neutral property `text` for target-language strings (legacy properties like `it` or `es` are supported as read fallbacks).

- **Dialogue lines**: `{ "id": "line-1", "speaker": "Anna", "avatar": "A", "text": "Guten Tag! Wie geht es Ihnen?" }`
- **Vocabulary items**: `{ "id": "de-001", "text": "Hallo", "lesson": "lesson-1" }`
- **Exercises**: `{ "id": "mcq-de1", "format": "mcq", "category": "greetings", "options": [{ "id": "opt-1", "text": "Hallo", "correct": true }] }`
- **Matching pairs**: `{ "id": "m1", "text": "danke" }`

### Step 4: Provide Translations in `courses/<courseId>/i18n/<locale>/`

For every locale listed in `availableLocales`:
Create `<same relative path>.json` keyed by item ID:

- `i18n/<locale>/lessons/<lessonId>.json`:
  ```json
  {
    "line-1": {
      "trans": "Доброго дня! Як справи?",
      "pronunciation": "[ґутен таґ! ві ґейт ес інен]"
    },
    "de-001": {
      "trans": "привіт",
      "pronunciation": "[гало]"
    }
  }
  ```

### Step 5: Validate

Run automated course and icon checks:

```bat
node scripts/validate-courses.mjs
node scripts/check-icons.mjs
```

Validation ensures:
1. Every ID declared in a lesson is strictly unique.
2. Every declared ID has a translation in all locales specified in `availableLocales`.
3. All JSON files are valid and well-formed.
