# Adding a path

1. Open the course content in the admin editor.
2. Add a new path object with the required id, title, and ordering metadata.
3. Create one or more lesson records under the path.
4. Link each lesson to the correct `lesson_id` values used in the shared vocabulary import.

The word catalog is intentionally independent from course path metadata. Path and lesson information are used for unlock rules and filtering, but the vocabulary itself is stored globally and resolved by `course` and `wordId`.
