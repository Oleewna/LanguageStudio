const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const backendRoot = path.resolve(__dirname, '../..');
const configuredPath = process.env.CONTENT_DATABASE_FILE || './data/content.sqlite';
const databasePath = configuredPath === ':memory:'
    ? configuredPath
    : path.resolve(backendRoot, configuredPath);
const migrationsDirectory = path.resolve(__dirname, '../migrations');

function migrate() {
    if (databasePath !== ':memory:') {
        fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    }

    const database = new Database(databasePath);
    database.pragma('foreign_keys = ON');
    database.pragma('busy_timeout = 5000');

    try {
        const files = fs.readdirSync(migrationsDirectory)
            .filter(file => /^\d+_[a-z0-9_-]+\.sql$/i.test(file))
            .sort();

        for (const file of files) {
            const version = file.slice(0, file.indexOf('_'));
            const alreadyApplied = database.prepare(
                "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'schema_migrations'"
            ).get() && database.prepare(
                'SELECT 1 AS applied FROM schema_migrations WHERE version = ?'
            ).get(version);

            if (alreadyApplied) continue;

            const sql = fs.readFileSync(path.join(migrationsDirectory, file), 'utf8');
            database.transaction(() => {
                database.exec(sql);
                database.prepare(
                    'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)'
                ).run(version, new Date().toISOString());
            })();
            console.log(`Applied database migration ${file}`);
        }
    } finally {
        database.close();
    }
}

module.exports = { migrate };
