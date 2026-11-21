const { mongoose } = require('../connection');
const { User } = require('./User');

function shouldUseMemory() {
    return !mongoose.connection || mongoose.connection.readyState !== 1;
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
        selectedPaths: {
            type: [String],
            default: []
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
            selectedPaths: Array.isArray(data.selectedPaths) ? data.selectedPaths : [],
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

    async hasEntitlement(userId, courseId, pathId = null) {
        if (!userId || !courseId) return false;
        try {
            const user = await User.findById(userId);
            if (user && user.role === 'admin') {
                return true;
            }
        } catch (e) {
            // Ignore user lookup error and fallback to entitlement records
        }
        const now = new Date();

        let docs = [];
        if (!shouldUseMemory()) {
            docs = await MongooseEntitlement.find({
                userId: String(userId),
                courseId: String(courseId),
                status: 'active',
                $or: [
                    { expiresAt: null },
                    { expiresAt: { $gt: now } }
                ]
            }).lean();
        } else {
            for (const record of memoryEntitlements.values()) {
                if (
                    String(record.userId) === String(userId) &&
                    String(record.courseId) === String(courseId) &&
                    record.status === 'active'
                ) {
                    if (!record.expiresAt || new Date(record.expiresAt) > now) {
                        docs.push(record);
                    }
                }
            }
        }

        if (!docs || docs.length === 0) return false;

        // If no specific pathId was requested, having any active entitlement for this course returns true
        if (!pathId) return true;

        const normalizedPathId = String(pathId).trim().toLowerCase();

        for (const doc of docs) {
            const selected = Array.isArray(doc.selectedPaths) ? doc.selectedPaths : [];
            // If selectedPaths is empty or contains wildcard, grants all paths in course
            if (selected.length === 0 || selected.includes('*') || selected.includes(courseId)) {
                return true;
            }
            const match = selected.some(p => {
                const norm = String(p).trim().toLowerCase();
                if (norm === normalizedPathId || norm === '*') return true;
                if (normalizedPathId.endsWith(`-${norm}`) || norm.endsWith(`-${normalizedPathId}`)) return true;
                const strippedDoc = norm.replace(/^[a-z]+-/, '');
                const strippedReq = normalizedPathId.replace(/^[a-z]+-/, '');
                return strippedDoc === strippedReq;
            });
            if (match) return true;
        }

        return false;
    },

    async hasActiveEntitlement(userId, courseId, pathId = null) {
        return this.hasEntitlement(userId, courseId, pathId);
    },

    async grantEntitlement({ userId, courseId, selectedPaths = [], provider, providerPaymentId, expiresAt = null }) {
        if (!userId || !courseId || !providerPaymentId) {
            throw new Error('userId, courseId, and providerPaymentId are required.');
        }

        const normalizedPaths = Array.isArray(selectedPaths)
            ? selectedPaths.filter(p => typeof p === 'string' && p.trim()).map(p => p.trim())
            : [];

        const existing = await this.findOne({ providerPaymentId });
        if (existing) {
            const updates = {
                status: 'active',
                expiresAt: expiresAt ? new Date(expiresAt) : null
            };
            if (normalizedPaths.length > 0) {
                const combined = Array.from(new Set([
                    ...(Array.isArray(existing.selectedPaths) ? existing.selectedPaths : []),
                    ...normalizedPaths
                ]));
                updates.selectedPaths = combined;
            }
            await this.updateOne(
                { providerPaymentId },
                { $set: updates }
            );
            return { entitlement: await this.findOne({ providerPaymentId }), idempotent: true };
        }

        const created = await this.create({
            userId: String(userId),
            courseId: String(courseId),
            selectedPaths: normalizedPaths,
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
