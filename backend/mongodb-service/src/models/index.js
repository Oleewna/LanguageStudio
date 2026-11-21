const User = require('./User');
const Progress = require('./Progress');
const Entitlement = require('./Entitlement');

module.exports = {
    User: User.User || User,
    MongooseUser: User.MongooseUser,
    MemoryUser: User.MemoryUser,
    memoryUsers: User.memoryUsers,

    Profile: Progress.Profile,
    Daily: Progress.Daily,
    LessonProgress: Progress.LessonProgress,
    WordStats: Progress.WordStats,
    Position: Progress.Position,
    CustomWords: Progress.CustomWords,
    PROGRESS_MODELS: Progress.PROGRESS_MODELS,
    memoryStores: Progress.memoryStores,
    formatUserProfile: Progress.formatUserProfile,

    Entitlement: Entitlement.Entitlement || Entitlement,
    MongooseEntitlement: Entitlement.MongooseEntitlement,
    memoryEntitlements: Entitlement.memoryEntitlements
};
