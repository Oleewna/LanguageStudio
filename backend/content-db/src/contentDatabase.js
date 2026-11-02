const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const backendRoot = path.resolve(__dirname, '../..');
const configuredPath = process.env.CONTENT_DATABASE_FILE || './data/content.sqlite';
const databasePath = configuredPath === ':memory:'
    ? configuredPath
    : path.resolve(backendRoot, configuredPath);

let database;

function getContentDatabase() {
    if (database) return database;

    if (databasePath !== ':memory:' && !fs.existsSync(databasePath)) {
        const error = new Error('Content database is not initialized. Run npm run db:setup from backend/content-db.');
        error.status = 503;
        error.publicMessage = error.message;
        throw error;
    }

    database = new Database(databasePath);
    database.pragma('foreign_keys = ON');
    database.pragma('busy_timeout = 5000');

    const migrationTable = database.prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'schema_migrations'"
    ).get();
    const applied = migrationTable && database.prepare(
        'SELECT 1 AS applied FROM schema_migrations WHERE version = ?'
    ).get('002');

    if (!applied) {
        database.close();
        database = null;
        const error = new Error('Content database migrations are missing. Run npm run db:setup from backend/content-db.');
        error.status = 503;
        error.publicMessage = error.message;
        throw error;
    }

    return database;
}

function closeContentDatabase() {
    if (!database) return;
    database.close();
    database = null;
}

module.exports = { closeContentDatabase, getContentDatabase };
