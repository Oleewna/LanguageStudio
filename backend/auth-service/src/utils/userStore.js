const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

function writeUsers(users) {
    fs.mkdirSync(path.dirname(usersFile), { recursive: true });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), { mode: 0o600 });
}

function findByEmail(email) {
    return readUsers().find(user => user.email === email) || null;
}

function findById(id) {
    return readUsers().find(user => user.id === id) || null;
}

/**
 * Find an existing user by googleId or email, or create a new one.
 * If found by email but missing googleId, links the googleId to that user.
 * Returns the user object (without password fields).
 */
function findOrCreateByGoogle(googleId, profile) {
    const users = readUsers();

    // Try to find by googleId first
    let user = users.find(u => u.googleId === googleId) || null;

    if (!user && profile.email) {
        // Try to find by email (account pre-existed without Google)
        user = users.find(u => u.email === profile.email) || null;
        if (user && !user.googleId) {
            // Link googleId to existing account
            user.googleId = googleId;
            writeUsers(users);
        }
    }

    if (!user) {
        // Create a brand-new user
        user = {
            id: crypto.randomUUID(),
            name: profile.name || profile.email.split('@')[0],
            email: profile.email,
            googleId,
            role: 'learner',
            createdAt: new Date().toISOString()
        };
        users.push(user);
        writeUsers(users);
    }

    return user;
}

function setRoleByEmail(email, role) {
    if (!['admin', 'learner'].includes(role)) {
        throw new Error('Role must be either admin or learner.');
    }

    const users = readUsers();
    const user = users.find(existingUser => existingUser.email === email);
    if (!user) return false;
    user.role = role;
    writeUsers(users);
    return true;
}

module.exports = { findByEmail, findById, findOrCreateByGoogle, setRoleByEmail };
