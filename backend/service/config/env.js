const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
    get PORT() {
        return parseInt(process.env.PORT || "3006", 10);
    },
    get HOST() {
        return process.env.HOST || "127.0.0.1";
    },
    get NODE_ENV() {
        return process.env.NODE_ENV || "development";
    },
    get MONGODB_URI() {
        return process.env.MONGODB_URI;
    },
    get SESSION_SECRET() {
        return process.env.SESSION_SECRET || "dev_session_secret_languagestudio_key_2026";
    },
    get SESSION_COOKIE_NAME() {
        return process.env.SESSION_COOKIE_NAME || "ls.sid";
    },
    get COOKIE_SECURE() {
        return process.env.COOKIE_SECURE === "true";
    },
    get USE_MEMORY_SESSION() {
        return process.env.USE_MEMORY_SESSION === "true";
    },
    get GOOGLE_CLIENT_ID() {
        return process.env.GOOGLE_CLIENT_ID;
    },
    get GOOGLE_CLIENT_SECRET() {
        return process.env.GOOGLE_CLIENT_SECRET;
    },
    get GOOGLE_REDIRECT_URI() {
        return process.env.GOOGLE_REDIRECT_URI || "http://localhost:3005/api/v1/auth/google/callback";
    },
    get FRONTEND_URL() {
        return process.env.FRONTEND_URL || "http://localhost:3005";
    },
    get VOCAB_DB_PATH() {
        return process.env.VOCAB_DB_PATH;
    },
    get PAID_CONTENT_DIR() {
        return process.env.PAID_CONTENT_DIR;
    }
};
