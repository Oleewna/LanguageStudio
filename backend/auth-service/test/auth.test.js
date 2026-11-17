const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { EventEmitter } = require('node:events');
const { after, before, test } = require('node:test');

const dataDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'language-studio-auth-'));
process.env.AUTH_USERS_FILE = path.join(dataDirectory, 'users.json');

// Ensure Google placeholders are clear for test
process.env.GOOGLE_CLIENT_ID = '';
process.env.GOOGLE_CLIENT_SECRET = '';

const app = require('../src/server');
const userStore = require('../src/utils/userStore');
const { createSession } = require('../src/controllers/authController');

function request(appInstance, { method = 'GET', url = '/', headers = {}, body = null }) {
    return new Promise((resolve) => {
        const req = new EventEmitter();
        req.method = method;
        req.url = url;
        req.headers = {};
        for (const [k, v] of Object.entries(headers)) {
            req.headers[k.toLowerCase()] = v;
        }

        let bodyPayload = null;
        if (body !== null && body !== undefined) {
            bodyPayload = typeof body === 'object' ? JSON.stringify(body) : String(body);
            if (!req.headers['content-type']) {
                req.headers['content-type'] = 'application/json';
            }
            req.headers['content-length'] = String(Buffer.byteLength(bodyPayload));
        }

        const resHeaders = {};
        let resStatusCode = 200;
        let responseChunks = [];

        const res = new EventEmitter();
        res.setHeader = (k, v) => { resHeaders[k.toLowerCase()] = v; };
        res.getHeader = (k) => resHeaders[k.toLowerCase()];
        res.status = (code) => { resStatusCode = code; return res; };
        res.sendStatus = (code) => { resStatusCode = code; res.end(); return res; };
        res.json = (data) => {
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
        };
        res.redirect = (statusCodeOrUrl, redirectUrl) => {
            if (typeof statusCodeOrUrl === 'number') {
                resStatusCode = statusCodeOrUrl;
                resHeaders['location'] = redirectUrl;
            } else {
                resStatusCode = 302;
                resHeaders['location'] = statusCodeOrUrl;
            }
            res.end();
            return res;
        };
        res.write = (chunk) => {
            if (chunk) responseChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            return true;
        };
        res.end = (chunk) => {
            if (chunk) responseChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            const fullBody = Buffer.concat(responseChunks).toString('utf8');
            resolve({
                status: resStatusCode,
                headers: {
                    get: (name) => resHeaders[name.toLowerCase()] || null
                },
                json: async () => fullBody ? JSON.parse(fullBody) : {},
                text: async () => fullBody
            });
        };

        appInstance(req, res);

        if (bodyPayload !== null) {
            req.emit('data', Buffer.from(bodyPayload));
        }
        req.emit('end');
    });
}

after(() => {
    fs.rmSync(dataDirectory, { recursive: true, force: true });
});

test('health check returns ok', async () => {
    const res = await request(app, { method: 'GET', url: '/health' });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: 'ok', service: 'auth' });
});

test('unauthenticated session returns authenticated: false on /session and /me', async () => {
    const sessionRes = await request(app, { method: 'GET', url: '/api/auth/session' });
    assert.equal(sessionRes.status, 200);
    assert.deepEqual(await sessionRes.json(), { authenticated: false });

    const meRes = await request(app, { method: 'GET', url: '/api/auth/me' });
    assert.equal(meRes.status, 200);
    assert.deepEqual(await meRes.json(), { authenticated: false });
});

test('GET /api/auth/google returns 503 when credentials are not configured', async () => {
    const res = await request(app, { method: 'GET', url: '/api/auth/google' });
    assert.equal(res.status, 503);
    const body = await res.json();
    assert.match(body.error, /Google OAuth is not configured/);
});

test('userStore.findOrCreateByGoogle creates, links, and manages users', () => {
    // 1. Create a brand new user
    const user1 = userStore.findOrCreateByGoogle('google-sub-123', {
        name: 'Maria Rossi',
        email: 'maria@example.com'
    });
    assert.ok(user1.id);
    assert.equal(user1.name, 'Maria Rossi');
    assert.equal(user1.email, 'maria@example.com');
    assert.equal(user1.googleId, 'google-sub-123');
    assert.equal(user1.role, 'learner');

    // 2. Calling again with same googleId returns same user
    const user1Again = userStore.findOrCreateByGoogle('google-sub-123', {
        name: 'Maria Rossi Updated',
        email: 'maria@example.com'
    });
    assert.equal(user1Again.id, user1.id);

    // 3. User can be found by ID
    const found = userStore.findById(user1.id);
    assert.equal(found.email, 'maria@example.com');

    // 4. Update role
    const updated = userStore.setRoleByEmail('maria@example.com', 'admin');
    assert.equal(updated, true);
    assert.equal(userStore.findById(user1.id).role, 'admin');

    // 5. Link Google account to an existing pre-registered email
    const usersFile = path.resolve(__dirname, '../..', process.env.AUTH_USERS_FILE);
    const allUsers = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    allUsers.push({
        id: 'legacy-id-456',
        name: 'Legacy User',
        email: 'legacy@example.com',
        role: 'learner',
        createdAt: new Date().toISOString()
    });
    fs.writeFileSync(usersFile, JSON.stringify(allUsers, null, 2));

    const linked = userStore.findOrCreateByGoogle('google-sub-789', {
        name: 'Legacy User',
        email: 'legacy@example.com'
    });
    assert.equal(linked.id, 'legacy-id-456');
    assert.equal(linked.googleId, 'google-sub-789');
});

