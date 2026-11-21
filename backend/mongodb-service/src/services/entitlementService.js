const { Entitlement } = require('../models/Entitlement');

const entitlementService = {
    async checkEntitlement(userId, courseId, pathId = null) {
        return await Entitlement.hasEntitlement(userId, courseId, pathId);
    },

    async getUserEntitlements(userId, courseId = null) {
        if (!userId) return [];
        const filter = { userId: String(userId), status: 'active' };
        if (courseId) {
            filter.courseId = String(courseId);
        }
        return await Entitlement.find(filter);
    },

    async grantEntitlement(params) {
        return await Entitlement.grantEntitlement(params);
    },

    async revokeEntitlement(params) {
        return await Entitlement.revokeEntitlement(params);
    },

    async deleteMany(filter = {}) {
        return await Entitlement.deleteMany(filter);
    }
};

module.exports = entitlementService;
