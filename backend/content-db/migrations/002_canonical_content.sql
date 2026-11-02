CREATE TABLE content_meta_new (
    singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
    default_course_id TEXT NOT NULL
);

CREATE TABLE courses_new (
    id TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL,
    index_metadata_json TEXT NOT NULL CHECK (json_valid(index_metadata_json)),
    name_json TEXT NOT NULL CHECK (json_valid(name_json)),
    native_name TEXT NOT NULL DEFAULT '',
    flag TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'inactive',
    target_json TEXT NOT NULL CHECK (json_valid(target_json)),
    tagline_json TEXT NOT NULL CHECK (json_valid(tagline_json)),
    features_json TEXT NOT NULL CHECK (json_valid(features_json)),
    metadata_json TEXT NOT NULL CHECK (json_valid(metadata_json))
);

CREATE TABLE exercise_categories_new (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id) REFERENCES courses_new(id) ON DELETE CASCADE
);

CREATE TABLE learning_paths_new (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    metadata_json TEXT NOT NULL CHECK (json_valid(metadata_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id) REFERENCES courses_new(id) ON DELETE CASCADE
);

CREATE TABLE learning_units_new (
    course_id TEXT NOT NULL,
    path_id TEXT NOT NULL,
    id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    metadata_json TEXT NOT NULL CHECK (json_valid(metadata_json)),
    PRIMARY KEY (course_id, path_id, id),
    FOREIGN KEY (course_id, path_id)
        REFERENCES learning_paths_new(course_id, id) ON DELETE CASCADE
);

CREATE TABLE lessons_new (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    path_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    metadata_json TEXT NOT NULL CHECK (json_valid(metadata_json)),
    content_json TEXT CHECK (content_json IS NULL OR json_valid(content_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id, path_id, unit_id)
        REFERENCES learning_units_new(course_id, path_id, id) ON DELETE CASCADE
);

CREATE TABLE course_resource_metadata_new (
    course_id TEXT NOT NULL,
    resource TEXT NOT NULL CHECK (resource IN ('vocab', 'grammar', 'exercises')),
    metadata_json TEXT NOT NULL CHECK (json_valid(metadata_json)),
    PRIMARY KEY (course_id, resource),
    FOREIGN KEY (course_id) REFERENCES courses_new(id) ON DELETE CASCADE
);

CREATE TABLE vocabulary_new (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    word TEXT NOT NULL,
    topic TEXT,
    category TEXT,
    lesson_id TEXT,
    payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id) REFERENCES courses_new(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id, lesson_id)
        REFERENCES lessons_new(course_id, id)
);

CREATE TABLE grammar_topics_new (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id) REFERENCES courses_new(id) ON DELETE CASCADE
);

CREATE TABLE exercises_new (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    format TEXT NOT NULL,
    category TEXT,
    path_id TEXT,
    lesson_id TEXT,
    payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id) REFERENCES courses_new(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id, category)
        REFERENCES exercise_categories_new(course_id, id),
    FOREIGN KEY (course_id, path_id)
        REFERENCES learning_paths_new(course_id, id),
    FOREIGN KEY (course_id, lesson_id)
        REFERENCES lessons_new(course_id, id)
);

INSERT INTO content_meta_new (singleton, default_course_id)
SELECT singleton, default_course_id FROM content_meta;

INSERT INTO courses_new (
    id, sort_order, index_metadata_json, name_json, native_name, flag, status,
    target_json, tagline_json, features_json, metadata_json
)
SELECT
    c.id,
    CAST(index_course.key AS INTEGER),
    json_remove(index_course.value, '$.id', '$.name', '$.native', '$.flag', '$.status'),
    COALESCE(json_extract(index_course.value, '$.name'), '{}'),
    COALESCE(json_extract(index_course.value, '$.native'), ''),
    COALESCE(json_extract(index_course.value, '$.flag'), ''),
    COALESCE(json_extract(index_course.value, '$.status'), 'inactive'),
    COALESCE(json_extract(c.config_json, '$.target'), '{}'),
    COALESCE(json_extract(c.config_json, '$.tagline'), '{}'),
    COALESCE(json_extract(c.config_json, '$.features'), '{}'),
    json_remove(c.config_json, '$.id', '$.target', '$.tagline', '$.features', '$.paths', '$.exerciseCategories')
