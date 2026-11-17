const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test, beforeEach } = require('node:test');

function createStorage() {
  const store = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      Object.keys(store).forEach((k) => delete store[k]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key(i) {
      return Object.keys(store)[i] || null;
    }
  };
}

function loadScripts(customWindow = {}) {
  const conflictSrc = fs.readFileSync(path.resolve(__dirname, '../../service/src/services/progressConflict.js'), 'utf8');
  const storeSrc = fs.readFileSync(path.resolve(__dirname, '../../../frontend/public/js/progress-store.js'), 'utf8');
  const progressSrc = fs.readFileSync(path.resolve(__dirname, '../../../frontend/public/js/progress.js'), 'utf8');

  const storage = customWindow.localStorage || createStorage();
  const win = {
    console,
    localStorage: storage,
    CustomEvent: class CustomEvent {
      constructor(type, init = {}) {
        this.type = type;
        this.detail = init.detail;
      }
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    fetch: customWindow.fetch || (async () => ({ ok: true, json: async () => ({}) })),
    document: {
      cookie: '',
      querySelectorAll: () => []
    },
    ...customWindow
  };

  const context = {
    window: win,
    globalThis: win,
    localStorage: storage,
    console,
    CustomEvent: win.CustomEvent,
    fetch: win.fetch,
    document: win.document,
    setTimeout,
    clearTimeout
  };

  vm.createContext(context);
  vm.runInContext(conflictSrc, context);
  vm.runInContext(storeSrc, context);
  vm.runInContext(progressSrc, context);

  return win;
}

test('LocalStorageAdapter performs get, set, update, list, remove synchronously', () => {
  const win = loadScripts();
  const { LocalStorageAdapter } = win.__LSProgressAdapters;
  const adapter = new LocalStorageAdapter('guest');

  // set
  const saved = adapter.set('profile', 'guest', { userId: 'guest', totalXp: 50 });
  assert.equal(saved.totalXp, 50);

  // get
  const retrieved = adapter.get('profile', 'guest');
  assert.equal(retrieved.totalXp, 50);

  // update
  const updated = adapter.update('profile', 'guest', { totalXp: 80, sourceLanguage: 'uk' });
  assert.equal(updated.totalXp, 80);
  assert.equal(updated.sourceLanguage, 'uk');

  // list
  adapter.set('lessonProgress', 'it:1.1', { courseId: 'it', lessonId: '1.1', state: 'completed' });
  adapter.set('lessonProgress', 'it:1.2', { courseId: 'it', lessonId: '1.2', state: 'in_progress' });
  const completed = adapter.list('lessonProgress', { state: 'completed' });
  assert.equal(completed.length, 1);
  assert.equal(completed[0].lessonId, '1.1');

  // remove
  const removed = adapter.remove('lessonProgress', 'it:1.2');
  assert.equal(removed, true);
  assert.equal(adapter.get('lessonProgress', 'it:1.2'), null);
});

test('ApiAdapter write-through cache: operations return immediately and queue server requests', async () => {
  const fetchCalls = [];
  const fakeFetch = async (url, options = {}) => {
    fetchCalls.push({ url, method: options.method, body: options.body ? JSON.parse(options.body) : null });
    return {
      ok: true,
      status: 200,
      json: async () => (options.body ? JSON.parse(options.body) : {})
    };
  };

  const win = loadScripts({ fetch: fakeFetch });
  const { ApiAdapter } = win.__LSProgressAdapters;
  const adapter = new ApiAdapter('u_test');

  // set writes to cache immediately
  const rec = adapter.set('profile', 'u_test', { userId: 'u_test', totalXp: 120 });
  assert.equal(rec.totalXp, 120);

  // synchronous get from cache
  const cached = adapter.get('profile', 'u_test');
  assert.equal(cached.totalXp, 120);

  // synchronous list from cache
  adapter.set('lessonProgress', 'it:1.1', { courseId: 'it', lessonId: '1.1', state: 'completed' });
  const list = adapter.list('lessonProgress');
  assert.equal(list.length, 1);
  assert.equal(list[0].lessonId, '1.1');

  // Wait for background flush to execute
  await new Promise((resolve) => setImmediate(resolve));
  const putCalls = fetchCalls.filter((c) => c.method === 'PUT');
  assert.ok(putCalls.length >= 2, 'Should have made background fetch calls for queued items');
  assert.equal(putCalls[0].method, 'PUT');
  assert.equal(putCalls[0].body.totalXp, 120);
});

test('ApiAdapter offline queue: queues items when network fails, flushes when online', async () => {
  let isOnline = false;
  const queuedCalls = [];

  const fakeFetch = async (url, options = {}) => {
    if (!isOnline) {
      throw new TypeError('Failed to fetch (offline)');
    }
    queuedCalls.push({ url, method: options.method });
    return {
      ok: true,
      status: 200,
      json: async () => ({})
    };
  };

  const win = loadScripts({ fetch: fakeFetch });
  const { ApiAdapter } = win.__LSProgressAdapters;
  const adapter = new ApiAdapter('u_offline');

  // Save while offline
  adapter.set('position', 'it', { courseId: 'it', refId: '1.1' });
  await new Promise((resolve) => setImmediate(resolve));

  // Should have failed to fetch and kept in queue
  assert.equal(queuedCalls.length, 0);
  assert.equal(adapter._queue.length, 1);

  // Connection restored
  isOnline = true;
  await adapter.flushQueue();

  assert.equal(queuedCalls.length, 1);
  assert.equal(adapter._queue.length, 0);
});

test('Progress picks ApiAdapter when logged in, LocalStorageAdapter for guests', () => {
  const win = loadScripts();
  const { Progress } = win;

  // Initial guest state
  assert.equal(Progress.getAdapter().constructor.name, 'LocalStorageAdapter');

  // User logs in
  Progress.initSession({ id: 'user_456' });
  assert.equal(Progress.getAdapter().constructor.name, 'ApiAdapter');
  assert.equal(Progress.getAdapter().userId, 'user_456');

  // User logs out
  Progress.initSession(null);
  assert.equal(Progress.getAdapter().constructor.name, 'LocalStorageAdapter');
});

test('Progress.getXP and Progress.getCompletedLessons return single source of truth', async () => {
  const win = loadScripts();
  const { Progress } = win;

  await Progress.recordXp({ courseId: 'it', amount: 35, source: 'exercise' });
  assert.equal(Progress.getXP(), 35);

  await Progress.recordLessonResult('it', 'lesson-abc', { score: 1, xp: 10 });
  assert.equal(Progress.isLessonCompleted('lesson-abc', 'it'), true);
  assert.deepEqual([...Progress.getCompletedLessons('it')], ['lesson-abc']);
});

test('Guest progress merge on login imports existing guest progress into server account', async () => {
  let serverMergedCalled = false;
  let serverReceivedPayload = null;

  const fakeFetch = async (url, options = {}) => {
    if (url === '/api/progress/merge') {
      serverMergedCalled = true;
      serverReceivedPayload = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          merged: {
            profile: {
              u_target: { userId: 'u_target', totalXp: 180, updatedAt: '2026-10-14T12:00:00.000Z' }
            },
            lessonProgress: {
              'it:1.1': { courseId: 'it', lessonId: '1.1', state: 'completed', bestScore: 1.0 }
            },
            daily: {},
            wordStats: {},
            position: {},
            customWords: {}
          }
        })
      };
    }
    return { ok: true, status: 200, json: async () => ({}) };
  };

  const win = loadScripts({ fetch: fakeFetch });
  const { Progress } = win;

  // Guest earns 80 XP
  await Progress.recordXp({ courseId: 'it', amount: 80, source: 'lesson' });
  assert.equal(Progress.getXP(), 80);

  // User logs in with account 'u_target'
  const merged = await Progress.mergeGuestProgress('u_target');
  assert.ok(merged, 'Should return merged result');
  assert.equal(serverMergedCalled, true);
  assert.ok(serverReceivedPayload.profile.local.totalXp >= 80, 'Guest XP was exported');

  // Verify active adapter is now ApiAdapter and merged data is in effect
  assert.equal(Progress.getAdapter().constructor.name, 'ApiAdapter');
  assert.equal(Progress.getXP(), 180);
});
