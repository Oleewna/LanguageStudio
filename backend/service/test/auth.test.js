const assert = require('node:assert/strict');
const { before, beforeEach, test } = require('node:test');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.ENABLE_RATE_LIMIT = 'false';

const app = require('../src/server');
const User = require('../src/models/User');
const { getEmailService } = require('../src/services/emailService');

const emailService = getEmailService();

// Helper to get CSRF token and session cookies from app
async function getCsrfSession(agent) {
    const res = await agent.get('/api/auth/csrf-token');
    assert.equal(res.status, 200);
    assert.ok(res.body.csrfToken, 'Should return csrfToken');
    return res.body.csrfToken;
}

beforeEach(async () => {
    await User.deleteMany({});
    emailService.clear();
});

test('CSRF protection blocks state-changing POST requests without valid token', async () => {
    const resNoToken = await request(app)
        .post('/api/auth/register')
        .send({
            email: 'test@example.com',
            password: 'Password123!',
            displayName: 'Test User'
        });
    assert.equal(resNoToken.status, 403);
    assert.match(resNoToken.body.error, /CSRF/i);

    const agent = request.agent(app);
    await agent.get('/api/auth/csrf-token');

    const resInvalidToken = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', 'invalid-token-value')
        .send({
            email: 'test@example.com',
            password: 'Password123!',
            displayName: 'Test User'
        });
    assert.equal(resInvalidToken.status, 403);
    assert.match(resInvalidToken.body.error, /CSRF/i);
});

test('Validates registration input fields using Zod', async () => {
    const agent = request.agent(app);
    const csrfToken = await getCsrfSession(agent);

    // Missing email
    const resMissingEmail = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({ password: 'Password123!', displayName: 'Test' });
    assert.equal(resMissingEmail.status, 400);

    // Invalid email format
    const resInvalidEmail = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({ email: 'not-an-email', password: 'Password123!', displayName: 'Test' });
    assert.equal(resInvalidEmail.status, 400);
    assert.match(resInvalidEmail.body.error, /email/i);

    // Short password (< 8 chars)
    const resShortPassword = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({ email: 'valid@example.com', password: 'short', displayName: 'Test' });
    assert.equal(resShortPassword.status, 400);
    assert.match(resShortPassword.body.error, /8 characters/i);

    // Missing display name
    const resMissingName = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({ email: 'valid@example.com', password: 'Password123!' });
    assert.equal(resMissingName.status, 400);
    assert.match(resMissingName.body.error, /display name/i);
});

test('Registers a new user, hashes password with Argon2, sends verification email, and starts session', async () => {
    const agent = request.agent(app);
    const csrfToken = await getCsrfSession(agent);

    const res = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({
            email: 'Learner@Example.com', // Should be normalized to lower-case
            password: 'SuperSecretPassword123!',
            displayName: 'Elena Rostova'
        });

    assert.equal(res.status, 201);
    assert.equal(res.body.user.email, 'learner@example.com');
    assert.equal(res.body.user.displayName, 'Elena Rostova');
    assert.equal(res.body.user.emailVerified, false);
    assert.equal('passwordHash' in res.body.user, false);
    assert.equal('emailVerificationToken' in res.body.user, false);

    // Stored password hash check
    const storedUser = await User.findOne({ email: 'learner@example.com' });
    assert.ok(storedUser);
    assert.notEqual(storedUser.passwordHash, 'SuperSecretPassword123!');
    assert.match(storedUser.passwordHash, /^\$argon2/);

    // Verification email sent
    const emails = emailService.getSentEmails();
    assert.equal(emails.length, 1);
    assert.equal(emails[0].type, 'verification');
    assert.equal(emails[0].to, 'learner@example.com');
    assert.ok(emails[0].token);

    // Check that session is established via /api/auth/me
    const meRes = await agent.get('/api/auth/me');
    assert.equal(meRes.status, 200);
    assert.equal(meRes.body.authenticated, true);
    assert.equal(meRes.body.user.email, 'learner@example.com');

    // Duplicate registration rejected
    const dupRes = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({
            email: 'learner@example.com',
            password: 'AnotherPassword123!',
            displayName: 'Duplicate'
        });
    assert.equal(dupRes.status, 409);
    assert.match(dupRes.body.error, /already exists/i);
});

