const assert = require('node:assert/strict');
const express = require('express');
const { after, before, test } = require('node:test');

const authUpstream = express();
authUpstream.use(express.json());
authUpstream.get('/api/auth/session', (req, res) => res.json({ authenticated: false }));
authUpstream.post('/api/auth/login', (req, res) => {
    res.cookie('ls_session', 'gateway-test-session', { httpOnly: true });
    res.json({ path: req.path, body: req.body });
});

const contentUpstream = express();
contentUpstream.get('/api/content/course-index', (req, res) => {
    res.json({ forwardedPath: req.path, courses: [{ id: 'it' }] });
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
    const session = await fetch(`${baseUrl}/api/v1/auth/session`);
    assert.equal(session.status, 200);
    assert.deepEqual(await session.json(), { authenticated: false });

    const login = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'learner@example.com' })
    });
    assert.equal(login.status, 200);
    assert.deepEqual(await login.json(), {
        path: '/api/auth/login',
        body: { email: 'learner@example.com' }
    });
    assert.match(login.headers.get('set-cookie'), /ls_session=gateway-test-session/);

    const content = await fetch(`${baseUrl}/api/v1/content/course-index`);
    assert.equal(content.status, 200);
    assert.deepEqual(await content.json(), {
        forwardedPath: '/api/content/course-index',
        courses: [{ id: 'it' }]
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
