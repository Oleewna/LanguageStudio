# Adding a course

Courses in LanguageStudio are a lightweight metadata layer. The shared vocabulary catalog is not a per-course file anymore.

1. Add the course metadata to the course index in the admin editor or in the generated catalog.
2. Use a course code like `it` or `es`; the course code must also exist as the target-language code in the vocab catalog.
3. Keep the course id generic; do not add any `if (course === 'xx')` checks in the app logic.
4. Add a lesson path or unit as usual in the course editor.
5. If the new course is a target language with a new vocabulary set, import a CSV with the proper `lang` column and the same schema as the other target languages.

The key rule is: each course is just a target language plus its learning content. New interface languages or new target languages should only need new CSV rows and new `trans_<code>` columns, not new code paths.
