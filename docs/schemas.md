# Multilingual Content Schemas

LanguageStudio structures content along two independent axes:
1. **Target Language (Course)**: Stored in `courses/<courseId>/`
2. **Explanation / Translation Language (Locale)**: Stored in `courses/<courseId>/i18n/<locale>/` and `frontend/public/locales/<locale>.json`

This decoupled architecture allows scaling to 10+ target languages and 5+ explanation languages without writing language-specific code.

---

## 1. Course Metadata Schema (`courses/<courseId>/course.json`)

```json
{
  "id": "it",
  "target": {
    "code": "it",
    "name": "Italian",
    "tts": "it-IT",
    "script": "latin",
    "rtl": false
  },
  "tts": "it-IT",
  "script": "latin",
  "rtl": false,
  "availableLocales": ["uk", "en"],
  "tagline": "Italian for real-life situations",
  "features": {
    "flashcards": true,
    "dictionary": true,
    "exercises": true,
    "grammar": true,
    "tests": true,
    "exerciseFormats": ["mcq", "blank", "match", "reorder", "listen", "dialogue"]
  },
  "exerciseCategories": [
    {
      "id": "articles",
      "group": "grammar",
      "icon": "pin"
    }
  ],
  "paths": [
    {
      "id": "communication-basics",
      "icon": "greeting",
      "locked": false,
      "defaultOpen": true,
      "units": [
        {
          "id": "communication-basics-1",
          "lessons": [
            {
              "id": "communication-basics-1",
              "status": "available",
              "nextLessonId": "communication-basics-1-greetings"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 2. Base Content Schemas (Target-Language Only)

All base files contain **only target-language strings and stable IDs**. Strings use the neutral property `text` (legacy properties such as `it`, `es`, `word` are supported as read fallbacks).

### Lessons (`courses/<courseId>/lessons/<lessonId>.json`)

```json
{
  "id": "communication-basics-1",
  "xpReward": 10,
  "nextLessonId": "communication-basics-1-greetings",
  "blocks": [
    {
      "id": "dialogue-1",
      "type": "dialogue",
      "lines": [
        {
          "id": "line-1",
          "speaker": "Anna",
          "avatar": "A",
          "text": "Ciao! Come stai?",
          "audio": true
        }
      ]
    },
    {
      "id": "vocab-1",
      "type": "vocab",
      "items": [
        { "id": "v-1", "text": "Ciao" }
      ]
    },
    {
      "id": "story-1",
      "type": "story_text",
      "paragraphs": [
        { "id": "p-1", "text": "Nina vede una casa." }
      ],
      "vocabHints": [
        { "id": "hint-casa", "word": "casa" }
      ]
    },
    {
      "id": "takeaways-1",
      "type": "takeaways",
      "items": [
        { "id": "t-1" }
      ]
    },
    {
      "id": "tasks-1",
      "type": "tasks",
      "items": [
        {
          "id": "ask-how-are-you",
          "kind": "choice",
          "options": [
            { "id": "opt-1", "text": "Come stai?", "correct": true },
            { "id": "opt-2", "text": "Bene, grazie!", "correct": false }
          ]
        }
      ]
    }
  ]
}
```

### Vocabulary (`courses/<courseId>/vocab.json`)

```json
[
  {
    "id": "it-001",
    "text": "ciao",
    "word": "ciao",
    "example": {
      "text": "Ciao! Come stai?"
    },
    "lesson": "communication-basics-1",
    "path": "foundations",
    "topic": "greetings",
    "category": "greetings",
    "type": "greeting"
  }
]
```

### Exercises (`courses/<courseId>/exercises.json`)

```json
[
  {
    "id": "mcq-g1",
    "format": "mcq",
    "category": "greetings",
    "pathId": "communication-basics",
    "lessonId": "communication-basics-1",
    "options": [
      { "id": "opt-1", "correct": false },
      { "id": "opt-2", "correct": true }
    ],
    "xp": 15
  },
  {
    "id": "match-greetings",
    "format": "match",
    "category": "greetings",
    "pairs": [
      { "id": "m1", "text": "ciao" },
      { "id": "m2", "text": "grazie" }
    ],
    "xp": 20
  }
]
```

---

## 3. Translation Files Schema (`courses/<courseId>/i18n/<locale>/<path>.json`)

Translation files mirror the relative path of each content resource and are keyed flatly by item ID.

### Lesson Translations (`i18n/<locale>/lessons/<lessonId>.json`)

```json
{
  "communication-basics-1": {
    "title": "Привіт, як справи?",
    "subtitle": "Ciao! Come stai?",
    "description": "Привітайтеся з другом і запитайте, як у нього справи.",
    "duration": "2 хв"
  },
  "dialogue-1": {
    "title": "Привітаймося",
    "story": "Анна зустрічає Луку й запитує, як у нього справи."
  },
  "line-1": {
    "trans": "Привіт! Як справи?",
    "pronunciation": "[чао! коме стаї]"
  },
  "vocab-1": {
    "title": "Три корисні фрази"
  },
  "v-1": {
    "trans": "привіт; бувай",
    "pronunciation": "[чао]"
  },
  "story-1": {
    "title": "Читання"
  },
  "p-1": {
    "translations": "Ніна бачить дім."
  },
  "hint-casa": {
    "translations": "дім"
  },
  "takeaways-1": {
    "title": "Запам’ятайте"
  },
  "t-1": {
    "text": "Ciao — неформальне «привіт»; ним також можна попрощатися."
  },
  "tasks-1": {
    "title": "Швидка практика"
  },
  "ask-how-are-you": {
    "question": "Як запитати друга, як у нього справи?",
    "explanation": "«Come stai?» використовується для неформального запитання."
  }
}
```

### Vocabulary Translations (`i18n/<locale>/vocab.json`)

```json
{
  "it-001": {
    "trans": "привіт / бувай",
    "pronunciation": "[ча-о]",
    "example": {
      "trans": "Привіт! Як справи?"
    }
  }
}
```

---

## 4. UI Translation Schema (`frontend/public/locales/<locale>.json`)

UI strings, settings options, labels, and shared messages are defined in locale bundles loaded asynchronously:

```json
{
  "nav.home": "Головна",
  "nav.learn": "Навчання",
  "common.checkAnswers": "Перевірити завдання",
  "settings.sidebarTitle": "Налаштування"
}
```

---

## 5. Runtime Resolution & Fallback

The runtime loader (`course.js` and `app.js`) merges translations into base objects dynamically:
1. `loadCourseData(name)` fetches the neutral base content.
2. `loadI18nWithFallback(courseId, name, availableLocales)` resolves translations following the fallback chain:
   $$\text{Selected Locale} \longrightarrow \text{en} \longrightarrow \text{First Available}$$
3. `mergeI18n(baseData, translations, locale, courseId)` combines target text with localized strings and populates compatibility fallbacks.

---

## 6. Unified Task & Quiz Schema

All quiz items in lesson base JSON files adhere to a consistent schema:
- **Block type**: `"tasks"` or `"quiz"`
- **Task item kind**: `kind: "choice"` (canonical)
- **Question**: `q` (or `question` in translations)
- **Options**: array of `{ "id": "...", "text": "...", "correct": true|false }`
- **Correctness**: Determined exclusively by `"correct": true` on the valid option in base JSON. Runtime normalizers derive `correctIndex` automatically; source JSON files do not specify `correctIndex` or `acceptableAnswers`.
- **Target Language Strings**: Use `"text"` across all blocks (dialogue, vocab, story, options), falling back to course code (e.g., `"it"`) for backwards compatibility.


---

## 7. Access Control & Paid Content Schemas

To support paid courses and premium content while preserving free teasers and previews:

### Course Metadata (`courses/<courseId>/course.json`)
- `access`: `"free" | "paid"` (optional, defaults to `"free"`)
- `priceId`: string (optional, provider price identifier, e.g. `"price_it_premium"`)

### Lesson Definitions (`paths[].units[].lessons[]` & lesson base JSON)
- `access`: `"free" | "paid"` (optional; first lesson in a paid course remains `"free"`)
- `priceId`: string (optional, provider price identifier)

### Storage & Enforcement Architecture
- **Free Content**: Kept in `courses/<courseId>/lessons/<lessonId>.json` and served via `express.static` (`/courses/...`).
- **Paid Content**: Stored outside public static folders in `paid-content/courses/<courseId>/lessons/<lessonId>.json` (and `paid-content/courses/<courseId>/i18n/...`).
- **API Gate**: Served through `GET /api/courses/:courseId/lessons/:lessonId`, enforcing session authentication and active entitlement verification. Responds with `401 Unauthorized` (`AUTH_REQUIRED`) or `403 Forbidden` (`ENTITLEMENT_REQUIRED`).

### Mongo Collection: `entitlements`

Stores user entitlements granted upon verified payments:

```json
{
  "_id": "ObjectId(...)",
  "userId": "6724fa13e9a...",
  "courseId": "it",
  "status": "active",
  "provider": "mock",
  "providerPaymentId": "pay_mock_1731872400000_abc123",
  "createdAt": "2026-11-17T19:00:00.000Z",
  "expiresAt": null
}
```

- **Fields**:
  - `userId`: `String` (Indexed, required)
  - `courseId`: `String` (Indexed, required)
  - `status`: `"active" | "expired" | "refunded"` (Indexed, default: `"active"`)
  - `provider`: `String` (e.g. `"stripe"`, `"paddle"`, `"mock"`)
  - `providerPaymentId`: `String` (Unique, indexed; ensures webhook idempotency)
  - `createdAt`: `Date` (default: `Date.now`)
  - `expiresAt`: `Date` (optional, null for lifetime access)
- **Indexes**:
  - Compound: `{ userId: 1, courseId: 1 }`
  - Unique: `{ providerPaymentId: 1 }`
