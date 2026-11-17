const PaymentProvider = require('./PaymentProvider');
const MockPaymentProvider = require('./MockPaymentProvider');

const providers = new Map();
const defaultMockProvider = new MockPaymentProvider();
providers.set('mock', defaultMockProvider);

/**
 * Get configured payment provider. Defaults to 'mock'.
 * @param {string} [name]
 * @returns {PaymentProvider}
 */
function getPaymentProvider(name) {
    const providerKey = (name || process.env.PAYMENT_PROVIDER || 'mock').toLowerCase();
    const provider = providers.get(providerKey);
    if (!provider) {
        console.warn(`Payment provider '${providerKey}' not registered. Falling back to mock provider.`);
        return defaultMockProvider;
    }
    return provider;
}

/**
 * Register a custom payment provider.
 * @param {PaymentProvider} provider
 */
function registerPaymentProvider(provider) {
    if (!provider || !provider.name) {
        throw new Error('Invalid payment provider instance.');
    }
    providers.set(provider.name.toLowerCase(), provider);
}

module.exports = {
    PaymentProvider,
    MockPaymentProvider,
    getPaymentProvider,
    registerPaymentProvider
};
