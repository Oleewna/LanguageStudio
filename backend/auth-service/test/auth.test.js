const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const dataDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'language-studio-auth-'));
process.env.AUTH_USERS_FILE = path.join(dataDirectory, 'users.json');
const app = require('../src/server');

let server;
let baseUrl;

before(async () => {
    server = app.listen(0);
    await new Promise(resolve => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    fs.rmSync(dataDirectory, { recursive: true, force: true });
});

test('registers, authenticates, and logs out a user without storing a plain-text password', async () => {
    const health = await fetch(`${baseUrl}/health`);
    assert.deepEqual(await health.json(), { status: 'ok', service: 'auth' });

    const emptySession = await fetch(`${baseUrl}/api/auth/session`);
    assert.deepEqual(await emptySession.json(), { authenticated: false });

    const missingConsent = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Language Learner',
            email: 'learner@example.com',
            password: 'secure-pass-123'
        })
    });
    assert.equal(missingConsent.status, 400);

    const registration = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Language Learner',
            email: 'Learner@example.com',
            password: 'secure-pass-123',
            role: 'admin',
            termsAccepted: true
        })
    });
    assert.equal(registration.status, 201);
    const { user } = await registration.json();
    assert.equal(user.name, 'Language Learner');
    assert.equal(user.email, 'learner@example.com');
    assert.equal(user.role, 'learner');
    assert.equal('passwordHash' in user, false);

    const storedUsers = JSON.parse(fs.readFileSync(process.env.AUTH_USERS_FILE, 'utf8'));
    assert.equal(storedUsers.length, 1);
    assert.notEqual(storedUsers[0].passwordHash, 'secure-pass-123');

    const duplicate = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Another Learner',
            email: 'learner@example.com',
            password: 'secure-pass-123',
            termsAccepted: true
        })
    });
    assert.equal(duplicate.status, 409);

    const malformedLogin = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'null'
    });
    assert.equal(malformedLogin.status, 400);

    const invalidLogin = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'learner@example.com', password: 'incorrect' })
    });
    assert.equal(invalidLogin.status, 401);

    const login = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'learner@example.com', password: 'secure-pass-123', remember: true })
    });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';', 1)[0];
    assert.match(login.headers.get('set-cookie'), /HttpOnly/);

    const authenticatedSession = await fetch(`${baseUrl}/api/auth/session`, {
        headers: { Cookie: cookie }
    });
    assert.deepEqual(await authenticatedSession.json(), { authenticated: true, user });

    const userStore = require('../src/utils/userStore');
    assert.equal(userStore.setRoleByEmail('learner@example.com', 'admin'), true);
    const promotedSession = await fetch(`${baseUrl}/api/auth/session`, {
        headers: { Cookie: cookie }
    });
    assert.equal((await promotedSession.json()).user.role, 'admin');
    assert.equal(userStore.setRoleByEmail('learner@example.com', 'learner'), true);

    const logout = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { Cookie: cookie }
    });
    assert.equal(logout.status, 200);
    assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);

    const loggedOutSession = await fetch(`${baseUrl}/api/auth/session`, {
        headers: { Cookie: cookie }
    });
    assert.deepEqual(await loggedOutSession.json(), { authenticated: false });
});
