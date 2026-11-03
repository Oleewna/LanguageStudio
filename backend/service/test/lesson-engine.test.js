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

test('markLessonCompleted unlocks the lesson vocabulary in the current course', () => {
  const calls = [];
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
      unlockWordsForLesson: async (courseId, lessonId) => {
        calls.push([courseId, lessonId]);
      }
    }
  };

  const win = loadLessonEngineWith(windowStub);
  win.markLessonCompleted('lesson-1');

  assert.deepEqual(calls, [['it', 'lesson-1']]);
  assert.equal(win.isLessonCompleted('lesson-1'), true);
});
