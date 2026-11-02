const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const serviceDirectory = path.resolve(__dirname, '..');
const contentDbDirectory = path.resolve(serviceDirectory, '../content-db');
const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'language-studio-content-'));
process.env.CONTENT_DATABASE_FILE = path.join(temporaryDirectory, 'content.sqlite');
const contentDbRequire = require('node:module').createRequire(
    path.join(contentDbDirectory, 'package.json')
);
fs.copyFileSync(
    path.join(contentDbDirectory, 'seeds', 'initial-content.sqlite'),
    process.env.CONTENT_DATABASE_FILE
);
const contentDb = require('language-studio-content-db');

let server;
let authServer;
let app;
let baseUrl;

before(async () => {
    authServer = http.createServer((req, res) => {
        const cookie = req.headers.cookie || '';
        const role = cookie.includes('ls_session=admin')
            ? 'admin'
            : cookie.includes('ls_session=learner')
                ? 'learner'
                : null;
        const payload = role
            ? { authenticated: true, user: { id: 'test-user', role } }
            : { authenticated: false };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(payload));
    });
    authServer.listen(0);
    await new Promise(resolve => authServer.once('listening', resolve));
    process.env.AUTH_SERVICE_URL = `http://127.0.0.1:${authServer.address().port}`;
    app = require('../src/server');
    server = app.listen(0);
    await new Promise(resolve => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    if (authServer) await new Promise((resolve, reject) => authServer.close(error => error ? reject(error) : resolve()));
    contentDb.closeContentDatabase();
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
});

test('content API serves all catalog data from the database seed', async () => {
    const indexResponse = await fetch(`${baseUrl}/api/content/course-index`);
    assert.equal(indexResponse.status, 200);
    const index = await indexResponse.json();
    assert.equal(index.default, 'it');
    assert.deepEqual(index.courses.map(course => course.id), ['it', 'es']);

    const catalogResponse = await fetch(`${baseUrl}/api/content/admin/catalog`, {
        headers: { Cookie: 'ls_session=admin' }
    });
    assert.equal(catalogResponse.status, 200);
    const catalog = await catalogResponse.json();
    assert.deepEqual(catalog.index, index);

    for (const entry of catalog.courses) {
        const courseResponse = await fetch(`${baseUrl}/api/content/courses/${entry.course.id}`);
        assert.equal(courseResponse.status, 200);
        assert.deepEqual(await courseResponse.json(), entry.course);

        for (const resource of ['vocab', 'grammar', 'exercises']) {
            const response = await fetch(`${baseUrl}/api/content/courses/${entry.course.id}/${resource}`);
            assert.equal(response.status, 200);
            assert.deepEqual(await response.json(), entry.resources[resource]);
        }

        for (const lesson of entry.lessons) {
            const response = await fetch(
                `${baseUrl}/api/content/courses/${entry.course.id}/lessons/${lesson.id}`
            );
            assert.equal(response.status, 200);
            assert.deepEqual(await response.json(), lesson.content);
        }
    }
});

test('content API returns explicit not-found responses for unknown content', async () => {
    const course = await fetch(`${baseUrl}/api/content/courses/missing-course`);
    const resource = await fetch(`${baseUrl}/api/content/courses/missing-course/vocab`);
    const lesson = await fetch(`${baseUrl}/api/content/courses/it/lessons/missing-lesson`);
    assert.equal(course.status, 404);
    assert.equal(resource.status, 404);
    assert.equal(lesson.status, 404);
});

test('admin catalog reads and writes require an administrator and preserve validation', async () => {
    const anonymous = await fetch(`${baseUrl}/api/content/admin/catalog`);
    assert.equal(anonymous.status, 401);

    const learner = await fetch(`${baseUrl}/api/content/admin/catalog`, {
        headers: { Cookie: 'ls_session=learner' }
    });
    assert.equal(learner.status, 403);

    const adminHeaders = { Cookie: 'ls_session=admin' };
    const learnerWrite = await fetch(`${baseUrl}/api/content/admin/catalog`, {
        method: 'PUT',
        headers: {
            Cookie: 'ls_session=learner',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index: {}, courses: [] })
    });
    assert.equal(learnerWrite.status, 403);

    const catalogResponse = await fetch(`${baseUrl}/api/content/admin/catalog`, {
        headers: adminHeaders
    });
    assert.equal(catalogResponse.status, 200);
    const catalog = await catalogResponse.json();
    assert.equal(catalog.courses.length, 2);

    const invalidUpdate = await fetch(`${baseUrl}/api/content/admin/catalog`, {
        method: 'PUT',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: {}, courses: [] })
    });
    assert.equal(invalidUpdate.status, 400);
    const unchangedIndex = await fetch(`${baseUrl}/api/content/course-index`);
    assert.deepEqual(await unchangedIndex.json(), catalog.index);

    const update = await fetch(`${baseUrl}/api/content/admin/catalog`, {
        method: 'PUT',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(catalog)
    });
    assert.equal(update.status, 200);
    assert.deepEqual(await update.json(), { success: true });
    assert.deepEqual(await (await fetch(`${baseUrl}/api/content/course-index`)).json(), catalog.index);

    const originalName = catalog.index.courses[0].name.en;
    catalog.index.courses[0].name.en = 'Italian editor test';
    const changedName = await fetch(`${baseUrl}/api/content/admin/catalog`, {
        method: 'PUT',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(catalog)
    });
    assert.equal(changedName.status, 200);
    const changedIndex = await (await fetch(`${baseUrl}/api/content/course-index`)).json();
    assert.equal(changedIndex.courses[0].name.en, 'Italian editor test');

    catalog.index.courses[0].name.en = originalName;
    catalog.index.default = 'es';
    const changedDefault = await fetch(`${baseUrl}/api/content/admin/catalog`, {
        method: 'PUT',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(catalog)
    });
    assert.equal(changedDefault.status, 200);
    assert.equal(
        (await (await fetch(`${baseUrl}/api/content/course-index`)).json()).default,
        'es'
    );

    catalog.index.default = 'it';
    const restoreDefault = await fetch(`${baseUrl}/api/content/admin/catalog`, {
        method: 'PUT',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(catalog)
    });
    assert.equal(restoreDefault.status, 200);
});

test('database seed has valid relational data and can be replaced without duplication', async () => {
    const catalog = await (await fetch(`${baseUrl}/api/content/admin/catalog`, {
        headers: { Cookie: 'ls_session=admin' }
    })).json();
    for (let attempt = 0; attempt < 2; attempt += 1) {
        const response = await fetch(`${baseUrl}/api/content/admin/catalog`, {
            method: 'PUT',
            headers: { Cookie: 'ls_session=admin', 'Content-Type': 'application/json' },
            body: JSON.stringify(catalog)
        });
        assert.equal(response.status, 200);
    }

    const Database = contentDbRequire('better-sqlite3');
    const database = new Database(process.env.CONTENT_DATABASE_FILE);
    try {
        assert.equal(database.prepare('SELECT COUNT(*) AS count FROM courses').get().count, 2);
        assert.equal(database.prepare('SELECT COUNT(*) AS count FROM lessons').get().count, 4);
        assert.equal(database.prepare('SELECT COUNT(*) AS count FROM vocabulary').get().count, 28);
        assert.equal(database.prepare('SELECT COUNT(*) AS count FROM exercises').get().count, 29);
        assert.equal(database.pragma('integrity_check')[0].integrity_check, 'ok');
        assert.equal(database.pragma('foreign_key_check').length, 0);
    } finally {
        database.close();
    }
});
