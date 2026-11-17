#!/usr/bin/env node

/**
 * Validates course catalog, target metadata, locale translations, stable IDs,
 * and access control enforcement (free vs paid content separation).
 * 
 * Requirements:
 *  1. courses/index.json defines default and lists courses with status.
 *  2. course.json contains: target.code (BCP-47), tts, script, rtl, availableLocales[].
 *  3. access ('free' | 'paid') and priceId validation on course.json and lessons.
 *  4. First lessons of a paid course must remain free.
 *  5. Paid lesson JSON must NOT be served from the public static folder (must be in paid-content/).
 *  6. In each lesson: all IDs must be unique (fails on duplicate).
 *  7. For each locale in availableLocales:
 *     - i18n/<locale>/lessons/<lessonId>.json must be valid JSON (fails on syntax/read error).
 *     - Every ID in the lesson should have a translation in each locale (warns if missing).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const coursesDir = path.join(projectRoot, 'courses');
const indexPath = path.join(coursesDir, 'index.json');
const paidContentBaseDir = path.join(projectRoot, 'paid-content', 'courses');

let hasErrors = false;
let warningCount = 0;

function fail(message) {
  console.error(`ERROR: ${message}`);
  hasErrors = true;
}

function warn(message) {
  console.warn(`WARN: ${message}`);
  warningCount++;
}

function readJson(filePath) {
  const rel = path.relative(projectRoot, filePath).replace(/\\/g, '/');
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    fail(`Invalid JSON in ${rel}: ${error.message}`);
    return null;
  }
}

function validateCourseIndex(indexData) {
  if (!indexData || typeof indexData !== 'object') {
    fail('courses/index.json must contain an object.');
    return [];
  }

  if (typeof indexData.default !== 'string' || !indexData.default.trim()) {
    fail('courses/index.json must define a non-empty default course id.');
  }

  if (!Array.isArray(indexData.courses) || indexData.courses.length === 0) {
    fail('courses/index.json must include a non-empty courses array.');
    return [];
  }

  const ids = new Set();
  const validStatuses = ['active', 'inactive', 'soon', 'locked'];

  for (const course of indexData.courses) {
    if (!course || typeof course !== 'object') {
      fail('Each course entry in courses/index.json must be an object.');
      continue;
    }

    if (typeof course.id !== 'string' || !course.id.trim()) {
      fail('Each course entry must contain a non-empty id.');
      continue;
    }

    if (ids.has(course.id)) {
      fail(`Duplicate course id found in courses/index.json: '${course.id}'`);
    }
    ids.add(course.id);

    if (course.status && !validStatuses.includes(course.status)) {
      fail(`Course '${course.id}' has unsupported status '${course.status}'. Must be one of: ${validStatuses.join(', ')}`);
    }
  }

  if (indexData.default && !ids.has(indexData.default)) {
    fail(`Default course id '${indexData.default}' not found in courses list.`);
  }

  return [...ids];
}

function collectLessonIds(lessonData) {
  const ids = [];

  if (lessonData.id) {
    ids.push(lessonData.id);
  }

  const blocks = Array.isArray(lessonData.blocks) ? lessonData.blocks : [];
  for (const block of blocks) {
    if (block.id) ids.push(block.id);

    if (block.type === 'dialogue' && Array.isArray(block.lines)) {
      for (const line of block.lines) {
        if (line.id) ids.push(line.id);
      }
    }

    if (block.type === 'vocab' && Array.isArray(block.items)) {
      for (const item of block.items) {
        if (item.id) ids.push(item.id);
      }
    }

    if ((block.type === 'culture' || block.type === 'culture_note') && Array.isArray(block.paragraphs)) {
      for (const para of block.paragraphs) {
        if (para && typeof para === 'object' && para.id) ids.push(para.id);
      }
    }

    if (block.type === 'takeaways' && Array.isArray(block.items)) {
      for (const item of block.items) {
        if (item && typeof item === 'object' && item.id) ids.push(item.id);
      }
    }

    if (block.type === 'story_text') {
      if (Array.isArray(block.paragraphs)) {
        for (const para of block.paragraphs) {
          if (para && typeof para === 'object' && para.id) ids.push(para.id);
        }
      }
      if (Array.isArray(block.vocabHints)) {
        for (const hint of block.vocabHints) {
          if (hint && typeof hint === 'object' && hint.id) ids.push(hint.id);
        }
      }
    }

    if ((block.type === 'tasks' || block.type === 'quiz') && Array.isArray(block.items || block.tasks)) {
      for (const task of (block.items || block.tasks)) {
        if (task && task.id) ids.push(task.id);
      }
    }
  }

  return ids;
}

function validateCourse(courseId) {
  const courseFolder = path.join(coursesDir, courseId);
  if (!fs.existsSync(courseFolder) || !fs.statSync(courseFolder).isDirectory()) {
    fail(`Missing course folder for '${courseId}'.`);
    return;
  }

  const courseJsonPath = path.join(courseFolder, 'course.json');
  if (!fs.existsSync(courseJsonPath)) {
    fail(`Course '${courseId}' is missing course.json.`);
    return;
  }

  const course = readJson(courseJsonPath);
  if (!course) return;

  if (course.id !== courseId) {
    fail(`Course id mismatch: folder is '${courseId}' but course.json declares '${course.id}'.`);
  }

  // Access control & pricing validation on course.json
  if (course.access !== undefined) {
    if (!['free', 'paid'].includes(course.access)) {
      fail(`Course '${courseId}' has invalid access '${course.access}'. Must be 'free' or 'paid'.`);
    }
  }
  if (course.priceId !== undefined) {
    if (typeof course.priceId !== 'string' || !course.priceId.trim()) {
      fail(`Course '${courseId}' priceId must be a non-empty string.`);
    }
  }

  // Target metadata
  const targetCode = course.target?.code || course.target;
  if (!targetCode || typeof targetCode !== 'string') {
    fail(`Course '${courseId}' requires target.code (BCP-47).`);
  }

  const tts = course.tts || course.target?.tts;
  if (!tts || typeof tts !== 'string') {
    fail(`Course '${courseId}' requires tts (e.g. 'it-IT').`);
  }

  const script = course.script || course.target?.script;
  if (!script || typeof script !== 'string') {
    fail(`Course '${courseId}' requires script (e.g. 'latin').`);
  }

  const rtl = course.rtl ?? course.target?.rtl;
  if (typeof rtl !== 'boolean') {
    fail(`Course '${courseId}' requires rtl boolean.`);
  }

  const availableLocales = Array.isArray(course.availableLocales) ? course.availableLocales : [];
  if (availableLocales.length === 0) {
    fail(`Course '${courseId}' must specify at least one locale in availableLocales[].`);
  }

  // Check i18n directory exists for each locale
  for (const locale of availableLocales) {
    const localeDir = path.join(courseFolder, 'i18n', locale);
    if (!fs.existsSync(localeDir) || !fs.statSync(localeDir).isDirectory()) {
      warn(`Course '${courseId}' i18n directory missing for locale '${locale}': ${path.relative(projectRoot, localeDir)}`);
    }
  }

  // Extract all lessons defined across learning paths
  const pathLessons = [];
  if (Array.isArray(course.paths)) {
    for (const p of course.paths) {
      if (Array.isArray(p.units)) {
        for (const u of p.units) {
          if (Array.isArray(u.lessons)) {
            for (const l of u.lessons) {
              pathLessons.push(l);
            }
          }
        }
      }
    }
  }

  // Enforce rule: first lessons of a paid course stay free
  if (course.access === 'paid' && pathLessons.length > 0) {
    const firstLesson = pathLessons[0];
    if (firstLesson.access === 'paid') {
      fail(`In paid course '${courseId}', the first lesson ('${firstLesson.id}') must stay free.`);
    }
  }

  // Validate lesson access and priceId fields
  for (const l of pathLessons) {
    if (l.access !== undefined && !['free', 'paid'].includes(l.access)) {
      fail(`Lesson '${l.id}' in '${courseId}' has invalid access '${l.access}'. Must be 'free' or 'paid'.`);
    }
    if (l.priceId !== undefined && (typeof l.priceId !== 'string' || !l.priceId.trim())) {
      fail(`Lesson '${l.id}' in '${courseId}' priceId must be a non-empty string.`);
    }
  }

  // Validate separation of free static content and paid private content
  const paidCourseDir = path.join(paidContentBaseDir, courseId);
  const paidLessonsDir = path.join(paidCourseDir, 'lessons');
  const freeLessonsDir = path.join(courseFolder, 'lessons');

  for (const l of pathLessons) {
    const isPaid = l.access === 'paid' || (course.access === 'paid' && l.access !== 'free');
    const fileName = `${l.id}.json`;
    const staticFilePath = path.join(freeLessonsDir, fileName);
    const paidFilePath = path.join(paidLessonsDir, fileName);

    if (isPaid) {
      if (fs.existsSync(staticFilePath)) {
        fail(`Security violation: Paid lesson '${l.id}' is stored in public static folder '${path.relative(projectRoot, staticFilePath)}'. Must be moved to paid-content.`);
      }
      if (!fs.existsSync(paidFilePath)) {
        fail(`Paid lesson file missing for '${l.id}' at '${path.relative(projectRoot, paidFilePath)}'.`);
      }
    } else {
      if (!fs.existsSync(staticFilePath)) {
        fail(`Free lesson file missing for '${l.id}' at '${path.relative(projectRoot, staticFilePath)}'.`);
      }
    }
  }

  // Collect all lesson files (free and paid) for structural and i18n checks
  const allLessonEntries = [];
  if (fs.existsSync(freeLessonsDir)) {
    for (const fileName of fs.readdirSync(freeLessonsDir).filter(f => f.endsWith('.json'))) {
      allLessonEntries.push({
        fileName,
        filePath: path.join(freeLessonsDir, fileName),
        isPaid: false,
        i18nBaseDir: courseFolder
      });
    }
  }
  if (fs.existsSync(paidLessonsDir)) {
    for (const fileName of fs.readdirSync(paidLessonsDir).filter(f => f.endsWith('.json'))) {
      allLessonEntries.push({
        fileName,
        filePath: path.join(paidLessonsDir, fileName),
        isPaid: true,
        i18nBaseDir: paidCourseDir
      });
    }
  }

  if (allLessonEntries.length === 0) {
    warn(`Course '${courseId}' has no lesson files.`);
    return;
  }

  for (const entry of allLessonEntries) {
    const { fileName, filePath, i18nBaseDir } = entry;
    const lessonData = readJson(filePath);
    if (!lessonData) continue;

    if (lessonData.access !== undefined && !['free', 'paid'].includes(lessonData.access)) {
      fail(`Lesson file '${fileName}' in '${courseId}' has invalid access '${lessonData.access}'. Must be 'free' or 'paid'.`);
    }
    if (lessonData.priceId !== undefined && (typeof lessonData.priceId !== 'string' || !lessonData.priceId.trim())) {
      fail(`Lesson file '${fileName}' in '${courseId}' priceId must be a non-empty string.`);
    }

    const lessonIds = collectLessonIds(lessonData);

    // Check unique IDs within lesson
    const seenIds = new Set();
    for (const id of lessonIds) {
      if (seenIds.has(id)) {
        fail(`Duplicate ID '${id}' found in lesson '${path.relative(projectRoot, filePath)}'.`);
      }
      seenIds.add(id);
    }

    // Check translations in each locale
    for (const locale of availableLocales) {
      const i18nLessonPath = path.join(i18nBaseDir, 'i18n', locale, 'lessons', fileName);
      if (!fs.existsSync(i18nLessonPath)) {
        warn(`Missing translation file: ${path.relative(projectRoot, i18nLessonPath)}`);
        continue;
      }

      const i18nData = readJson(i18nLessonPath);
      if (!i18nData) continue;

      for (const id of lessonIds) {
        if (!(id in i18nData)) {
          warn(`Missing translation for ID '${id}' in ${path.relative(projectRoot, i18nLessonPath)}`);
        }
      }
    }
  }
}

function main() {
  if (!fs.existsSync(indexPath)) {
    fail(`Missing courses/index.json at ${indexPath}`);
    process.exit(1);
  }

  const indexData = readJson(indexPath);
  if (!indexData) {
    process.exit(1);
  }

  const courseIds = validateCourseIndex(indexData);
  for (const courseId of courseIds) {
    validateCourse(courseId);
  }

  if (hasErrors) {
    console.error(`Course validation failed with errors (${warningCount} warnings).`);
    process.exit(1);
  }

  console.log(`Course validation passed for ${courseIds.length} course(s) (${warningCount} warnings).`);
}

main();
