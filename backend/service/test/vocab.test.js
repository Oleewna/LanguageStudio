const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const serviceDirectory = path.resolve(__dirname, '..');
const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'language-studio-vocab-'));
process.env.VOCAB_DB_PATH = path.join(temporaryDirectory, 'vocab.db');
process.env.CONTENT_DATABASE_FILE = path.join(temporaryDirectory, 'content.sqlite');
const contentDbDirectory = path.resolve(serviceDirectory, '../content-db');
fs.copyFileSync(
  path.join(contentDbDirectory, 'seeds', 'initial-content.sqlite'),
  process.env.CONTENT_DATABASE_FILE
);
const contentDb = require('language-studio-content-db');
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
  contentDb.closeContentDatabase();
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });
});

test('vocab API exposes lesson-derived catalog entries and search routes', async () => {
  const lists = await fetch(`${baseUrl}/api/vocab?course=it`);
  const contentResource = await fetch(`${baseUrl}/api/content/courses/it/vocab`);
  const search = await fetch(`${baseUrl}/api/vocab/search?course=it&q=ciao`);

  assert.equal(lists.status, 200);
  assert.equal(contentResource.status, 200);
  assert.equal(search.status, 200);

  const listBody = await lists.json();
  assert.deepEqual(await contentResource.json(), listBody);
  const searchBody = await search.json();

  assert.deepEqual(
    listBody.map((word) => word.word.toLowerCase()).sort(),
    ['ciao', 'come stai?', 'bene, grazie!', 'buongiorno!', 'buonasera!', 'come ti chiami?', 'mi chiamo...', 'e tu?']
      .map((word) => word.toLowerCase())
      .sort()
  );
  assert.ok(searchBody.some((word) => word.word.toLowerCase() === 'ciao'));
  assert.ok(listBody.every((word) => word.lessons.length > 0));

  const ciao = listBody.find((word) => word.word.toLowerCase() === 'ciao');
  const ids = await fetch(`${baseUrl}/api/vocab?course=it&ids=${encodeURIComponent(ciao.id)}`);
  assert.equal(ids.status, 200);
  assert.deepEqual(await ids.json(), [ciao]);

  const lessonWords = await fetch(`${baseUrl}/api/vocab/by-lesson?course=it&lesson=communication-basics-1`);
  assert.equal(lessonWords.status, 200);
  assert.ok((await lessonWords.json()).every((word) => word.lessons.includes('communication-basics-1')));
});

test('vocab API accepts course aliases and serves vocabulary from that course lesson content', async () => {
  const response = await fetch(`${baseUrl}/api/vocab/search?course=italian&q=ciao&limit=5`);
  const spanish = await fetch(`${baseUrl}/api/vocab?course=es`);

  assert.equal(response.status, 200);
  assert.equal(spanish.status, 200);
  const body = await response.json();
  const spanishWords = await spanish.json();
  assert.ok(Array.isArray(body));
  assert.deepEqual(
    spanishWords.map((word) => word.word.toLowerCase()).sort(),
    ['hola', '¿cómo estás?', 'soy', 'mucho gusto'].sort()
  );
});

test('database-backed vocab layer exposes user words and examples endpoints without relying on the external API for core data', async () => {
  const db = require('../src/db/init').getDb();
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('vocab_words', 'user_words', 'custom_words', 'word_examples_cache')").all().map((row) => row.name);
  assert.deepEqual(tables.sort(), ['custom_words', 'user_words', 'vocab_words', 'word_examples_cache']);

  const userWords = await fetch(`${baseUrl}/api/user-words?course=it`);
  const examples = await fetch(`${baseUrl}/api/examples?word=ciao`);

  assert.equal(userWords.status, 200);
  assert.equal(examples.status, 200);
  assert.ok(Array.isArray(await userWords.json()));
  assert.ok(Array.isArray(await examples.json()));
});
