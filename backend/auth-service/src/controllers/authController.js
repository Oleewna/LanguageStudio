const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const userStore = require('../utils/userStore');
const { loadGoogleConfig } = require('../utils/googleConfig');

// ─── Session store ───────────────────────────────────────────────────────────
const sessions = new Map();
const SESSION_COOKIE = 'ls_session';
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

// ─── OAuth state store (CSRF protection) ─────────────────────────────────────
const oauthStates = new Map(); // state → timestamp
const STATE_LIFETIME_MS = 10 * 60 * 1000; // 10 minutes

function getOAuth2Client() {
    const config = loadGoogleConfig();
    return {
        client: new OAuth2Client(config.clientId, config.clientSecret, config.redirectUri),
        config
    };
}

// ─── Session helpers ──────────────────────────────────────────────────────────
function getSessionId(req) {
    const cookies = req.headers.cookie || '';
    const sessionCookie = cookies.split(';').map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith(`${SESSION_COOKIE}=`));
    return sessionCookie ? sessionCookie.slice(SESSION_COOKIE.length + 1) : null;
}

function publicUser(user) {
    return {
        id: user.id,
        name: user.name,
        displayName: user.name,
        email: user.email,
        role: user.role || 'learner'
    };
}

function setSessionCookie(res, sessionId) {
    const attributes = [
        `${SESSION_COOKIE}=${sessionId}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        `Max-Age=${Math.floor(SESSION_LIFETIME_MS / 1000)}`
    ];
    if (process.env.NODE_ENV === 'production') attributes.push('Secure');
    res.setHeader('Set-Cookie', attributes.join('; '));
}

function createSession(user) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    sessions.set(sessionId, {
        userId: user.id,
        expiresAt: Date.now() + SESSION_LIFETIME_MS
    });
    return sessionId;
}

function getUserForRequest(req) {
    const sessionId = getSessionId(req);
    const session = sessionId && sessions.get(sessionId);
    if (!session) return null;
    if (session.expiresAt <= Date.now()) {
        sessions.delete(sessionId);
        return null;
    }
    return userStore.findById(session.userId);
}

function getFrontendBase(req) {
    if (process.env.FRONTEND_URL) {
        return process.env.FRONTEND_URL.replace(/\/+$/, '');
    }
    const host = (req && req.headers && (req.headers['x-forwarded-host'] || req.headers.host)) || '';
    const proto = (req && req.headers && req.headers['x-forwarded-proto']) || (req && req.socket && req.socket.encrypted ? 'https' : 'http');
    // If request came directly to auth-service on port 3007, redirect user to the gateway on port 3005
    if (host.includes(':3007')) {
        return `${proto}://${host.replace(':3007', ':3005')}`;
    }
    if (host && !host.includes(':3007')) {
        return `${proto}://${host}`;
    }
    return 'http://localhost:3005';
}

// ─── Route handlers ───────────────────────────────────────────────────────────

/**
 * GET /api/auth/google
 * Initiates the Google OAuth flow.
 */
function googleRedirect(req, res) {
    const { client, config } = getOAuth2Client();

    if (!config.clientId || !config.clientSecret) {
        return res.status(503).json({
            error: 'Google OAuth is not configured on this server. Please provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env or place your Google client secret JSON file in backend/auth-service/.'
        });
    }

    // Clean up expired states
    const now = Date.now();
    for (const [state, ts] of oauthStates) {
        if (now - ts > STATE_LIFETIME_MS) oauthStates.delete(state);
    }

    const state = crypto.randomBytes(16).toString('hex');
    oauthStates.set(state, Date.now());

    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['openid', 'email', 'profile'],
        state,
        prompt: 'select_account'
    });

    return res.redirect(authUrl);
}

/**
 * GET /api/auth/google/callback
 * Handles Google's OAuth callback with authorization code.
 */
async function googleCallback(req, res) {
    const { code, state, error } = req.query;
    const frontendBase = getFrontendBase(req);

    if (error) {
        console.warn('Google OAuth error from provider:', error);
        return res.redirect(`${frontendBase}/pages/auth.html?error=google_failed`);
    }

    // Validate CSRF state
    if (!state || !oauthStates.has(state)) {
        return res.redirect(`${frontendBase}/pages/auth.html?error=invalid_state`);
    }
    oauthStates.delete(state);

    if (!code) {
        return res.redirect(`${frontendBase}/pages/auth.html?error=missing_code`);
    }

    try {
        const { client, config } = getOAuth2Client();

        // Exchange code for tokens
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        // Verify and decode the id_token
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: config.clientId
        });
        const payload = ticket.getPayload();

        const googleId = payload.sub;
        const name = payload.name || payload.given_name || (payload.email ? payload.email.split('@')[0] : 'Learner');
        const email = payload.email;

        if (!googleId || !email) {
            return res.redirect(`${frontendBase}/pages/auth.html?error=google_profile_missing`);
        }

        // Find or create user
        const user = userStore.findOrCreateByGoogle(googleId, { name, email });

        // Create session and set cookie
        const sessionId = createSession(user);
        setSessionCookie(res, sessionId);

        return res.redirect(`${frontendBase}/pages/home.html`);
    } catch (err) {
        console.error('Google OAuth callback error:', err.message);
        return res.redirect(`${frontendBase}/pages/auth.html?error=google_failed`);
    }
}

/**
 * GET /api/auth/session or GET /api/auth/me
 */
function getSession(req, res) {
    const user = getUserForRequest(req);
    if (!user) return res.status(200).json({ authenticated: false });
    return res.status(200).json({ authenticated: true, user: publicUser(user) });
}

/**
 * POST /api/auth/logout
 */
function logout(req, res) {
    const sessionId = getSessionId(req);
    if (sessionId) sessions.delete(sessionId);
    const attributes = [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
    if (process.env.NODE_ENV === 'production') attributes.push('Secure');
    res.setHeader('Set-Cookie', attributes.join('; '));
    return res.status(200).json({ success: true });
}

module.exports = {
    googleRedirect,
    googleCallback,
    getSession,
    logout,
    createSession,
    setSessionCookie,
    publicUser,
    sessions,
    oauthStates
};
