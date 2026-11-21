const assert = require('node:assert/strict');
const { test, beforeEach } = require('node:test');
const router = require('../src/routes/payments');
const { Entitlement } = require('../src/models/Entitlement');

// Helper to simulate Express request/response against the router without TCP sockets
function testRequest(routerInstance, { method = 'POST', url = '/', body = {}, query = {}, session = null, headers = {} }) {
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

test('POST /api/payments/checkout - requires authentication', async () => {
    const res = await testRequest(router, {
        method: 'POST',
        url: '/checkout',
        body: { courseId: 'it' },
        session: null // No session
    });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.code, 'AUTH_REQUIRED');
});

test('POST /api/payments/checkout - validates courseId and creates checkout session', async () => {
    const userId = 'usr_checkout_test';

    // Missing courseId
    let res = await testRequest(router, {
        method: 'POST',
        url: '/checkout',
        body: {},
        session: { userId }
    });
    assert.strictEqual(res.status, 400);

    // Valid courseId
    res = await testRequest(router, {
        method: 'POST',
        url: '/checkout',
        body: { courseId: 'it' },
        session: { userId }
    });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.checkoutUrl, 'Should return checkoutUrl');
    assert.ok(res.body.checkoutUrl.includes('/pages/checkout.html'));
    assert.ok(res.body.providerPaymentId);
    assert.strictEqual(res.body.provider, 'mock');
});

test('POST /api/payments/checkout - prevents duplicate checkout if already entitled (409)', async () => {
    const userId = 'usr_already_entitled';
    const courseId = 'it';

    // Grant entitlement first
    await Entitlement.grantEntitlement({
        userId,
        courseId,
        provider: 'mock',
        providerPaymentId: 'pay_existing_001'
    });

    const res = await testRequest(router, {
        method: 'POST',
        url: '/checkout',
        body: { courseId },
        session: { userId }
    });

    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.code, 'ALREADY_ENTITLED');
});

