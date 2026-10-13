# Icon System: Full Replacement Plan

Goal: replace **every** icon-like element on the platform (emojis, inline SVGs, text glyphs used as icons, CSS-injected symbols) with icons from the project's own icon folder, through **one registry and one rendering method**. After this plan, no old icon may remain anywhere.

> **How to use:** tell the AI "do step N in docs/ICON_SYSTEM_PLAN.md". Steps are ordered and each leaves the site working. Tick the progress list as you go.

> **Assumption:** `docs/MULTI_COURSE_PLAN.md` is done (navigation, footer, and profile modal come from `js/layout.js`; lessons from JSON). Section "Where old icons live" still lists the legacy locations so nothing is missed if some are still present.

## Progress

- [ ] Step 1: Audit the icon folder and choose the rendering method
- [ ] Step 2: Master icon list, mapping file, and placeholders
- [ ] Step 3: Icon registry and renderer (`js/icons.js`)
- [ ] Step 4: Icon CSS (sizing, color, dark theme)
- [ ] Step 5: Shared layout (nav, mobile drawer, footer, profile modal)
- [ ] Step 6: Pages and JS-generated UI
- [ ] Step 7: Data files (course packs, categories, games, flags)
- [ ] Step 8: Purge emojis and glyphs from text, translations, and CSS
- [ ] Step 9: Brand assets (logo, favicon) and decorations
- [ ] Step 10: Automated sweep and visual QA
- [ ] Step 11: Authoring guide

---

## Rules