test('Login flow returns generic error on bad credentials and establishes session on success', async () => {
    const setupAgent = request.agent(app);
    const setupCsrf = await getCsrfSession(setupAgent);

    await setupAgent
        .post('/api/auth/register')
        .set('x-csrf-token', setupCsrf)
        .send({
            email: 'student@example.com',
            password: 'ValidPassword123!',
            displayName: 'Student'
        });

    const loginAgent = request.agent(app);
    const csrfToken = await getCsrfSession(loginAgent);

    // Non-existent user
    const resNotFound = await loginAgent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({ email: 'unknown@example.com', password: 'ValidPassword123!' });
    assert.equal(resNotFound.status, 401);
    assert.equal(resNotFound.body.error, 'Invalid email or password.');

    // Incorrect password
    const resWrongPass = await loginAgent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({ email: 'student@example.com', password: 'WrongPassword123!' });
    assert.equal(resWrongPass.status, 401);
    assert.equal(resWrongPass.body.error, 'Invalid email or password.');

    // Correct password
    const resSuccess = await loginAgent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({ email: 'student@example.com', password: 'ValidPassword123!', remember: true });
    assert.equal(resSuccess.status, 200);
    assert.equal(resSuccess.body.user.email, 'student@example.com');
    assert.equal('passwordHash' in resSuccess.body.user, false);

    // Verify authenticated session
    const meRes = await loginAgent.get('/api/auth/me');
    assert.equal(meRes.status, 200);
    assert.equal(meRes.body.authenticated, true);
    assert.equal(meRes.body.user.displayName, 'Student');
});

test('Logout destroys session and invalidates access to /api/auth/me', async () => {
    const agent = request.agent(app);
    const csrfToken = await getCsrfSession(agent);

    await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({
            email: 'logout-user@example.com',
            password: 'Password123!',
            displayName: 'Logout User'
        });

    const preLogoutMe = await agent.get('/api/auth/me');
    assert.equal(preLogoutMe.status, 200);

    const logoutRes = await agent
        .post('/api/auth/logout')
        .set('x-csrf-token', csrfToken);
    assert.equal(logoutRes.status, 200);
    assert.equal(logoutRes.body.success, true);

    const postLogoutMe = await agent.get('/api/auth/me');
    assert.equal(postLogoutMe.status, 401);
    assert.equal(postLogoutMe.body.authenticated, false);
});

test('Password reset flow: forgot password, token generation, and password update', async () => {
    const agent = request.agent(app);
    const csrfToken = await getCsrfSession(agent);

    await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({
            email: 'reset-test@example.com',
            password: 'InitialPassword123!',
            displayName: 'Reset Tester'
        });

    emailService.clear();

    // Forgot password request
    const forgotRes = await agent
        .post('/api/auth/forgot-password')
        .set('x-csrf-token', csrfToken)
        .send({ email: 'reset-test@example.com' });
    assert.equal(forgotRes.status, 200);
    assert.match(forgotRes.body.message, /password reset link has been sent/i);

    const emails = emailService.getSentEmails();
    assert.equal(emails.length, 1);
    assert.equal(emails[0].type, 'password-reset');
    const resetToken = emails[0].token;
    assert.ok(resetToken);

    // Reset password with invalid token
    const invalidResetRes = await agent
        .post('/api/auth/reset-password')
        .set('x-csrf-token', csrfToken)
        .send({ token: 'nonexistent-token', password: 'BrandNewPassword123!' });
    assert.equal(invalidResetRes.status, 400);

    // Reset password with valid token
    const validResetRes = await agent
        .post('/api/auth/reset-password')
        .set('x-csrf-token', csrfToken)
        .send({ token: resetToken, password: 'BrandNewPassword123!' });
    assert.equal(validResetRes.status, 200);
    assert.equal(validResetRes.body.success, true);

    // Try logging in with old password (must fail)
    const oldLoginAgent = request.agent(app);
    const oldLoginCsrf = await getCsrfSession(oldLoginAgent);
    const oldLoginRes = await oldLoginAgent
        .post('/api/auth/login')
        .set('x-csrf-token', oldLoginCsrf)
        .send({ email: 'reset-test@example.com', password: 'InitialPassword123!' });
    assert.equal(oldLoginRes.status, 401);

    // Login with new password (must succeed)
    const newLoginRes = await oldLoginAgent
        .post('/api/auth/login')
        .set('x-csrf-token', oldLoginCsrf)
        .send({ email: 'reset-test@example.com', password: 'BrandNewPassword123!' });
    assert.equal(newLoginRes.status, 200);
});

test('Email verification flow marks emailVerified as true', async () => {
    const agent = request.agent(app);
    const csrfToken = await getCsrfSession(agent);

    await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({
            email: 'verify-me@example.com',
            password: 'Password123!',
            displayName: 'Verify User'
        });

    const userBefore = await User.findOne({ email: 'verify-me@example.com' });
    assert.equal(userBefore.emailVerified, false);
    const verificationToken = userBefore.emailVerificationToken;
    assert.ok(verificationToken);

    // Verify with invalid token
    const invalidVerifyRes = await agent
        .post('/api/auth/verify-email')
        .set('x-csrf-token', csrfToken)
        .send({ token: 'bogus-token' });
    assert.equal(invalidVerifyRes.status, 400);

    // Verify with valid token
    const verifyRes = await agent
        .post('/api/auth/verify-email')
        .set('x-csrf-token', csrfToken)
        .send({ token: verificationToken });
    assert.equal(verifyRes.status, 200);
    assert.equal(verifyRes.body.success, true);

    const userAfter = await User.findOne({ email: 'verify-me@example.com' });
    assert.equal(userAfter.emailVerified, true);
    assert.equal(userAfter.emailVerificationToken, null);
});

