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

function getCourseResource(courseId, resource) {
    const database = getContentDatabase();
    const course = database.prepare('SELECT 1 FROM courses WHERE id = ?').get(courseId);
    if (!course) return null;

    if (resource === 'vocab') {
        return database.prepare(`
            SELECT payload_json FROM vocabulary
            WHERE course_id = ?
            ORDER BY sort_order
        `).all(courseId).map(row => readJson(row.payload_json));
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

module.exports = { getAdminCatalog, getCourse, getCourseIndex, getCourseResource, getLesson };
