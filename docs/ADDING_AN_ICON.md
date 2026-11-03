# Adding an icon

Icons are registered by semantic names and resolved through `getIconSvg()` / the icon manifest.

1. Reuse an existing icon name if the meaning matches.
2. If a new value is required, add it to `frontend/public/assets/icons/icons.json`.
3. Then run:

```bat
node scripts/check-icons.mjs
```

Avoid inline SVGs, emoji, or custom glyphs in the UI. The icon registry is the single source of truth for icon names.