test('User.findOrCreateByGoogle handles create, find by googleId, and email account linking', async () => {
    // 1. Create a brand new user via Google
    const created = await User.findOrCreateByGoogle('google-sub-1001', {
        name: 'Google Learner',
        email: 'google-learner@example.com'
    });
    assert.ok(created);
    assert.equal(created.googleId, 'google-sub-1001');
    assert.equal(created.email, 'google-learner@example.com');
    assert.equal(created.displayName, 'Google Learner');
    assert.equal(created.emailVerified, true);
    assert.equal(created.role, 'learner');

    // 2. Find existing user by googleId
    const found = await User.findOrCreateByGoogle('google-sub-1001', {
        name: 'Different Name',
        email: 'google-learner@example.com'
    });
    assert.equal(found._id.toString(), created._id.toString());

    // 3. Link googleId to an existing account that originally registered via email/password
    const localUser = new User({
        email: 'local-to-google@example.com',
        displayName: 'Local User',
        passwordHash: 'dummy-hash',
        emailVerified: false
    });
    await localUser.save();

    const linked = await User.findOrCreateByGoogle('google-sub-2002', {
        name: 'Local User Google',
        email: 'local-to-google@example.com'
    });
    assert.equal(linked._id.toString(), localUser._id.toString());
    assert.equal(linked.googleId, 'google-sub-2002');
    assert.equal(linked.emailVerified, true);
});

test('GET /api/v1/auth/session returns 200 { authenticated: false } when unauthenticated', async () => {
    const res = await request(app).get('/api/v1/auth/session');
    assert.equal(res.status, 200);
    assert.equal(res.body.authenticated, false);
});

test('Google OAuth initiation and callback validation in backend/service', async () => {
    // 1. Not configured returns 503
    process.env.GOOGLE_CLIENT_ID = '';
    process.env.GOOGLE_CLIENT_SECRET = '';
    const resUnconfigured = await request(app).get('/api/v1/auth/google');
    assert.equal(resUnconfigured.status, 503);
    assert.match(resUnconfigured.body.error, /Google OAuth is not configured/);

    // 2. Configured redirects to Google authorization URL
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
    const resConfigured = await request(app).get('/api/v1/auth/google');
    assert.equal(resConfigured.status, 302);
    assert.match(resConfigured.headers.location, /^https:\/\/accounts\.google\.com/);
    assert.match(resConfigured.headers.location, /client_id=test-client-id/);
    process.env.GOOGLE_CLIENT_ID = '';
    process.env.GOOGLE_CLIENT_SECRET = '';

    // 3. Callback with error parameter redirects to auth page
    const resErr = await request(app).get('/api/v1/auth/google/callback?error=access_denied');
    assert.equal(resErr.status, 302);
    assert.match(resErr.headers.location, /error=google_failed/);

    // 4. Callback with invalid state redirects with invalid_state error
    const resInvalidState = await request(app).get('/api/v1/auth/google/callback?state=invalid-state&code=test-code');
    assert.equal(resInvalidState.status, 302);
    assert.match(resInvalidState.headers.location, /error=invalid_state/);
});

test('Unified session: Google authenticated user establishes ls.sid and accesses protected progress and course endpoints', async () => {
    const user = await User.findOrCreateByGoogle('google-sub-unified', {
        name: 'Unified Student',
        email: 'unified@example.com'
    });

    // Create session for user
    const agent = request.agent(app);
    const csrfToken = await getCsrfSession(agent);

    // Simulate login for this user or register to inspect cookie name
    const registerRes = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({
            email: 'cookie-check@example.com',
            password: 'Password123!',
            displayName: 'Cookie Check'
        });
    assert.equal(registerRes.status, 201);

    // Both email/password and session establishment set the 'ls.sid' cookie
    const cookies = registerRes.headers['set-cookie'];
    assert.ok(cookies.some(c => c.startsWith('ls.sid=')), 'Expected ls.sid cookie');

    // Verify session user access to /api/auth/me, /api/auth/session, and /api/progress
    const sessionRes = await agent.get('/api/v1/auth/session');
    assert.equal(sessionRes.status, 200);
    assert.equal(sessionRes.body.authenticated, true);
    assert.equal(sessionRes.body.user.email, 'cookie-check@example.com');

    const progressRes = await agent.get('/api/progress');
    assert.equal(progressRes.status, 200);
    assert.ok(progressRes.body);
});
