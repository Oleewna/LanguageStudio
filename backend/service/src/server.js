const express = require('express');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { initDatabase } = require('./db/init');
const contentRoutes = require('./routes/content');
const vocabRoutes = require('./routes/vocab');
const userWordsRoutes = require('./routes/userWords');
const examplesRoutes = require('./routes/examples');
const pagesRoutes = require('./routes/pageroutes');
const app = express();

initDatabase();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));
app.use('/api/content', contentRoutes);
app.use('/api/vocab', vocabRoutes);
app.use('/api/user-words', userWordsRoutes);
app.use('/api/examples', examplesRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'content' }));

app.use((req, res, next) => {
    if (req.path === '/pages/lesson' || req.path === '/lesson') {
        req.url = '/pages/lesson.html' + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
    }
    next();
});

app.use(express.static(path.join(__dirname, '../../../frontend/public')));
app.use('/', pagesRoutes);

app.use((error, req, res, next) => {
    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 600
        ? error.status
        : 500;
    if (status >= 500) console.error(error);
    res.status(status).json({
        error: status >= 500 ? (error.publicMessage || 'Unexpected server error.') : error.message
    });
});

const port = Number(process.env.PORT || 3006);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('PORT must be an integer between 0 and 65535.');
}

if (require.main === module) {
    const host = process.env.HOST || '127.0.0.1';
    app.listen(port, host, () => {
        console.log(`LanguageStudio server running at http://localhost:${port}`);
    });
}

module.exports = app;
