const { PROGRESS_MODELS } = require('../models/Progress');

const progressService = {
    async getUserProgressSnapshot(userId) {
        if (!userId) {
            throw new Error('userId is required');
        }
        const filter = { userId: String(userId) };
        const snapshot = {};

        for (const [coll, model] of Object.entries(PROGRESS_MODELS)) {
            const records = await model.find(filter);
            if (coll === 'profile') {
                snapshot[coll] = records && records[0] ? records[0] : null;
            } else {
                snapshot[coll] = records || [];
            }
        }
        return snapshot;
    },

    async getCollectionRecords(collectionName, filter = {}) {
        const model = PROGRESS_MODELS[collectionName];
        if (!model) {
            throw new Error(`Invalid progress collection: ${collectionName}`);
        }
        return await model.find(filter);
    },

    async getCollectionRecord(collectionName, filter = {}) {
        const model = PROGRESS_MODELS[collectionName];
        if (!model) {
            throw new Error(`Invalid progress collection: ${collectionName}`);
        }
        return await model.findOne(filter);
    },

    async upsertCollectionRecord(collectionName, filter, updateData) {
        const model = PROGRESS_MODELS[collectionName];
        if (!model) {
            throw new Error(`Invalid progress collection: ${collectionName}`);
        }
        return await model.upsert(filter, updateData);
    },

    async deleteCollectionRecord(collectionName, filter = {}) {
        const model = PROGRESS_MODELS[collectionName];
        if (!model) {
            throw new Error(`Invalid progress collection: ${collectionName}`);
        }
        return await model.deleteOne(filter);
    },

    async resetUserProgress(userId) {
        if (!userId) {
            throw new Error('userId is required');
        }
        const filter = { userId: String(userId) };
        const results = {};
        for (const [coll, model] of Object.entries(PROGRESS_MODELS)) {
            results[coll] = await model.deleteMany(filter);
        }
        return results;
    }
};

module.exports = progressService;
