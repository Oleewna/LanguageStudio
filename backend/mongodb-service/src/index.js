const {
    connectMongo,
    closeMongo,
    isMongoConnected,
    getConnection,
    mongoose
} = require('./connection');

const models = require('./models');
const services = require('./services');

module.exports = {
    // Connection
    connectMongo,
    closeMongo,
    isMongoConnected,
    getConnection,
    mongoose,

    // Models
    User: models.User,
    MongooseUser: models.MongooseUser,
    MemoryUser: models.MemoryUser,
    memoryUsers: models.memoryUsers,

    Entitlement: models.Entitlement,
    MongooseEntitlement: models.MongooseEntitlement,
    memoryEntitlements: models.memoryEntitlements,

    Profile: models.Profile,
    Daily: models.Daily,
    LessonProgress: models.LessonProgress,
    WordStats: models.WordStats,
    Position: models.Position,
    CustomWords: models.CustomWords,
    PROGRESS_MODELS: models.PROGRESS_MODELS,
    memoryStores: models.memoryStores,
    formatUserProfile: models.formatUserProfile,

    // Domain Services
    userService: services.userService,
    progressService: services.progressService,
    entitlementService: services.entitlementService,
    sessionStore: services.sessionStore,
    createMongoSessionStore: services.createMongoSessionStore
};