test('POST /api/payments/webhook - validates signature and rejects forged events', async () => {
    const payload = {
        eventType: 'payment_success',
        providerPaymentId: 'pay_tampered_001',
        userId: 'usr_hacker',
        courseId: 'it'
    };

    // Missing signature header
    let res = await testRequest(router, {
        method: 'POST',
        url: '/webhook',
        body: payload,
        headers: {}
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.code, 'INVALID_SIGNATURE');

    // Invalid signature header
    res = await testRequest(router, {
        method: 'POST',
        url: '/webhook',
        body: payload,
        headers: { 'x-signature': 'forged_fake_signature' }
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.code, 'INVALID_SIGNATURE');
});

test('POST /api/payments/webhook - idempotent entitlement granting by providerPaymentId', async () => {
    const userId = 'usr_buyer_123';
    const courseId = 'it';
    const providerPaymentId = 'pay_stripe_sim_999';

    // 1. User has no access prior to webhook
    let hasAccess = await Entitlement.hasActiveEntitlement(userId, courseId);
    assert.strictEqual(hasAccess, false);

    const webhookBody = {
        eventType: 'payment_success',
        providerPaymentId,
        userId,
        courseId,
        provider: 'mock'
    };

    // 2. First webhook delivery
    let res = await testRequest(router, {
        method: 'POST',
        url: '/webhook',
        body: webhookBody,
        headers: { 'x-signature': 'mock_valid_signature' }
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.received, true);
    assert.strictEqual(res.body.idempotent, false);
    assert.strictEqual(res.body.entitlement.status, 'active');

    // User now has active access
    hasAccess = await Entitlement.hasActiveEntitlement(userId, courseId);
    assert.strictEqual(hasAccess, true);

    // 3. Second webhook delivery (simulating provider retry / network duplicate)
    res = await testRequest(router, {
        method: 'POST',
        url: '/webhook',
        body: webhookBody,
        headers: { 'x-signature': 'mock_valid_signature' }
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.received, true);
    assert.strictEqual(res.body.idempotent, true, 'Second call must be flagged as idempotent');

    // Verify exactly ONE entitlement record exists with this payment ID
    const records = await Entitlement.find({ providerPaymentId });
    assert.strictEqual(records.length, 1, 'Duplicate webhook must not create multiple entitlements');
});

test('POST /api/payments/webhook - revokes entitlement on refund or subscription cancellation', async () => {
    const userId = 'usr_refund_user';
    const courseId = 'it';
    const providerPaymentId = 'pay_refundable_123';

    // Grant access first via webhook
    await testRequest(router, {
        method: 'POST',
        url: '/webhook',
        body: {
            eventType: 'payment_success',
            providerPaymentId,
            userId,
            courseId,
            provider: 'mock'
        },
        headers: { 'x-signature': 'mock_valid_signature' }
    });

    let hasAccess = await Entitlement.hasActiveEntitlement(userId, courseId);
    assert.strictEqual(hasAccess, true);

    // Dispatch refund webhook
    const refundRes = await testRequest(router, {
        method: 'POST',
        url: '/webhook',
        body: {
            eventType: 'payment_refunded',
            providerPaymentId
        },
        headers: { 'x-signature': 'mock_valid_signature' }
    });

    assert.strictEqual(refundRes.status, 200);
    assert.strictEqual(refundRes.body.action, 'refunded');

    // Access must now be immediately revoked
    hasAccess = await Entitlement.hasActiveEntitlement(userId, courseId);
    assert.strictEqual(hasAccess, false);

    // Check entitlement status in DB
    const rec = await Entitlement.findOne({ providerPaymentId });
    assert.strictEqual(rec.status, 'refunded');
});

test('POST /api/payments/checkout & webhook - accepts and stores selectedPaths', async () => {
    const userId = 'usr_paths_checkout';
    const courseId = 'it';
    const selectedPaths = ['italian-reading', 'travel-conversation'];

    // 1. Initiate checkout with selectedPaths
    const checkoutRes = await testRequest(router, {
        method: 'POST',
        url: '/checkout',
        body: {
            courseId,
            selectedPaths
        },
        session: { userId }
    });

    assert.strictEqual(checkoutRes.status, 200);
    assert.deepEqual(checkoutRes.body.selectedPaths, selectedPaths);
    assert.ok(checkoutRes.body.checkoutUrl.includes('selectedPaths'));
    const providerPaymentId = checkoutRes.body.providerPaymentId;

    // 2. Deliver webhook with selectedPaths
    const webhookRes = await testRequest(router, {
        method: 'POST',
        url: '/webhook',
        body: {
            eventType: 'payment_success',
            providerPaymentId,
            userId,
            courseId,
            selectedPaths,
            provider: 'mock'
        },
        headers: { 'x-signature': 'mock_valid_signature' }
    });

    assert.strictEqual(webhookRes.status, 200);
    assert.strictEqual(webhookRes.body.received, true);
    assert.deepEqual(webhookRes.body.entitlement.selectedPaths, selectedPaths);

    // 3. Verify entitlement in store has selectedPaths
    const stored = await Entitlement.findOne({ providerPaymentId });
    assert.ok(stored);
    assert.deepEqual(stored.selectedPaths, selectedPaths);

    // 4. Test GET /api/payments/entitlements
    const listRes = await testRequest(router, {
        method: 'GET',
        url: '/entitlements',
        session: { userId }
    });
    assert.strictEqual(listRes.status, 200);
    assert.strictEqual(listRes.body.authenticated, true);
    assert.strictEqual(listRes.body.entitlements.length, 1);
    assert.deepEqual(listRes.body.entitlements[0].selectedPaths, selectedPaths);

    // 5. Test GET /api/payments/entitlement/:courseId with pathId check
    const readingCheck = await testRequest(router, {
        method: 'GET',
        url: `/entitlement/${courseId}?pathId=italian-reading`,
        session: { userId }
    });
    assert.strictEqual(readingCheck.status, 200);
    assert.strictEqual(readingCheck.body.hasAccess, true);

    const grammarCheck = await testRequest(router, {
        method: 'GET',
        url: `/entitlement/${courseId}?pathId=grammar-basics`,
        session: { userId }
    });
    assert.strictEqual(grammarCheck.status, 200);
    assert.strictEqual(grammarCheck.body.hasAccess, false);
});

test('POST /api/payments/dev-unlock - security gating behind tunnel and localhost', async () => {
    // 1. Allowed on localhost
    let res = await testRequest(router, {
        method: 'POST',
        url: '/dev-unlock',
        body: { courseId: 'it' },
        headers: { host: 'localhost:3005' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    // 2. Blocked (403) when request arrives via tunnel
    res = await testRequest(router, {
        method: 'POST',
        url: '/dev-unlock',
        body: { courseId: 'it' },
        headers: { 'x-forwarded-host': 'my-tunnel.ngrok-free.app' }
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.code, 'DEV_UNLOCK_DISABLED');

    // 3. Allowed when ALLOW_DEV_ENDPOINTS=true
    process.env.ALLOW_DEV_ENDPOINTS = 'true';
    res = await testRequest(router, {
        method: 'POST',
        url: '/dev-unlock',
        body: { courseId: 'it' },
        headers: { 'x-forwarded-host': 'my-tunnel.ngrok-free.app' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    delete process.env.ALLOW_DEV_ENDPOINTS;
});

test('POST /api/payments/webhook - mock signature rejected behind tunnel unless ALLOW_DEV_ENDPOINTS=true', async () => {
    const payload = {
        eventType: 'payment_success',
        providerPaymentId: 'pay_tunnel_001',
        userId: 'usr_tunnel_user',
        courseId: 'it'
    };

    // 1. Rejected when arriving via tunnel
    let res = await testRequest(router, {
        method: 'POST',
        url: '/webhook',
        body: payload,
        headers: {
            'x-forwarded-host': 'demo.ngrok-free.app',
            'x-signature': 'mock_valid_signature'
        }
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.code, 'INVALID_SIGNATURE');

    // 2. Accepted behind tunnel when ALLOW_DEV_ENDPOINTS=true
    process.env.ALLOW_DEV_ENDPOINTS = 'true';
    res = await testRequest(router, {
        method: 'POST',
        url: '/webhook',
        body: payload,
        headers: {
            'x-forwarded-host': 'demo.ngrok-free.app',
            'x-signature': 'mock_valid_signature'
        }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.received, true);
    delete process.env.ALLOW_DEV_ENDPOINTS;
});

test('POST /api/payments/webhook - accepts PAYMENT_WEBHOOK_SECRET and raw body HMAC behind tunnel', async () => {
    const crypto = require('crypto');
    const secret = 'prod_secret_tunnel_webhook_key_99';
    process.env.PAYMENT_WEBHOOK_SECRET = secret;

    const payload = {
        eventType: 'payment_success',
        providerPaymentId: 'pay_tunnel_secret_002',
        userId: 'usr_secret_user',
        courseId: 'it'
    };

    // 1. Exact secret match behind tunnel
    let res = await testRequest(router, {
        method: 'POST',
        url: '/webhook',
        body: payload,
        headers: {
            'x-forwarded-host': 'payments.ngrok-free.app',
            'x-signature': secret
        }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.received, true);

    // 2. HMAC-SHA256 signature with raw buffer
    const rawBuffer = Buffer.from(JSON.stringify(payload));
    const hmac = crypto.createHmac('sha256', secret).update(rawBuffer).digest('hex');

    res = await testRequest(router, {
        method: 'POST',
        url: '/webhook',
        body: rawBuffer,
        headers: {
            'x-forwarded-host': 'payments.ngrok-free.app',
            'x-signature': `sha256=${hmac}`
        }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.received, true);

    delete process.env.PAYMENT_WEBHOOK_SECRET;
});

test('GET /api/payments/config - exposes allowDevEndpoints flag correctly', async () => {
    // Localhost
    let res = await testRequest(router, {
        method: 'GET',
        url: '/config',
        headers: { host: 'localhost:3005' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.allowDevEndpoints, true);

    // Tunnel
    res = await testRequest(router, {
        method: 'GET',
        url: '/config',
        headers: { 'x-forwarded-host': 'my-tunnel.ngrok-free.app' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.allowDevEndpoints, false);
});
