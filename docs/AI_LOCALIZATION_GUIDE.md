# AI Localization Guide

This project supports two interface and explanation languages: Ukrainian (`uk`) and English (`en`). Keep them separate in every UI string, course description, instruction, hint, explanation, and translation.

## Required rules

1. **Write a complete pair.** Every localized object must contain non-empty `uk` and `en` string values:

   ```json
   {
     "uk": "Як справи?",
     "en": "How are you?"
   }
   ```

2. **Do not copy one language into the other.** Translate the complete meaning naturally. Do not leave Ukrainian words, sentences, or option labels in `en`, and do not leave English explanations in `uk`.
3. **Keep the target language distinct from the explanation language.** Italian or Spanish phrases being taught may stay identical in both values when the learner must see the original phrase. Translate the surrounding prompt, instructions, answer labels, and explanations into each interface language.
4. **Do not use a raw string for learner-facing prose.** Use a `{ "uk": "...", "en": "..." }` object. Raw strings are appropriate only for language-neutral data or target-language answers whose wording must remain unchanged.
5. **Preserve meaning and learning level.** Use natural, grammatically correct Ukrainian and English; do not translate target-language examples as if they were interface copy. Keep names, course IDs, markup, placeholders, and exercise meaning intact.
6. **Never fix missing translations with a runtime fallback to the other language.** Add the missing translation instead. The app deliberately resolves only the selected locale so missing copy cannot silently masquerade as a translation.

## Before finishing a language change

- Check every changed localized pair: `uk` is natural Ukrainian and `en` is natural English.
- Confirm target-language examples are intentionally shared, not accidentally untranslated interface text.
- Run `node scripts/validate-courses.mjs` for course JSON changes.
- Search the changed files for Cyrillic characters in English values and for English prose accidentally left in Ukrainian values.
- Keep UI translation dictionaries complete in both languages and verify both language settings.

When adding a language or changing the localization model, update the resolver, validation, and this guide together. Do not infer language from course IDs: `uk` and `en` select the learner-facing explanation language; course-specific strings teach the target language.
