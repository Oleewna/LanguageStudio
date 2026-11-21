# LanguageStudio MongoDB Service

A decentralized database and data-access layer for **LanguageStudio**.

This service encapsulates all MongoDB Atlas connectivity, Mongoose schemas, data models, and domain-level database operations, separating them from the core API and content serving logic in `backend/service`.

## Structure

```
backend/mongodb-service/
├── config/
│   └── env.js              # Environment configuration (MONGODB_URI, PORT, HOST)
├── src/
│   ├── connection.js       # MongoDB connection lifecycle (connect, close, status)
│   ├── models/
│   │   ├── User.js         # User model, Argon2 hashing, Google auth, memory fallback
│   │   ├── Progress.js     # DailyActivity, LessonProgress, WordStats, Position, CustomWords
│   │   ├── Entitlement.js  # Course access entitlements and verification
│   │   └── index.js        # Aggregated model exports
│   ├── services/
│   │   ├── userService.js        # Decentralized user functions (find, create, verify, reset)
│   │   ├── progressService.js    # Decentralized progress functions (snapshot, upsert, reset)
│   │   ├── entitlementService.js # Decentralized entitlement functions (check, grant, revoke)
│   │   ├── sessionStore.js       # Connect-mongo session store factory
│   │   └── index.js              # Aggregated domain services
│   ├── server.js           # Optional standalone health service (Port 3008)
│   └── index.js            # Main module entry point
└── test/
    └── mongodb-service.test.js # Test suite for models and decentralized services
```

## Exports & Usage

### 1. Database Connection
```javascript
const { connectMongo, closeMongo, isMongoConnected } = require('../mongodb-service');

await connectMongo();
```

### 2. Models
```javascript
const { User, Entitlement, PROGRESS_MODELS } = require('../mongodb-service');

const user = await User.findById(userId);
const hasAccess = await Entitlement.hasEntitlement(userId, courseId, pathId);
```

### 3. Decentralized Services
```javascript
const { userService, progressService, entitlementService } = require('../mongodb-service');

// User operations
const user = await userService.createUser({ email, password, displayName });
const isValid = await userService.verifyUserPassword(user, password);

// Progress operations
const snapshot = await progressService.getUserProgressSnapshot(userId);
await progressService.upsertCollectionRecord('lessonProgress', { userId, courseId, lessonId }, { bestScore: 100 });

// Entitlements
await entitlementService.grantEntitlement({ userId, courseId, selectedPaths, provider, providerPaymentId });
```

### 4. Session Storage
```javascript
const { createMongoSessionStore } = require('../mongodb-service');

const store = createMongoSessionStore(process.env.MONGODB_URI);
```

## Running Tests

```bash
cd backend/mongodb-service
npm test
```
