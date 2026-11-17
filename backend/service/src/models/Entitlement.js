const mongoose = require('mongoose');

function shouldUseMemory() {
    return mongoose.connection.readyState !== 1;
}

const memoryEntitlements = new Map();

const entitlementSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, 'userId is required.'],
            index: true
        },
        courseId: {
            type: String,
            required: [true, 'courseId is required.'],
            index: true
        },
        status: {
            type: String,
            required: [true, 'status is required.'],
            enum: ['active', 'expired', 'refunded'],
            default: 'active',
            index: true
        },
        provider: {
            type: String,
            required: [true, 'provider is required.']
        },
        providerPaymentId: {
            type: String,
            required: [true, 'providerPaymentId is required.'],
            unique: true,
            index: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: false,
        collection: 'entitlements'
    }
);

entitlementSchema.index({ userId: 1, courseId: 1 });

const MongooseEntitlement = mongoose.models.Entitlement || mongoose.model('Entitlement', entitlementSchema);

function matchesFilter(record, filter = {}) {
    if (!record) return false;
    for (const [key, val] of Object.entries(filter)) {
        if (val !== undefined && record[key] !== val) {
            return false;
        }
    }
    return true;
}

function cleanDoc(doc) {
    if (!doc) return null;
    const clone = { ...doc };
    delete clone.__v;
    return clone;
}

const Entitlement = {
    async findOne(filter = {}) {
        if (!shouldUseMemory()) {
            const doc = await MongooseEntitlement.findOne(filter).lean();
            return cleanDoc(doc);
        }
        for (const record of memoryEntitlements.values()) {
            if (matchesFilter(record, filter)) {
                return cleanDoc(record);
            }
        }
        return null;
    },

    async find(filter = {}) {
        if (!shouldUseMemory()) {
            const docs = await MongooseEntitlement.find(filter).lean();
            return docs.map(cleanDoc);
        }
        const results = [];
        for (const record of memoryEntitlements.values()) {
            if (matchesFilter(record, filter)) {
                results.push(cleanDoc(record));
            }
        }
        return results;
    },

    async create(data) {
        const record = {
            ...data,
            status: data.status || 'active',
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null
        };

        if (!shouldUseMemory()) {
            const doc = await MongooseEntitlement.create(record);
            return cleanDoc(doc.toObject());
        }

        const id = record.providerPaymentId || `ent_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        memoryEntitlements.set(id, { _id: id, ...record });
        return cleanDoc(memoryEntitlements.get(id));
    },

    async updateOne(filter, update) {
        if (!shouldUseMemory()) {
            return await MongooseEntitlement.updateOne(filter, update);
        }
        for (const [id, record] of memoryEntitlements.entries()) {
            if (matchesFilter(record, filter)) {
                const patch = update.$set ? update.$set : update;
                const updated = { ...record, ...patch };
                memoryEntitlements.set(id, updated);
                return { acknowledged: true, modifiedCount: 1, matchedCount: 1 };
            }
        }
        return { acknowledged: true, modifiedCount: 0, matchedCount: 0 };
    },

    async deleteMany(filter = {}) {
        if (!shouldUseMemory()) {
            return await MongooseEntitlement.deleteMany(filter);
        }
        let count = 0;
        for (const [id, record] of memoryEntitlements.entries()) {
            if (matchesFilter(record, filter)) {
                memoryEntitlements.delete(id);
                count++;
            }
        }
        return { acknowledged: true, deletedCount: count };
    },

    async hasActiveEntitlement(userId, courseId) {
        if (!userId || !courseId) return false;
        const now = new Date();

        if (!shouldUseMemory()) {
            const doc = await MongooseEntitlement.findOne({
                userId: String(userId),
                courseId: String(courseId),
                status: 'active',
                $or: [
                    { expiresAt: null },
                    { expiresAt: { $gt: now } }
                ]
            }).lean();
            return !!doc;
        }

        for (const record of memoryEntitlements.values()) {
            if (
                String(record.userId) === String(userId) &&
                String(record.courseId) === String(courseId) &&
                record.status === 'active'
            ) {
                if (!record.expiresAt || new Date(record.expiresAt) > now) {
                    return true;
                }
            }
        }
        return false;
    },

    async grantEntitlement({ userId, courseId, provider, providerPaymentId, expiresAt = null }) {
        if (!userId || !courseId || !providerPaymentId) {
            throw new Error('userId, courseId, and providerPaymentId are required.');
        }

        const existing = await this.findOne({ providerPaymentId });
        if (existing) {
            if (existing.status !== 'active') {
                await this.updateOne(
                    { providerPaymentId },
                    { $set: { status: 'active', expiresAt: expiresAt ? new Date(expiresAt) : null } }
                );
            }
            return { entitlement: await this.findOne({ providerPaymentId }), idempotent: true };
        }

        const created = await this.create({
            userId: String(userId),
            courseId: String(courseId),
            provider: String(provider || 'unknown'),
            providerPaymentId: String(providerPaymentId),
            status: 'active',
            createdAt: new Date(),
            expiresAt: expiresAt ? new Date(expiresAt) : null
        });

        return { entitlement: created, idempotent: false };
    },

    async revokeEntitlement({ providerPaymentId, status = 'refunded' }) {
        if (!providerPaymentId) throw new Error('providerPaymentId is required.');
        const validStatuses = ['refunded', 'expired'];
        const nextStatus = validStatuses.includes(status) ? status : 'refunded';

        const res = await this.updateOne(
            { providerPaymentId },
            { $set: { status: nextStatus } }
        );
        return { modifiedCount: res.modifiedCount, status: nextStatus };
    },

    // Reset for tests
    _clearMemoryStore() {
        memoryEntitlements.clear();
    }
};

module.exports = {
    Entitlement,
    MongooseEntitlement,
    memoryEntitlements
};
