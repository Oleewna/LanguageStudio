# Flashcards Trainer Page (Deprecated / Merged)

> [!IMPORTANT]
> **Page Deprecation & Merger Notice**
> The standalone `/flashcards` route and `pages/flashcards.html` (along with `js/flashcards.js`) have been removed from the application. 
> Flashcard functionality is now permanently integrated into the **Practice Hub** at [`pages/exercises.html?mode=flashcards`](./exercises.md).
> All links across the top navigation, mobile drawer, and home dashboard now point directly to `exercises.html?mode=flashcards`.

---

## Migration Summary

- **New URL / Route**: [`/exercises?mode=flashcards`](./exercises.md) or [`pages/exercises.html?mode=flashcards`](./exercises.md)
- **Active Documentation**: Please refer to [**Practice & Exercises Hub (`exercises.md`)**](./exercises.md) for full DOM structure, spaced repetition mechanics, and API details.
- **Underlying Logic**: Spaced repetition, 3D card flipping, audio pronunciation, and "Mark as learned" mastery toggles remain fully functional inside `exercises.js` within the `#mode-flashcards` container of `exercises.html`.
