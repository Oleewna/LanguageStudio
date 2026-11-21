const fs = require('fs');
const path = require('path');
const env = require('../../config/env');

/**
 * Searches for and loads Google OAuth credentials from:
 * 1. Explicit path in GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_CREDENTIALS_JSON
 * 2. Any client_secret*.json, google*.json, or *credential*.json in backend/service, backend/auth-service, backend, or project root
 * 3. Environment variables GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
 */
function loadGoogleConfig() {
    const candidates = [];

    // 1. Explicit environment paths
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        candidates.push(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS));
    }
    if (process.env.GOOGLE_CREDENTIALS_JSON) {
        candidates.push(path.resolve(__dirname, '../../', process.env.GOOGLE_CREDENTIALS_JSON));
        candidates.push(path.resolve(process.env.GOOGLE_CREDENTIALS_JSON));
    }

    // 2. Scan standard directories for Google client secret JSON files
    const searchDirs = [
        path.resolve(__dirname, '../../'),          // backend/service/
        path.resolve(__dirname, '../../../auth-service/'), // backend/auth-service/ (legacy)
        path.resolve(__dirname, '../../../'),       // backend/
        path.resolve(__dirname, '../../../../'),    // workspace root
    ];

    for (const dir of searchDirs) {
        try {
            if (!fs.existsSync(dir)) continue;
            const entries = fs.readdirSync(dir);
            for (const entry of entries) {
                if (!entry.endsWith('.json')) continue;
                const lower = entry.toLowerCase();
                if (
                    lower.startsWith('client_secret') ||
                    lower.includes('oauth') ||
                    lower.includes('google') ||
                    lower.includes('credential')
                ) {
                    // Skip package.json and tsconfig.json
                    if (lower === 'package.json' || lower === 'package-lock.json' || lower.includes('tsconfig')) {
                        continue;
                    }
                    candidates.push(path.join(dir, entry));
                }
            }
        } catch {
            // Ignore directory read errors
        }
    }

    // Check JSON candidates
    for (const filePath of candidates) {
        try {
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, 'utf8');
                const parsed = JSON.parse(raw);
                const creds = parsed.web || parsed.installed || parsed;

                const clientId = creds.client_id || creds.clientId;
                const clientSecret = creds.client_secret || creds.clientSecret;

                if (clientId && clientSecret) {
                    const redirectUris = creds.redirect_uris || creds.redirectUris;
                    const redirectUri = env.PUBLIC_URL || process.env.GOOGLE_REDIRECT_URI
                        ? env.GOOGLE_REDIRECT_URI
                        : ((Array.isArray(redirectUris) && redirectUris[0]) ||
                            env.GOOGLE_REDIRECT_URI ||
                            'http://localhost:3005/api/v1/auth/google/callback');

                    return {
                        clientId: String(clientId).trim(),
                        clientSecret: String(clientSecret).trim(),
                        redirectUri: String(redirectUri).trim(),
                        source: filePath
                    };
                }
            }
        } catch {
            // Skip invalid JSON files
        }
    }

    // 3. Fallback to environment variables
    const envClientId = (env.GOOGLE_CLIENT_ID || '').trim();
    const envClientSecret = (env.GOOGLE_CLIENT_SECRET || '').trim();
    const rawRedirectUri = (env.GOOGLE_REDIRECT_URI || '').trim();
    const envRedirectUri = (!rawRedirectUri || rawRedirectUri.includes('your-name'))
        ? 'http://localhost:3005/api/v1/auth/google/callback'
        : rawRedirectUri;

    const isPlaceholder = !envClientId ||
        envClientId === 'YOUR_GOOGLE_CLIENT_ID_HERE' ||
        envClientId.includes('your-name') ||
        !envClientSecret ||
        envClientSecret === 'YOUR_GOOGLE_CLIENT_SECRET_HERE' ||
        envClientSecret.includes('your-name');

    return {
        clientId: isPlaceholder ? '' : envClientId,
        clientSecret: isPlaceholder ? '' : envClientSecret,
        redirectUri: envRedirectUri,
        source: '.env'
    };
}

module.exports = { loadGoogleConfig };
