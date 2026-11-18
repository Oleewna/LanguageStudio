# Vocabulary Dictionary Page (`pages/dictionary.html`)

- **File Path**: [`frontend/public/pages/dictionary.html`](../../frontend/public/pages/dictionary.html)
- **Routes**: `/dictionary` or `/pages/dictionary.html`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/course.js`, `js/storage.js`, `js/progress-store.js`, `js/progress.js`, `js/layout.js`, `js/app.js`, `js/user-vocab.js`, `js/dictionary.js`
- **Styles**: `css/main.css`, `css/dictionary.css`, `css/studio.css`

---

## 1. Overview & Purpose

The **Vocabulary Dictionary Page** functions as both an authoritative course reference lexicon and a personalized notebook. Learners use it to look up vocabulary encountered during lessons, filter words by communicative situation, listen to pronunciations, and bookmark target phrases to their personal study deck.

---

## 2. Key Sections & DOM Architecture

```
[Navigation: data-component="navbar"]

[Hero: .page-hero]
  ├── Eyebrow: "Слова за темами й ситуаціями"
  ├── Title: "Власний словник"
  └── Description: "Знаходьте слова за темою чи ситуацією, зберігайте нову лексику з уроків і власного життя та тренуйте її у флешкартках."

[Main Stage: .page-container]
  ├── [Dictionary Toolbar: .dict-toolbar]
  │     ├── [Search Box: .search-box]
  │     │     ├── Search Icon ([data-icon="search"])
  │     │     └── Live Input Field (#dictSearch: "Пошук слова чи перекладу...")
  │     │
  │     ├── [Filters Drawer Toggle: .dict-filters-toggle]
  │     │
  │     ├── [Collapsible Filters Panel: #dictionaryFiltersPanel]
  │     │     ├── Category Dropdown (#filterCategory: e.g. Greetings, Food, Travel)
  │     │     ├── Lesson Dropdown (#filterLesson: All lessons, Lesson 1, Lesson 2...)
  │     │     └── Part of Speech Dropdown (#filterType: Noun, Verb, Adjective, Phrase)
  │     │
  │     └── [Action Button: .btn-primary]
  │           └── "Додати нове слово" (Opens #addModal)
  │
  ├── [Dictionary Cards Grid: #dictGrid]
  │     └── Dynamically rendered word cards:
  │           ├── Card Header: Word, Part of Speech pill, Audio button
  │           ├── Phonetics: e.g. "[ar-ree-veh-DER-chee]"
  │           ├── Primary Translation: Ukrainian & English
  │           ├── Example Usage: Italian context sentence with translation
  │           └── Bookmark Toggle: Add / Remove from Personal Saved Words
  │
  └── [Modal: Add Custom Word (#addModal)]
        ├── Header: "Нове слово" & Close Button
        ├── Search Catalog Input (#catalogSearchInput)
        ├── Dynamic Catalog Results (#catalogSearchResults)
        └── Custom Manual Entry Form & Save Button

[Footer: data-component="footer"]
[Profile Modal: data-component="profile-modal"]
```

---

## 3. Data Ingestion & Search Mechanics

### 3.1 Fast Diacritic-Insensitive Search
When the learner types in `#dictSearch`:
1. `dictionary.js` performs client-side token matching against the cached course vocabulary (`vocab.json`).
2. Concurrently queries the SQLite backend via `/api/vocab/search?q={query}` for deep catalog lookup.
3. Diacritics are normalized (e.g. searching `"caffe"` matches both `"caffè"` and `"caffe"`).
4. Matches are rendered immediately without page reload.

### 3.2 Dual Vocabulary Architecture
- **Official Course Vocabulary**: Loaded from `courses/{courseId}/vocab.json` and backend SQLite database (`vocab_words` table).
- **User Custom Vocabulary**: Maintained via `user-vocab.js` and synced to `/api/user-words` and `progress_customwords`. Users can add words they encountered outside the course (e.g. while reading an Italian menu or book).

---

## 4. Modal: Add Custom Word (`#addModal`)

Learners can expand their personal dictionary in two ways:
1. **Search Catalog**: Search the 2,000+ words in the backend SQLite dictionary and click "Add to My Words".
2. **Manual Creation**: Enter a custom word, phonetic pronunciation, Ukrainian/English translation, and personal context notes.

---

## 5. User Workflows

- **Search for a Term**: Learner hears an Italian word in a video, types it into `#dictSearch`, sees pronunciation and sample sentences.
- **Filter by Grammar Type**: Learner selects "Verb" in `#filterType` to review all target Italian verbs.
- **Sync to Flashcards**: Words saved in the dictionary automatically become available for review in the Flashcards mode of the Practice Hub (`pages/exercises.html?mode=flashcards`).
