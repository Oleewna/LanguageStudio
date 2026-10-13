# Adding an Icon

Icons are stored in `frontend/public/assets/icons/` and referenced by semantic name through the icon registry.

1. Add the icon file to `frontend/public/assets/icons/`.
2. Add or update its semantic name in `frontend/public/assets/icons/icons.json`, pointing to the file. If the name was mapped to `_placeholder.svg`, remove it from `frontend/public/assets/icons/MISSING.md` after adding the real asset.
3. Use the registry name in HTML with `<span data-icon="cafe"></span>` or in JavaScript with `getIconSvg('cafe')`. Do not reference filenames directly or add inline SVG, emoji, or glyph icons.
4. If no suitable asset exists yet, map the semantic name to `_placeholder.svg` and document its purpose in `MISSING.md`.
5. Run `node scripts/check-icons.mjs` from the repository root.

Course flags use the name `flag-<course-code>` (for example, `flag-fr`). If its asset is not available, keep the registry entry mapped to the placeholder and list it in `MISSING.md` until the flag asset is supplied.