You are working on the LanguageStudio project. The task is to refactor the vocabulary/data layer so that the database becomes the source of truth for all words and translations, while the external API is used only for example sentences.

Requirements:

- Keep the database as the canonical source for vocabulary, translations, course mappings, and user words.
- Do not make the external API the main source of truth for the app.
- The core vocabulary tables must support:
  - courseId
  - word
  - normalizedWord
  - translation
  - language
  - lesson
  - category
  - type
  - source
  - createdAt
  - updatedAt
- Add and use tables for:
  - vocab_words
  - user_words
  - custom_words
  - word_examples_cache
- Keep the user dictionary logic separated from external API logic.
- Search, filters, and lesson/course vocabulary loading must use the database results, not API calls.
- Only fetch external examples on demand when a user opens a word/detail panel or asks for examples.
- Cache API example responses to avoid repeated requests and rate limits.
- Keep the frontend and backend architecture clean:
  - `/api/vocab` for database-backed words
  - `/api/user-words` for user vocabulary
  - `/api/examples` for external example data only
- Ensure the app still works when the external example API is unavailable.
- The API should enrich the experience, not define the main app data model.

Implementation target:

- Update backend routes and controllers for the database-backed vocab API.
- Update schema or migration files to support the new vocabulary structure.
- Update the frontend logic so it loads dictionary data from the database and only triggers examples when needed.
- Keep code changes minimal and consistent with the existing project structure.
- Preserve current project behavior while moving to the new structure.

Output expectations:

- Provide the exact code changes needed in the project.
- Explain which files should be changed and why.
- Keep the solution practical and aligned with this existing application.
- Do not create a system where external API data replaces stored vocabulary records.

Final rule:

The database is the source of truth for words and translations. The API is only for examples.
