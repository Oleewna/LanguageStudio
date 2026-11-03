# Database refactor instructions

This is the practical plan for changing the current setup so the database owns the words and translations, while the external API is limited to example sentences.

## 1. Keep the database as the source of truth

Your vocabulary database should contain all entries used by the app:

- course vocabulary
- user saved words
- custom words added by the user
- translations
- lesson/category metadata
- type and source data

The app must use this database data for:

- dictionary page rendering
- search
- filters
- course vocabulary loading
- exercises based on words
- user word tracking

## 2. Create the core vocabulary tables

Create a main words table with these fields:

- id
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

Then create support tables:

- user_words
- custom_words
- word_examples_cache

## 3. Keep the app logic database-first

The frontend and backend should always prefer database results when showing the dictionary.

This means:

- `/api/vocab` should return words + translations from the DB
- the dictionary page should render from database data
- search and filters should work on database records
- course vocab should not be fetched from a third-party API

## 4. Use the external API only for examples

When a user opens a word detail or views example usage:

- call the external API
- fetch example sentences only
- return those examples to the UI
- do not replace the stored translation with the API result

## 5. Cache API examples

Store example responses in a cache table or short-lived cache.

This avoids:

- repeated requests
- rate limit issues
- slow UI caused by repeated example fetches

## 6. Keep the architecture clean

Split endpoints by role:

- `/api/vocab` — database-backed words and translations
- `/api/user-words` — user vocabulary data
- `/api/examples` — example sentences from the external API

Do not mix the example API with your main dictionary database logic.

## 7. Keep the app working without the API

The dictionary should still be fully functional even if the example API is down.

The rule is:

- words and translations work without the API
- examples are optional enrichment

## 8. Migration strategy

1. Create the new vocabulary tables.
2. Keep the existing DB data working.
3. Add the example API endpoint.
4. Update the frontend to fetch examples only when needed.
5. Ensure the dictionary list is database-backed.
6. Remove any dependency on the external API for the core vocabulary list.

## 9. Final rule

The database is the source of truth for words and translations.
The external API is only for examples.

This gives you stable app behavior, better control over your data, and a cleaner architecture for future features.
