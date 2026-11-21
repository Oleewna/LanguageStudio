const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = {
    get PORT() {
        return parseInt(process.env.MONGODB_SERVICE_PORT || process.env.PORT || '3008', 10);
    },
    get HOST() {
        return process.env.HOST || '127.0.0.1';
    },
    get NODE_ENV() {
        return process.env.NODE_ENV || 'development';
    },
    get MONGODB_URI() {
        return process.env.MONGODB_URI;
    }
};
