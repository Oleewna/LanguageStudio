const session = require('express-session');
const { createMongoSessionStore } = require('../../../mongodb-service');
const config = require('../../config/env');

function createSessionMiddleware() {
    const isProd = config.NODE_ENV === 'production';
    const isTest =
        config.NODE_ENV === 'test' ||
        process.execArgv.includes('--test') ||
        process.argv.some(arg => typeof arg === 'string' && (arg.includes('test') || arg.endsWith('.test.js')));
    const secret = config.SESSION_SECRET || 'language-studio-default-dev-secret-replace-in-env';
    const cookieName = config.SESSION_COOKIE_NAME || 'ls.sid';

    let store;
    const mongoUri = config.MONGODB_URI;

    // Use MongoStore if MONGODB_URI is provided and not explicitly set to use memory
    if (mongoUri && !isTest && !config.USE_MEMORY_SESSION) {
        store = createMongoSessionStore(mongoUri, {
            collectionName: 'sessions',
            ttl: 30 * 24 * 60 * 60, // 30 days in seconds
            autoRemove: 'native',
            touchAfter: 24 * 3600 // lazy session update once per day
        });
    } else {
        store = new session.MemoryStore();
    }

    return session({
        name: cookieName,
        secret,
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
            httpOnly: true,
            secure: isProd ? true : (config.COOKIE_SECURE ? true : 'auto'),
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // default 1 day
        }
    });
}

module.exports = {
    createSessionMiddleware
};
