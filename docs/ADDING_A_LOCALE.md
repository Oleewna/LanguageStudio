# Adding an Explanation / Interface Language (Locale)

LanguageStudio separates the interface and translation locale from the target course language. To add a new explanation language (e.g., `pl` Polish, `es` Spanish, `de` German, `fr` French), follow these steps.

---

## 1. Create the UI Translation Bundle

Create `frontend/public/locales/<locale>.json` (for example, `frontend/public/locales/pl.json`).

The bundle maps UI keys and natural language strings to the target locale:

```json
{
  "nav.home": "Strona główna",
  "nav.learn": "Nauka",
  "nav.paths": "Ścieżki nauki",
  "nav.flashcards": "Fiszki",
  "nav.exercises": "Ćwiczenia",
  "nav.dictionary": "Mój słownik",
  "nav.grammar": "Gramatyka",
  "nav.tests": "Testy",
  "nav.settings": "Ustawienia",
  "nav.signin": "Zaloguj się",
  "common.checkAnswers": "Sprawdź odpowiedzi",
  "common.showTranslation": "Pokaż tłumaczenie",
  "common.hideTranslation": "Ukryj tłumaczenie",
  "settings.sidebarTitle": "Ustawienia",
  "settings.generalHeading": "Ogólne",
  "settings.langBLabel": "Język tłumaczeń i interfejsu"
}
```

UI components and scripts resolve strings dynamically via:
```javascript
window.t('key', { param: 'value' });
```

---

## 2. Translate Course Content

For each active course in `courses/<courseId>/`:

### A. Register the Locale in `course.json`
Add the locale code to `availableLocales`:

```json
{
  "id": "it",
  "availableLocales": ["uk", "en", "pl"]
}
```

### B. Add Course Translations in `courses/<courseId>/i18n/<locale>/`
Create matching JSON files mirroring the course content structure:

```
courses/<courseId>/i18n/<locale>/
├── course.json                           # Course title, tagline, categories, path titles
├── vocab.json                            # Vocabulary translations & pronunciations
├── grammar.json                          # Grammar explanations and table headers
├── exercises.json                        # Exercise questions, explanations, instructions
└── lessons/
    ├── communication-basics-1.json       # Lesson titles, dialogue line translations, task questions
    └── ...
```

All translation files are keyed flatly by the stable item IDs defined in the base course files.

---

## 3. Runtime Resolution and Fallback Chain

When a learner chooses a locale, `course.js` and `app.js` merge translations at runtime following this priority chain:

$$\text{Selected Locale} \longrightarrow \text{English (en)} \longrightarrow \text{First Available Locale}$$

If a specific line or vocabulary item is missing in the newly added locale, the loader automatically falls back to English without throwing errors or breaking the learning experience.

---

## 4. Verification

Run automated validation to verify that all lesson IDs have corresponding translations:

```bat
node scripts/validate-courses.mjs
node scripts/check-icons.mjs
```

Ensure no icon or emoji violations exist, and all JSON files are formatted correctly.
