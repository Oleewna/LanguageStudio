const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const serviceDirectory = path.resolve(__dirname, '..');
const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'language-studio-vocab-'));
process.env.VOCAB_DB_PATH = path.join(temporaryDirectory, 'vocab.db');
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
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });
});

test('vocab API exposes the shared catalog and search routes', async () => {
  const lists = await fetch(`${baseUrl}/api/vocab?course=it`);
  const search = await fetch(`${baseUrl}/api/vocab/search?course=it&q=ciao`);
  const ids = await fetch(`${baseUrl}/api/vocab?course=it&ids=it-001`);

  assert.equal(lists.status, 200);
  assert.equal(search.status, 200);
  assert.equal(ids.status, 200);

  const listBody = await lists.json();
  const searchBody = await search.json();
  const idsBody = await ids.json();

  assert.ok(Array.isArray(listBody));
  assert.ok(Array.isArray(searchBody));
  assert.ok(Array.isArray(idsBody));
});

test('vocab API accepts the human-readable course name as an alias for the language code', async () => {
  const response = await fetch(`${baseUrl}/api/vocab/search?course=italian&q=ciao&limit=5`);

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(Array.isArray(body));
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
