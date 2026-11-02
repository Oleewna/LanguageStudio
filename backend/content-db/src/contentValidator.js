const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

function requireRecord(value, label) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`${label} must be a JSON object.`);
    }
}

function requireId(value, label) {
    if (typeof value !== 'string' || !ID_PATTERN.test(value)) {
        throw new Error(`${label} must be a non-empty ID containing only letters, numbers, underscores, and hyphens.`);
    }
}

function requireUnique(items, label, getId) {
    const ids = new Set();
    items.forEach((item, index) => {
        const id = getId(item);
        requireId(id, `${label}[${index}].id`);
        if (ids.has(id)) throw new Error(`${label} contains duplicate ID '${id}'.`);
        ids.add(id);
    });
    return ids;
}

function validateContent(index, courses) {
    requireRecord(index, 'Course index');
    requireId(index.default, 'Course index default');
    if (!Array.isArray(index.courses) || index.courses.length === 0) {
        throw new Error('Course index must contain a non-empty courses array.');
    }

    const indexIds = requireUnique(index.courses, 'Course index courses', entry => entry && entry.id);
    if (!indexIds.has(index.default)) throw new Error(`Default course '${index.default}' is not in the course index.`);
    for (const entry of index.courses) {
        requireRecord(entry, 'Course index entry');
        requireRecord(entry.name, `Course '${entry.id}' name`);
        if (typeof entry.name.uk !== 'string' || !entry.name.uk.trim()
            || typeof entry.name.en !== 'string' || !entry.name.en.trim()) {
            throw new Error(`Course '${entry.id}' name must include Ukrainian and English text.`);
        }
        if (entry.native !== undefined && typeof entry.native !== 'string') {
            throw new Error(`Course '${entry.id}' native name must be text.`);
        }
        if (entry.flag !== undefined && typeof entry.flag !== 'string') {
            throw new Error(`Course '${entry.id}' flag must be text.`);
        }
        if (entry.status !== undefined && !['active', 'soon', 'locked', 'inactive'].includes(entry.status)) {
            throw new Error(`Course '${entry.id}' has an unsupported status.`);
        }
    }
    if (!Array.isArray(courses)) throw new Error('Course catalog must contain a courses array.');
    if (courses.length !== index.courses.length) {
        throw new Error('The course index and course records must contain the same courses.');
    }

    const recordsById = new Map();
    for (const item of courses) {
        requireRecord(item, 'Course record');
        requireRecord(item.course, 'Course configuration');
        requireId(item.course.id, 'Course ID');
        if (recordsById.has(item.course.id)) {
            throw new Error(`Duplicate course '${item.course.id}'.`);
        }
        recordsById.set(item.course.id, item);
    }

    const normalizedCourses = index.courses.map(indexEntry => {
        const item = recordsById.get(indexEntry.id);
        if (!item) throw new Error(`Course '${indexEntry.id}' is missing from the catalog.`);
        requireRecord(item, `Course '${indexEntry.id}'`);
        requireRecord(item.course, `Course '${indexEntry.id}' configuration`);
        if (item.course.id !== indexEntry.id) {
            throw new Error(`Course ID mismatch for '${indexEntry.id}'.`);
        }
        requireRecord(item.course.target, `Course '${indexEntry.id}' target`);
        requireRecord(item.course.tagline, `Course '${indexEntry.id}' tagline`);
        requireRecord(item.course.features, `Course '${indexEntry.id}' features`);
        requireRecord(item.resources, `Course '${indexEntry.id}' resources`);
        if (typeof item.course.target.code !== 'string' || !item.course.target.code.trim()) {
            throw new Error(`Course '${indexEntry.id}' must define target.code.`);
        }
        const categories = item.course.exerciseCategories;
        if (!Array.isArray(categories)) throw new Error(`Course '${item.course.id}' exerciseCategories must be an array.`);
        const categoryIds = requireUnique(categories, `${item.course.id} exercise categories`, category => category && category.id);

        if (!Array.isArray(item.course.paths)) throw new Error(`Course '${item.course.id}' paths must be an array.`);
        const pathIds = requireUnique(item.course.paths, `${item.course.id} paths`, learningPath => learningPath && learningPath.id);
        const lessonById = new Map();
        const allLessonMetadata = new Map();

        item.course.paths.forEach(learningPath => {
            requireRecord(learningPath, `Course '${item.course.id}' path`);
            if (!Array.isArray(learningPath.units)) {
                throw new Error(`Path '${learningPath.id}' in course '${item.course.id}' must contain a units array.`);
            }
            requireUnique(learningPath.units, `${item.course.id}/${learningPath.id} units`, unit => unit && unit.id);
            for (const unit of learningPath.units) {
                requireRecord(unit, `Course '${item.course.id}' unit`);
                if (!Array.isArray(unit.lessons)) {
                    throw new Error(`Unit '${unit.id}' in course '${item.course.id}' must contain a lessons array.`);
                }
                for (const lesson of unit.lessons) {
                    requireRecord(lesson, `Course '${item.course.id}' lesson metadata`);
                    requireId(lesson.id, `Course '${item.course.id}' lesson ID`);
                    if (allLessonMetadata.has(lesson.id)) {
                        throw new Error(`Course '${item.course.id}' contains duplicate lesson ID '${lesson.id}'.`);
                    }
                    allLessonMetadata.set(lesson.id, { lesson, pathId: learningPath.id, unitId: unit.id });
                }
            }
        });

        for (const { lesson } of allLessonMetadata.values()) {
            for (const relation of ['prevLessonId', 'nextLessonId']) {
                const relatedId = lesson[relation];
                if (relatedId && !allLessonMetadata.has(relatedId)) {
                    throw new Error(`Lesson '${lesson.id}' references missing ${relation} '${relatedId}'.`);
                }
            }
        }

        if (!Array.isArray(item.lessons)) throw new Error(`Course '${item.course.id}' lessons must be an array.`);
        const contentLessonIds = new Set();
        for (const lessonEntry of item.lessons) {
            requireRecord(lessonEntry, `Course '${item.course.id}' lesson record`);
            requireId(lessonEntry.id, `Course '${item.course.id}' lesson ID`);
            if (contentLessonIds.has(lessonEntry.id)) {
                throw new Error(`Course '${item.course.id}' contains duplicate lesson content '${lessonEntry.id}'.`);
            }
            contentLessonIds.add(lessonEntry.id);
            requireRecord(lessonEntry.content, `Course '${item.course.id}' lesson '${lessonEntry.id}'`);
            if (lessonEntry.content.id !== lessonEntry.id) {
                throw new Error(`Lesson ID mismatch: record '${lessonEntry.id}' has ID '${lessonEntry.content.id}'.`);
            }
            if (!Array.isArray(lessonEntry.content.blocks)) {
                throw new Error(`Lesson '${lessonEntry.id}' must contain a blocks array.`);
            }
            lessonEntry.content.blocks.forEach((block, blockIndex) => {
                if (!block || typeof block !== 'object' || Array.isArray(block)
                    || typeof block.type !== 'string' || !block.type.trim()) {
                    throw new Error(`Lesson '${lessonEntry.id}' block ${blockIndex} must have a type.`);
                }
            });
            if (!allLessonMetadata.has(lessonEntry.id)) {
                throw new Error(`Lesson '${lessonEntry.id}' is not listed in a course path.`);
            }
            lessonById.set(lessonEntry.id, lessonEntry.content);
        }

        for (const [lessonId, metadata] of allLessonMetadata) {
            if (metadata.lesson.status === 'available' && !lessonById.has(lessonId)) {
                throw new Error(`Available lesson '${lessonId}' is missing its lesson content.`);
            }
            if (metadata.lesson.pathId && metadata.lesson.pathId !== metadata.pathId) {
                throw new Error(`Lesson '${lessonId}' has a pathId that does not match its course path.`);
            }
            if (metadata.lesson.unitId && metadata.lesson.unitId !== metadata.unitId) {
                throw new Error(`Lesson '${lessonId}' has a unitId that does not match its course unit.`);
            }
        }

        const vocab = item.resources.vocab;
        const grammar = item.resources.grammar;
        const exercises = item.resources.exercises;
        if (!Array.isArray(vocab)) throw new Error(`Course '${item.course.id}' vocabulary must be an array.`);
        requireRecord(grammar, `Course '${item.course.id}' grammar`);
        if (!Array.isArray(grammar.topics)) throw new Error(`Course '${item.course.id}' grammar must define topics.`);
        if (!Array.isArray(exercises)) throw new Error(`Course '${item.course.id}' exercises must be an array.`);

        requireUnique(vocab, `${item.course.id} vocabulary`, entry => entry && entry.id);
        requireUnique(grammar.topics, `${item.course.id} grammar topics`, topic => topic && topic.id);
        requireUnique(exercises, `${item.course.id} exercises`, exercise => exercise && exercise.id);
        const exerciseFormats = new Set(
            Array.isArray(item.course.features && item.course.features.exerciseFormats)
                ? item.course.features.exerciseFormats
                : []
        );

        for (const entry of vocab) {
            requireRecord(entry, `Course '${item.course.id}' vocabulary entry`);
            if (typeof entry.word !== 'string' || !entry.word.trim()) {
                throw new Error(`Vocabulary item '${entry.id}' in course '${item.course.id}' needs a word.`);
            }
            if (entry.lesson && !allLessonMetadata.has(entry.lesson)) {
                throw new Error(`Vocabulary item '${entry.id}' references missing lesson '${entry.lesson}'.`);
            }
        }
        for (const exercise of exercises) {
            requireRecord(exercise, `Course '${item.course.id}' exercise`);
            if (typeof exercise.format !== 'string' || !exercise.format.trim()) {
                throw new Error(`Exercise '${exercise.id}' in course '${item.course.id}' needs a format.`);
            }
            if (exerciseFormats.size && !exerciseFormats.has(exercise.format)) {
                throw new Error(`Exercise '${exercise.id}' uses unsupported format '${exercise.format}'.`);
            }
            if (exercise.category && !categoryIds.has(exercise.category)) {
                throw new Error(`Exercise '${exercise.id}' references missing category '${exercise.category}'.`);
            }
            if (exercise.pathId && !pathIds.has(exercise.pathId)) {
                throw new Error(`Exercise '${exercise.id}' references missing path '${exercise.pathId}'.`);
            }
            if (exercise.lessonId && !allLessonMetadata.has(exercise.lessonId)) {
                throw new Error(`Exercise '${exercise.id}' references missing lesson '${exercise.lessonId}'.`);
            }
        }

        return { ...item, lessonById };
    });

    return { index, courses: normalizedCourses };
}

module.exports = { validateContent };
