const mongoose = require('mongoose');
const argon2 = require('argon2');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required.'],
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: [254, 'Email cannot exceed 254 characters.'],
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address.']
        },
        passwordHash: {
            type: String,
            required: function () {
                return !this.googleId;
            }
        },
        displayName: {
            type: String,
            required: [true, 'Display name is required.'],
            trim: true,
            minlength: [1, 'Display name must be at least 1 character long.'],
            maxlength: [80, 'Display name cannot exceed 80 characters.']
        },
        role: {
            type: String,
            enum: ['learner', 'admin'],
            default: 'learner'
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        googleId: {
            type: String,
            sparse: true,
            unique: true
        },
        emailVerificationToken: {
            type: String,
            default: null
        },
        emailVerificationExpires: {
            type: Date,
            default: null
        },
        passwordResetToken: {
            type: String,
            default: null
        },
        passwordResetExpires: {
            type: Date,
            default: null
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        profile: {
            timezone: { type: String, default: 'UTC' },
            sourceLanguage: { type: String, default: 'device' },
            activeCourseId: { type: String, default: '' },
            dailyGoalXp: { type: Number, default: 50 },
            effectsEnabled: { type: Boolean, default: true },
            totalXp: { type: Number, default: 0 },
            lastCelebratedLevel: { type: Number, default: 0 },
            schemaVersion: { type: Number, default: 1 },
            createdAt: { type: String, default: () => new Date().toISOString() },
            updatedAt: { type: String, default: () => new Date().toISOString() }
        }
    },
    {
        timestamps: false
    }
);

userSchema.methods.verifyPassword = async function (plainPassword) {
    if (!this.passwordHash) return false;
    try {
        return await argon2.verify(this.passwordHash, plainPassword);
    } catch {
        return false;
    }
};

userSchema.methods.toPublicJSON = function () {
    return {
        id: this._id.toString(),
        email: this.email,
        name: this.displayName,
        displayName: this.displayName,
        role: this.role || 'learner',
        emailVerified: Boolean(this.emailVerified),
        createdAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
        profile: this.profile || {}
    };
};

userSchema.statics.hashPassword = async function (plainPassword) {
    return await argon2.hash(plainPassword, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 3,
        parallelism: 1
    });
};

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

// Memory fallback store for offline development and fast isolated test suites
const memoryUsers = new Map();

class MemoryUser {
    constructor(data = {}) {
        this._id = data._id || crypto.randomUUID();
        this.email = data.email ? String(data.email).toLowerCase().trim() : '';
        this.passwordHash = data.passwordHash || null;
        this.displayName = data.displayName || '';
        this.role = data.role || 'learner';
        this.emailVerified = Boolean(data.emailVerified);
        this.googleId = data.googleId || null;
        this.emailVerificationToken = data.emailVerificationToken || null;
        this.emailVerificationExpires = data.emailVerificationExpires || null;
        this.passwordResetToken = data.passwordResetToken || null;
        this.passwordResetExpires = data.passwordResetExpires || null;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.profile = data.profile || {
            timezone: 'UTC',
            sourceLanguage: 'device',
            activeCourseId: '',
            dailyGoalXp: 50,
            effectsEnabled: true,
            totalXp: 0,
            lastCelebratedLevel: 0,
            schemaVersion: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    async save() {
        memoryUsers.set(this._id.toString(), this);
        return this;
    }

    async verifyPassword(plainPassword) {
        if (!this.passwordHash) return false;
        try {
            return await argon2.verify(this.passwordHash, plainPassword);
        } catch {
            return false;
        }
    }

    toPublicJSON() {
        return {
            id: this._id.toString(),
            email: this.email,
            name: this.displayName,
            displayName: this.displayName,
            role: this.role || 'learner',
            emailVerified: Boolean(this.emailVerified),
            createdAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
            profile: this.profile || {}
        };
    }
}

function shouldUseMemory() {
    return mongoose.connection.readyState !== 1;
}

function User(data) {
    if (shouldUseMemory()) {
        return new MemoryUser(data);
    }
    return new MongooseUser(data);
}

User.hashPassword = async function (plainPassword) {
    return await argon2.hash(plainPassword, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1
    });
};

User.findOne = async function (query = {}) {
    if (!shouldUseMemory()) {
        return await MongooseUser.findOne(query);
    }

    const now = new Date();
    for (const user of memoryUsers.values()) {
        if (query.googleId && user.googleId === query.googleId) {
            return user;
        }
        if (query.email && user.email === String(query.email).toLowerCase().trim()) {
            return user;
        }
        if (query.$or && Array.isArray(query.$or)) {
            const matches = query.$or.some(subQuery => {
                if (subQuery.googleId && user.googleId === subQuery.googleId) return true;
                if (subQuery.email && user.email === String(subQuery.email).toLowerCase().trim()) return true;
                return false;
            });
            if (matches) return user;
        }
        if (query.passwordResetToken && user.passwordResetToken === query.passwordResetToken) {
            if (query.passwordResetExpires && query.passwordResetExpires.$gt) {
                if (user.passwordResetExpires && user.passwordResetExpires > now) {
                    return user;
                }
                return null;
            }
            return user;
        }
        if (query.emailVerificationToken && user.emailVerificationToken === query.emailVerificationToken) {
            if (query.emailVerificationExpires && query.emailVerificationExpires.$gt) {
                if (user.emailVerificationExpires && user.emailVerificationExpires > now) {
                    return user;
                }
                return null;
            }
            return user;
        }
    }
    return null;
};

User.findOrCreateByGoogle = async function (googleId, profile = {}) {
    if (!googleId) {
        throw new Error('googleId is required');
    }
    const normalizedEmail = profile.email ? String(profile.email).toLowerCase().trim() : '';

    // 1. Try finding by googleId
    let user = await User.findOne({ googleId });
    if (user) {
        return user;
    }

    // 2. Try finding by email (if user previously registered with email)
    if (normalizedEmail) {
        user = await User.findOne({ email: normalizedEmail });
        if (user) {
            user.googleId = googleId;
            if (!user.emailVerified) {
                user.emailVerified = true;
            }
            await user.save();
            return user;
        }
    }

    // 3. Create new user
    const displayName = (profile.name && String(profile.name).trim()) || (normalizedEmail ? normalizedEmail.split('@')[0] : 'Learner');
    user = new User({
        email: normalizedEmail,
        displayName,
        googleId,
        emailVerified: true,
        role: 'learner'
    });
    await user.save();
    return user;
};

User.findById = async function (id) {
    if (!shouldUseMemory()) {
        return await MongooseUser.findById(id);
    }
    return memoryUsers.get(String(id)) || null;
};

User.deleteMany = async function (query = {}) {
    if (!shouldUseMemory()) {
        return await MongooseUser.deleteMany(query);
    }
    const count = memoryUsers.size;
    memoryUsers.clear();
    return { acknowledged: true, deletedCount: count };
};

User.schema = userSchema;

module.exports = User;
module.exports.User = User;
