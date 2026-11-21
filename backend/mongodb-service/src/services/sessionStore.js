let MongoStore;
try {
    MongoStore = require('connect-mongo');
} catch (err) {
    try {
        MongoStore = require('../../../service/node_modules/connect-mongo');
    } catch {
        throw err;
    }
}

function createMongoSessionStore(mongoUri, options = {}) {
    if (!mongoUri) {
        throw new Error('mongoUri is required to create a MongoDB session store.');
    }

    const createStore = MongoStore.create || MongoStore.default?.create || MongoStore.MongoStore?.create;
    if (typeof createStore !== 'function') {
        throw new Error('connect-mongo create method not available.');
    }

    return createStore({
        mongoUrl: mongoUri,
        collectionName: options.collectionName || 'sessions',
        ttl: options.ttl || 30 * 24 * 60 * 60, // 30 days in seconds
        autoRemove: options.autoRemove || 'native',
        touchAfter: options.touchAfter !== undefined ? options.touchAfter : 24 * 3600,
        ...options
    });
}

module.exports = {
    createMongoSessionStore,
    MongoStore
};
