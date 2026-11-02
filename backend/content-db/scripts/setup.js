const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const backendRoot = path.resolve(__dirname, '../..');
const configuredPath = process.env.CONTENT_DATABASE_FILE || './data/content.sqlite';
if (configuredPath === ':memory:') {
    throw new Error('db:setup requires a persistent CONTENT_DATABASE_FILE path.');
}

const databasePath = path.resolve(backendRoot, configuredPath);
const seedPath = path.resolve(__dirname, '../seeds/initial-content.sqlite');

if (!fs.existsSync(databasePath)) {
    if (!fs.existsSync(seedPath)) {
        throw new Error(`Initial content database seed was not found: ${seedPath}`);
    }
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    fs.copyFileSync(seedPath, databasePath);
    console.log(`Created content database from ${path.relative(backendRoot, seedPath)}.`);
}

require('../src/migrate').migrate();
