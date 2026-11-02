const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

function parsePort(value, fallback, name) {
    const port = Number(value || fallback);
    if (!Number.isInteger(port) || port < 0 || port > 65535) {
        throw new Error(`${name} must be an integer between 0 and 65535.`);
    }
    return port;
}

module.exports = {
    port: parsePort(process.env.PORT, 3005, 'PORT'),
    host: process.env.HOST || '127.0.0.1',
    serviceUrl: process.env.SERVICE_URL || 'http://127.0.0.1:3006',
    authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3007',
    corsOrigins: (process.env.CORS_ORIGINS || '')
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean)
};
