# Settings Page Plan

## Goal
Create a dedicated Settings / Preferences page for LanguageStudio that fits the current app architecture, reuses the existing local storage-based preferences model, and gives users a clean way to manage course, interface language, and theme settings.

## Current state
The app already has the core settings logic in place:
- source language preferences are saved in localStorage
- target course is stored and reused across pages
- theme switching is already supported
- the profile modal exposes a compact version of the same settings UI

The main gap is that the settings experience is fragmented: the user can only adjust preferences through the modal instead of a full page.

---

## Step 1: Confirm the existing settings foundation
Review and validate the current settings behavior before making UI changes.

### Tasks
- Inspect the source-language logic in `frontend/public/js/app.js`
- Confirm the course selection flow and persistence keys
- Confirm the theme toggle behavior and dark/light state handling
- Make sure the app updates the UI after changing each setting without a page reload

### Outcome
A single, shared preferences model is used for:
- interface language
- translation language
- course selection
- theme

This ensures the page and the modal stay synchronized.

---

## Step 2: Define the settings page scope
Keep the page limited to client-side user preferences, since the project does not yet have a real account system.

### Recommended sections
- Profile summary
- Course selection
- Interface / translation language
- Theme
- Future optional cards: accessibility, sound, lesson reminders

### Not in scope for now
- login or user account management
- server-side profile sync
- payment or subscription features

### Outcome
The page is treated as a “Preferences” screen rather than an account dashboard.

---

## Step 3: Create the dedicated settings page
Add a proper page in the frontend flow for preferences.

### Implementation direction
- Create a new page under `frontend/public/pages/`
- Reuse the current navigation and page shell patterns
- Add a visible entry in the main app navigation or profile access flow
- Keep the modal as a shortcut so existing quick-actions still work

### Outcome
Users can access all preferences from a single, dedicated screen.

---

## Step 4: Reuse existing state handlers instead of creating a second settings system
The page should use the current handlers already defined in the app instead of introducing parallel logic.

### Reuse these flows
- `setSourceLanguage()`
- `getSourceLanguage()`
- `setTargetCourse()`
- `getTargetCourse()`
- `toggleTheme()`
- `applySourceLanguageSettings()`

### Why this matters
This keeps:
- localStorage keys consistent
- UI language switching predictable
- theme behavior the same across pages
- no duplicated state logic

### Outcome
The same settings state drives both the modal and the full page.

---

## Step 5: Build the page layout
Design the page around a simple card-based layout.

### Suggested structure
1. Header
   - Settings title
   - short description (for example: “Preferences saved on this device”)
2. Profile card
   - student avatar
   - guest/student label
   - progress note
3. Preferences cards
   - course selector
   - language selector
   - theme toggle
4. Optional future cards
   - accessibility
   - audio / sound
   - daily reminder options

### Visual rules
- Follow the existing LanguageStudio card and dark theme system
- Use soft borders, consistent spacing, and readable form controls
- Ensure the layout stacks cleanly on mobile

### Outcome
The settings page feels native to the existing app and is easy to scan.

---

## Step 6: Localize all labels correctly
This project already follows a bilingual pattern and the settings page must not mix languages.

### Requirements
- Ukrainian and English labels only
- use the same translation pattern as the existing app
- check both languages before finalizing the UI

### Example fields
- Settings title
- Course label
- Interface language label
- Theme label
- Save/description text
- profile-related copy

### Outcome
The page remains consistent with the rest of the app and matches the user memory guidance for UI strings.

---

## Step 7: Style for light and dark themes
Use the current platform theme system from the app’s CSS base.

### Tasks
- Confirm the page inherits the root theme tokens
- Add dark mode overrides where necessary
- Ensure form controls remain readable in both themes
- Check the page looks polished without adding new visual inconsistencies

### Outcome
The settings page is comfortable in both light and dark mode.

---

## Step 8: Verify persistence and behavior
Before calling the feature complete, test the actual app behavior.

### Manual checks
- Open the settings page
- change the course
- change the interface language
- change the theme
- refresh the page
- verify preferences are still present
- navigate across pages and confirm the language and course still match

### Expected result
The settings page behaves like the existing system, and user choices persist on-device.

---

## Step 9: Keep the modal as a quick-access layer
Do not remove the existing modal immediately; instead, make it a shortcut surface.

### Reasoning
- Users already know the current settings UI
- Existing layout patterns rely on it
- the modal remains useful as a fast preference panel

### Preferred behavior
- the page becomes the main destination
- the modal remains the quick-access entry point

### Outcome
The new page enhances the interface without breaking current flows.

---

## Step 10: Future expansion
This page should be prepared for future settings without requiring a rewrite.

### Good additions later
- sound / volume
- reading speed
- accessibility color contrast toggle
- daily lesson reminders
- progress reset confirmation

### Outcome
The page grows in a clean, modular way when more preferences are needed.

---

## Final recommendation
Build the settings page as a client-side preferences screen that reuses the app’s current language, course, and theme state. That keeps the implementation consistent with the existing architecture, avoids duplicating logic, and gives the app a clean place to evolve.

The current modal should remain as a lightweight shortcut, while the new page becomes the main Settings experience.
