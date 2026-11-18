# Settings & Profile Page (`pages/settings.html`)

- **File Path**: [`frontend/public/pages/settings.html`](../../frontend/public/pages/settings.html)
- **Routes**: `/settings` or `/pages/settings.html`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/course.js`, `js/storage.js`, `js/progress-store.js`, `js/progress.js`, `js/layout.js`, `js/app.js`, inline tab switcher
- **Styles**: `css/main.css`, `css/settings.css`, `css/studio.css`

---

## 1. Overview & Purpose

The **Settings & Profile Page** is the central control center for learner preferences, profile management, learning targets, audio/visual settings, and entitlement auditing. Presented as a clean desktop-class split-pane interface with responsive mobile adaptation, it allows learners to tailor their LanguageStudio experience and trigger cloud progress synchronizations.

---

## 2. Key Sections & DOM Architecture

```
[Navigation: data-component="navbar"]

[Main Container: .st-shell]
  ├── [Left Sidebar: .st-left / #settingsCategoryNav]
  │     ├── Header: "PREFERENCES" / "Settings"
  │     └── Category List (.st-cat-list):
  │           ├── Tab 1: Profile ([data-st-cat="profile"])
  │           ├── Tab 2: General ([data-st-cat="general"])
  │           ├── Tab 3: Notifications ([data-st-cat="notifications"])
  │           └── Tab 4: Payments ([data-st-cat="payments"])
  │
  └── [Right Content Panels: .st-right]
        ├── [Section 1: Profile (#sec-profile)]
        │     ├── User Avatar & Display Name
        │     ├── Google Account Email & SSO Verification Badge
        │     ├── Course Badge: Current enrolled course (e.g. "Italian · A1")
        │     ├── Cloud Sync Trigger: "Sync Now" button (POST /api/progress/sync)
        │     └── Account Action: "Sign Out" button (POST /api/auth/logout)
        │
        ├── [Section 2: General Preferences (#sec-general)]
        │     ├── Interface Language Dropdown: Ukrainian (`uk`) vs English (`en`)
        │     ├── Active Course Dropdown: Switch course track
        │     ├── Daily Goal Selector: 10 XP (Casual), 20 XP (Regular), 50 XP (Intense)
        │     ├── Theme Selector Buttons: Light, Dark, or System Auto
        │     └── Sound Effects Toggle: Toggle audio chimes on exercise answers
        │
        ├── [Section 3: Notifications (#sec-notifications)]
        │     ├── Daily Study Reminders switch
        │     └── Streak Protection Warning switch (alert before streak expires)
        │
        └── [Section 4: Payments & Subscriptions (#sec-payments)]
              ├── Active Entitlements Table: Unlocked courses & paths, grant date, status
              ├── "Restore Purchases" button: Queries /api/payments/entitlements
              └── "Upgrade Plan" link ──► pages/pricing.html

[Footer: data-component="footer"]
[Profile Modal: data-component="profile-modal"]
```

---

## 3. Dynamic Setting Mechanics & Storage Persistence

Every configuration choice maps directly to persistent client storage keys and synchronization events:

| Setting Control | Storage Key | Values | Reactive Event / Action |
|---|---|---|---|
| **Interface Language** | `ls_source_language` | `'uk'`, `'en'` | Dispatches `sourceLanguageChanged` event on `window`. |
| **Active Course** | `ls_course` | `'it'` | Re-initializes course progress store. |
| **Daily XP Target** | `ls_daily_goal` | `10`, `20`, `50` | Updates `#dashboardGoalValue` and goal bar on `home.html`. |
| **Theme** | `ls_theme` | `'light'`, `'dark'`, `'auto'` | Updates `data-theme` attribute on `<html>` element. |
| **Sound Effects** | `ls_sound_effects` | `'true'`, `'false'` | Mutes audio chimes during lesson exercise checks. |

---

## 4. Cloud Data Sync & Reset Controls

### 4.1 Manual Cloud Synchronization
- When the learner clicks **"Sync Now"**:
  - Gathers local progress from `progress-store.js` (`ls_{courseId}_progress`).
  - Dispatches `POST /api/progress/sync`.
  - Backend performs 3-way high-water mark merge with MongoDB Atlas.
  - Updates local store with resolved progress payload and displays a success checkmark.

### 4.2 Local Data Reset Safeguard
- For testing or resetting study records:
  - Learner clicks "Reset Local Progress".
  - A modal prompts for confirmation to prevent accidental data loss.
  - Clears `ls_{courseId}_progress` and resets streaks to zero while leaving purchased entitlements intact.

---

## 5. User Workflows

- **Adjust Daily Goal**: Learner finds 50 XP too demanding, visits Settings → General, adjusts goal to 20 XP → Home dashboard immediately updates today's progress bar calculation.
- **Switch Interface Language**: Learner toggles from Ukrainian to English → All UI labels, buttons, and navigation terms dynamically translate without page refresh.
- **Verify Purchased Access**: Learner navigates to Payments tab to confirm that their "Targeted Path Pass" is listed as active.
