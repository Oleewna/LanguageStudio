const assert = require('node:assert/strict');
const express = require('express');
const { after, before, test } = require('node:test');

const authUpstream = express();
authUpstream.use(express.json());
authUpstream.get('/api/auth/session', (req, res) => res.json({ authenticated: false }));
authUpstream.post('/api/auth/logout', (req, res) => {
    res.cookie('ls_session', '', { maxAge: 0 });
    res.json({ success: true, path: req.path });
});

const contentUpstream = express();
contentUpstream.use(express.json());
contentUpstream.get('/api/auth/session', (req, res) => res.json({ authenticated: false, forwardedPath: req.path }));
contentUpstream.get('/api/v1/auth/session', (req, res) => res.json({ authenticated: false, forwardedPath: req.path }));
contentUpstream.post('/api/auth/logout', (req, res) => {
    res.cookie('ls.sid', '', { maxAge: 0 });
    res.json({ success: true, path: req.path });
});
contentUpstream.post('/api/v1/auth/logout', (req, res) => {
    res.cookie('ls.sid', '', { maxAge: 0 });
    res.json({ success: true, path: req.path });
});
contentUpstream.get('/api/courses', (req, res) => {
    res.json({ forwardedPath: req.path, courses: [{ id: 'it' }] });
});
contentUpstream.get('/api/v1/courses', (req, res) => {
    res.json({ forwardedPath: req.path, courses: [{ id: 'it' }] });
});
contentUpstream.get('/api/vocab', (req, res) => {
    res.json({ forwardedPath: req.path, vocab: [] });
});
contentUpstream.get('/api/payments', (req, res) => {
    res.json({ forwardedPath: req.path, payments: [] });
});
contentUpstream.get('/api/v1/payments', (req, res) => {
    res.json({ forwardedPath: req.path, payments: [] });
});

let authServer;
let contentServer;
let gatewayServer;
let baseUrl;

function listen(app) {
    return new Promise((resolve, reject) => {
        const server = app.listen(0, '127.0.0.1');
        server.once('listening', () => resolve(server));
        server.once('error', reject);
    });
}

before(async () => {
    authServer = await listen(authUpstream);
    contentServer = await listen(contentUpstream);
    process.env.AUTH_SERVICE_URL = `http://127.0.0.1:${authServer.address().port}`;
    process.env.SERVICE_URL = `http://127.0.0.1:${contentServer.address().port}`;
    process.env.CORS_ORIGINS = 'http://localhost:5500';
    const app = require('../src/gateway');
    gatewayServer = await listen(app);
    baseUrl = `http://127.0.0.1:${gatewayServer.address().port}`;
});

after(async () => {
    for (const server of [gatewayServer, contentServer, authServer]) {
        if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
});

test('proxies versioned auth and content APIs to their corresponding services', async () => {
    const sessionV1 = await fetch(`${baseUrl}/api/v1/auth/session`);
    assert.equal(sessionV1.status, 200);
    assert.deepEqual(await sessionV1.json(), { authenticated: false, forwardedPath: '/api/v1/auth/session' });

    const sessionLegacy = await fetch(`${baseUrl}/api/auth/session`);
    assert.equal(sessionLegacy.status, 200);
    assert.deepEqual(await sessionLegacy.json(), { authenticated: false, forwardedPath: '/api/auth/session' });

    const logout = await fetch(`${baseUrl}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    assert.equal(logout.status, 200);
    assert.deepEqual(await logout.json(), {
        success: true,
        path: '/api/v1/auth/logout'
    });

    const courses = await fetch(`${baseUrl}/api/courses`);
    assert.equal(courses.status, 200);
    assert.deepEqual(await courses.json(), {
        forwardedPath: '/api/courses',
        courses: [{ id: 'it' }]
    });

    const v1Courses = await fetch(`${baseUrl}/api/v1/courses`);
    assert.equal(v1Courses.status, 200);
    assert.deepEqual(await v1Courses.json(), {
        forwardedPath: '/api/v1/courses',
        courses: [{ id: 'it' }]
    });

    const vocab = await fetch(`${baseUrl}/api/vocab`);
    assert.equal(vocab.status, 200);
    assert.deepEqual(await vocab.json(), {
        forwardedPath: '/api/vocab',
        vocab: []
    });

    const payments = await fetch(`${baseUrl}/api/payments`);
    assert.equal(payments.status, 200);
    assert.deepEqual(await payments.json(), {
        forwardedPath: '/api/payments',
        payments: []
    });

    const v1Payments = await fetch(`${baseUrl}/api/v1/payments`);
    assert.equal(v1Payments.status, 200);
    assert.deepEqual(await v1Payments.json(), {
        forwardedPath: '/api/v1/payments',
        payments: []
    });
});

test('serves the frontend and allows configured local-development origins', async () => {
    const page = await fetch(`${baseUrl}/pages/auth.html`);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /data-auth-form/);

    const preflight = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'OPTIONS',
        headers: { Origin: 'http://localhost:5500' }
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('access-control-allow-origin'), 'http://localhost:5500');
    assert.equal(preflight.headers.get('access-control-allow-credentials'), 'true');
    assert.match(preflight.headers.get('access-control-allow-methods'), /\bPUT\b/);
});

test('does not expose course content files as static JSON', async () => {
    const response = await fetch(`${baseUrl}/courses/it/course.json`);
    assert.notEqual(response.status, 200);
});
