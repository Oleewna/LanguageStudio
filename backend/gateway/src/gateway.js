const util = require('util');
if (util._extend) {
    util._extend = Object.assign;
}

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config/env');

const app = express();
const projectRoot = path.resolve(__dirname, '../../..');

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && config.corsOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.vary('Origin');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'gateway' }));

function makePathRewrite(prefix) {
    return (path) => {
        if (!path || path === '/') return prefix;
        if (path.startsWith('/?')) return `${prefix}${path.slice(1)}`;
        if (path.startsWith('?')) return `${prefix}${path}`;
        if (path.startsWith('/')) return `${prefix}${path}`;
        return `${prefix}/${path}`;
    };
}

const serviceProxy = (serviceName, prefix) => ({
    target: config.serviceUrl,
    changeOrigin: true,
    pathRewrite: makePathRewrite(prefix),
    on: {
        error: (error, req, res) => {
            console.error(`${serviceName} proxy failed:`, error.message);
            if (!res.headersSent) res.status(502).json({ error: `${serviceName} is unavailable.` });
        }
    }
});

app.use('/api/auth', createProxyMiddleware(serviceProxy('Authentication service', '/api/auth')));
app.use('/api/v1/auth', createProxyMiddleware(serviceProxy('Authentication service', '/api/v1/auth')));

app.use('/api/courses', createProxyMiddleware(serviceProxy('Course service', '/api/courses')));
app.use('/api/v1/courses', createProxyMiddleware(serviceProxy('Course service', '/api/v1/courses')));
app.use('/api/vocab', createProxyMiddleware(serviceProxy('Vocab service', '/api/vocab')));
app.use('/api/payments', createProxyMiddleware(serviceProxy('Payment service', '/api/payments')));
app.use('/api/v1/payments', createProxyMiddleware(serviceProxy('Payment service', '/api/v1/payments')));

app.use('/api/v1/progress', createProxyMiddleware({
    target: config.serviceUrl,
    changeOrigin: true,
    pathRewrite: requestPath => `/api/progress${requestPath}`,
    on: {
        error: (error, req, res) => {
            console.error('Progress service proxy failed:', error.message);
            if (!res.headersSent) res.status(502).json({ error: 'Progress service is unavailable.' });
        }
    }
}));

app.use('/courses', (req, res, next) => {
    if (req.path.endsWith('.json')) {
        return res.status(403).json({ error: 'Direct access to course content files is not permitted.' });
    }
    next();
});
app.use('/courses', express.static(path.join(projectRoot, 'courses')));
app.use(express.static(path.join(projectRoot, 'frontend', 'public')));
app.use(createProxyMiddleware({
    target: config.serviceUrl,
    changeOrigin: true,
    on: {
        error: (error, req, res) => {
            console.error('Page service proxy failed:', error.message);
            if (!res.headersSent) res.status(502).json({ error: 'LanguageStudio service is unavailable.' });
        }
    }
}));

if (require.main === module) {
    app.listen(config.port, config.host, () => {
        console.log(`LanguageStudio gateway running at http://localhost:${config.port}`);
    });
}

module.exports = app;
