const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const backendRoot = path.resolve(__dirname, '../..');
const configuredPath = process.env.CONTENT_DATABASE_FILE || './data/content.sqlite';
const sourcePath = configuredPath === ':memory:'
    ? configuredPath
    : path.resolve(backendRoot, configuredPath);
const requestedPath = process.argv[2];
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const destinationPath = requestedPath
    ? path.resolve(backendRoot, requestedPath)
    : path.join(backendRoot, 'data', 'backups', `content-${timestamp}.sqlite`);

async function backup() {
    if (sourcePath === ':memory:' || !fs.existsSync(sourcePath)) {
        throw new Error('Content database file was not found; configure CONTENT_DATABASE_FILE and run npm run db:setup from backend/content-db.');
    }
    if (sourcePath === destinationPath) throw new Error('Backup destination must differ from the content database.');

    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    const database = new Database(sourcePath, { readonly: true, fileMustExist: true });
    try {
        await database.backup(destinationPath);
    } finally {
        database.close();
    }
    console.log(`Content database backed up to ${destinationPath}`);
}

backup().catch(error => {
    console.error(`Content database backup failed: ${error.message}`);
    process.exitCode = 1;
});
