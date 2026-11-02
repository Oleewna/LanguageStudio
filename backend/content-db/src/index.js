const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
    ...require('./contentValidator'),
    ...require('./contentRepository'),
    closeContentDatabase: require('./contentDatabase').closeContentDatabase,
    replaceAllContent: require('./contentWriter').replaceAllContent
};
