const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { after, before, test } = require('node:test');
const { closeDatabase } = require('../src/db/init');

let server;
let baseUrl;

before(async () => {
    const app = require('../src/server');
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    if (server) {
        await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    }
    closeDatabase();
});

test('GET /api/courses and /api/v1/courses serve course metadata and lesson details', async () => {
    // 1. Course index catalog
    for (const prefix of ['/api/courses', '/api/v1/courses']) {
        const indexRes = await fetch(`${baseUrl}${prefix}`);
        assert.equal(indexRes.status, 200);
        const indexData = await indexRes.json();
        assert.equal(indexData.default, 'it');
        assert.ok(Array.isArray(indexData.courses));
        assert.ok(indexData.courses.some(c => c.id === 'it'));
        assert.ok(indexData.courses.some(c => c.id === 'es'));

        // 2. Course metadata by path parameter
        const courseRes = await fetch(`${baseUrl}${prefix}/it`);
        assert.equal(courseRes.status, 200);
        const courseData = await courseRes.json();
        assert.equal(courseData.id, 'it');
        assert.equal(courseData.target?.code, 'it');
        assert.ok(Array.isArray(courseData.paths));

        // 3. Course metadata by query parameter
        const courseQueryRes = await fetch(`${baseUrl}${prefix}?course=it`);
        assert.equal(courseQueryRes.status, 200);
        const courseQueryData = await courseQueryRes.json();
        assert.equal(courseQueryData.id, 'it');

        // 4. Free lesson details
        const lessonRes = await fetch(`${baseUrl}${prefix}/it/lessons/communication-basics-1`);
        assert.equal(lessonRes.status, 200);
        const lessonData = await lessonRes.json();
        assert.equal(lessonData.id, 'communication-basics-1');
        assert.equal(lessonData.access, 'free');
        assert.ok(Array.isArray(lessonData.blocks) || Array.isArray(lessonData.sections) || Array.isArray(lessonData.steps));
    }

    // 5. Unknown course returns 404
    const notFoundCourse = await fetch(`${baseUrl}/api/courses/non-existent-course`);
    assert.equal(notFoundCourse.status, 404);

    // 6. Paid lesson requires authentication (401)
    const paidLesson = await fetch(`${baseUrl}/api/courses/it/lessons/italian-reading-2`);
    assert.equal(paidLesson.status, 401);
});

test('GET /api/vocab?course=it returns vocabulary from courses/it/vocab.json', async () => {
    const itVocabFile = path.resolve(__dirname, '../../../courses/it/vocab.json');
    const expectedVocab = JSON.parse(fs.readFileSync(itVocabFile, 'utf8'));

    const res = await fetch(`${baseUrl}/api/vocab?course=it`);
    assert.equal(res.status, 200);
    const data = await res.json();

    assert.ok(Array.isArray(data));
    assert.equal(data.length, expectedVocab.length);
    assert.equal(data[0].id, expectedVocab[0].id);
    assert.ok(data.some(w => (w.word || w.text || '').toLowerCase() === 'ciao'));

    // Filter by ids
    const sampleWord = data.find(w => (w.word || w.text || '').toLowerCase() === 'ciao');
    assert.ok(sampleWord);
    const idsRes = await fetch(`${baseUrl}/api/vocab?course=it&ids=${encodeURIComponent(sampleWord.id)}`);
    assert.equal(idsRes.status, 200);
    const idsData = await idsRes.json();
    assert.deepEqual(idsData, [sampleWord]);

    // Missing course query param returns 400
    const missingRes = await fetch(`${baseUrl}/api/vocab`);
    assert.equal(missingRes.status, 400);

    // Unknown course returns 400
    const unknownRes = await fetch(`${baseUrl}/api/vocab?course=unknown_lang`);
    assert.equal(unknownRes.status, 400);
});

test('GET /api/vocab/search searches words by prefix/match', async () => {
    const searchRes = await fetch(`${baseUrl}/api/vocab/search?course=it&q=ciao`);
    assert.equal(searchRes.status, 200);
    const searchData = await searchRes.json();

    assert.ok(Array.isArray(searchData));
    assert.ok(searchData.length > 0);
    assert.ok(searchData.some(w => (w.word || w.text || '').toLowerCase().startsWith('ciao')));

    // Search with course alias 'italian'
    const aliasRes = await fetch(`${baseUrl}/api/vocab/search?course=italian&q=ciao&limit=5`);
    assert.equal(aliasRes.status, 200);
    const aliasData = await aliasRes.json();
    assert.ok(Array.isArray(aliasData));
    assert.ok(aliasData.length > 0);
    assert.ok(aliasData.some(w => (w.word || w.text || '').toLowerCase() === 'ciao'));

    // Empty query returns empty array
    const emptyQueryRes = await fetch(`${baseUrl}/api/vocab/search?course=it&q=`);
    assert.equal(emptyQueryRes.status, 200);
    assert.deepEqual(await emptyQueryRes.json(), []);

    // Non-matching query returns empty array
    const noMatchRes = await fetch(`${baseUrl}/api/vocab/search?course=it&q=xyznonexistentword12345`);
    assert.equal(noMatchRes.status, 200);
    assert.deepEqual(await noMatchRes.json(), []);
});
