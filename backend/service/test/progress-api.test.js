const assert = require('node:assert/strict');
const { test, beforeEach } = require('node:test');
const router = require('../src/routes/progress');
const { PROGRESS_MODELS, memoryStores } = require('../src/models/Progress');

// Helper to simulate Express request/response against the router without TCP sockets
function testRequest(routerInstance, { method = 'GET', url = '/', body = {}, query = {}, session = null }) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url, 'http://localhost');
    const req = {
      method,
      url,
      path: parsedUrl.pathname,
      originalUrl: url,
      body,
      query: { ...Object.fromEntries(parsedUrl.searchParams), ...query },
      session,
      headers: {},
      params: {}
    };

    let statusCode = 200;
    let responseBody = null;

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseBody = data;
        resolve({ status: statusCode, body: responseBody });
        return this;
      },
      send(data) {
        responseBody = data;
        resolve({ status: statusCode, body: responseBody });
        return this;
      }
    };

    const next = (err) => {
      if (err) {
        resolve({ status: err.status || 500, error: err.message });
      } else {
        resolve({ status: 404, error: 'Route not handled' });
      }
    };

    routerInstance(req, res, next);
  });
}

beforeEach(async () => {
  for (const model of Object.values(PROGRESS_MODELS)) {
    await model.deleteMany({});
  }
});

test('GET /api/progress requires authentication', async () => {
  const res = await testRequest(router, { method: 'GET', url: '/', session: null });
  assert.equal(res.status, 401);
  assert.match(res.body.error, /Not authenticated/);
});

test('PUT /api/progress/:collection/:id sets record and applies conflict policy', async () => {
  const session = { userId: 'u_123' };

  // 1. Initial PUT
  const initial = {
    userId: 'u_123',
    timezone: 'Europe/Kyiv',
    sourceLanguage: 'uk',
    totalXp: 100,
    dailyGoalXp: 50,
    updatedAt: '2026-10-14T10:00:00.000Z'
  };

  const res1 = await testRequest(router, {
    method: 'PUT',
    url: '/profile/u_123',
    body: initial,
    session
  });
  assert.equal(res1.status, 200);
  assert.equal(res1.body.totalXp, 100);
  assert.equal(res1.body.sourceLanguage, 'uk');

  // 2. Subsequent PUT with newer updatedAt for scalars, but lower totalXp
  const update = {
    userId: 'u_123',
    timezone: 'UTC',
    sourceLanguage: 'en',
    totalXp: 80, // Lower counter
    dailyGoalXp: 75,
    updatedAt: '2026-10-14T12:00:00.000Z' // Newer
  };

  const res2 = await testRequest(router, {
    method: 'PUT',
    url: '/profile/u_123',
    body: update,
    session
  });
  assert.equal(res2.status, 200);
  assert.equal(res2.body.sourceLanguage, 'en', 'Newer updatedAt wins for scalars');
  assert.equal(res2.body.totalXp, 100, 'Counter keeps max');
  assert.equal(res2.body.dailyGoalXp, 75, 'Newer updatedAt wins for scalar goal');
});

test('PUT /api/progress/lessonProgress/:id keeps bestScore max', async () => {
  const session = { userId: 'u_123' };

  // Initial attempt: scored 0.95
  await testRequest(router, {
    method: 'PUT',
    url: '/lessonProgress/it:1.1',
    body: {
      courseId: 'it',
      lessonId: '1.1',
      state: 'completed',
      bestScore: 0.95,
      attempts: 3,
      bestXp: 30,
      updatedAt: '2026-10-14T09:00:00.000Z'
    },
    session
  });

  // Re-attempt: scored 0.70 at later time
  const res = await testRequest(router, {
    method: 'PUT',
    url: '/lessonProgress/it:1.1',
    body: {
      courseId: 'it',
      lessonId: '1.1',
      state: 'completed',
      bestScore: 0.70,
      attempts: 1,
      bestXp: 20,
      updatedAt: '2026-10-14T15:00:00.000Z'
    },
    session
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.bestScore, 0.95, 'bestScore keeps max');
  assert.equal(res.body.attempts, 3, 'attempts keeps max');
  assert.equal(res.body.bestXp, 30, 'bestXp keeps max');
  assert.equal(res.body.state, 'completed');
});

test('GET /api/progress returns full user snapshot', async () => {
  const session = { userId: 'u_123' };

  await testRequest(router, {
    method: 'PUT',
    url: '/profile/u_123',
    body: { userId: 'u_123', totalXp: 250, updatedAt: '2026-10-14T10:00:00.000Z' },
    session
  });

  await testRequest(router, {
    method: 'PUT',
    url: '/daily/2026-10-14',
    body: { date: '2026-10-14', xp: 50, updatedAt: '2026-10-14T10:00:00.000Z' },
    session
  });

  const res = await testRequest(router, { method: 'GET', url: '/', session });
  assert.equal(res.status, 200);
  assert.ok(res.body.profile);
  assert.ok(res.body.daily);
  assert.equal(res.body.profile['u_123'].totalXp, 250);
  assert.equal(res.body.daily['2026-10-14'].xp, 50);
});

test('POST /api/progress/merge merges guest snapshot into user progress', async () => {
  const session = { userId: 'u_123' };

  // Existing server record
  await testRequest(router, {
    method: 'PUT',
    url: '/profile/u_123',
    body: { userId: 'u_123', totalXp: 100, updatedAt: '2026-10-14T08:00:00.000Z' },
    session
  });

  // Incoming guest payload
  const guestPayload = {
    profile: {
      local: { userId: 'u_123', totalXp: 150, updatedAt: '2026-10-14T10:00:00.000Z' }
    },
    lessonProgress: {
      'it:1.1': { courseId: 'it', lessonId: '1.1', state: 'completed', bestScore: 1.0, attempts: 1, updatedAt: '2026-10-14T10:00:00.000Z' }
    }
  };

  const mergeRes = await testRequest(router, {
    method: 'POST',
    url: '/merge',
    body: guestPayload,
    session
  });

  assert.equal(mergeRes.status, 200);
  assert.equal(mergeRes.body.success, true);
  assert.equal(mergeRes.body.merged.profile['u_123'].totalXp, 150);
  assert.equal(mergeRes.body.merged.lessonProgress['it:1.1'].bestScore, 1.0);

  // Verify database persisted the merged result
  const getRes = await testRequest(router, { method: 'GET', url: '/', session });
  assert.equal(getRes.body.profile['u_123'].totalXp, 150);
  assert.equal(getRes.body.lessonProgress['it:1.1'].bestScore, 1.0);
});

test('DELETE /api/progress/:collection/:id removes record', async () => {
  const session = { userId: 'u_123' };

  await testRequest(router, {
    method: 'PUT',
    url: '/position/it',
    body: { courseId: 'it', refId: '1.1', at: '2026-10-14T10:00:00.000Z' },
    session
  });

  const delRes = await testRequest(router, {
    method: 'DELETE',
    url: '/position/it',
    session
  });
  assert.equal(delRes.status, 200);
  assert.equal(delRes.body.success, true);

  const getRes = await testRequest(router, {
    method: 'GET',
    url: '/position/it',
    session
  });
  assert.equal(getRes.status, 404);
});
