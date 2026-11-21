const crypto = require('crypto');
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
    async createCheckout({ userId, courseId, selectedPaths = [], priceId, successUrl, cancelUrl, metadata = {} }) {
        if (!userId) throw new Error('userId is required for createCheckout');
        if (!courseId) throw new Error('courseId is required for createCheckout');

        const timestamp = Date.now();
        const rand = Math.random().toString(36).slice(2, 8);
        const providerPaymentId = `mock_pay_${timestamp}_${rand}`;
        const sessionId = `mock_sess_${timestamp}_${rand}`;

        const normalizedPaths = Array.isArray(selectedPaths)
            ? selectedPaths.filter(p => typeof p === 'string' && p.trim()).map(p => p.trim())
            : [];

        // Return local stub checkout URL
        const query = new URLSearchParams({
            provider: 'mock',
            sessionId,
            providerPaymentId,
            courseId,
            priceId: priceId || 'price_default',
            userId
        });

        if (normalizedPaths.length > 0) {
            query.set('selectedPaths', JSON.stringify(normalizedPaths));
        }

        if (successUrl) query.set('successUrl', successUrl);
        if (cancelUrl) query.set('cancelUrl', cancelUrl);

        return {
            id: sessionId,
            checkoutUrl: `/pages/checkout.html?${query.toString()}`,
            provider: this.name,
            providerPaymentId,
            courseId,
            selectedPaths: normalizedPaths,
            priceId: priceId || 'price_default'
        };
    }

    /**
     * Verifies the webhook signature.
     * Behind a tunnel / public URL, mock_valid_signature is rejected unless ALLOW_DEV_ENDPOINTS=true.
     * Verifies with PAYMENT_WEBHOOK_SECRET (direct, v1=, or HMAC-SHA256).
     */
    verifyWebhook(payload, signature, headers = {}) {
        if (!signature || typeof signature !== 'string') {
            return false;
        }

        const allowDev = process.env.ALLOW_DEV_ENDPOINTS === 'true';
        let isTunnel = Boolean(process.env.PUBLIC_URL && process.env.PUBLIC_URL.trim());
        if (!isTunnel && headers && headers['x-forwarded-host']) {
            const primaryHost = String(headers['x-forwarded-host']).split(',')[0].trim().split(':')[0].toLowerCase();
            if (primaryHost !== 'localhost' && primaryHost !== '127.0.0.1' && primaryHost !== '::1') {
                isTunnel = true;
            }
        }

        const isMockSignature = signature === 'mock_valid_signature' ||
            signature === 'v1=mock_valid_signature' ||
            (signature.includes('v1=') && signature.split(',').map(s => s.trim()).includes('v1=mock_valid_signature'));

        // Behind tunnel reject mock signature unless ALLOW_DEV_ENDPOINTS=true
        if (isTunnel && !allowDev && isMockSignature) {
            return false;
        }

        const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || this.secret;

        // Direct secret match
        if (webhookSecret && signature === webhookSecret) {
            return true;
        }

        // HMAC verification support for raw body or payload
        if (webhookSecret) {
            try {
                const raw = Buffer.isBuffer(payload)
                    ? payload
                    : (typeof payload === 'string' ? Buffer.from(payload) : Buffer.from(JSON.stringify(payload)));
                const hmac = crypto.createHmac('sha256', webhookSecret).update(raw).digest('hex');
                if (signature === hmac || signature === `sha256=${hmac}`) {
                    return true;
                }
                if (signature.includes('v1=')) {
                    const parts = signature.split(',').map(s => s.trim());
                    const v1 = parts.find(p => p.startsWith('v1='));
                    if (v1 === `v1=${webhookSecret}` || v1 === `v1=${hmac}`) {
                        return true;
                    }
                }
            } catch (e) {}
        }

        // Standard mock signature acceptance when allowed
        if ((!isTunnel || allowDev) && signature === 'mock_valid_signature') {
            return true;
        }

        // Allow 't=...,v1=...' simulation if needed
        if (signature.includes('v1=')) {
            const parts = signature.split(',').map(s => s.trim());
            const v1 = parts.find(p => p.startsWith('v1='));
            return (
                (!isTunnel || allowDev ? v1 === 'v1=mock_valid_signature' : false) ||
                (webhookSecret ? v1 === `v1=${webhookSecret}` : false)
            );
        }

        return false;
    }

    /**
     * Parses the payload into normalized payment event object.
     */
    parseEvent(payload, headers = {}) {
        if (Buffer.isBuffer(payload)) {
            try {
                payload = JSON.parse(payload.toString('utf8'));
            } catch (e) {
                throw new Error('Invalid JSON payload buffer.');
            }
        } else if (typeof payload === 'string') {
            try {
                payload = JSON.parse(payload);
            } catch (e) {
                throw new Error('Invalid JSON payload string.');
            }
        }

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
        const rawPaths = payload.selectedPaths || payload.data?.selectedPaths || payload.metadata?.selectedPaths || [];
        const selectedPaths = Array.isArray(rawPaths)
            ? rawPaths.filter(p => typeof p === 'string' && p.trim()).map(p => p.trim())
            : [];
        const expiresAt = payload.expiresAt ? new Date(payload.expiresAt) : null;

        return {
            eventType,
            providerPaymentId: String(providerPaymentId),
            userId: String(userId),
            courseId: String(courseId),
            selectedPaths,
            status,
            expiresAt,
            provider: this.name
        };
    }
}

module.exports = MockPaymentProvider;
