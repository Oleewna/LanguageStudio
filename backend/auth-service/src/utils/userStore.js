const fs = require('fs');
const path = require('path');

const configuredPath = process.env.AUTH_USERS_FILE || './data/users.json';
const usersFile = path.resolve(__dirname, '../../', configuredPath);

function readUsers() {
    try {
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        if (!Array.isArray(users)) throw new Error('User data must be an array.');
        return users;
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

function findByEmail(email) {
    return readUsers().find(user => user.email === email) || null;
}

function findById(id) {
    return readUsers().find(user => user.id === id) || null;
}

function create(user) {
    const users = readUsers();
    if (users.some(existingUser => existingUser.email === user.email)) return false;
    fs.mkdirSync(path.dirname(usersFile), { recursive: true });
    fs.writeFileSync(usersFile, JSON.stringify([...users, user], null, 2), { mode: 0o600 });
    return true;
}

function setRoleByEmail(email, role) {
    if (!['admin', 'learner'].includes(role)) {
        throw new Error('Role must be either admin or learner.');
    }

    const users = readUsers();
    const user = users.find(existingUser => existingUser.email === email);
    if (!user) return false;
    user.role = role;
    fs.mkdirSync(path.dirname(usersFile), { recursive: true });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), { mode: 0o600 });
    return true;
}

module.exports = { create, findByEmail, findById, setRoleByEmail };
