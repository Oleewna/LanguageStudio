const User = require('../../../mongodb-service/src/models/User');

module.exports = User;
module.exports.User = User.User || User;
module.exports.MongooseUser = User.MongooseUser;
module.exports.MemoryUser = User.MemoryUser;
module.exports.memoryUsers = User.memoryUsers;
