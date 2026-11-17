const session = require('express-session');
const MongoStore = require('connect-mongo');

function createSessionMiddleware() {
    const isProd = process.env.NODE_ENV === 'production';
    const isTest =
        process.env.NODE_ENV === 'test' ||
        process.execArgv.includes('--test') ||
        process.argv.some(arg => typeof arg === 'string' && (arg.includes('test') || arg.endsWith('.test.js')));
    const secret = process.env.SESSION_SECRET || 'language-studio-default-dev-secret-replace-in-env';
    const cookieName = process.env.SESSION_COOKIE_NAME || 'ls.sid';

    let store;
    const mongoUri = process.env.MONGODB_URI;

    // Use MongoStore if MONGODB_URI is provided and not explicitly set to use memory
    if (mongoUri && !isTest && process.env.USE_MEMORY_SESSION !== 'true') {
        const createStore = MongoStore.create || MongoStore.default?.create || MongoStore.MongoStore?.create;
        store = createStore({
            mongoUrl: mongoUri,
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
            secure: isProd || process.env.COOKIE_SECURE === 'true',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // default 1 day
        }
    });
}

module.exports = {
    createSessionMiddleware
};
