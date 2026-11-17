const crypto = require('crypto');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_COOKIE_NAME = 'XSRF-TOKEN';

function ensureCsrfToken(req, res) {
    if (!req.session) return null;
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    // Set un-httpOnly cookie so JavaScript (e.g. fetch / document.cookie) can read it
    res.cookie(CSRF_COOKIE_NAME, req.session.csrfToken, {
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });
    return req.session.csrfToken;
}

function csrfProtection(req, res, next) {
    // Ensure session exists
    if (!req.session) {
        return res.status(500).json({ error: 'Session middleware must be initialized before CSRF.' });
    }

    // Always ensure a CSRF token is available on the session and cookie
    ensureCsrfToken(req, res);

    // Safe read-only methods don't modify state
    if (SAFE_METHODS.has(req.method)) {
        return next();
    }

    // Allow tests to bypass CSRF ONLY IF explicitly enabled via header or env flag,
    // but default to requiring it so CSRF behavior can be thoroughly tested.
    if (process.env.NODE_ENV === 'test' && req.headers['x-bypass-csrf'] === 'true') {
        return next();
    }

    const clientToken =
        req.headers['x-csrf-token'] ||
        req.headers['x-xsrf-token'] ||
        (req.body && typeof req.body === 'object' ? req.body._csrf : null);

    const sessionToken = req.session.csrfToken;

    if (!clientToken || typeof clientToken !== 'string') {
        return res.status(403).json({ error: 'Missing CSRF token in request headers.' });
    }

    if (!sessionToken || typeof sessionToken !== 'string') {
        return res.status(403).json({ error: 'No active session or CSRF token found.' });
    }

    const clientBuf = Buffer.from(clientToken);
    const sessionBuf = Buffer.from(sessionToken);

    if (clientBuf.length !== sessionBuf.length || !crypto.timingSafeEqual(clientBuf, sessionBuf)) {
        return res.status(403).json({ error: 'Invalid CSRF token.' });
    }

    next();
}

module.exports = {
    csrfProtection,
    ensureCsrfToken,
    CSRF_COOKIE_NAME
};
