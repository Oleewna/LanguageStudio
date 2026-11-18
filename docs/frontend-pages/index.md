# Landing Page (`index.html`)

- **File Path**: [`frontend/public/index.html`](../../frontend/public/index.html)
- **Routes**: `/` or `/index.html`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/landing-language.js`
- **Styles**: `css/main.css`, `css/index.css`, `css/studio.css`

---

## 1. Overview & Purpose

The **Landing Page** is the public front door and conversion engine for LanguageStudio. Designed with a clean, approachable aesthetic, it communicates the platform's core methodology—short, bite-sized daily language lessons that build speaking confidence from day one. It introduces visitors to the curriculum without forcing an upfront account creation.

---

## 2. Key Sections & DOM Structure

```
[Header: .landing-header]
  ├── Brand Logo & Wordmark (LanguageStudio)
  ├── Language Toggle (#landingLanguageToggle)
  ├── Theme Toggle (#landingThemeToggle)
  └── "Sign In" link (pages/auth.html)

[Hero Section: .landing-hero]
  ├── Eyebrow: "YOUR ITALIAN JOURNEY"
  ├── Main Title: "A little Italian, every day."
  ├── Course Selector Dropdown (#landingLanguageSelect) & "Go" Action
  ├── Primary CTA: "Start learning" (Links to pages/placement-test.html)
  ├── Zero-Friction Assurance: "Free to explore · no account needed"
  └── Visual Mockup Card (.landing-lesson-card): Interactive sample preview

[Benefits Section: .landing-benefits]
  ├── 1. "Just a few minutes" (Clock icon, micro-learning focus)
  ├── 2. "Made for real life" (Chat icon, practical conversational phrases)
  └── 3. "Your pace, your path" (Path icon, self-guided tracking)

[Preview Showcase: .landing-preview]
  ├── Conversational Dialogue Mockup ("Ciao! Come stai? - Sto bene, grazie!")
  └── Interactive Answer Selection Pill

[3-Step Methodology: .landing-steps]
  ├── Step 01: "Pick your goal"
  ├── Step 02: "Take small daily steps"
  └── Step 03: "See how far you go"

[Bottom CTA: .landing-bottom-cta]
  ├── Heading: "Your first 'Ciao!' is waiting."
  └── CTA Button: "Start learning" -> pages/placement-test.html

[Footer: .landing-footer]
  └── Brand, Tagline, and Sign-in link
```

---

## 3. Dynamic Behavior & Client Logic

### 3.1 Localization (`js/landing-language.js`)
- The page includes dynamic client-side translation via `data-i18n` and `data-i18n-content` attributes.
- The language toggle button (`#landingLanguageToggle`) cycles between English (`en`) and Ukrainian (`uk`).
- Saves preference to `localStorage.getItem('ls_source_language')`.
- Broadcasts the `sourceLanguageChanged` event on the `window` object to notify components.

### 3.2 Theme Toggling (`js/theme.js`)
- Executed synchronously in `<head>` to prevent Flash of Unstyled Content (FOUC).
- Reads stored theme from `localStorage.getItem('ls_theme')` (`light`, `dark`, or system default).
- Applies `data-theme="dark"` or `data-theme="light"` to the `<html>` root element.

### 3.3 Path Redirection Guard
The inline script in `<head>` ensures that if a user opens the directory root directly (`/frontend/public`), it normalizes trailing slashes and relative asset links without broken paths.

---

## 4. User Entry Points & Flows

1. **New Learner Onboarding**:
   - User clicks **"Start learning"** → Directed immediately to `pages/placement-test.html` to diagnose level and select goals.
2. **Direct Course Access**:
   - User picks language from dropdown → Clicks **"Go"** → Navigates directly to `pages/home.html?course=it`.
3. **Existing Learner Sign In**:
   - User clicks **"Sign in"** in header or footer → Navigates to `pages/auth.html`.
