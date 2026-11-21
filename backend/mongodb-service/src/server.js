let express;
try {
    express = require('express');
} catch (err) {
    try {
        express = require('../../service/node_modules/express');
    } catch {
        throw err;
    }
}

const config = require('../config/env');
const { connectMongo, isMongoConnected } = require('./connection');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'mongodb',
        connected: isMongoConnected()
    });
});

const port = Number(config.PORT);
if (require.main === module) {
    if (config.MONGODB_URI && config.NODE_ENV !== 'test') {
        connectMongo().catch(err => {
            console.warn('MongoDB Atlas connection deferred:', err.message);
        });
    }
    app.listen(port, config.HOST, () => {
        console.log(`LanguageStudio MongoDB service running on http://${config.HOST}:${port}`);
    });
}

module.exports = app;
