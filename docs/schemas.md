# Shared vocab schema

LanguageStudio now uses one shared SQLite catalog for vocabulary. The static course folders are no longer the source of truth for vocabulary, and legacy per-course `vocab.json` files are treated as read-only fallbacks only.

## 1. Catalog layer

The catalog lives in `backend/service/data/vocab.db` and is initialized by `backend/service/src/db/init.js`.

### Tables

```sql
languages(code PK, name_native, is_target, is_interface)
words(id PK, lang_code FK, word, lesson, path, topic, category, type, created_at, updated_at, normalized_search)
word_lessons(word_id FK, lesson_id, PRIMARY KEY(word_id, lesson_id))
word_translations(word_id FK, lang_code FK, text, PRIMARY KEY(word_id, lang_code))
word_phonetics(word_id FK, lang_code FK, text, PRIMARY KEY(word_id, lang_code))
examples(id INTEGER PK, word_id FK, position, text)
example_translations(example_id FK, lang_code FK, text, PRIMARY KEY(example_id, lang_code))
```

### Catalog shape

Each word is returned to the frontend in the same shape already used by older course vocab files:

```js
{
  id: 'it-001',
  word: 'ciao',
  phon: { uk: '[ч-ао]', en: '[chow]' },
  trans: { uk: 'привіт', en: 'hello' },
  example: { text: 'Ciao! Come stai?', trans: { uk: 'Привіт! Як справи?', en: 'Hi! How are you?' } },
  examples: [{ text: 'Ciao! Come stai?', trans: { uk: 'Привіт! Як справи?', en: 'Hi! How are you?' } }],
  lesson: 'communication-basics-1',
  lessons: ['communication-basics-1'],
  path: 'basics',
  topic: 'greetings',
  category: 'greetings',
  type: 'greeting'
}
```

The API intentionally exposes all available translations for each row, while the UI resolves the current interface language with `getSourceLanguage()` and then falls back to `uk` and `en` as needed.

## 2. User vocabulary layer

The user’s personal vocabulary is kept in the existing local progress store and is stored under collection `userWords`:

```js
{
  courseId: 'it',
  wordId: 'it-001',
  source: 'lesson',
  earlyAdded: false,
  addedAt: '2026-05-01T12:00:00.000Z',
  updatedAt: '2026-05-01T12:00:00.000Z'
}
```

This is intentionally designed to move later to a server database table:

```sql
user_words(userId, courseId, wordId, source, earlyAdded, addedAt, updatedAt)
```

The learner dictionary is a merge of:

- `userWords` records for the selected course
- catalog rows returned by `/api/vocab?course=<id>&ids=...`
- custom entries stored in `custom_dict`

## 3. Search and localization

Search is accent-insensitive and case-insensitive. The database stores a `normalized_search` column so lookups like `perche` still match `perché`.

The catalog can hold as many interface languages as needed: `uk`, `en`, `pl`, `fr`, etc. No schema migration is needed because the language rows are created automatically when a new `trans_<code>` column appears during import.

## 4. Legacy fallback

`courses/<id>/vocab.json` remains a read-only fallback only. The application must not depend on it for normal dictionary rendering anymore; it is used only when the API is unavailable in a static hosting scenario.

## 5. Future-ready API shape

The shared API routes are:

- `GET /api/vocab?course=it`
- `GET /api/vocab?course=it&ids=a,b,c`
- `GET /api/vocab/search?course=it&q=ciao&limit=20`
- `GET /api/vocab/by-lesson?course=it&lesson=communication-basics-1`

The UI should render the user’s merged vocabulary, not the whole catalog.
