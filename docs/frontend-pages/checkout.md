# Payment Simulator Page (`pages/checkout.html`)

- **File Path**: [`frontend/public/pages/checkout.html`](../../frontend/public/pages/checkout.html)
- **Routes**: `/checkout` or `/pages/checkout.html`
- **Primary Scripts**: `js/theme.js`, `js/icons.js`, `js/components.js`, `js/course.js`, `js/storage.js`, `js/progress-store.js`, `js/progress.js`, `js/layout.js`, `js/app.js`, inline simulator script
- **Styles**: `css/main.css`, `css/studio.css`, scoped inline styles

---

## 1. Overview & Purpose

The **Payment Simulator Page** is an offsite sandbox environment. In production, customers paying for LanguageStudio are redirected to an external PCI-DSS-compliant hosted checkout (such as Stripe Checkout, Paddle, or Lemon Squeezy). For local development, testing, and continuous integration, this page acts as an interactive stand-in for those external gateways, permitting developers to simulate successful transactions, refunds, cancellations, and signed webhook deliveries without test credit cards or live provider accounts.

---

## 2. Key Sections & DOM Architecture

```
[Navigation: data-component="navbar"]

[Main Container: .checkout-stub-wrap]
  ├── [Badge: .checkout-badge] ──► "Offsite Provider Sandbox"
  ├── [Title] ──► "Hosted Payment Simulator"
  ├── [Provider Subtitle] ──► Explains provider-agnostic offsite simulation
  │
  ├── [Order Details Card: .checkout-details]
  │     ├── Provider: #dispProvider (e.g. "mock", "stripe")
  │     ├── Payment ID: #dispPaymentId (e.g. "mock_pay_1700000000")
  │     ├── Course ID: #dispCourseId (e.g. "it")
  │     ├── Price ID: #dispPriceId (e.g. "price_path_pass")
  │     ├── Recommended Tier: #dispTier ("Targeted Path Pass")
  │     └── Selected Paths: #dispPaths (e.g. "travel-conversation, italian-reading")
  │
  ├── [Security Notice: .checkout-notice]
  │     └── Informs user that in production no card data ever touches LanguageStudio servers.
  │
  ├── [Action Button Stack: .btn-stack]
  │     ├── Pay Button (#btnSimulateSuccess: .btn.btn-primary "Pay with Mock Checkout")
  │     ├── Refund Button (#btnSimulateRefund: .btn.btn-secondary "Simulate Refund (Webhook Revocation)")
  │     └── Cancel Button (#btnCancel: .btn.btn-ghost "Cancel and Return")
  │
  └── [Status Alert: #statusMsg] (Displays webhook transmission logs and errors)

[Footer: data-component="footer"]
```

---

## 3. Query Parameter Ingestion

The simulator parses the following URL parameters passed by `/api/payments/checkout`:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `provider` | String | `'mock'` | Active payment provider identity. |
| `providerPaymentId`| String | Auto-generated | Unique session ID assigned by provider. |
| `courseId` | String | `'it'` | Target course identifier. |
| `priceId` | String | `'price_default'` | Pricing tier identifier. |
| `userId` | String | `""` | User ID being granted access. |
| `selectedPaths` | JSON/CSV | `[]` | Array of path IDs to be unlocked. |
| `successUrl` | URL | `/pages/path.html?unlocked=true` | Redirect destination upon payment success. |
| `cancelUrl` | URL | `/pages/pricing.html` | Redirect destination upon cancellation. |

---

## 4. Webhook Dispatch & Entitlement State Machine

### 4.1 Simulating Successful Purchase
When `#btnSimulateSuccess` is clicked:
1. Dispatches an HTTP `POST` request to `/api/payments/webhook`:
   ```json
   POST /api/payments/webhook
   Header: x-signature: mock_valid_signature
   {
     "eventType": "payment_success",
     "providerPaymentId": "mock_pay_123456789",
     "userId": "654321fedcba",
     "courseId": "it",
     "selectedPaths": ["travel-conversation"],
     "provider": "mock"
   }
   ```
2. The Content Service verifies `x-signature`, looks up the user, and inserts/updates an active record in the MongoDB `entitlements` collection.
3. Upon receiving `200 OK`, `#statusMsg` reports success and redirects the learner to `successUrl`.

### 4.2 Simulating Refund & Access Revocation
When `#btnSimulateRefund` is clicked:
1. Dispatches an HTTP `POST` to `/api/payments/webhook` with `eventType: "payment_refunded"`.
2. Content Service locates the entitlement matching `providerPaymentId` and updates `status: 'revoked'`.
3. Premium lessons immediately re-lock on the learner's device.

---

## 5. User Workflows

- **E2E Purchase Testing**: Developer selects "Targeted Path Pass" on `pricing.html` → Redirected to `checkout.html` → Clicks "Pay with Mock Checkout" → Webhook activates entitlement → Lands on `path.html?unlocked=true` with units unlocked.
- **Refund Testing**: Developer clicks "Simulate Refund" → Webhook revokes entitlement → Returns to course to verify premium lessons now reject access with 403.
