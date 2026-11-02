const express = require('express');
const contentRepository = require('language-studio-content-db');

const router = express.Router();
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3007';

function validId(value) {
    return typeof value === 'string' && ID_PATTERN.test(value);
}

async function requireAdmin(req, res, next) {
    const cookie = req.headers.cookie;
    if (!cookie) return res.status(401).json({ error: 'Sign in with an administrator account.' });

    let response;
    try {
        response = await fetch(`${authServiceUrl}/api/auth/session`, {
            headers: { cookie }
        });
    } catch (error) {
        console.error('Could not verify admin session:', error.message);
        return res.status(503).json({ error: 'Authentication service is unavailable.' });
    }

    if (!response.ok) {
        console.error(`Admin session verification failed with status ${response.status}.`);
        return res.status(503).json({ error: 'Authentication service is unavailable.' });
    }

    let session;
    try {
        session = await response.json();
    } catch (error) {
        console.error('Auth service returned an invalid session response:', error.message);
        return res.status(502).json({ error: 'Could not verify administrator access.' });
    }

    if (!session.authenticated) {
        return res.status(401).json({ error: 'Sign in with an administrator account.' });
    }
    if (!session.user || session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Administrator access is required.' });
    }

    return next();
}

router.get('/admin/catalog', requireAdmin, (req, res, next) => {
    try {
        const catalog = contentRepository.getAdminCatalog();
        if (!catalog) return res.status(503).json({ error: 'Course content has not been initialized.' });
        return res.json(catalog);
    } catch (error) {
        return next(error);
    }
});

router.put('/admin/catalog', requireAdmin, (req, res, next) => {
    let content;
    try {
        const body = req.body;
        if (!body || typeof body !== 'object' || Array.isArray(body)
            || !Array.isArray(body.courses)) {
            return res.status(400).json({ error: 'Catalog must include an index and courses array.' });
        }
        content = contentRepository.validateContent(body.index, body.courses);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    try {
        contentRepository.replaceAllContent(content);
        return res.json({ success: true });
    } catch (error) {
        return next(error);
    }
});

router.get('/course-index', (req, res, next) => {
    try {
        const index = contentRepository.getCourseIndex();
        if (!index) return res.status(503).json({ error: 'Course database is empty. Run npm run db:setup from backend/content-db.' });
        return res.json(index);
    } catch (error) {
        return next(error);
    }
});

router.get('/courses/:courseId/lessons/:lessonId', (req, res, next) => {
    if (!validId(req.params.courseId) || !validId(req.params.lessonId)) {
        return res.status(400).json({ error: 'Invalid course or lesson ID.' });
    }
    try {
        const lesson = contentRepository.getLesson(req.params.courseId, req.params.lessonId);
        if (!lesson) return res.status(404).json({ error: 'Lesson not found.' });
        return res.json(lesson);
    } catch (error) {
        return next(error);
    }
});

router.get('/courses/:courseId', (req, res, next) => {
    if (!validId(req.params.courseId)) return res.status(400).json({ error: 'Invalid course ID.' });
    try {
        const course = contentRepository.getCourse(req.params.courseId);
        if (!course) return res.status(404).json({ error: 'Course not found.' });
        return res.json(course);
    } catch (error) {
        return next(error);
    }
});

router.get('/courses/:courseId/:resource', (req, res, next) => {
    if (!validId(req.params.courseId)) return res.status(400).json({ error: 'Invalid course ID.' });
    const resource = req.params.resource;
    if (!['vocab', 'grammar', 'exercises'].includes(resource)) {
        return res.status(404).json({ error: 'Course resource not found.' });
    }
    try {
        const payload = contentRepository.getCourseResource(req.params.courseId, resource);
        if (!payload) return res.status(404).json({ error: 'Course resource not found.' });
        return res.json(payload);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
