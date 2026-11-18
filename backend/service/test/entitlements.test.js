const assert = require('node:assert/strict');
const { test, beforeEach } = require('node:test');
const router = require('../src/routes/courseLessons');
const { Entitlement } = require('../src/models/Entitlement');
const { User } = require('../src/models/User');

// Helper to simulate Express request/response against the router without TCP sockets
function testRequest(routerInstance, { method = 'GET', url = '/', body = {}, query = {}, session = null, headers = {} }) {
    return new Promise((resolve) => {
        const parsedUrl = new URL(url, 'http://localhost');
        const req = {
            method,
            url,
            path: parsedUrl.pathname,
            originalUrl: url,
            body,
            query: { ...Object.fromEntries(parsedUrl.searchParams), ...query },
            session,
            headers: { ...headers },
            params: {}
        };

        let statusCode = 200;
        let responseBody = null;

        const res = {
            status(code) {
                statusCode = code;
                return this;
            },
            json(data) {
                responseBody = data;
                resolve({ status: statusCode, body: responseBody });
                return this;
            },
            send(data) {
                responseBody = data;
                resolve({ status: statusCode, body: responseBody });
                return this;
            }
        };

        const next = (err) => {
            if (err) {
                resolve({ status: err.status || 500, error: err.message });
            } else {
                resolve({ status: 404, error: 'Route not handled' });
            }
        };

        routerInstance(req, res, next);
    });
}

beforeEach(async () => {
    await Entitlement.deleteMany({});
    Entitlement._clearMemoryStore();
});

test('Entitlement model: creates, checks active access, and handles expiration', async () => {
    const userId = 'usr_test_1';
    const courseId = 'it';

    // No access initially
    let hasAccess = await Entitlement.hasActiveEntitlement(userId, courseId);
    assert.strictEqual(hasAccess, false);

    // Grant active entitlement
    const { entitlement, idempotent } = await Entitlement.grantEntitlement({
        userId,
        courseId,
        provider: 'mock',
        providerPaymentId: 'pay_test_001'
    });

    assert.strictEqual(idempotent, false);
    assert.strictEqual(entitlement.userId, userId);
    assert.strictEqual(entitlement.status, 'active');

    // Should now have active access
    hasAccess = await Entitlement.hasActiveEntitlement(userId, courseId);
    assert.strictEqual(hasAccess, true);

    // Revoke entitlement (refund)
    await Entitlement.revokeEntitlement({
        providerPaymentId: 'pay_test_001',
        status: 'refunded'
    });

    hasAccess = await Entitlement.hasActiveEntitlement(userId, courseId);
    assert.strictEqual(hasAccess, false);

    // Test expired entitlement
    await Entitlement.create({
        userId: 'usr_test_expired',
        courseId: 'it',
        provider: 'mock',
        providerPaymentId: 'pay_test_exp',
        status: 'active',
        expiresAt: new Date(Date.now() - 60000) // expired 1 minute ago
    });

    hasAccess = await Entitlement.hasActiveEntitlement('usr_test_expired', 'it');
    assert.strictEqual(hasAccess, false, 'Expired entitlement should not grant active access');
});

test('GET /api/courses/:courseId/lessons/:lessonId - free lesson delivers without auth or entitlement', async () => {
    const res = await testRequest(router, {
        method: 'GET',
        url: '/it/lessons/communication-basics-1',
        session: null
    });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body);
    assert.strictEqual(res.body.id, 'communication-basics-1');
    assert.strictEqual(res.body.access, 'free');
});

test('GET /api/courses/:courseId/lessons/:lessonId - paid lesson returns 401 when unauthenticated', async () => {
    const res = await testRequest(router, {
        method: 'GET',
        url: '/it/lessons/italian-reading-2',
        session: null // Unauthenticated
    });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.code, 'AUTH_REQUIRED');
});

test('GET /api/courses/:courseId/lessons/:lessonId - paid lesson returns 403 when user lacks entitlement', async () => {
    const res = await testRequest(router, {
        method: 'GET',
        url: '/it/lessons/italian-reading-2',
        session: { userId: 'usr_no_access' }
    });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.code, 'ENTITLEMENT_REQUIRED');
    assert.strictEqual(res.body.courseId, 'it');
    assert.strictEqual(res.body.lessonId, 'italian-reading-2');
});

test('GET /api/courses/:courseId/lessons/:lessonId - paid lesson returns 200 when user is entitled', async () => {
    const userId = 'usr_entitled_learner';
    const courseId = 'it';

    // Grant entitlement
    await Entitlement.grantEntitlement({
        userId,
        courseId,
        provider: 'mock',
        providerPaymentId: 'pay_reading_access'
    });

    const res = await testRequest(router, {
        method: 'GET',
        url: '/it/lessons/italian-reading-2',
        session: { userId }
    });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body);
    assert.strictEqual(res.body.id, 'italian-reading-2');
    assert.strictEqual(res.body.access, 'paid');
});