test('authenticated session flow with cookie and logout', async () => {
    const user = userStore.findOrCreateByGoogle('google-sub-session-test', {
        name: 'Session Learner',
        email: 'session@example.com'
    });

    const sessionId = createSession(user);
    const cookieHeader = `ls_session=${sessionId}`;

    // Verify /session with cookie
    const sessionRes = await request(app, {
        method: 'GET',
        url: '/api/auth/session',
        headers: { Cookie: cookieHeader }
    });
    assert.equal(sessionRes.status, 200);
    const sessionData = await sessionRes.json();
    assert.equal(sessionData.authenticated, true);
    assert.equal(sessionData.user.email, 'session@example.com');
    assert.equal(sessionData.user.name, 'Session Learner');
    assert.equal(sessionData.user.displayName, 'Session Learner');

    // Verify /me alias with cookie
    const meRes = await request(app, {
        method: 'GET',
        url: '/api/auth/me',
        headers: { Cookie: cookieHeader }
    });
    assert.equal(meRes.status, 200);
    const meData = await meRes.json();
    assert.equal(meData.authenticated, true);
    assert.equal(meData.user.id, user.id);

    // Logout
    const logoutRes = await request(app, {
        method: 'POST',
        url: '/api/auth/logout',
        headers: { Cookie: cookieHeader }
    });
    assert.equal(logoutRes.status, 200);
    assert.match(logoutRes.headers.get('set-cookie'), /Max-Age=0/);

    // Session is now gone
    const postLogout = await request(app, {
        method: 'GET',
        url: '/api/auth/session',
        headers: { Cookie: cookieHeader }
    });
    assert.deepEqual(await postLogout.json(), { authenticated: false });
});

test('loads Google credentials from a JSON file dynamically', () => {
    const { loadGoogleConfig } = require('../src/utils/googleConfig');
    const tempJsonPath = path.join(dataDirectory, 'client_secret_test.json');

    fs.writeFileSync(tempJsonPath, JSON.stringify({
        web: {
            client_id: 'mock-client-id-12345.apps.googleusercontent.com',
            client_secret: 'mock-client-secret-abcde',
            redirect_uris: ['http://localhost:3005/api/v1/auth/google/callback']
        }
    }));

    process.env.GOOGLE_CREDENTIALS_JSON = tempJsonPath;
    const config = loadGoogleConfig();

    assert.equal(config.clientId, 'mock-client-id-12345.apps.googleusercontent.com');
    assert.equal(config.clientSecret, 'mock-client-secret-abcde');
    assert.equal(config.redirectUri, 'http://localhost:3005/api/v1/auth/google/callback');

    delete process.env.GOOGLE_CREDENTIALS_JSON;
});

test('GET /api/auth/google redirects to Google authorization URL when configured', async () => {
    process.env.GOOGLE_CLIENT_ID = 'test-client-id-xyz';
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret-xyz';

    const res = await request(app, { method: 'GET', url: '/api/auth/google' });
    assert.equal(res.status, 302);
    const location = res.headers.get('location');
    assert.ok(location);
    assert.match(location, /^https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth/);
    assert.match(location, /client_id=test-client-id-xyz/);
    assert.match(location, /scope=openid(%20|\+)email(%20|\+)profile/);
    assert.match(location, /state=/);

    process.env.GOOGLE_CLIENT_ID = '';
    process.env.GOOGLE_CLIENT_SECRET = '';
});

test('direct GET /google/callback handles error parameter and redirects to frontend URL on port 3005', async () => {
    const res = await request(app, {
        method: 'GET',
        url: '/google/callback?error=access_denied',
        headers: { host: 'localhost:3007' }
    });
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), 'http://localhost:3005/pages/auth.html?error=google_failed');
});

test('direct GET /google/callback handles invalid/missing state and redirects to frontend URL on port 3005', async () => {
    const res = await request(app, {
        method: 'GET',
        url: '/google/callback?code=fake-code&state=non-existent',
        headers: { host: 'localhost:3007' }
    });
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), 'http://localhost:3005/pages/auth.html?error=invalid_state');
});
