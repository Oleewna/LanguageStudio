# Adding vocabulary

The catalog is filled from a CSV import. Use `scripts/import-vocab.mjs` to load data into the shared SQLite database.

## CSV columns

The required columns are:

- `id` — unique catalog id such as `it-001`
- `lang` — target language code such as `it` or `es`
- `word` — the target-language word or phrase
- `lesson` — one or more lesson ids separated by `|`
- `path` — path id or group label
- `topic` — thematic category
- `category` — broader classification
- `type` — part of speech or phrase type

Dynamic columns:

- `trans_<code>` — translation to an interface language, for example `trans_uk`, `trans_en`, `trans_pl`
- `phon_<code>` — phonetic value for an interface language, for example `phon_uk`
- `ex1_text`, `ex1_trans_uk`, `ex1_trans_en` — example sentence and its translations
- Additional example blocks use `ex2_text`, `ex3_text`, etc.

## Import command

```bat
node scripts/import-vocab.mjs docs/vocab-template.csv
node scripts/import-vocab.mjs docs/vocab-template.csv --dry-run
node scripts/import-vocab.mjs docs/vocab-template.csv --require=uk,en
```

The importer is idempotent: re-importing the same file updates rows instead of duplicating them.

## Adding a new target language

If the target language is new, just add rows with `lang=fr` and import them. The `languages` table will accept the new row; no schema change is required.

## Adding a new interface language

If the import sees a new `trans_pl` or `phon_pl` column, the importer auto-creates a language row and marks it as interface language only. No frontend code change is needed in the app because all translations are resolved dynamically from the catalog.