1. **One source of truth:** icons are referenced only by **semantic name** (`streak`, `dictionary`, `lock`), never by file name, emoji, or inline markup.
2. **One way to render:** HTML uses `<span data-icon="name"></span>`; JS uses `getIconSvg('name')` (same function name kept so existing callers keep working, but it now returns markup for the new icons). No other icon markup is allowed anywhere.
3. **Zero old icons.** No emoji, no hand-written `<svg>`, no icon-like text glyphs (`←`, `→`, `›`, `☰`, `✕`, `✔`, `○`, `▶`, etc.), no emoji in CSS `content`, no emoji inside translation keys or data files.
4. **Typographic punctuation stays** (it isn't an icon): `·` separators, `«»` quotes, `—`, `…`, `%`.
5. **Missing icon = placeholder square.** If the folder has no suitable icon, the registry maps the name to a plain placeholder square and the name is added to the missing list (Step 2). Placeholders are replaced later by dropping a file in the folder and updating the mapping, with no code changes.
6. **Content photos are not icons.** Illustrations like `assets/images/communication-basics.jpg` stay as they are.
7. **Icons are decorative by default** (`aria-hidden="true"`). Icon-only buttons keep an `aria-label`.
8. Existing class `.ls-icon` stays as the sizing hook (used in `main.css`, `index.css`, `tests.css`) to avoid CSS churn.

---

## Where old icons live (inventory)

Use this as the checklist of everything to replace.

**Registry and helpers**
- `js/icons.js`: the whole `LS_ICONS` object of inline SVG strings.
- `js/app.js`: theme toggle fallbacks (`☀️`, `🌙`), profile modal (`🌓`, `✕`), `ensureTestsNavigation`, and **emojis inside `UI_TRANSLATIONS` keys and values** (`📚 🃏 ✏️ 📖 🎮 📋 🧭 ➕ 🔄 🎲 👤 🚦 ☀️ 🏷 💡 🔒 🎓 ▶ 💼 🧳 👋 🔤 ⭐ 👆 🇮🇹 🟢 …`).

**Markup (legacy pages, or `layout.js` / `lesson.html` in the new structure)**
- Topbar, mobile drawer, footer, and hero icons on every page: `index.html`, `pages/{units,flashcards,exercises,dictionary,games,grammar,tests}.html`, `lessons/communication-basics-lesson-1.html`.
- Multi-color inline SVGs with hard-coded fills (flashcards, exercises, dictionary, games, grammar nav icons; hub cards on the home page).
- Emojis in markup: `👋 🔤 🇮🇹 ✔ ○ 📑 ⭐ ⌕ ＋ 🚦 🔒 🎓 🟢 ☰` and text arrows `←` `→` `›`.

**JS that generates UI**
- `exercises.js`: inline SVGs inside `CATEGORIES_MAP` names, listen/audio button, and `sparkles`, `close`, `lightbulb`, `user`, `chat`, `shuffle` usages.
- `dictionary.js`: inline star and audio SVGs, `tag`, `units`, `trash`.
- `flashcards.js`: `TRACK_ICONS`, topic icons.
- `games.js`: round icons (`sun`, `moon`, `handshake`), `trophy`, `sparkles`.
- `grammar.js`: `lightbulb`.
- `units.js`: emoji path icons (`👋 🧳 💼`), inline play and chevron SVGs, `🔒 Locked`.
- Lesson scripts/engine: `✓` and `✗` text feedback, takeaway bullets `✔`, sidebar bullets `○`.

**CSS**
- `lesson.css`: `.hero::after { content: "🍋" }`.
- `main.css`: `.ls-icon` rules assuming stroke-based inline SVG (`stroke-width`), `.theme-toggle-btn`, `.menu-toggle` text glyph sizing.
- Leftover or unused: `.nav-flag-pip` (check and delete if unused).

**Data files**
- `course.json`: `paths[].icon` (emoji), `exerciseCategories[].icon`, `flag` in `courses/index.json`, game round `icon` fields.

**Brand assets** (Step 9): `assets/images/icon.png` (favicon), `light_theme_logo.png`, `dark_theme_logo.png`.

---

## Step 1: Audit the icon folder and choose the rendering method

**Goal:** know exactly what the icons are before wiring anything.

**Do:**
1. List every file in the icon folder (put the folder at `assets/icons/` if it isn't there yet). Record in `assets/icons/README.md`:
   - **Format:** SVG or PNG/other.
   - **Style:** single color (monochrome) or multi-color.
   - **Size/grid:** e.g. 24×24, consistent stroke/padding or not.
   - **Variants:** separate dark-theme versions, filled/outline pairs, sizes.
   - **File names** (as they are; do not rename).
2. Choose the rendering method from what you found:

| Icons are | Method |
|---|---|
| Monochrome SVG | **CSS mask**: `<span class="ls-icon" style="--icon:url(...)">` painted with `background: currentColor`. Icons follow text color, hover color, and dark theme automatically. **Preferred.** |
| Multi-color SVG | `<img>`-style rendering (CSS `background-image`), plus dark variants if they don't read on dark backgrounds. |
| PNG / raster | `background-image` at fixed sizes, with `@2x` files if available; no recoloring. |
| Mixed | Per icon in the mapping file (`"mode": "mask" | "image"`). |

3. Write the decision and the reason into `assets/icons/README.md`.

**Done when:**
- [ ] `assets/icons/README.md` exists with format, style, grid, variants, and the chosen method.
- [ ] Decisions needed from the owner are listed at the top of that file (see "Open decisions" below).

---

## Step 2: Master icon list, mapping file, and placeholders

**Goal:** define every icon the platform needs, then match each to a file in the folder.

**Do:**
1. Create `assets/icons/icons.json`: semantic name → file (and optional mode/variants).
```json
{
  "placeholder": { "file": "_placeholder.svg" },
  "streak": { "file": "flame.svg" },
  "dictionary": { "file": "book.svg" }
}
```
2. Create `assets/icons/_placeholder.svg`: a plain solid square (the "random square").
3. For **each name in the master list below**, find the closest icon in the folder and map it. If none fits, map it to `placeholder` and add the name to `assets/icons/MISSING.md` with its purpose (copy it from the list). Do not draw or invent icons.
4. If one icon is reasonable for several names (e.g. `sun` for both theme and game rounds), map them to the same file; never fall back to old icons.

### Master icon list

**Navigation and layout**

| Name | Used for |
|---|---|
| `home` | Home link, "neighbors" exercise category |
| `paths` | Learning paths / units (nav, hub card, units page) |
| `lesson` | Lesson links (play-in-circle), active lesson |
| `flashcards` | Flashcards section |
| `exercises` | Exercises section |
| `dictionary` | Dictionary section |
| `games` | Games section |
| `grammar` | Grammar guide section |
| `tests` | Tests section |
| `menu` | Mobile menu button |
| `close` | Close buttons, modals, wrong-answer mark |
| `sun`, `moon` | Theme toggle, game round times of day |
| `chevron-down` | Dropdown and accordion arrows |
| `chevron-right` | Submenu arrow (replaces `›`) |
| `arrow-left`, `arrow-right` | Back/next, "All lessons →", "← Home" (replace `←` `→`) |
| `play` | "Open" / "Start" buttons (replaces `▶`) |

**Student, status, and feedback**

| Name | Used for |
|---|---|
| `streak` | Streak badge |
| `xp` | XP badge |
| `lock` | Locked/soon items |
| `check` | Correct mark, takeaway bullets, completed lesson |
| `wrong` | Incorrect mark (can reuse `close` file) |
| `circle` | Empty lesson bullet (replaces `○`) |
| `status-dot` | "Active" badge dot (replaces 🟢) |
| `clock` | Time estimates, "Coming soon" heading |
| `graduation` | Path recap / summary (replaces 🎓) |
| `sparkles` | Success messages |
| `trophy` | Game complete |
| `lightbulb` | Notes, explanations |
| `user` | Dialogue speakers, avatar fallback |

**Actions**

| Name | Used for |
|---|---|
| `search` | Search boxes |
| `add` | Add word, add buttons |
| `delete` | Delete custom word |
| `audio` | Play pronunciation |
| `shuffle` | Shuffle cards / matching |
| `tap` | "Tap to flip" hint |
| `filter` | Filters toggle |
| `generate` | "Generate quiz" button |
| `star`, `star-filled` | Learned-word toggle (two states) |
| `layers` | Counts, filters, "view all" |
| `tag` | Word category label |
| `globe` | Language / "all categories" |

**Topics, categories, and formats**

| Name | Used for |
|---|---|
| `greeting` | Greetings (handshake/wave) |
| `pin` | Articles / grammar group |
| `verb` | Verb conjugation |
| `chat` | Dialogue, pronouns, situational |
| `type` | Sentence structure, basic phrases |
| `article` | Articles cheat sheet |
| `cafe` | Cafe and bar |
| `directions` | Asking directions |
| `shopping` | Shopping and prices |
| `mcq` | Multiple-choice format |
| `blank` | Fill-in-the-blank format |
| `match` | Matching format |
| `reorder` | Word-order format |
| `listen` | Listening format |
| `dialogue` | Dialogue format |
| `from-dictionary` | "From dictionary" format |
| `target` | Exercise bank, tests |
| `traffic-light` | Greeting traffic-light game |
| `travel` | Travel path (suitcase) |
| `business` | Business path (briefcase) |

**Courses and brand**

| Name | Used for |
|---|---|
| `flag-it` (one `flag-<code>` per course) | Course badges and switcher (replaces 🇮🇹) |
| `logo-light`, `logo-dark` | Header logo |
| `favicon` | Browser tab icon |

**Done when:**
- [ ] Every name in the master list exists in `icons.json`, either mapped to a real file or to `placeholder`.
- [ ] `assets/icons/MISSING.md` lists exactly the names mapped to `placeholder`, with their purpose.
- [ ] No name maps to an old icon, emoji, or inline SVG.

---

## Step 3: Icon registry and renderer (`js/icons.js`)

**Goal:** one tiny module serves all icons from the mapping file.

**Do:**
1. Delete the entire `LS_ICONS` object and every inline SVG string from `js/icons.js`.
2. Load `assets/icons/icons.json` once (resolve the base path from `/`, `/pages/`, `/lessons/`, same helper as in `course.js`). Cache it.
3. Keep `getIconSvg(name)` (rename later if desired) returning the markup string for the chosen method, e.g. `<span class="ls-icon" data-name="streak" style="--icon:url('...')" aria-hidden="true"></span>`.
4. `renderRegisteredIcons(root)` fills every `[data-icon]` element (already in `app.js`; move it here).
5. **Unknown name:** return the `placeholder` icon and log one `console.warn` per missing name (`Icon "xyz" not found`). Never return an empty string, since invisible icons hide bugs.
6. Preload or render icons synchronously from the cached mapping so there is no flash of empty icons. If the mapping isn't loaded yet, `layout.js` waits for it before rendering.
7. Support two-state icons by name (`star` / `star-filled`), not by swapping markup.
8. Add `getIconNames()` for tooling and the sweep script.

**Done when:**
- [ ] `icons.js` contains no SVG or emoji.
- [ ] A deliberately wrong name shows the placeholder square and a console warning.

---

## Step 4: Icon CSS (sizing, color, dark theme)

**Goal:** icons look consistent everywhere.

**Do:**
1. Rewrite the `.ls-icon` rules in `main.css` for the chosen method (mask: `width/height: 1.3em; background: currentColor; mask: var(--icon) center/contain no-repeat;`). Remove stroke-based rules (`stroke-width`, `fill`).
2. Keep the existing context sizes (`.dd-icon .ls-icon`, `.ic .ls-icon`, `.stat-pill .ls-icon`, `.hub-icon .ls-icon`, `.theme-toggle-btn .ls-icon`, `.eyebrow .ls-icon`, `.topic-icon .ls-icon`) and verify alignment with text baselines.
3. Color comes from `currentColor` so hover, active, and dark theme work automatically. Remove all hard-coded icon fills.
4. If using multi-color or raster icons: add dark-theme variants via `[data-theme="dark"]` rules and the `variants` field in the mapping.
5. Define the placeholder look (`.ls-icon[data-name="placeholder"]`): a visible square with a subtle outline so it's obvious in QA.
6. Remove obsolete CSS: `.nav-flag-pip` if unused, any rule targeting `svg` inside icon wrappers.

**Done when:**
- [ ] Icons scale with font size and follow text color on hover/active in both themes.
- [ ] No CSS rule refers to inline `svg` for icons.

---

## Step 5: Shared layout (nav, mobile drawer, footer, profile modal)

**Goal:** the most visible icons use the new set first.

**Do:**
1. In `js/layout.js`, replace every icon in the topbar, dropdowns, mobile drawer, footer, and profile modal with `data-icon`/`getIconSvg` calls using the master names. The old multi-color nav icons (cards, checklist, book, gamepad, clipboard) become `flashcards`, `exercises`, `dictionary`, `games`, `grammar`.
2. Text glyphs become icons: `☰` → `menu`, `✕` → `close`, `›` → `chevron-right`, `○` → `circle`, `←`/`→` → `arrow-left`/`arrow-right`.
3. Theme toggle: show `sun` or `moon` by theme (remove emoji fallbacks in `updateThemeToggleButtons`).
4. Streak and XP badges use `streak` and `xp`.
5. Icon-only buttons keep `aria-label`.

**Done when:**
- [ ] Opening any page shows only new icons in header, drawer, footer, and profile modal.
- [ ] `layout.js` has no `<svg`, emoji, or glyph icons.

---

## Step 6: Pages and JS-generated UI

**Goal:** replace icons in all page content and everything generated by scripts.

**Do (follow the inventory above file by file):**
1. Home: hero label, hub cards (`paths`, `flashcards`, `exercises`, `dictionary`, `games`, `grammar`, `tests`), roadmap buttons and badges (`play`, `lock`, `graduation`, `status-dot`, `check`).
2. Units: path icons (use the `icon` name from data, see Step 7), lesson rows (`play`, `lock`, completed `check`), accordion `chevron-down`.
3. Flashcards: tags, hint (`tap`), controls (`arrow-left`, `arrow-right`, `audio`, `shuffle`).
4. Exercises: category pills and names, format tabs (`mcq`, `blank`, `match`, `reorder`, `listen`, `dialogue`, `from-dictionary`), feedback (`sparkles`, `wrong`, `lightbulb`), dialogue (`user`, `chat`), matching shuffle button, generate button. Category names stop embedding inline SVG; they use the category's `icon` field.
5. Dictionary: card meta (`paths`/`tag`), `star`/`star-filled`, `audio`, `delete`, `search`, `add`, `filter`, modal `close`.
6. Games: situation icons (`sun`, `moon`, `greeting`), `traffic-light`, `trophy`, `sparkles`, `clock`.
7. Grammar: tab icons (`article`, `verb`, `greeting`), `lightbulb` in notes.
8. Tests: topic icons, `lock`, `clock`, `layers`, `target`, `paths` link arrow.
9. Lessons: section title icons, dialogue audio buttons, takeaway bullets (`check`), sidebar bullets (`circle`/`check`/`lock`), grading feedback `✓`/`✗` text becomes `check`/`wrong` icons plus words.
10. Block renderers (`js/blocks.js`): any icon fields (note `icon`) resolve through `getIconSvg`.

**Done when:**
- [ ] Every page, in every state (empty, correct, wrong, locked, completed), shows only new icons.
- [ ] No `<svg`, emoji, or glyph icon remains in any `.html` or `.js` file outside `assets/icons/`.

---

## Step 7: Data files (course packs, categories, games, flags)

**Goal:** content data refers to icons by name only.

**Do:**
1. `course.json`: `paths[].icon` becomes a semantic name (`greeting`, `travel`, `business`), and `exerciseCategories[].icon` too. Remove every emoji.
2. `courses/index.json`: replace `flag: "🇮🇹"` with `flag: "flag-it"` (an icon name).
3. `games.json`: round `icon` fields become icon names.
4. `grammar.json` and lesson JSON: note/block `icon` fields use names only.
5. Update `docs/schemas.md`: `icon` is always a registry name; emojis are not allowed in data.
6. Unknown names in data trigger the placeholder + warning (Step 3), so a typo is visible.

**Done when:**
- [ ] All JSON under `courses/` contains no emoji and every `icon`/`flag` value exists in `icons.json`.

---

## Step 8: Purge emojis and glyphs from text, translations, and CSS

**Goal:** remove symbols hiding in strings.

**Do:**
1. `UI_TRANSLATIONS` in `app.js`: remove emojis from **keys and values** (e.g. `'📚 Розділи': '📚 Learning paths'` becomes plain-text entries). Since icons are now separate elements, the matching text nodes are clean. Delete duplicate keys that differed only by emoji. Check that the translation walker still matches the remaining text.
2. Remove glyph characters used as icons from visible text (`←`, `→`, `▶`, `✔`, `✓`, `✗`, `›`, `○`, `★`, `☰`, `⌕`, `＋`).
3. CSS: delete `.hero::after { content: "🍋" }` in `lesson.css` (or, if the owner wants a decoration, replace with a mapped icon, see Step 9). Search all CSS for `content:` values containing symbols.
4. HTML `<title>` and meta text: no emoji.
5. Placeholder and button texts: no emoji.

**Done when:**
- [ ] A search for emoji and the glyph list across the repo returns nothing outside `assets/icons/` and node tooling.
- [ ] Switching language still translates all UI text.

---

## Step 9: Brand assets (logo, favicon) and decorations

**Goal:** finish the "no old icon" rule for images that act as icons.

**Do:**
1. If the icon folder contains the **logo** and **favicon**, map `logo-light`, `logo-dark`, and `favicon`. Update the `<link rel="icon">` (now generated in `layout.js` or set per page) and `.brand-logo` handling in `theme.js` so it reads from the mapping instead of fixed `assets/images/*_logo.png` paths. Then delete the old logo and favicon files.
2. If the folder has **no** logo/favicon: keep the current ones, and add `logo-light`, `logo-dark`, `favicon` to `MISSING.md` so it's tracked (do not use a placeholder square for the logo; keep the existing one until replaced).
3. The decorative lemon in the lesson hero is removed (Step 8). If a replacement decoration is wanted, add a `decoration` name to the master list.
4. Course flags (`flag-<code>`) follow the same rule: use files from the folder; otherwise placeholder.

**Done when:**
- [ ] Brand assets either come from the mapping or are explicitly listed as pending in `MISSING.md`.
- [ ] No unused old icon files remain in `assets/images/` (content photos stay).

---

## Step 10: Automated sweep and visual QA

**Goal:** prove nothing old is left, and keep it that way.

**Do:**
1. Add `scripts/check-icons.mjs` (plain Node, no dependencies) that scans the repo (excluding `assets/icons/` and `docs/`) and **fails** on:
   - Any emoji/pictograph (`/\p{Extended_Pictographic}/u`) and variation selectors.
   - Icon-like glyphs: `← → ↑ ↓ › ‹ ▶ ▸ ☰ ✕ ✖ ✔ ✓ ✗ ● ○ ★ ☆ ⌕ ＋`.
   - Any `<svg` or `<symbol` tag in `.html`, `.js`, `.css`, `.json`.
   - CSS `content:` containing non-ASCII symbols.
   - Any `data-icon`, `getIconSvg('...')`, `icon:` or `flag:` value that is not a key in `icons.json`.
2. It also **reports** (does not fail): names mapped to `placeholder`, and icons in the folder never used.
3. Visual QA checklist (manual), for light and dark theme, desktop and mobile widths:
   - Every page loads with no placeholder squares except the ones listed in `MISSING.md`.
   - Dropdowns, mobile drawer, profile modal, accordions, filters, tabs.
   - All exercise formats in correct and wrong states, flashcards flip, game complete screen.
   - Locked, available, and completed lessons.
   - Hover and active colors; icon alignment with text; no icon clipped or blurry.
4. Update `README.md`: how to run the icon check.

**Done when:**
- [ ] `node scripts/check-icons.mjs` exits cleanly.
- [ ] QA checklist done in both themes and on mobile width.

---

## Step 11: Authoring guide

**Goal:** make replacing the placeholders and adding future icons trivial.

**Do:**
1. Add `docs/ADDING_AN_ICON.md`:
   - Drop the file into `assets/icons/`.
   - Add or update the name in `icons.json` (and remove it from `MISSING.md`).
   - Use it with `data-icon="name"` or `getIconSvg('name')`; never inline SVG or emoji.
   - Run `node scripts/check-icons.mjs`.
2. Mention in `docs/ADDING_A_COURSE.md` (from the multi-course plan) that course `icon` and `flag` fields use registry names, and how to request a new `flag-<code>` icon.

**Done when:**
- [ ] A new contributor can replace a placeholder using only the guide.

---

## Open decisions (answer before Step 1 or 9)

1. **Icon format and style** of your folder (SVG vs PNG, monochrome vs colored). This decides the rendering method in Step 1.
2. **Logo and favicon:** are they included in the icon folder, or should the current ones stay for now?
3. **Lemon decoration** in the lesson hero: remove it, or replace it with a specific icon?
4. **Flags:** do you have flag icons for courses, or should they be placeholders until the courses exist?
