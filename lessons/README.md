# Lesson references

These Markdown files are readable lesson references; they are not loaded by the application. The authoritative lesson content, lesson metadata, vocabulary, grammar, and exercises live in the SQLite database.

To add or modify a lesson, sign in as an administrator, open **Content editor** in the app, and update the database catalog. Add the lesson body to that course's `lessons` array and link its ID from the appropriate path and unit. The editor validates lesson IDs, block types, ordering, and cross-references before saving the full catalog transactionally.

There is no JSON-file import step. Back up the database before substantial edits; see [the content database guide](../backend/content-db/README.md).
