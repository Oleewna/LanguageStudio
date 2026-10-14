# Missing Icon Asset Guide

This guide lists the icons currently mapped to `_placeholder.svg`, where they appear, and what to look for when sourcing or creating replacements.

## Where to put and register icons

- Add icon assets to `frontend/public/assets/icons/`.
- Use the semantic names below in `frontend/public/assets/icons/icons.json`; replace each `_placeholder.svg` filename with its asset filename.
- The current icon set uses SVGs with a transparent background, a `0 0 14 14` viewBox, and monochrome filled shapes. Icons are rendered as CSS masks and take their color from the surrounding text.
- After replacing an icon, remove its row from `frontend/public/assets/icons/MISSING.md` and run `node scripts/check-icons.mjs` from the repository root.

The registry maps semantic icon names to SVG files. At runtime, the icon script loads that registry and applies each SVG as a CSS mask to matching icon elements; the mask inherits the element's text color. Names still mapped to `_placeholder.svg` display as outlined squares.

## UI icons to source

| Registry name | Where it appears | Suggested visual |
|---|---|---|
| `close` | Close buttons for the mobile menu, profile modal, and dictionary modal | A clear X made from two even diagonal strokes; readable at small sizes. |
| `chevron-down` | Main navigation dropdowns and learning-path accordion headers | A compact downward V, centered and optically balanced. |
| `chevron-right` | Navigation submenu and lesson breadcrumb/forward cue | A compact right-facing chevron, matching the down chevron's stroke or weight. |
| `streak` | Header streak badge and student widget | A simple flame silhouette, with a distinct outer contour at small sizes. |
| `lock` | Locked or not-yet-available lessons and tests | A closed padlock with a simple shackle and body. |
| `wrong` | Incorrect-answer feedback in exercises and lessons | A bold X/cross that remains distinct from the close button through weight or proportions. |
| `circle` | Empty bullets for upcoming lessons in the navigation | A thin, unfilled circle. |
| `status-dot` | Active/available lesson badges on learning paths | A small solid circle; keep its visual weight subtle beside badge text. |
| `clock` | Test time estimates and duration labels | A simple clock face with hands; omit tiny ticks. |
| `sparkles` | Correct-answer feedback and a marker on the tests page | Two or three four-point sparkles, with one dominant and the others smaller. |
| `lightbulb` | Lesson notes and exercise explanations | A recognizable bulb outline or filled silhouette with a simple base. |
| `filter` | Dictionary filter toggle | A funnel shape with a clear wide top tapering to a short stem. |
| `verb` | Verb exercise category and grammar navigation | A language/grammar cue such as a compact conjugation table or letterform; avoid a generic document icon. |
| `trophy` | Intended for a game-complete state; no direct current render call found | A small cup with handles and a short base, legible as a reward symbol. |
| `traffic-light` | Intended for the greeting traffic-light game; no direct current render call found | A vertical signal with three circular lights, simplified for the 14×14 grid. |

## Course flags

| Registry name | Where it appears | Suggested visual |
|---|---|---|
| `flag-it` | Italian course badge/card and course switcher | Italian tricolor: three equal vertical green, white, and red bands. |
| `flag-es` | Spanish course badge/card and course switcher when the Spanish course is listed | Spanish flag: horizontal red, yellow, and red bands, with the yellow band wider. |

Course flags need color to be recognizable. The current icon renderer uses CSS masks, which discard SVG fill colors. Use a color-capable image/rendering path for flags, or agree on a monochrome flag treatment before adding them to the mask registry; do not expect a colored SVG to remain colored as a mask.

## Already handled separately

`logo-light`, `logo-dark`, and `favicon` are tracked in `MISSING.md`, but they are not square-placeholder assets to source for this icon set. The app already uses `frontend/public/assets/images/light_theme_logo.png`, `frontend/public/assets/images/dark_theme_logo.png`, and `frontend/public/assets/images/icon.png`, respectively. Keep those image references in place.