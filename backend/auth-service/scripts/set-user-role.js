const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const userStore = require('../src/utils/userStore');
const [emailArgument, role] = process.argv.slice(2);
const email = typeof emailArgument === 'string' ? emailArgument.trim().toLowerCase() : '';

if (!email || !['admin', 'learner'].includes(role)) {
    console.error('Usage: npm run user:role -- <email> <admin|learner>');
    process.exitCode = 1;
} else if (!userStore.setRoleByEmail(email, role)) {
    console.error(`No account found for ${email}.`);
    process.exitCode = 1;
} else {
    console.log(`Updated ${email} role to ${role}.`);
}
