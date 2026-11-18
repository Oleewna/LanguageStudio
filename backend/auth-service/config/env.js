const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
    get AUTH_PORT() {
        return parseInt(process.env.AUTH_PORT || process.env.PORT || "3007", 10);
    },
    get PORT() {
        return parseInt(process.env.AUTH_PORT || process.env.PORT || "3007", 10);
    },
    get HOST() {
        return process.env.HOST || "127.0.0.1";
    },
    get GOOGLE_CLIENT_ID() {
        return process.env.GOOGLE_CLIENT_ID;
    },
    get GOOGLE_CLIENT_SECRET() {
        return process.env.GOOGLE_CLIENT_SECRET;
    },
    get GOOGLE_REDIRECT_URI() {
        return process.env.GOOGLE_REDIRECT_URI || "http://localhost:3007/google/callback";
    },
    get FRONTEND_URL() {
        return process.env.FRONTEND_URL || "";
    },
    get SESSION_SECRET() {
        return process.env.SESSION_SECRET || "language-studio-auth-secret-change-in-production";
    },
    get AUTH_USERS_FILE() {
        return process.env.AUTH_USERS_FILE || "./data/users.json";
    },
    get NODE_ENV() {
        return process.env.NODE_ENV || "development";
    }
};
