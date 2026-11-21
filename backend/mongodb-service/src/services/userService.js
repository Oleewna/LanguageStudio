const User = require('../models/User');

const userService = {
    async getUserById(id) {
        if (!id) return null;
        return await User.findById(id);
    },

    async getUserByEmail(email) {
        if (!email) return null;
        return await User.findOne({ email: String(email).toLowerCase().trim() });
    },

    async getUserByGoogleId(googleId) {
        if (!googleId) return null;
        return await User.findOne({ googleId });
    },

    async findUser(query = {}) {
        return await User.findOne(query);
    },

    async createUser({ email, password, displayName, role = 'learner' }) {
        if (!email) throw new Error('Email is required.');
        if (!displayName) throw new Error('Display name is required.');
        
        let passwordHash = null;
        if (password) {
            passwordHash = await User.hashPassword(password);
        }

        const user = new User({
            email: String(email).toLowerCase().trim(),
            passwordHash,
            displayName: String(displayName).trim(),
            role,
            emailVerified: false
        });

        await user.save();
        return user;
    },

    async verifyUserPassword(user, plainPassword) {
        if (!user || typeof user.verifyPassword !== 'function') return false;
        return await user.verifyPassword(plainPassword);
    },

    async findOrCreateGoogleUser(googleId, profile = {}) {
        return await User.findOrCreateByGoogle(googleId, profile);
    },

    async updateUserProfile(userId, profileData = {}) {
        const user = await User.findById(userId);
        if (!user) return null;
        user.profile = {
            ...(user.profile || {}),
            ...profileData,
            updatedAt: new Date().toISOString()
        };
        await user.save();
        return user.profile;
    },

    async setPasswordResetToken(email, token, expires) {
        const user = await this.getUserByEmail(email);
        if (!user) return null;
        user.passwordResetToken = token;
        user.passwordResetExpires = expires;
        await user.save();
        return user;
    },

    async resetPassword(token, newPassword) {
        if (!token || !newPassword) throw new Error('Token and new password are required.');
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() }
        });
        if (!user) return null;

        user.passwordHash = await User.hashPassword(newPassword);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();
        return user;
    },

    async setEmailVerificationToken(userId, token, expires) {
        const user = await this.getUserById(userId);
        if (!user) return null;
        user.emailVerificationToken = token;
        user.emailVerificationExpires = expires;
        await user.save();
        return user;
    },

    async verifyEmail(token) {
        if (!token) throw new Error('Verification token is required.');
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() }
        });
        if (!user) return null;

        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();
        return user;
    },

    async deleteMany(query = {}) {
        return await User.deleteMany(query);
    }
};

module.exports = userService;
