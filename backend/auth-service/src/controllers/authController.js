const crypto = require('crypto');
const userStore = require('../utils/userStore');

const sessions = new Map();
const SESSION_COOKIE = 'ls_session';
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

function getSessionId(req) {
    const cookies = req.headers.cookie || '';
    const sessionCookie = cookies.split(';').map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith(`${SESSION_COOKIE}=`));
    return sessionCookie ? sessionCookie.slice(SESSION_COOKIE.length + 1) : null;
}

function publicUser(user) {
    return { id: user.id, name: user.name, email: user.email, role: user.role || 'learner' };
}

function setSessionCookie(res, sessionId, remember = false) {
    const attributes = [
        `${SESSION_COOKIE}=${sessionId}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax'
    ];
    if (remember) attributes.push(`Max-Age=${Math.floor(SESSION_LIFETIME_MS / 1000)}`);
    if (process.env.NODE_ENV === 'production') attributes.push('Secure');
    res.setHeader('Set-Cookie', attributes.join('; '));
}

function createSession(res, user, remember, status = 200) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    sessions.set(sessionId, {
        userId: user.id,
        expiresAt: Date.now() + SESSION_LIFETIME_MS
    });
    setSessionCookie(res, sessionId, remember);
    res.status(status).json({ user: publicUser(user) });
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

async function register(req, res) {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!name || name.length > 80) {
        return res.status(400).json({ error: 'Name must be between 1 and 80 characters.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        return res.status(400).json({ error: 'Enter a valid email address.' });
    }
    if (password.length < 8 || password.length > 128) {
        return res.status(400).json({ error: 'Password must be between 8 and 128 characters.' });
    }
    if (body.termsAccepted !== true) {
        return res.status(400).json({ error: 'You must accept the terms to create an account.' });
    }
    if (userStore.findByEmail(email)) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = await new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (error, derivedKey) => {
            if (error) reject(error);
            else resolve(derivedKey.toString('hex'));
        });
    });
    const user = {
        id: crypto.randomUUID(),
        name,
        email,
        salt,
        passwordHash,
        role: 'learner',
        createdAt: new Date().toISOString()
    };

    if (!userStore.create(user)) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    return createSession(res, user, false, 201);
}

async function login(req, res) {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = userStore.findByEmail(email);
    if (!user || password.length > 128) {
        return res.status(401).json({ error: 'Email or password is incorrect.' });
    }
    const passwordHash = await new Promise((resolve, reject) => {
        crypto.scrypt(password, user.salt, 64, (error, derivedKey) => {
            if (error) reject(error);
            else resolve(derivedKey);
        });
    });
    const storedHash = Buffer.from(user.passwordHash, 'hex');
    if (storedHash.length !== passwordHash.length || !crypto.timingSafeEqual(storedHash, passwordHash)) {
        return res.status(401).json({ error: 'Email or password is incorrect.' });
    }

    return createSession(res, user, body.remember === true);
}

function getSession(req, res) {
    const user = getUserForRequest(req);
    if (!user) return res.status(200).json({ authenticated: false });
    return res.status(200).json({ authenticated: true, user: publicUser(user) });
}

function logout(req, res) {
    const sessionId = getSessionId(req);
    if (sessionId) sessions.delete(sessionId);
    const attributes = [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
    if (process.env.NODE_ENV === 'production') attributes.push('Secure');
    res.setHeader('Set-Cookie', attributes.join('; '));
    return res.status(200).json({ success: true });
}

module.exports = { getSession, login, logout, register };
