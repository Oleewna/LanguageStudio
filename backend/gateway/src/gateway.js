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

app.use('/api/v1/auth', createProxyMiddleware({
    target: config.authServiceUrl,
    changeOrigin: true,
    pathRewrite: requestPath => `/api/auth${requestPath}`,
    on: {
        error: (error, req, res) => {
            console.error('Auth service proxy failed:', error.message);
            if (!res.headersSent) res.status(502).json({ error: 'Authentication service is unavailable.' });
        }
    }
}));

app.use('/api/v1/content', createProxyMiddleware({
    target: config.serviceUrl,
    changeOrigin: true,
    pathRewrite: requestPath => `/api/content${requestPath}`,
    on: {
        error: (error, req, res) => {
            console.error('Content service proxy failed:', error.message);
            if (!res.headersSent) res.status(502).json({ error: 'Content service is unavailable.' });
        }
    }
}));

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
