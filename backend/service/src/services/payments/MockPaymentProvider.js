const PaymentProvider = require('./PaymentProvider');

/**
 * Mock / Stub Payment Provider for local testing and offline verification.
 * Simulates checkout creation, signature verification, and event parsing.
 */
class MockPaymentProvider extends PaymentProvider {
    constructor(options = {}) {
        super();
        this.secret = options.secret || process.env.PAYMENT_WEBHOOK_SECRET || 'mock_secret_test_key_123';
    }

    get name() {
        return 'mock';
    }

    /**
     * Creates a mock checkout session.
     */
    async createCheckout({ userId, courseId, priceId, successUrl, cancelUrl, metadata = {} }) {
        if (!userId) throw new Error('userId is required for createCheckout');
        if (!courseId) throw new Error('courseId is required for createCheckout');

        const timestamp = Date.now();
        const rand = Math.random().toString(36).slice(2, 8);
        const providerPaymentId = `mock_pay_${timestamp}_${rand}`;
        const sessionId = `mock_sess_${timestamp}_${rand}`;

        // Return local stub checkout URL
        const query = new URLSearchParams({
            provider: 'mock',
            sessionId,
            providerPaymentId,
            courseId,
            priceId: priceId || 'price_default',
            userId
        });

        if (successUrl) query.set('successUrl', successUrl);
        if (cancelUrl) query.set('cancelUrl', cancelUrl);

        return {
            id: sessionId,
            checkoutUrl: `/pages/checkout.html?${query.toString()}`,
            provider: this.name,
            providerPaymentId,
            courseId,
            priceId: priceId || 'price_default'
        };
    }

    /**
     * Verifies the webhook signature.
     * Accepts:
     * - 'mock_valid_signature' (standard test token)
     * - or secret match (signature === this.secret)
     * - rejects invalid/mismatched signatures
     */
    verifyWebhook(payload, signature, headers = {}) {
        if (!signature || typeof signature !== 'string') {
            return false;
        }

        // Standard mock valid signature or matching configured webhook secret
        if (signature === 'mock_valid_signature' || signature === this.secret) {
            return true;
        }

        // Allow 't=...,v1=...' simulation if needed
        if (signature.includes('v1=')) {
            const parts = signature.split(',').map(s => s.trim());
            const v1 = parts.find(p => p.startsWith('v1='));
            return v1 === `v1=${this.secret}` || v1 === 'v1=mock_valid_signature';
        }

        return false;
    }

    /**
     * Parses the payload into normalized payment event object.
     */
    parseEvent(payload, headers = {}) {
        if (!payload || typeof payload !== 'object') {
            throw new Error('Invalid payload: expected an object.');
        }

        const rawType = payload.eventType || payload.type || 'payment_success';
        let eventType = rawType;
        let status = 'active';

        if (rawType === 'payment_refunded' || rawType === 'charge.refunded') {
            eventType = 'payment_refunded';
            status = 'refunded';
        } else if (rawType === 'subscription_cancelled' || rawType === 'customer.subscription.deleted') {
            eventType = 'subscription_cancelled';
            status = 'expired';
        } else {
            eventType = 'payment_success';
            status = 'active';
        }

        const providerPaymentId = payload.providerPaymentId || payload.data?.id || payload.id;
        if (!providerPaymentId) {
            throw new Error('Payload missing providerPaymentId or id.');
        }

        const userId = payload.userId || payload.data?.userId || payload.metadata?.userId || '';
        const courseId = payload.courseId || payload.data?.courseId || payload.metadata?.courseId || '';
        const expiresAt = payload.expiresAt ? new Date(payload.expiresAt) : null;

        return {
            eventType,
            providerPaymentId: String(providerPaymentId),
            userId: String(userId),
            courseId: String(courseId),
            status,
            expiresAt,
            provider: this.name
        };
    }
}

module.exports = MockPaymentProvider;
