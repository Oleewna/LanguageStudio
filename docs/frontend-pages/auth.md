# Authentication Page (`pages/auth.html`)

- **File Path**: [`frontend/public/pages/auth.html`](../../frontend/public/pages/auth.html)
- **Routes**: `/auth` or `/pages/auth.html`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/layout.js`, `js/auth.js`
- **Styles**: `css/main.css`, `css/auth.css`, `css/studio.css`

---

## 1. Overview & Purpose

The **Authentication Page** is the identity gateway for LanguageStudio. Built for minimal user friction, it enables Single Sign-On (SSO) using Google OAuth 2.0, permitting learners to link their cross-device progress, store purchased entitlements in the cloud, and sync vocabulary words without managing traditional password credentials.

---

## 2. Key Sections & DOM Architecture

```
[Header Component: data-component="auth-header"]
  └── Streamlined navigation bar with Brand logo and Theme toggle

[Main Page Container: .page-container]
  └── [Auth Card: .auth-card]
        ├── [Global Error Banner: #auth-global-error] (hidden unless error query param present)
        │
        └── [Auth Panel: #panel-auth]
              ├── Title: "Benvenuto!" (#welcomeTitle)
              ├── Subtitle (#welcomeSub: "Увійдіть за допомогою облікового запису Google...")
              │
              └── Google SSO Button: .btn-google-signin
                    ├── Google "G" SVG Logo
                    ├── Text: "Увійти через Google" / "Sign in with Google"
                    └── Target Link: /api/v1/auth/google
```

---

## 3. Dynamic Behavior & Logic Flow (`js/auth.js`)

### 3.1 Localization (`I18N`)
- Contains full inline translations for Ukrainian (`uk`) and English (`en`).
- Resolves language preference from `window.getSourceLanguage()`, `localStorage.getItem('ls_source_language')`, or the browser navigator.
- Reacts to `sourceLanguageChanged` events to update text dynamically.

### 3.2 Return URL Forwarding (`returnUrl`)
If the user was attempting to access a gated page (such as `checkout.html` or a premium lesson) before being prompted to log in:
- `auth.js` reads `?returnUrl=...` or `?redirect=...` from `window.location.search`.
- Appends the encoded return parameter to the Google OAuth link:
  ```
  /api/v1/auth/google?returnUrl=%2Fpages%2Fpricing.html
  ```
- After Google authenticates the user, the backend automatically redirects the browser back to that specified URL.

### 3.3 Security & Error Banner Interception
If Google OAuth fails, is canceled by the user, or encounters an invalid CSRF state:
- The backend redirects back to `/pages/auth.html?error={errorKey}`.
- `auth.js` parses the `error` param, unhides `#auth-global-error`, and renders a localized error message:

| Error Key | Ukrainian Translation | English Translation |
|---|---|---|
| `google_failed` | *Не вдалося увійти через Google.* | *Failed to sign in with Google. Please try again.* |
| `invalid_state` | *Помилка безпеки. Будь ласка, спробуйте увійти знову.* | *Security verification failed. Please try again.* |
| `missing_code` | *Авторизацію було скасовано.* | *Authorization was cancelled. Please try again.* |
| `google_profile_missing`| *Не вдалося отримати дані профілю Google.* | *Could not retrieve Google profile details.* |

---

## 4. User Workflows

1. **Standard Sign-In**:
   - Learner clicks "Sign in" in the top navigation bar → Navigates to `/pages/auth.html`.
   - Clicks "Sign in with Google" → Redirected to Google accounts screen.
   - Grants permission → Google redirects to `/api/v1/auth/google/callback` → Backend establishes session cookie `ls.sid` → Redirects to `pages/home.html`.
2. **Checkout Interception Login**:
   - Learner attempts to purchase a path pass without being logged in.
   - Pricing page redirects to `pages/auth.html?redirect=/pages/pricing.html`.
   - Learner completes Google sign-in → Redirects immediately back to `pages/pricing.html` with active session.
