const express = require('express');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const authRoutes = require('./routes/auth');
const app = express();

app.use(express.json({ limit: '16kb' }));
app.use('/api/auth', authRoutes);
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

const port = Number(process.env.PORT || 3007);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('PORT must be an integer between 0 and 65535.');
}

if (require.main === module) {
    const host = process.env.HOST || '127.0.0.1';
    app.listen(port, host, () => {
        console.log(`LanguageStudio auth service running at http://localhost:${port}`);
    });
}

module.exports = app;
