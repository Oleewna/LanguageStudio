# Authentication & MongoDB Atlas Setup Guide

This guide details the user authentication system implemented in the LanguageStudio Express 5 backend (`backend/service/src`) and provides setup instructions for MongoDB Atlas, environment variables, security safeguards, and guest user handling.

---

## 1. Stack & Architecture

- **Backend Framework**: Express 5 (`express@^5.2.1`)
- **Database & ODM**: MongoDB Atlas via `mongoose`
- **Password Hashing**: `argon2` (using Argon2id algorithm per OWASP recommendations)
- **Session Management**: `express-session` with `connect-mongo` for persistent session storage
  - `httpOnly: true` (prevents JavaScript access to session cookie)
  - `sameSite: 'lax'` (mitigates CSRF on top-level navigations)
  - `secure: process.env.NODE_ENV === 'production'` (requires HTTPS in production)
- **Security Headers**: `helmet` (protects against clickjacking, MIME sniffing, and XSS)
- **Rate Limiting**: `express-rate-limit` (prevents brute-force credential stuffing)
- **Validation**: `zod` for strict request payload schema validation
- **CSRF Protection**: Token-based verification for state-modifying requests (`POST`, `PUT`, `DELETE`, `PATCH`) with `XSRF-TOKEN` cookie and session matching
- **Email Interface**: Pluggable `EmailService` with `StubEmailService` implementation for verification and password reset tokens

---

## 2. MongoDB Atlas Configuration

To connect the application to MongoDB Atlas, configure both a **Database User** and the **Network Access IP Allowlist**.

### A. Creating a Database User
1. Log in to the [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. Select your project and navigate to **Security** -> **Database Access** in the left sidebar.
3. Click **Add New Database User**.
4. Select **Password** as the Authentication Method.
5. Enter a **Username** (e.g. `ls_admin`) and a secure **Password** (or click *Autogenerate Secure Password*). Keep these credentials safe.
6. Under **Database User Privileges**, select **Read and write to any database** (or assign custom privileges restricted to `languagestudio`).
7. Click **Add User**.

### B. Configuring Network Access (IP Allowlist)
Atlas blocks all incoming connections by default unless the client's public IP address is in the allowlist.

1. In the Atlas sidebar, navigate to **Security** -> **Network Access**.
2. Click **Add IP Address**.
3. Choose one of the following options:
   - **Add Current IP Address**: Recommended for production or fixed development workstations. Adds your current machine's public IP.
   - **Allow Access from Anywhere (`0.0.0.0/0`)**: Convenient for local development across multiple networks (e.g., dynamic home IPs, VPNs).
4. Click **Confirm** and wait ~1 minute for Atlas to deploy the network rule.

> **Note on Connection Errors**: If your IP is not whitelisted, Mongoose will throw:
> `Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.`

### C. Obtaining the Connection String
1. In the Atlas sidebar, click **Deployment** -> **Database**.
2. Find your cluster and click **Connect**.
3. Select **Drivers** (Node.js).
4. Copy the connection string URI. It will look like:
   ```text
   mongodb+srv://<username>:<password>@<cluster-domain>/languagestudio?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials.

---

## 3. Environment Variables Reference

Environment variables are loaded via `dotenv` from `backend/service/.env` (and root `.env`).

Templates are provided in `.env.example`:
- `backend/service/.env.example`
- `backend/.env.example`

| Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | integer | `3006` | Port for the backend service |
| `HOST` | string | `127.0.0.1` | Network interface to bind |
| `NODE_ENV` | string | `development` | Environment mode (`development`, `production`, `test`) |
| `MONGODB_URI` | string | (required in prod) | MongoDB Atlas connection string |
| `SESSION_SECRET` | string | (dev default) | Cryptographic secret used to sign session cookies |
| `SESSION_COOKIE_NAME` | string | `ls.sid` | Name of the session cookie |
| `COOKIE_SECURE` | boolean | `false` | Force `Secure` flag on cookies even in non-production |
| `ENABLE_RATE_LIMIT` | boolean | `true` | Enables or disables rate limiting |

> **Security Rule**: Never commit `.env` or files containing database passwords (`atlas-credentials.env`) into version control. These files are listed in `.gitignore`.

---

## 4. API Endpoints Under `/api/auth`

All API responses are formatted as JSON (no HTML echoing).

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/csrf-token` | Returns `{ csrfToken }` and sets `XSRF-TOKEN` cookie |
| `POST` | `/api/auth/register` | Registers a new account, hashes password, starts session |
| `POST` | `/api/auth/login` | Authenticates user; returns generic error on bad credentials |
| `POST` | `/api/auth/logout` | Destroys session and clears cookie |
| `GET` | `/api/auth/me` | Returns current user profile (or 401 unauthenticated) |
| `POST` | `/api/auth/forgot-password` | Generates reset token and sends email (prevents enumeration) |
| `POST` | `/api/auth/reset-password` | Resets password using token and hashes with Argon2 |
| `POST` | `/api/auth/verify-email` | Verifies email via token |
| `GET` | `/api/auth/verify-email` | Verifies email via query parameter `?token=...` |
| `POST` | `/api/auth/resend-verification` | Issues a fresh verification email token |

---

## 5. Guest Mode & Progress Continuity

LanguageStudio is designed so users can study immediately without creating an account:
- Guest users are marked with `isAuthenticated: false` and the label *"Гостьовий профіль · прогрес зберігається на цьому пристрої"*.
- All lesson completions, daily streak, dictionary words, and XP points remain saved in the browser's `localStorage` via `frontend/public/js/progress-store.js` and `frontend/public/js/progress.js`.
- Creating or logging into an account provides persistent cross-device identity while leaving local guest learning uninterrupted.
