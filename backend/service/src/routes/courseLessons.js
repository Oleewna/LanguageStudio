const express = require('express');
const path = require('path');
const fs = require('fs');
const { Entitlement } = require('../models/Entitlement');

const router = express.Router();
const projectRoot = path.resolve(__dirname, '../../../../');
const coursesDir = path.join(projectRoot, 'courses');
const paidContentBaseDir = process.env.PAID_CONTENT_DIR
    ? path.resolve(process.env.PAID_CONTENT_DIR)
    : path.join(projectRoot, 'paid-content', 'courses');

const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

function validId(val) {
    return typeof val === 'string' && ID_PATTERN.test(val);
}

function readJsonFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (e) {
        // Ignore read/syntax errors
    }
    return null;
}

function findLessonInCourse(courseData, lessonId) {
    if (!courseData || !Array.isArray(courseData.paths)) return null;
    for (const p of courseData.paths) {
        if (!Array.isArray(p.units)) continue;
        for (const u of p.units) {
            if (!Array.isArray(u.lessons)) continue;
            for (const l of u.lessons) {
                if (l.id === lessonId) return l;
            }
        }
    }
    return null;
}

function isLessonPaid(courseData, lessonDef, courseId, lessonId) {
    // Explicit lesson access takes precedence
    if (lessonDef && lessonDef.access === 'paid') return true;
    if (lessonDef && lessonDef.access === 'free') return false;

    // Course level setting
    if (courseData && courseData.access === 'paid') {
        // First lesson rule: if this is the very first lesson, it stays free by default
        const firstLessonId = courseData.paths?.[0]?.units?.[0]?.lessons?.[0]?.id;
        if (firstLessonId && firstLessonId === lessonId) {
            return false;
        }
        return true;
    }

    // Check if file is stored in paid content directory
    const paidFilePath = path.join(paidContentBaseDir, courseId, 'lessons', `${lessonId}.json`);
    if (fs.existsSync(paidFilePath)) {
        return true;
    }

    return false;
}

/**
 * GET /api/courses/:courseId/lessons/:lessonId
 * Server-side gate for lesson content.
 * Free lessons are returned directly.
 * Paid lessons require active session and entitlement (401/403 with clear code otherwise).
 */
router.get('/:courseId/lessons/:lessonId', async (req, res, next) => {
    try {
        const { courseId, lessonId } = req.params;
        if (!validId(courseId) || !validId(lessonId)) {
            return res.status(400).json({ error: 'Invalid course or lesson ID.', code: 'INVALID_ID' });
        }

        const courseData = readJsonFile(path.join(coursesDir, courseId, 'course.json'));
        const lessonDef = findLessonInCourse(courseData, lessonId);
        const paid = isLessonPaid(courseData, lessonDef, courseId, lessonId);

        if (!paid) {
            // Free content delivery
            const freePath = path.join(coursesDir, courseId, 'lessons', `${lessonId}.json`);
            const freeData = readJsonFile(freePath);
            if (!freeData) {
                return res.status(404).json({ error: 'Lesson not found.', code: 'NOT_FOUND' });
            }
            return res.json(freeData);
        }

        // Paid content enforcement
        const userId = req.session && req.session.userId;
        if (!userId) {
            return res.status(401).json({
                error: 'Authentication required to access paid content.',
                code: 'AUTH_REQUIRED',
                courseId,
                lessonId
            });
        }

        const hasAccess = await Entitlement.hasActiveEntitlement(userId, courseId);
        if (!hasAccess) {
            return res.status(403).json({
                error: 'Entitlement required to access this paid lesson.',
                code: 'ENTITLEMENT_REQUIRED',
                courseId,
                lessonId,
                priceId: lessonDef?.priceId || courseData?.priceId || null
            });
        }

        // User is entitled: load lesson from paid-content
        const paidPath = path.join(paidContentBaseDir, courseId, 'lessons', `${lessonId}.json`);
        const paidData = readJsonFile(paidPath);
        if (!paidData) {
            return res.status(404).json({ error: 'Paid lesson content not found.', code: 'NOT_FOUND' });
        }

        return res.json(paidData);
    } catch (error) {
        return next(error);
    }
});

/**
 * GET /api/courses/:courseId/i18n/:locale/lessons/:lessonId
 * Serves translation files for paid lessons with entitlement protection.
 */
router.get('/:courseId/i18n/:locale/lessons/:lessonId', async (req, res, next) => {
    try {
        const { courseId, locale, lessonId } = req.params;
        if (!validId(courseId) || !validId(locale) || !validId(lessonId)) {
            return res.status(400).json({ error: 'Invalid parameters.', code: 'INVALID_ID' });
        }

        const courseData = readJsonFile(path.join(coursesDir, courseId, 'course.json'));
        const lessonDef = findLessonInCourse(courseData, lessonId);
        const paid = isLessonPaid(courseData, lessonDef, courseId, lessonId);

        if (paid) {
            const userId = req.session && req.session.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Authentication required.', code: 'AUTH_REQUIRED' });
            }
            const hasAccess = await Entitlement.hasActiveEntitlement(userId, courseId);
            if (!hasAccess) {
                return res.status(403).json({ error: 'Entitlement required.', code: 'ENTITLEMENT_REQUIRED' });
            }

            const paidI18nPath = path.join(paidContentBaseDir, courseId, 'i18n', locale, 'lessons', `${lessonId}.json`);
            const data = readJsonFile(paidI18nPath);
            if (!data) return res.status(404).json({ error: 'Translation not found.' });
            return res.json(data);
        }

        // Free lesson i18n
        const freeI18nPath = path.join(coursesDir, courseId, 'i18n', locale, 'lessons', `${lessonId}.json`);
        const data = readJsonFile(freeI18nPath);
        if (!data) return res.status(404).json({ error: 'Translation not found.' });
        return res.json(data);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
