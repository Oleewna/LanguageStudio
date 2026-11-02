# Italian lesson exports

These files are readable source documents, not files that the platform loads directly:

- [communication-basics.md](./communication-basics.md) contains eleven short, bilingual Italian lessons. Each introduces one small conversational step and includes five quick practice exercises.
- [italian-reading.md](./italian-reading.md) contains the Italian-specific reading rules and contextual review that were added by the platform outside the course JSON. It skips the alphabet-basics lesson and uses reusable, Italian-term-based vocabulary IDs.

## Re-adding a lesson to the platform

1. Pick a unique lesson ID. For an older embedded draft, either merge its content into the current lesson or give it a new ID.
2. Convert the lesson text into a JSON file at `courses/it/lessons/<lesson-id>.json`. Keep the content as plain text in JSON values; do not include presentation details such as audio controls or avatars unless needed.
3. Add a lesson entry to a unit in `courses/it/course.json`, inside `paths[].units[].lessons[]`. Include the ID, localized title and description, lesson number, duration, and `status: "available"`. Set previous/next lesson IDs when lessons should be linked.
4. Put the lesson body in the JSON file's `blocks` array. Use localized `uk` and `en` text where needed. Existing lesson formats include `dialogue`, `vocab`, `grammar_rule`, `story_text`, `culture_note`, `takeaways`, and `tasks`/`quiz`.
5. Serve the repository through the app's normal web server. The existing lesson loader reads `courses/<course-id>/lessons/<lesson-id>.json` and uses the matching entry in `course.json` to show the lesson in its path.

Typical block content maps as follows:

- Dialogue: speaker, Italian line, pronunciation, and Ukrainian/English translation.
- Vocabulary: Italian word or phrase and Ukrainian/English translations.
- Grammar or story text: explanation or reading, with any vocabulary hints.
- Takeaways: short points to remember.
- Tasks/quiz: question, choices or answer, and the correct answer.

These human-readable lesson files are source material for review, but there is no automatic text-to-lesson importer. Re-adding lessons requires converting the relevant content to the JSON structure above and linking it from `course.json`.
