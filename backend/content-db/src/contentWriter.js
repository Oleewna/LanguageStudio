const { getContentDatabase } = require('./contentDatabase');

function without(value, ...keys) {
    return Object.fromEntries(Object.entries(value).filter(([key]) => !keys.includes(key)));
}

function replaceAllContent(content) {
    const database = getContentDatabase();
    const replace = database.transaction(() => {
        database.prepare('DELETE FROM content_meta').run();
        database.prepare('DELETE FROM exercises').run();
        database.prepare('DELETE FROM vocabulary').run();
        database.prepare('DELETE FROM grammar_topics').run();
        database.prepare('DELETE FROM course_resource_metadata').run();
        database.prepare('DELETE FROM lessons').run();
        database.prepare('DELETE FROM learning_units').run();
        database.prepare('DELETE FROM learning_paths').run();
        database.prepare('DELETE FROM exercise_categories').run();
        database.prepare('DELETE FROM courses').run();

        database.prepare(
            'INSERT INTO content_meta (singleton, default_course_id) VALUES (1, ?)'
        ).run(content.index.default);

        const insertCourse = database.prepare(`
            INSERT INTO courses
                (id, sort_order, index_metadata_json, name_json, native_name, flag, status,
                 target_json, tagline_json, features_json, metadata_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const insertCategory = database.prepare(
            'INSERT INTO exercise_categories (course_id, id, sort_order, payload_json) VALUES (?, ?, ?, ?)'
        );
        const insertPath = database.prepare(
            'INSERT INTO learning_paths (course_id, id, sort_order, metadata_json) VALUES (?, ?, ?, ?)'
        );
        const insertUnit = database.prepare(
            'INSERT INTO learning_units (course_id, path_id, id, sort_order, metadata_json) VALUES (?, ?, ?, ?, ?)'
        );
        const insertLesson = database.prepare(`
            INSERT INTO lessons
                (course_id, id, path_id, unit_id, sort_order, metadata_json, content_json)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const insertResourceMetadata = database.prepare(
            'INSERT INTO course_resource_metadata (course_id, resource, metadata_json) VALUES (?, ?, ?)'
        );
        const insertVocabulary = database.prepare(`
            INSERT INTO vocabulary
                (course_id, id, sort_order, word, topic, category, lesson_id, payload_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const insertGrammarTopic = database.prepare(
            'INSERT INTO grammar_topics (course_id, id, sort_order, payload_json) VALUES (?, ?, ?, ?)'
        );
        const insertExercise = database.prepare(`
            INSERT INTO exercises
                (course_id, id, sort_order, format, category, path_id, lesson_id, payload_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const [courseIndex, item] of content.courses.entries()) {
            const courseId = item.course.id;
            const indexEntry = content.index.courses[courseIndex];
            insertCourse.run(
                courseId,
                courseIndex,
                JSON.stringify(without(indexEntry, 'id', 'name', 'native', 'flag', 'status')),
                JSON.stringify(indexEntry.name),
                indexEntry.native || '',
                indexEntry.flag || '',
                indexEntry.status || 'inactive',
                JSON.stringify(item.course.target),
                JSON.stringify(item.course.tagline),
                JSON.stringify(item.course.features),
                JSON.stringify(without(item.course, 'id', 'target', 'tagline', 'features', 'paths', 'exerciseCategories'))
            );

            item.course.exerciseCategories.forEach((category, index) => {
                insertCategory.run(courseId, category.id, index, JSON.stringify(without(category, 'id')));
            });

            item.course.paths.forEach((learningPath, pathIndex) => {
                insertPath.run(
                    courseId,
                    learningPath.id,
                    pathIndex,
                    JSON.stringify(without(learningPath, 'id', 'units'))
                );
                learningPath.units.forEach((unit, unitIndex) => {
                    insertUnit.run(
                        courseId,
                        learningPath.id,
                        unit.id,
                        unitIndex,
                        JSON.stringify(without(unit, 'id', 'lessons'))
                    );
                    unit.lessons.forEach((lesson, lessonIndex) => {
                        const lessonContent = item.lessonById.get(lesson.id);
                        insertLesson.run(
                            courseId,
                            lesson.id,
                            learningPath.id,
                            unit.id,
                            lessonIndex,
                            JSON.stringify(lesson),
                            lessonContent ? JSON.stringify(lessonContent) : null
                        );
                    });
                });
            });

            insertResourceMetadata.run(courseId, 'vocab', '{}');
            insertResourceMetadata.run(
                courseId,
                'grammar',
                JSON.stringify(without(item.resources.grammar, 'topics'))
            );
            insertResourceMetadata.run(courseId, 'exercises', '{}');

            item.resources.vocab.forEach((entry, index) => {
                insertVocabulary.run(
                    courseId,
                    entry.id,
                    index,
                    entry.word,
                    entry.topic || null,
                    entry.category || null,
                    entry.lesson || null,
                    JSON.stringify(entry)
                );
            });
            item.resources.grammar.topics.forEach((topic, index) => {
                insertGrammarTopic.run(courseId, topic.id, index, JSON.stringify(topic));
            });
            item.resources.exercises.forEach((exercise, index) => {
                insertExercise.run(
                    courseId,
                    exercise.id,
                    index,
                    exercise.format,
                    exercise.category || null,
                    exercise.pathId || null,
                    exercise.lessonId || null,
                    JSON.stringify(exercise)
                );
            });
        }
    });

    replace();
}

module.exports = { replaceAllContent };
