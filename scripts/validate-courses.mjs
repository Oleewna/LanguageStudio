#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dbPath = path.join(repoRoot, 'backend', 'service', 'data', 'vocab.db');
const indexPath = path.join(repoRoot, 'courses', 'index.json');

function warn(message) {
  console.warn(`WARN: ${message}`);
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

try {
  if (!exists(dbPath)) {
    console.error(`Missing database: ${dbPath}`);
    process.exitCode = 1;
  }

  if (!exists(indexPath)) {
    console.error(`Missing course index: ${indexPath}`);
    process.exitCode = 1;
    return;
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const courses = Array.isArray(index.courses) ? index.courses : [];

  if (!courses.length) {
    warn('Course index is empty.');
  }

  courses.forEach((course) => {
    const courseId = course && course.id ? String(course.id) : '';
    const courseFolder = path.join(repoRoot, 'courses', courseId);
    if (!exists(courseFolder)) {
      warn(`Course folder missing for ${courseId}`);
      return;
    }

    const vocabPath = path.join(courseFolder, 'vocab.json');
    const hasWords = exists(vocabPath) && fs.statSync(vocabPath).size > 0;
    if (!hasWords) {
      warn(`Course ${courseId} does not have a vocab.json file; the shared catalog is used instead.`);
    }
  });

  if (process.exitCode === undefined) {
    console.log('Validation passed.');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