FROM courses c
JOIN content_meta meta ON meta.singleton = 1
JOIN json_each(meta.courses_index_json, '$.courses') index_course
    ON json_extract(index_course.value, '$.id') = c.id;

INSERT INTO exercise_categories_new (course_id, id, sort_order, payload_json)
SELECT course_id, id, sort_order, json_remove(payload_json, '$.id')
FROM exercise_categories;

INSERT INTO learning_paths_new (course_id, id, sort_order, metadata_json)
SELECT course_id, id, sort_order, json_remove(payload_json, '$.id', '$.units')
FROM learning_paths;

INSERT INTO learning_units_new (course_id, path_id, id, sort_order, metadata_json)
SELECT course_id, path_id, id, sort_order, json_remove(payload_json, '$.id', '$.lessons')
FROM learning_units;

INSERT INTO lessons_new (
    course_id, id, path_id, unit_id, sort_order, metadata_json, content_json
)
SELECT course_id, id, path_id, unit_id, sort_order, metadata_json, content_json
FROM lessons;

INSERT INTO course_resource_metadata_new (course_id, resource, metadata_json)
SELECT
    course_id,
    resource,
    CASE WHEN resource = 'grammar' THEN json_remove(payload_json, '$.topics') ELSE '{}' END
FROM course_resources;

INSERT INTO vocabulary_new (
    course_id, id, sort_order, word, topic, category, lesson_id, payload_json
)
SELECT
    resource.course_id,
    json_extract(entry.value, '$.id'),
    CAST(entry.key AS INTEGER),
    json_extract(entry.value, '$.word'),
    json_extract(entry.value, '$.topic'),
    json_extract(entry.value, '$.category'),
    json_extract(entry.value, '$.lesson'),
    entry.value
FROM course_resources resource
JOIN json_each(resource.payload_json) entry
WHERE resource.resource = 'vocab';

INSERT INTO grammar_topics_new (course_id, id, sort_order, payload_json)
SELECT
    resource.course_id,
    json_extract(topic.value, '$.id'),
    CAST(topic.key AS INTEGER),
    topic.value
FROM course_resources resource
JOIN json_each(resource.payload_json, '$.topics') topic
WHERE resource.resource = 'grammar';

INSERT INTO exercises_new (
    course_id, id, sort_order, format, category, path_id, lesson_id, payload_json
)
SELECT
    resource.course_id,
    json_extract(exercise.value, '$.id'),
    CAST(exercise.key AS INTEGER),
    json_extract(exercise.value, '$.format'),
    json_extract(exercise.value, '$.category'),
    json_extract(exercise.value, '$.pathId'),
    json_extract(exercise.value, '$.lessonId'),
    exercise.value
FROM course_resources resource
JOIN json_each(resource.payload_json) exercise
WHERE resource.resource = 'exercises';

DROP TABLE exercises;
DROP TABLE vocabulary;
DROP TABLE grammar_topics;
DROP TABLE course_resources;
DROP TABLE lessons;
DROP TABLE learning_units;
DROP TABLE learning_paths;
DROP TABLE exercise_categories;
DROP TABLE courses;
DROP TABLE content_meta;

ALTER TABLE content_meta_new RENAME TO content_meta;
ALTER TABLE courses_new RENAME TO courses;
ALTER TABLE exercise_categories_new RENAME TO exercise_categories;
ALTER TABLE learning_paths_new RENAME TO learning_paths;
ALTER TABLE learning_units_new RENAME TO learning_units;
ALTER TABLE lessons_new RENAME TO lessons;
ALTER TABLE course_resource_metadata_new RENAME TO course_resource_metadata;
ALTER TABLE vocabulary_new RENAME TO vocabulary;
ALTER TABLE grammar_topics_new RENAME TO grammar_topics;
ALTER TABLE exercises_new RENAME TO exercises;

CREATE INDEX idx_units_course_order
    ON learning_units(course_id, path_id, sort_order);
CREATE INDEX idx_lessons_path_order
    ON lessons(course_id, path_id, unit_id, sort_order);
CREATE INDEX idx_exercises_course_format_category
    ON exercises(course_id, format, category);
CREATE INDEX idx_vocabulary_course_word
    ON vocabulary(course_id, word);
CREATE INDEX idx_vocabulary_course_topic
    ON vocabulary(course_id, topic);
CREATE INDEX idx_grammar_topics_order
    ON grammar_topics(course_id, sort_order);
CREATE INDEX idx_categories_order
    ON exercise_categories(course_id, sort_order);
