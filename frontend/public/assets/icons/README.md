# Icon Asset Audit

## Decisions

- Rendering: use CSS masks for the monochrome SVGs listed below.
- Logo and favicon: these are not in this folder. Keep using `../images/light_theme_logo.png`, `../images/dark_theme_logo.png`, and `../images/icon.png`; their registry names remain tracked in `MISSING.md` and must not render as placeholder squares.
- Course flags: no flag icons are in this folder. Map course flag names to the placeholder until dedicated assets are added.
- Lesson lemon decoration: the folder has a lemon icon, but whether to remove or use it is deferred to Step 8.

## Format and Rendering

- Format: 100 SVG files; no raster assets or other formats.
- Style: monochrome filled shapes, using black (`#000000`) paths with transparent backgrounds. They are suitable for CSS masks and can be recolored through `currentColor`.
- Grid: every SVG uses `viewBox="0 0 14 14"` and declares a 14 by 14 intrinsic size.
- Variants: no theme-specific, size, or outline/filled variants were found as paired assets. `Star-2` and `Star-Badge` are separate designs, not declared state variants.
- Method: CSS mask, with `background: currentColor` and the SVG URL supplied by the registry. This uses the common grid and allows icons to follow text colors in both themes.

## File Inventory

All filenames are preserved as found:

```text
Add-1--Streamline-Core-Remix.svg
Add-Square--Streamline-Core-Remix.svg
Airport-Plane--Streamline-Core-Remix.svg
Ambulance--Streamline-Core-Remix.svg
Bag-Suitcase-2--Streamline-Core-Remix.svg
Ball--Streamline-Core-Remix.svg
Bill-2--Streamline-Core-Remix.svg
Bookmark-1--Streamline-Core-Remix.svg
Bow-Tie--Streamline-Core-Remix.svg
Briefcase-Dollar--Streamline-Core-Remix.svg
Brightness-1--Streamline-Core-Remix.svg
Building-2--Streamline-Core-Remix.svg
Bullet-List--Streamline-Core-Remix.svg
Burger-1--Streamline-Core-Remix.svg
Bus--Streamline-Core-Remix.svg
Business-Handshake--Streamline-Core-Remix.svg
Business-User-Curriculum--Streamline-Core-Remix.svg
Button-Fast-Forward-1--Streamline-Core-Remix.svg
Button-Fast-Forward-2--Streamline-Core-Remix.svg
Button-Next--Streamline-Core-Remix.svg
Button-Pause-2--Streamline-Core-Remix.svg
Button-Play--Streamline-Core-Remix.svg
Button-Previous--Streamline-Core-Remix.svg
Button-Rewind-1--Streamline-Core-Remix.svg
Button-Rewind-2--Streamline-Core-Remix.svg
Button-Stop--Streamline-Core-Remix.svg
Calculator-1--Streamline-Core-Remix.svg
Car-Taxi-1--Streamline-Core-Remix.svg
Cards--Streamline-Core-Remix.svg
Chat-Bubble-Typing-Oval--Streamline-Core-Remix.svg
Check--Streamline-Core-Remix.svg
Clipboard-Add--Streamline-Core-Remix.svg
Clipboard-Check--Streamline-Core-Remix.svg
Clipboard-Remove--Streamline-Core-Remix.svg
Coffee-Takeaway-Cup--Streamline-Core-Remix.svg
Cog-1--Streamline-Core-Remix.svg
Credit-Card-1--Streamline-Core-Remix.svg
Customer-Support-1--Streamline-Core-Remix.svg
Definition-Search-Book--Streamline-Core-Remix.svg
Delete-1--Streamline-Core-Remix.svg
Diamond-2--Streamline-Core-Remix.svg
Dice-1--Streamline-Core-Remix.svg
Dice-2--Streamline-Core-Remix.svg
Dice-3--Streamline-Core-Remix.svg
Dice-4--Streamline-Core-Remix.svg
Dice-5--Streamline-Core-Remix.svg
Dice-6--Streamline-Core-Remix.svg
Dictionary-Language-Book--Streamline-Core-Remix.svg
Dollar-Coin--Streamline-Core-Remix.svg
Earth-1--Streamline-Core-Remix.svg
Equal-Sign--Streamline-Core-Remix.svg
Fork-Spoon--Streamline-Core-Remix.svg
Gift--Streamline-Core-Remix.svg
Gift-2--Streamline-Core-Remix.svg
Global-Learning--Streamline-Core-Remix.svg
Graduation-Cap--Streamline-Core-Remix.svg
Heart--Streamline-Core-Remix.svg
Hearts-Symbol--Streamline-Core-Remix.svg
Home-4--Streamline-Core-Remix.svg
Ice-Cream-3--Streamline-Core-Remix.svg
Invisible-1--Streamline-Core-Remix.svg
Invisible-2--Streamline-Core-Remix.svg
Lemon-Fruit-Seasoning--Streamline-Core-Remix.svg
Link-Chain--Streamline-Core-Remix.svg
Lipstick--Streamline-Core-Remix.svg
Live-Video--Streamline-Core-Remix.svg
Location-Pin-3--Streamline-Core-Remix.svg
Magnifying-Glass--Streamline-Core-Remix.svg
Map-Fold--Streamline-Core-Remix.svg
Medical-Bag--Streamline-Core-Remix.svg
Moon-Cloud--Streamline-Core-Remix.svg
Ok-Hand--Streamline-Core-Remix.svg
Open-Book--Streamline-Core-Remix.svg
Orientation-Landscape--Streamline-Core-Remix.svg
Paint-Palette--Streamline-Core-Remix.svg
Paintbrush-1--Streamline-Core-Remix.svg
Paperclip-1--Streamline-Core-Remix.svg
Pen-Tool--Streamline-Core-Remix.svg
Recycle-Bin-2--Streamline-Core-Remix.svg
Shopping-Basket-1--Streamline-Core-Remix.svg
Star-2--Streamline-Core-Remix.svg
Star-Badge--Streamline-Core-Remix.svg
Store-1--Streamline-Core-Remix.svg
Strategy-Tasks--Streamline-Core-Remix.svg
Target--Streamline-Core-Remix.svg
Task-List--Streamline-Core-Remix.svg
Tea-Cup--Streamline-Core-Remix.svg
Text-Square--Streamline-Core-Remix.svg
Text-Style--Streamline-Core-Remix.svg
Ticket-1--Streamline-Core-Remix.svg
Tooth--Streamline-Core-Remix.svg
User-Circle-Single--Streamline-Core-Remix.svg
User-Identifier-Card--Streamline-Core-Remix.svg
Volume-Level-High--Streamline-Core-Remix.svg
Volume-Level-Low--Streamline-Core-Remix.svg
Volume-Level-Off--Streamline-Core-Remix.svg
Volume-Mute--Streamline-Core-Remix.svg
Waning-Cresent-Moon--Streamline-Core-Remix.svg
Wave-Signal-Square--Streamline-Core-Remix.svg
Web--Streamline-Core-Remix.svg
```