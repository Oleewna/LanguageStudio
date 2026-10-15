# Missing Icon Asset Guide

This guide lists the icons currently mapped to `_placeholder.svg`, where they appear, and what to look for when sourcing or creating replacements.

## Where to put and register icons

- Add icon assets to `frontend/public/assets/icons/`.
- Use the semantic names below in `frontend/public/assets/icons/icons.json`; replace each `_placeholder.svg` filename with its asset filename.
- The current icon set uses SVGs with a transparent background, a `0 0 14 14` viewBox, and monochrome filled shapes. Icons are rendered as CSS masks and take their color from the surrounding text.
- After replacing an icon, remove its row from `frontend/public/assets/icons/MISSING.md` and run `node scripts/check-icons.mjs` from the repository root.

The registry maps semantic icon names to SVG files. At runtime, the icon script loads that registry and applies each SVG as a CSS mask to matching icon elements; the mask inherits the element's text color. Names still mapped to `_placeholder.svg` display as outlined squares.

## UI icons still to source

The entries below are the ones still mapped to `_placeholder.svg` in the live registry.

| Registry name | Where it appears | Suggested visual |
|---|---|---|
| `sparkles` | Correct-answer feedback and a marker on the tests page | Two or three four-point sparkles, with one dominant and the others smaller. |
| `verb` | Verb exercise category and grammar navigation | A language/grammar cue such as a compact conjugation table or letterform; avoid a generic document icon. |

## Course flags

| Registry name | Where it appears | Suggested visual |
|---|---|---|
| `flag-it` | Italian course badge/card and course switcher | Italian tricolor: three equal vertical green, white, and red bands. |
| `flag-es` | Spanish course badge/card and course switcher when the Spanish course is listed | Spanish flag: horizontal red, yellow, and red bands, with the yellow band wider. |

Course flags need color to be recognizable. The current icon renderer uses CSS masks, which discard SVG fill colors. Use a color-capable image/rendering path for flags, or agree on a monochrome flag treatment before adding them to the mask registry; do not expect a colored SVG to remain colored as a mask.

## Already handled separately

`logo-light`, `logo-dark`, and `favicon` are tracked in `MISSING.md`, but they are not square-placeholder assets to source for this icon set. The app already uses `frontend/public/assets/images/light_theme_logo.png`, `frontend/public/assets/images/dark_theme_logo.png`, and `frontend/public/assets/images/icon.png`, respectively. Keep those image references in place.