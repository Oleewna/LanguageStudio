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
