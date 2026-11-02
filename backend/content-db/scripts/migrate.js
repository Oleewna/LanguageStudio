const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

require('../src/migrate').migrate();
