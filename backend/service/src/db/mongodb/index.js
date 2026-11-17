const mongoose = require('mongoose');

let isConnecting = false;

async function connectMongo(customUri) {
    const uri = customUri || process.env.MONGODB_URI;
    if (!uri) {
        console.warn('MongoDB URI not configured. Set MONGODB_URI in your environment or .env file.');
        return null;
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (isConnecting) {
        return new Promise((resolve, reject) => {
            mongoose.connection.once('connected', () => resolve(mongoose.connection));
            mongoose.connection.once('error', (err) => reject(err));
        });
    }

    try {
        isConnecting = true;
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
        console.log('Connected to MongoDB Atlas successfully.');
        return mongoose.connection;
    } catch (error) {
        console.error('Failed to connect to MongoDB Atlas:', error.message);
        throw error;
    } finally {
        isConnecting = false;
    }
}

async function closeMongo() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
}

function isMongoConnected() {
    return mongoose.connection.readyState === 1;
}

module.exports = {
    connectMongo,
    closeMongo,
    isMongoConnected
};
