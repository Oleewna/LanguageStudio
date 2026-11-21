const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

function parsePort(value, fallback, name) {
    const port = Number(value || fallback);
    if (!Number.isInteger(port) || port < 0 || port > 65535) {
        throw new Error(`${name} must be an integer between 0 and 65535.`);
    }
    return port;
}

function getCorsOrigins() {
    const raw = process.env.CORS_ORIGINS || '';
    const origins = raw
        .split(',')
        .map(origin => origin.trim())
        .filter(origin => Boolean(origin) && !origin.includes('your-name'));
    const publicUrl = (process.env.PUBLIC_URL || process.env.APP_URL || '').trim().replace(/\/+$/, '');
    if (publicUrl && !publicUrl.includes('your-name') && !origins.includes(publicUrl)) {
        origins.push(publicUrl);
    }
    return origins;
}

module.exports = {
    port: parsePort(process.env.PORT, 3005, 'PORT'),
    host: process.env.HOST || '127.0.0.1',
    serviceUrl: process.env.SERVICE_URL || 'http://127.0.0.1:3006',
    authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3006',
    get publicUrl() {
        const val = (process.env.PUBLIC_URL || process.env.APP_URL || '').trim().replace(/\/+$/, '');
        return val.includes('your-name') ? '' : val;
    },
    get corsOrigins() {
        return getCorsOrigins();
    }
};