test('GET /api/courses/:courseId/i18n/:locale/lessons/:lessonId - protects translations for paid content', async () => {
    const userId = 'usr_learner_i18n';
    const courseId = 'it';

    // Without entitlement -> 403
    let res = await testRequest(router, {
        method: 'GET',
        url: '/it/i18n/uk/lessons/italian-reading-2',
        session: { userId }
    });
    assert.strictEqual(res.status, 403);

    // Grant entitlement -> 200
    await Entitlement.grantEntitlement({
        userId,
        courseId,
        provider: 'mock',
        providerPaymentId: 'pay_i18n_test'
    });

    res = await testRequest(router, {
        method: 'GET',
        url: '/it/i18n/uk/lessons/italian-reading-2',
        session: { userId }
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body);
});

test('Entitlement model & routing: path-specific gating unlocks ONLY selected paths', async () => {
    const userId = 'usr_travel_only';
    const courseId = 'it';

    // Grant entitlement specifically for travel-conversation, NOT italian-reading
    await Entitlement.grantEntitlement({
        userId,
        courseId,
        selectedPaths: ['travel-conversation'],
        provider: 'mock',
        providerPaymentId: 'pay_travel_only_123'
    });

    // Check Entitlement.hasEntitlement directly
    const hasTravel = await Entitlement.hasEntitlement(userId, courseId, 'travel-conversation');
    const hasReading = await Entitlement.hasEntitlement(userId, courseId, 'italian-reading');
    assert.strictEqual(hasTravel, true, 'User should be entitled to travel-conversation');
    assert.strictEqual(hasReading, false, 'User should NOT be entitled to italian-reading');

    // Attempting to access reading lesson must return 403 Forbidden with Path requires payment
    const readingRes = await testRequest(router, {
        method: 'GET',
        url: '/it/lessons/italian-reading-2',
        session: { userId }
    });

    assert.strictEqual(readingRes.status, 403);
    assert.strictEqual(readingRes.body.error, 'Path requires payment');
    assert.strictEqual(readingRes.body.requiresPath, 'italian-reading');

    // Now grant entitlement specifically for italian-reading
    const userIdReading = 'usr_reading_learner';
    await Entitlement.grantEntitlement({
        userId: userIdReading,
        courseId,
        selectedPaths: ['italian-reading'],
        provider: 'mock',
        providerPaymentId: 'pay_reading_path_456'
    });

    // User with italian-reading access now loads the paid lesson successfully
    const successRes = await testRequest(router, {
        method: 'GET',
        url: '/it/lessons/italian-reading-2',
        session: { userId: userIdReading }
    });

    assert.strictEqual(successRes.status, 200);
    assert.strictEqual(successRes.body.id, 'italian-reading-2');
    assert.strictEqual(successRes.body.access, 'paid');
});

test('Admin role grants instant access to paid lessons and all paths without purchasing', async () => {
    const adminUser = new User({
        email: 'admin_test@example.com',
        displayName: 'Site Admin',
        role: 'admin'
    });
    await adminUser.save();
    const adminId = adminUser._id.toString();

    // Check hasEntitlement returns true for admin even with 0 records in entitlements collection
    const hasAccess = await Entitlement.hasEntitlement(adminId, 'it', 'italian-reading');
    assert.strictEqual(hasAccess, true, 'Admin should automatically have entitlement to any path');

    // Admin should be able to fetch paid lesson successfully without 401 or 403
    const adminRes = await testRequest(router, {
        method: 'GET',
        url: '/it/lessons/italian-reading-2',
        session: { userId: adminId }
    });
    assert.strictEqual(adminRes.status, 200);
    assert.strictEqual(adminRes.body.id, 'italian-reading-2');
});

test('Course content and metadata endpoints serve index, course data, exercises, and grammar', async () => {
    const indexRes = await testRequest(router, { method: 'GET', url: '/course-index' });
    assert.strictEqual(indexRes.status, 200);
    assert.ok(Array.isArray(indexRes.body.courses));

    const courseRes = await testRequest(router, { method: 'GET', url: '/it' });
    assert.strictEqual(courseRes.status, 200);
    assert.strictEqual(courseRes.body.id, 'it');

    const exercisesRes = await testRequest(router, { method: 'GET', url: '/it/exercises' });
    assert.strictEqual(exercisesRes.status, 200);
    assert.ok(Array.isArray(exercisesRes.body));

    const grammarRes = await testRequest(router, { method: 'GET', url: '/it/grammar' });
    assert.strictEqual(grammarRes.status, 200);
    assert.ok(Array.isArray(grammarRes.body.topics));
});
