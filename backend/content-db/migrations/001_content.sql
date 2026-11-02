CREATE TABLE schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL
);

CREATE TABLE content_meta (
    singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
    default_course_id TEXT NOT NULL,
    courses_index_json TEXT NOT NULL CHECK (json_valid(courses_index_json))
);

CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    target_code TEXT NOT NULL,
    config_json TEXT NOT NULL CHECK (json_valid(config_json))
);

CREATE TABLE exercise_categories (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE learning_paths (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE learning_units (
    course_id TEXT NOT NULL,
    path_id TEXT NOT NULL,
    id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
    PRIMARY KEY (course_id, path_id, id),
    FOREIGN KEY (course_id, path_id)
        REFERENCES learning_paths(course_id, id) ON DELETE CASCADE
);

CREATE TABLE lessons (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    path_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    metadata_json TEXT NOT NULL CHECK (json_valid(metadata_json)),
    content_json TEXT CHECK (content_json IS NULL OR json_valid(content_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id, path_id, unit_id)
        REFERENCES learning_units(course_id, path_id, id) ON DELETE CASCADE
);

CREATE TABLE course_resources (
    course_id TEXT NOT NULL,
    resource TEXT NOT NULL CHECK (resource IN ('vocab', 'grammar', 'exercises')),
    payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
    PRIMARY KEY (course_id, resource),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE vocabulary (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    word TEXT NOT NULL,
    topic TEXT,
    category TEXT,
    lesson_id TEXT,
    payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id, lesson_id)
        REFERENCES lessons(course_id, id)
);

CREATE TABLE grammar_topics (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE exercises (
    course_id TEXT NOT NULL,
    id TEXT NOT NULL,
    format TEXT NOT NULL,
    category TEXT,
    path_id TEXT,
    lesson_id TEXT,
    payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
    PRIMARY KEY (course_id, id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id, category)
        REFERENCES exercise_categories(course_id, id),
    FOREIGN KEY (course_id, path_id)
        REFERENCES learning_paths(course_id, id),
    FOREIGN KEY (course_id, lesson_id)
        REFERENCES lessons(course_id, id)
);

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
