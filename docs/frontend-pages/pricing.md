# Pricing & Plans Page (`pages/pricing.html`)

- **File Path**: [`frontend/public/pages/pricing.html`](../../frontend/public/pages/pricing.html)
- **Routes**: `/pricing` or `/pages/pricing.html`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/course.js`, `js/storage.js`, `js/progress-store.js`, `js/progress.js`, `js/layout.js`, `js/app.js`, inline checkout orchestrator
- **Styles**: `css/main.css`, `css/studio.css`, scoped inline styles

---

## 1. Overview & Purpose

The **Pricing Page** is the commercial monetization and plan selection hub of LanguageStudio. Built around a user-friendly, transparent one-time purchase philosophy (no recurring subscriptions or hidden recurring billing), it presents the platform's access tiers and initiates payment workflows with the backend payment provider engine.

---

## 2. Key Sections & DOM Architecture

```
[Navigation: data-component="navbar"]

[Main Container: .pricing-container]
  ├── [Hero: .pricing-hero]
  │     ├── Eyebrow (#courseSubtitle: "LanguageStudio Courses")
  │     ├── Title (#pricingHeading: "Choose your learning plan")
  │     └── Subtitle: "Start for free with introductory lessons, or upgrade once for unlimited lifetime access..."
  │
  ├── [Placement Test Personalized Summary: #pricingSummaryCard] (hidden by default)
  │     ├── Recommended Tier Badge (#recommendedTierBadge: "Targeted Path Pass")
  │     ├── Heading: "Personalized plan based on your test goals"
  │     └── Summary Chips Container (#summaryChips):
  │           └── Injected goal pills with icons (e.g. [Travel], [Reading])
  │
  ├── [Pricing Grid: .pricing-grid]
  │     ├── Plan 1: Free Starter (.pricing-card)
  │     │     ├── Title: "Free Starter"
  │     │     ├── Price: "$0"
  │     │     ├── Feature List: Access to Unit 1, vocabulary flashcards, daily practice
  │     │     └── Action: "Start Free Lessons" ──► pages/path.html
  │     │
  │     ├── Plan 2: Targeted Path Pass (.pricing-card.featured)
  │     │     ├── Badge: "MOST POPULAR"
  │     │     ├── Title: "Targeted Path Pass"
  │     │     ├── Price: "$19" (One-time payment)
  │     │     ├── Feature List: Complete access to chosen paths, final exams, certificate
  │     │     └── Action: "Unlock Selected Paths" (#btnCheckout)
  │     │
  │     └── Plan 3: Complete Lifetime Pass (.pricing-card)
  │           ├── Title: "Complete Course Pass"
  │           ├── Price: "$39" (One-time payment)
  │           ├── Feature List: All present and future course paths, offline audio packs
  │           └── Action: "Unlock Everything"
  │
  └── [Security Banner: .pricing-security-banner]
        └── PCI-DSS compliance assurance: "No recurring charges. 30-day money-back guarantee."

[Footer: data-component="footer"]
[Profile Modal: data-component="profile-modal"]
```

---

## 3. Dynamic Plan Customization & Contextualization

When a learner completes the diagnostic test on `placement-test.html`:
1. `pricing.html` reads `sessionStorage.getItem('ls_pt_goals')`.
2. If goals are present, `#pricingSummaryCard` unhides and renders customized chips corresponding to the selected goals (e.g. *"Travel & Conversation"*, *"Short Stories & Reading"*).
3. The **Targeted Path Pass** card dynamically receives primary focus, highlighting the exact curriculum units the learner requested.

---

## 4. Checkout Initiation & Webhook Flow

When the learner clicks the upgrade button (`#btnCheckout`):

```
[1. User Clicks Checkout (#btnCheckout)]
       │
       ▼
[2. Dispatch POST /api/payments/checkout]
       │ Body: { courseId, selectedPaths, successUrl, cancelUrl }
       ├─► Status 401 Unauthorized ──► Redirects to auth.html?redirect=pricing.html
       ├─► Status 409 Conflict ──────► Alert ("Already purchased") ──► Redirects to path.html
       └─► Status 200 OK ────────────► Receives { providerPaymentId, checkoutUrl }
             ▼
[3. Development / Sandbox Auto-Simulation]
       │ If PAYMENT_PROVIDER === 'mock':
       │ - Dispatches signed webhook: POST /api/payments/webhook
       │   Headers: { 'x-signature': 'mock_valid_signature' }
       │   Body: { eventType: 'payment_success', providerPaymentId, courseId, selectedPaths }
       │ - Content Service creates active Entitlement record in MongoDB
       ▼
[4. Final Redirection]
       └─► window.location.href = '/pages/path.html?unlocked=true'
```

---

## 5. Security & Payment Provider Isolation

- The checkout implementation is decoupled from specific vendor SDKs.
- In production, `/api/payments/checkout` generates a hosted checkout URL (Stripe Checkout or Paddle) and redirects the browser offsite.
- Entitlement access is **never granted directly by the client browser**; it is granted strictly upon receipt of an authentic, cryptographically signed webhook on `/api/payments/webhook`.
