const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

const {
    connectMongo,
    closeMongo,
    isMongoConnected,
    User,
    Entitlement,
    PROGRESS_MODELS,
    userService,
    progressService,
    entitlementService,
    createMongoSessionStore
} = require('../src/index');

describe('MongoDB Service & Decentralized Functions', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Entitlement.deleteMany({});
        await PROGRESS_MODELS.profile.deleteMany({});
        await PROGRESS_MODELS.daily.deleteMany({});
        await PROGRESS_MODELS.lessonProgress.deleteMany({});
    });

    test('exports database connection utilities', () => {
        assert.equal(typeof connectMongo, 'function');
        assert.equal(typeof closeMongo, 'function');
        assert.equal(typeof isMongoConnected, 'function');
    });

    test('userService creates user, hashes password, and verifies credentials', async () => {
        const user = await userService.createUser({
            email: 'test@example.com',
            password: 'SecurePassword123!',
            displayName: 'Test User'
        });

        assert.ok(user);
        assert.equal(user.email, 'test@example.com');
        assert.equal(user.displayName, 'Test User');

        const found = await userService.getUserByEmail('test@example.com');
        assert.ok(found);
        assert.equal(found.displayName, 'Test User');

        const valid = await userService.verifyUserPassword(found, 'SecurePassword123!');
        assert.equal(valid, true);

        const invalid = await userService.verifyUserPassword(found, 'WrongPassword');
        assert.equal(invalid, false);
    });

    test('userService handles Google OAuth user creation and linking', async () => {
        const googleUser = await userService.findOrCreateGoogleUser('google-uid-12345', {
            email: 'google@example.com',
            name: 'Google Learner'
        });

        assert.ok(googleUser);
        assert.equal(googleUser.googleId, 'google-uid-12345');
        assert.equal(googleUser.email, 'google@example.com');
        assert.equal(googleUser.displayName, 'Google Learner');
        assert.equal(googleUser.emailVerified, true);
    });

    test('progressService manages user progress records and returns full snapshot', async () => {
        const userId = 'user_abc_123';

        await progressService.upsertCollectionRecord('lessonProgress', {
            userId,
            courseId: 'it',
            lessonId: 'lesson-1'
        }, {
            state: 'completed',
            bestScore: 95
        });

        const record = await progressService.getCollectionRecord('lessonProgress', {
            userId,
            courseId: 'it',
            lessonId: 'lesson-1'
        });

        assert.ok(record);
        assert.equal(record.state, 'completed');
        assert.equal(record.bestScore, 95);

        const snapshot = await progressService.getUserProgressSnapshot(userId);
        assert.ok(snapshot);
        assert.ok(Array.isArray(snapshot.lessonProgress));
        assert.equal(snapshot.lessonProgress.length, 1);
        assert.equal(snapshot.lessonProgress[0].lessonId, 'lesson-1');
    });

    test('entitlementService grants, verifies, and revokes course access', async () => {
        const userId = 'learner-777';
        const courseId = 'it';
        const paymentId = 'pay_order_999';

        const hasAccessBefore = await entitlementService.checkEntitlement(userId, courseId);
        assert.equal(hasAccessBefore, false);

        await entitlementService.grantEntitlement({
            userId,
            courseId,
            selectedPaths: ['travel'],
            provider: 'mock',
            providerPaymentId: paymentId
        });

        const hasAccessAfter = await entitlementService.checkEntitlement(userId, courseId, 'travel');
        assert.equal(hasAccessAfter, true);

        const hasDifferentPath = await entitlementService.checkEntitlement(userId, courseId, 'business');
        assert.equal(hasDifferentPath, false);

        await entitlementService.revokeEntitlement({ providerPaymentId: paymentId });
        const hasAccessRevoked = await entitlementService.checkEntitlement(userId, courseId, 'travel');
        assert.equal(hasAccessRevoked, false);
    });

    test('createMongoSessionStore is exported as a function', () => {
        assert.equal(typeof createMongoSessionStore, 'function');
    });
});
