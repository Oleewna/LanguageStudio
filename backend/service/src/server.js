const express = require('express');
const path = require('path');
const helmet = require('helmet');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { initDatabase } = require('./db/init');
const { connectMongo } = require('./db/mongodb');
const { createSessionMiddleware } = require('./middleware/session');
const authRoutes = require('./routes/auth');
const vocabRoutes = require('./routes/vocab');
const userWordsRoutes = require('./routes/userWords');
const examplesRoutes = require('./routes/examples');
const progressRoutes = require('./routes/progress');
const paymentsRoutes = require('./routes/payments');
const courseLessonsRoutes = require('./routes/courseLessons');
const pagesRoutes = require('./routes/pageroutes');

const app = express();

initDatabase();

// Security headers with Helmet
app.use(helmet({ contentSecurityPolicy: false }));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));

// Session middleware
app.use(createSessionMiddleware());

// Auth API routes
app.use('/api/auth', authRoutes);
app.use('/api/v1/auth', authRoutes);

// Application API routes
app.use('/api/courses', courseLessonsRoutes);
app.use('/api/v1/courses', courseLessonsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/vocab', vocabRoutes);
app.use('/api/user-words', userWordsRoutes);
app.use('/api/examples', examplesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/v1/progress', progressRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'content' }));

app.use((req, res, next) => {
    if (req.path === '/pages/lesson' || req.path === '/lesson') {
        req.url = '/pages/lesson.html' + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
    }
    next();
});

app.use('/courses', express.static(path.join(__dirname, '../../../courses')));
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
    if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
        connectMongo().catch(err => {
            console.warn('MongoDB Atlas connection deferred:', err.message);
        });
    }
    app.listen(port, host, () => {
        console.log(`LanguageStudio server running at http://localhost:${port}`);
    });
}

module.exports = app;
