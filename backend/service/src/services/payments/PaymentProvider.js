/**
 * PaymentProvider interface / base class.
 * All concrete payment providers (Stripe, Paddle, LemonSqueezy, Mock, etc.)
 * must implement these methods.
 */
class PaymentProvider {
    /**
     * Provider identifier (e.g. 'mock', 'stripe', 'paddle')
     */
    get name() {
        throw new Error('PaymentProvider.name must be implemented by subclass.');
    }

    /**
     * Creates a checkout session with the payment provider.
     * @param {Object} params
     * @param {string} params.userId User making the purchase
     * @param {string} params.courseId Course being purchased
     * @param {string} [params.priceId] Price/plan identifier
     * @param {string} [params.successUrl] Redirect URL on success
     * @param {string} [params.cancelUrl] Redirect URL on cancel
     * @param {Object} [params.metadata] Additional metadata
     * @returns {Promise<{ id: string, checkoutUrl: string, provider: string, providerPaymentId?: string }>}
     */
    async createCheckout(params) {
        throw new Error('createCheckout() must be implemented by subclass.');
    }

    /**
     * Verifies the authenticity of incoming webhook events.
     * @param {Object|string|Buffer} payload Raw webhook payload or body
     * @param {string} signature Signature header from provider
     * @param {Object} [headers] Request headers
     * @returns {boolean} True if signature is valid
     */
    verifyWebhook(payload, signature, headers = {}) {
        throw new Error('verifyWebhook() must be implemented by subclass.');
    }

    /**
     * Parses raw webhook payload into normalized event data.
     * @param {Object} payload Parsed webhook payload
     * @param {Object} [headers] Request headers
     * @returns {{
     *   eventType: 'payment_success' | 'payment_refunded' | 'subscription_cancelled' | string,
     *   providerPaymentId: string,
     *   userId: string,
     *   courseId: string,
     *   status: 'active' | 'refunded' | 'expired',
     *   expiresAt: Date | null,
     *   provider: string
     * }}
     */
    parseEvent(payload, headers = {}) {
        throw new Error('parseEvent() must be implemented by subclass.');
    }
}

module.exports = PaymentProvider;
