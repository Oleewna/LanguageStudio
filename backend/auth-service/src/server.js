const express = require('express');
const config = require('../config/env');

const authRoutes = require('./routes/auth');
const { googleCallback, googleRedirect } = require('./controllers/authController');
const app = express();

app.use(express.json({ limit: '16kb' }));
app.use('/api/auth', authRoutes);

// Direct aliases on root in case Google OAuth callback redirects straight to auth-service (:3007)
app.get('/google/callback', googleCallback);
app.get('/google', googleRedirect);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth' }));

app.use((error, req, res, next) => {
    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 600
        ? error.status
        : 500;
    if (status >= 500) console.error(error);
    res.status(status).json({
        error: status >= 500 ? 'Unexpected authentication service error.' : error.message
    });
});

const port = Number(config.PORT);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('PORT must be an integer between 0 and 65535.');
}

if (require.main === module) {
    const host = config.HOST;
    app.listen(port, host, () => {
        console.log(`LanguageStudio auth service running at http://localhost:${port}`);
    });
}

module.exports = app;
