const { getContentDatabase } = require('./contentDatabase');

function readJson(value) {
    return JSON.parse(value);
}

function getCourseIndex() {
    const database = getContentDatabase();
    const meta = database.prepare(
        'SELECT default_course_id FROM content_meta WHERE singleton = 1'
    ).get();
    if (!meta) return null;

    const courses = database.prepare(`
        SELECT id, index_metadata_json, name_json, native_name, flag, status
        FROM courses
        ORDER BY sort_order
    `).all().map(row => ({
        ...readJson(row.index_metadata_json),
        id: row.id,
        name: readJson(row.name_json),
        native: row.native_name,
        flag: row.flag,
        status: row.status
    }));

    return { default: meta.default_course_id, courses };
}

function getCourse(courseId) {
    const database = getContentDatabase();
    const course = database.prepare(`
        SELECT id, target_json, tagline_json, features_json, metadata_json
        FROM courses
        WHERE id = ?
    `).get(courseId);
    if (!course) return null;

    const categories = database.prepare(`
        SELECT id, payload_json
        FROM exercise_categories
        WHERE course_id = ?
        ORDER BY sort_order
    `).all(courseId).map(row => ({ ...readJson(row.payload_json), id: row.id }));

    const paths = database.prepare(`
        SELECT id, metadata_json
        FROM learning_paths
        WHERE course_id = ?
        ORDER BY sort_order
    `).all(courseId).map(path => {
        const units = database.prepare(`
            SELECT id, metadata_json
            FROM learning_units
            WHERE course_id = ? AND path_id = ?
            ORDER BY sort_order
        `).all(courseId, path.id).map(unit => {
            const lessons = database.prepare(`
                SELECT metadata_json
                FROM lessons
                WHERE course_id = ? AND path_id = ? AND unit_id = ?
                ORDER BY sort_order
            `).all(courseId, path.id, unit.id).map(row => readJson(row.metadata_json));
            return { ...readJson(unit.metadata_json), id: unit.id, lessons };
        });
        return { ...readJson(path.metadata_json), id: path.id, units };
    });

    return {
        ...readJson(course.metadata_json),
        id: course.id,
        target: readJson(course.target_json),
        tagline: readJson(course.tagline_json),
        features: readJson(course.features_json),
        exerciseCategories: categories,
        paths
    };
}

function getLesson(courseId, lessonId) {
    const row = getContentDatabase().prepare(
        'SELECT content_json FROM lessons WHERE course_id = ? AND id = ?'
    ).get(courseId, lessonId);
    return row && row.content_json !== null ? readJson(row.content_json) : null;
}

