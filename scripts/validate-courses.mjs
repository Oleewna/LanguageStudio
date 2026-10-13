#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const coursesDir = path.join(projectRoot, 'courses');
const indexPath = path.join(coursesDir, 'index.json');

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    const relative = path.relative(projectRoot, filePath).replace(/\\/g, '/');
    throw new Error(`Invalid JSON in ${relative}: ${error.message}`);
  }
}

function assertLocalizedText(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${label} must be an object with uk/en strings.`);
  }
  if (typeof value.uk !== 'string' || typeof value.en !== 'string') {
    fail(`${label} must include string values for uk and en.`);
  }
}

function validateCourseIndex(indexData) {
  if (!indexData || typeof indexData !== 'object') {
    fail('courses/index.json must contain an object.');
  }

  if (typeof indexData.default !== 'string' || !indexData.default.trim()) {
    fail('courses/index.json must define a non-empty default course id.');
  }

  if (!Array.isArray(indexData.courses) || indexData.courses.length === 0) {
    fail('courses/index.json must include a non-empty courses array.');
  }

  const ids = new Set();

  for (const course of indexData.courses) {
    if (!course || typeof course !== 'object') {
      fail('Each course entry in courses/index.json must be an object.');
    }

    if (typeof course.id !== 'string' || !course.id.trim()) {
      fail('Each course entry must contain a non-empty id.');
    }

    if (ids.has(course.id)) {
      fail(`Duplicate course id found in courses/index.json: ${course.id}`);
    }
    ids.add(course.id);

    if (!course.name || typeof course.name !== 'object') {
      fail(`Course ${course.id} is missing a name object.`);
    }
    assertLocalizedText(course.name, `Course ${course.id} name`);

    if (course.status && !['active', 'soon', 'locked'].includes(course.status)) {
      fail(`Course ${course.id} has an unsupported status: ${course.status}`);
    }
  }

  if (!ids.has(indexData.default)) {
    fail(`Default course id '${indexData.default}' does not exist in courses/index.json.`);
  }
}

function validateCourse(courseId) {
  const courseFolder = path.join(coursesDir, courseId);
  if (!fs.existsSync(courseFolder) || !fs.statSync(courseFolder).isDirectory()) {
    fail(`Missing course folder for '${courseId}'.`);
  }

  const requiredFiles = ['course.json', 'vocab.json', 'grammar.json', 'exercises.json'];
  for (const fileName of requiredFiles) {
    const filePath = path.join(courseFolder, fileName);
    if (!fs.existsSync(filePath)) {
      fail(`Course '${courseId}' is missing ${fileName}.`);
    }
  }

  const course = readJson(path.join(courseFolder, 'course.json'));
  if (!course || typeof course !== 'object') {
    fail(`Course '${courseId}' course.json must contain an object.`);
  }

  if (course.id !== courseId) {
    fail(`Course id mismatch: folder is '${courseId}' but course.json says '${course.id}'.`);
  }

  if (!course.target || typeof course.target !== 'object') {
    fail(`Course '${courseId}' is missing a target section.`);
  }

  if (typeof course.target.code !== 'string' || !course.target.code.trim()) {
    fail(`Course '${courseId}' target.code must be a non-empty string.`);
  }

  if (!course.tagline || typeof course.tagline !== 'object') {
    fail(`Course '${courseId}' is missing tagline text.`);
  }
  assertLocalizedText(course.tagline, `Course ${courseId} tagline`);

  if (!course.features || typeof course.features !== 'object') {
    fail(`Course '${courseId}' is missing features config.`);
  }

  const formats = Array.isArray(course.features.exerciseFormats) ? course.features.exerciseFormats : [];
  if (formats.length === 0) {
    fail(`Course '${courseId}' must define at least one exercise format.`);
  }

  for (const format of formats) {
    if (typeof format !== 'string' || !format.trim()) {
      fail(`Course '${courseId}' has an invalid exercise format entry.`);
    }
  }

  if (!Array.isArray(course.exerciseCategories) || course.exerciseCategories.length === 0) {
    fail(`Course '${courseId}' must define exerciseCategories.`);
  }

  const categoryIds = new Set();
  for (const category of course.exerciseCategories) {
    if (!category || typeof category !== 'object') {
      fail(`Course '${courseId}' has an invalid exercise category entry.`);
    }
    if (typeof category.id !== 'string' || !category.id.trim()) {
      fail(`Course '${courseId}' contains an exercise category without an id.`);
    }
    if (categoryIds.has(category.id)) {
      fail(`Course '${courseId}' has duplicate exercise category id '${category.id}'.`);
    }
    categoryIds.add(category.id);
    if (!category.name || typeof category.name !== 'object') {
      fail(`Exercise category '${category.id}' is missing a localized name.`);
    }
    assertLocalizedText(category.name, `Exercise category ${category.id} name`);
  }

  const vocab = readJson(path.join(courseFolder, 'vocab.json'));
  if (!Array.isArray(vocab)) {
    fail(`Course '${courseId}' vocab.json must contain an array.`);
  }

  for (const entry of vocab) {
    if (!entry || typeof entry !== 'object') {
      fail(`Course '${courseId}' contains a malformed vocabulary entry.`);
    }
    if (typeof entry.id !== 'string' || !entry.id.trim()) {
      fail(`Course '${courseId}' vocab entry is missing a valid id.`);
    }
    if (typeof entry.word !== 'string' || !entry.word.trim()) {
      fail(`Course '${courseId}' vocab entry '${entry.id}' is missing a valid word.`);
    }
    if (!entry.trans || typeof entry.trans !== 'object') {
      fail(`Course '${courseId}' vocab entry '${entry.id}' is missing localized translation data.`);
    }
    assertLocalizedText(entry.trans, `Course ${courseId} vocab entry ${entry.id} trans`);
  }

  const grammar = readJson(path.join(courseFolder, 'grammar.json'));
  if (!grammar || typeof grammar !== 'object' || !Array.isArray(grammar.topics)) {
    fail(`Course '${courseId}' grammar.json must contain a topics array.`);
  }

  const validBlockTypes = new Set(['table', 'note', 'examples', 'rules']);
  for (const topic of grammar.topics) {
    if (!topic || typeof topic !== 'object') {
      fail(`Course '${courseId}' contains a malformed grammar topic.`);
    }
    if (typeof topic.id !== 'string' || !topic.id.trim()) {
      fail(`Course '${courseId}' contains a grammar topic without a valid id.`);
    }
    if (!topic.title || typeof topic.title !== 'object') {
      fail(`Course '${courseId}' grammar topic '${topic.id}' is missing a localized title.`);
    }
    assertLocalizedText(topic.title, `Course ${courseId} grammar topic ${topic.id} title`);
    if (!Array.isArray(topic.blocks)) {
      fail(`Course '${courseId}' grammar topic '${topic.id}' must define a blocks array.`);
    }
    for (const block of topic.blocks) {
      if (!block || typeof block !== 'object') {
        fail(`Course '${courseId}' grammar topic '${topic.id}' contains a malformed block.`);
      }
      if (typeof block.type !== 'string' || !validBlockTypes.has(block.type)) {
        fail(`Course '${courseId}' grammar topic '${topic.id}' contains an unsupported block type: ${String(block.type)}`);
      }
    }
  }

  const exercises = readJson(path.join(courseFolder, 'exercises.json'));
  if (!Array.isArray(exercises)) {
    fail(`Course '${courseId}' exercises.json must be an array.`);
  }

  for (const exercise of exercises) {
    if (!exercise || typeof exercise !== 'object') {
      fail(`Course '${courseId}' contains a malformed exercise item.`);
    }
    if (typeof exercise.id !== 'string' || !exercise.id.trim()) {
      fail(`Course '${courseId}' exercise item is missing a valid id.`);
    }
    if (typeof exercise.format !== 'string' || !formats.includes(exercise.format)) {
      fail(`Exercise '${exercise.id}' uses unsupported format '${String(exercise.format)}' for course '${courseId}'.`);
    }
    if (typeof exercise.category !== 'string' || !categoryIds.has(exercise.category)) {
      fail(`Exercise '${exercise.id}' must use a category defined in ${courseId}/course.json.`);
    }

    if (exercise.format === 'match') {
      if (!exercise.title || typeof exercise.title !== 'object') {
        fail(`Exercise '${exercise.id}' is missing a localized title.`);
      }
      assertLocalizedText(exercise.title, `Exercise ${exercise.id} title`);
      if (!Array.isArray(exercise.pairs) || exercise.pairs.length === 0) {
        fail(`Exercise '${exercise.id}' match format requires a non-empty pairs array.`);
      }
      continue;
    }

    if (exercise.format === 'reorder') {
      if (!exercise.clue || typeof exercise.clue !== 'object') {
        fail(`Exercise '${exercise.id}' is missing a localized clue.`);
      }
      assertLocalizedText(exercise.clue, `Exercise ${exercise.id} clue`);
      if (!Array.isArray(exercise.words) || exercise.words.length === 0) {
        fail(`Exercise '${exercise.id}' reorder format requires a non-empty words array.`);
      }
      continue;
    }

    if (exercise.format === 'dialogue') {
      if (typeof exercise.lineA !== 'string' || !exercise.lineA.trim()) {
        fail(`Exercise '${exercise.id}' dialogue format requires lineA.`);
      }
      if (!Array.isArray(exercise.options) || exercise.options.length === 0) {
        fail(`Exercise '${exercise.id}' dialogue format requires a non-empty options array.`);
      }
      continue;
    }

    if (exercise.format === 'listen') {
      if (typeof exercise.audioWord !== 'string' || !exercise.audioWord.trim()) {
        fail(`Exercise '${exercise.id}' listen format requires audioWord.`);
      }
      if (!exercise.instruction || typeof exercise.instruction !== 'object') {
        fail(`Exercise '${exercise.id}' listen format requires instruction text.`);
      }
      assertLocalizedText(exercise.instruction, `Exercise ${exercise.id} instruction`);
      if (!Array.isArray(exercise.options) || exercise.options.length === 0) {
        fail(`Exercise '${exercise.id}' listen format requires a non-empty options array.`);
      }
      continue;
    }

    if (!exercise.question || typeof exercise.question !== 'object') {
      fail(`Exercise '${exercise.id}' is missing a localized question.`);
    }
    assertLocalizedText(exercise.question, `Exercise ${exercise.id} question`);

    if (exercise.format === 'mcq') {
      if (!Array.isArray(exercise.options) || exercise.options.length < 2) {
        fail(`Exercise '${exercise.id}' mcq format requires at least two options.`);
      }
    }

    if (exercise.format === 'blank') {
      if (!Array.isArray(exercise.answers) || exercise.answers.length === 0) {
        fail(`Exercise '${exercise.id}' blank format requires a non-empty answers array.`);
      }
    }
  }

  const lessonsDir = path.join(courseFolder, 'lessons');
  if (!fs.existsSync(lessonsDir) || !fs.statSync(lessonsDir).isDirectory()) {
    fail(`Course '${courseId}' does not define a lessons directory.`);
  }

  const referencedLessons = new Set();
  for (const pathEntry of course.paths || []) {
    if (!pathEntry || typeof pathEntry !== 'object') {
      fail(`Course '${courseId}' contains a malformed path entry.`);
    }
    for (const unit of pathEntry.units || []) {
      if (!unit || typeof unit !== 'object' || !Array.isArray(unit.lessons)) {
        fail(`Course '${courseId}' path '${pathEntry.id || 'unknown'}' contains a malformed unit.`);
      }
      for (const lesson of unit.lessons) {
        if (!lesson || typeof lesson !== 'object') {
          fail(`Course '${courseId}' contains a malformed lesson entry.`);
        }
        if (typeof lesson.id !== 'string' || !lesson.id.trim()) {
          fail(`Course '${courseId}' contains a lesson without a valid id.`);
        }
        referencedLessons.add(lesson.id);
        const lessonFile = path.join(lessonsDir, `${lesson.id}.json`);
        if (!fs.existsSync(lessonFile)) {
          fail(`Course '${courseId}' references lesson '${lesson.id}' but no file exists at courses/${courseId}/lessons/${lesson.id}.json`);
        }
        const lessonData = readJson(lessonFile);
        if (!lessonData || typeof lessonData !== 'object') {
          fail(`Lesson '${lesson.id}' in course '${courseId}' must contain a JSON object.`);
        }
        if (lessonData.id && lessonData.id !== lesson.id) {
          fail(`Lesson file ${lesson.id}.json declares id '${lessonData.id}', which does not match its filename.`);
        }
      }
    }
  }

  const lessonFiles = fs.readdirSync(lessonsDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fileName.replace(/\.json$/, ''));

  const missingReferencedFiles = [...referencedLessons].filter((lessonId) => !lessonFiles.includes(lessonId));
  if (missingReferencedFiles.length > 0) {
    fail(`Course '${courseId}' is missing lesson files for: ${missingReferencedFiles.join(', ')}`);
  }
}

function main() {
  if (!fs.existsSync(indexPath)) {
    fail('courses/index.json is missing.');
  }

  const indexData = readJson(indexPath);
  validateCourseIndex(indexData);

  const courses = indexData.courses.map((course) => course.id);
  for (const courseId of courses) {
    validateCourse(courseId);
  }

  console.log(`✅ Course validation passed for ${courses.length} course(s): ${courses.join(', ')}.`);
}

try {
  main();
} catch (error) {
  console.error('❌ Course validation failed');
  console.error(error.message);
  process.exit(1);
}
