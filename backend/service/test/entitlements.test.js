const assert = require('node:assert/strict');
const { test, beforeEach } = require('node:test');
const router = require('../src/routes/courseLessons');
const { Entitlement } = require('../src/models/Entitlement');

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
