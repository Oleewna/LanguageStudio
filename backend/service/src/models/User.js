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
        displayName: this.displayName,
        emailVerified: Boolean(this.emailVerified),
        createdAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString()
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
        this.emailVerified = Boolean(data.emailVerified);
        this.googleId = data.googleId || null;
        this.emailVerificationToken = data.emailVerificationToken || null;
        this.emailVerificationExpires = data.emailVerificationExpires || null;
        this.passwordResetToken = data.passwordResetToken || null;
        this.passwordResetExpires = data.passwordResetExpires || null;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
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
            displayName: this.displayName,
            emailVerified: Boolean(this.emailVerified),
            createdAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString()
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
        if (query.email && user.email === String(query.email).toLowerCase().trim()) {
            return user;
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