function normalizeVocabularyKey(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function getVocabularyTerm(item, courseId) {
    if (typeof item === 'string') return item.trim();
    if (!item || typeof item !== 'object' || Array.isArray(item)) return '';
    const value = item[courseId] || item.word || item.term || item.text;
    return typeof value === 'string' ? value.trim() : '';
}

function getCourseVocabulary(courseId) {
    const database = getContentDatabase();
    const course = database.prepare('SELECT 1 FROM courses WHERE id = ?').get(courseId);
    if (!course) return null;

    const existingRows = database.prepare(`
        SELECT id, word, lesson_id, payload_json
        FROM vocabulary
        WHERE course_id = ?
        ORDER BY sort_order
    `).all(courseId);
    const existingByWord = new Map();
    existingRows.forEach((row) => {
        const key = normalizeVocabularyKey(row.word);
        if (key && !existingByWord.has(key)) {
            existingByWord.set(key, { ...row, payload: readJson(row.payload_json) });
        }
    });

    const lessonRows = database.prepare(`
        SELECT l.id, l.path_id, l.content_json
        FROM lessons l
        INNER JOIN learning_paths p
            ON p.course_id = l.course_id AND p.id = l.path_id
        INNER JOIN learning_units u
            ON u.course_id = l.course_id AND u.path_id = l.path_id AND u.id = l.unit_id
        WHERE l.course_id = ? AND l.content_json IS NOT NULL
        ORDER BY p.sort_order, u.sort_order, l.sort_order
    `).all(courseId);

    const wordsByKey = new Map();
    const usedIds = new Set();
    lessonRows.forEach((lessonRow) => {
        const content = readJson(lessonRow.content_json);
        (content.blocks || content.sections || []).forEach((block) => {
            if (!block || block.type !== 'vocab' || !Array.isArray(block.items)) return;
            block.items.forEach((item, index) => {
                const word = getVocabularyTerm(item, courseId);
                const key = normalizeVocabularyKey(word);
                if (!word || !key) return;

                const existing = existingByWord.get(key);
                let entry = wordsByKey.get(key);
                if (!entry) {
                    const payload = existing ? existing.payload : {};
                    let id = existing ? existing.id : `${courseId}-${key.replace(/\s+/g, '-')}`;
                    if (!id || usedIds.has(id)) {
                        const baseId = `${courseId}-${key.replace(/\s+/g, '-') || `word-${index + 1}`}`;
                        id = baseId;
                        let suffix = 2;
                        while (usedIds.has(id)) {
                            id = `${baseId}-${suffix}`;
                            suffix += 1;
                        }
                    }
                    usedIds.add(id);

                    const translations = item && typeof item === 'object'
                        ? (item.translations || item.trans || item.translation)
                        : null;
                    const pronunciation = item && typeof item === 'object'
                        ? (item.pronunciation || item.phon)
                        : null;
                    entry = {
                        ...payload,
                        id,
                        word,
                        pronunciation: pronunciation || payload.pronunciation || payload.phon || '',
                        phon: payload.phon || pronunciation || {},
                        trans: translations || payload.trans || {},
                        example: payload.example || '',
                        lesson: lessonRow.id,
                        lessons: [],
                        path: lessonRow.path_id || payload.path || '',
                        topic: payload.topic || '',
                        category: payload.category || '',
                        type: payload.type || '',
                        courseId,
                        source: 'lesson-content'
                    };
                    wordsByKey.set(key, entry);
                } else if (item && typeof item === 'object') {
                    const translations = item.translations || item.trans || item.translation;
                    if (translations && typeof translations === 'object') {
                        entry.trans = { ...entry.trans, ...translations };
                    } else if (translations && !Object.keys(entry.trans || {}).length) {
                        entry.trans = translations;
                    }
                    const pronunciation = item.pronunciation || item.phon;
                    if (pronunciation && !entry.pronunciation) entry.pronunciation = pronunciation;
                }

                if (!entry.lessons.includes(lessonRow.id)) entry.lessons.push(lessonRow.id);
            });
        });
    });

    return Array.from(wordsByKey.values());
}

function getCourseResource(courseId, resource) {
    const database = getContentDatabase();
    const course = database.prepare('SELECT 1 FROM courses WHERE id = ?').get(courseId);
    if (!course) return null;

    if (resource === 'vocab') {
        return getCourseVocabulary(courseId);
    }

    if (resource === 'exercises') {
        return database.prepare(`
            SELECT payload_json FROM exercises
            WHERE course_id = ?
            ORDER BY sort_order
        `).all(courseId).map(row => readJson(row.payload_json));
    }

    if (resource === 'grammar') {
        const metadata = database.prepare(`
            SELECT metadata_json FROM course_resource_metadata
            WHERE course_id = ? AND resource = 'grammar'
        `).get(courseId);
        if (!metadata) return null;
        const topics = database.prepare(`
            SELECT payload_json FROM grammar_topics
            WHERE course_id = ?
            ORDER BY sort_order
        `).all(courseId).map(row => readJson(row.payload_json));
        return { ...readJson(metadata.metadata_json), topics };
    }

    return null;
}

function getAdminCatalog() {
    const index = getCourseIndex();
    if (!index) return null;

    const courses = index.courses.map(indexEntry => {
        const course = getCourse(indexEntry.id);
        const resources = {
            vocab: getCourseResource(indexEntry.id, 'vocab'),
            grammar: getCourseResource(indexEntry.id, 'grammar'),
            exercises: getCourseResource(indexEntry.id, 'exercises')
        };
        const lessons = course.paths.flatMap(learningPath => learningPath.units.flatMap(unit =>
            unit.lessons.map(metadata => ({
                id: metadata.id,
                content: getLesson(indexEntry.id, metadata.id)
            })).filter(entry => entry.content !== null)
        ));
        return { course, resources, lessons };
    });

    return { index, courses };
}

module.exports = { getAdminCatalog, getCourse, getCourseIndex, getCourseResource, getCourseVocabulary, getLesson };
