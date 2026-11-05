const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

function loadLessonEngineWith(stubWindow) {
  const source = fs.readFileSync(path.resolve(__dirname, '../../../frontend/public/js/lesson-engine.js'), 'utf8');
  const context = {
    console,
    window: stubWindow,
    document: { querySelectorAll: () => [] },
    navigator: { language: 'en-US' },
    localStorage: stubWindow.localStorage,
    CustomEvent,
    module: { exports: {} },
    exports: {}
  };

  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window;
}

test('markLessonCompleted records progress and unlocks lesson vocabulary in the current course', async () => {
  const calls = [];
  const progressCalls = [];
  const storage = {
    data: {},
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(this.data, key) ? this.data[key] : null;
    },
    setItem(key, value) {
      this.data[key] = String(value);
    },
    removeItem(key) {
      delete this.data[key];
    }
  };

  const windowStub = {
    localStorage: storage,
    getCourseId: () => 'it',
    getSourceLanguage: () => 'en',
    addEventListener: () => {},
    dispatchEvent: () => {},
    Progress: {
      getLessonProgress: async () => ({ state: 'in_progress' }),
      recordLessonResult: async (...args) => {
        progressCalls.push(args);
      },
      unlockWordsForLesson: async (courseId, lessonId) => {
        calls.push([courseId, lessonId]);
      }
    }
  };

  const win = loadLessonEngineWith(windowStub);
  win.markLessonCompleted('lesson-1');
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(calls, [['it', 'lesson-1']]);
  assert.equal(progressCalls.length, 1);
  assert.equal(progressCalls[0][0], 'it');
  assert.equal(progressCalls[0][1], 'lesson-1');
  assert.equal(progressCalls[0][2].score, 1);
  assert.equal(win.isLessonCompleted('lesson-1'), true);
});

test('markLessonCompleted retries vocabulary unlock without recording a completed lesson again', async () => {
  const calls = [];
  const storage = {
    data: { ls_completed_lessons: JSON.stringify(['lesson-1']) },
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(this.data, key) ? this.data[key] : null;
    },
    setItem(key, value) {
      this.data[key] = String(value);
    },
    removeItem(key) {
      delete this.data[key];
    }
  };
  const windowStub = {
    localStorage: storage,
    getCourseId: () => 'it',
    addEventListener: () => {},
    dispatchEvent: () => {},
    Progress: {
      getLessonProgress: async () => ({ state: 'completed' }),
      recordLessonResult: async () => assert.fail('Completed progress should not be recorded again'),
      unlockWordsForLesson: async (courseId, lessonId) => calls.push([courseId, lessonId])
    }
  };

  const win = loadLessonEngineWith(windowStub);
  win.markLessonCompleted('lesson-1');
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(calls, [['it', 'lesson-1']]);
});
