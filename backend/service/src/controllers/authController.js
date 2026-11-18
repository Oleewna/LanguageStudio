const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyEmailSchema
} = require('../validators/authValidators');
const { getEmailService } = require('../services/emailService');
const { ensureCsrfToken } = require('../middleware/csrf');
const { loadGoogleConfig } = require('../utils/googleConfig');
const config = require('../../config/env');

// ─── OAuth state store (CSRF protection) ─────────────────────────────────────
const oauthStates = new Map(); // state -> { timestamp, returnUrl }
const STATE_LIFETIME_MS = 10 * 60 * 1000; // 10 minutes

function getOAuth2Client() {
    const googleConfig = loadGoogleConfig();
    return {
        client: new OAuth2Client(googleConfig.clientId, googleConfig.clientSecret, googleConfig.redirectUri),
        config: googleConfig
    };
}

function getFrontendBase(req) {
    if (config.FRONTEND_URL) {
        return config.FRONTEND_URL.replace(/\/+$/, '');
    }
    const host = (req && req.headers && (req.headers['x-forwarded-host'] || req.headers.host)) || '';
    const proto = (req && req.headers && req.headers['x-forwarded-proto']) || (req && req.socket && req.socket.encrypted ? 'https' : 'http');
    // If request came directly to service on port 3006, redirect user to the gateway on port 3005
    if (host.includes(':3006')) {
        return `${proto}://${host.replace(':3006', ':3005')}`;
    }
    if (host && !host.includes(':3006')) {
        return `${proto}://${host}`;
    }
    return 'http://localhost:3005';
}

function formatZodError(zodError) {
    if (!zodError || !Array.isArray(zodError.issues)) {
        return 'Invalid request data.';
    }
    return zodError.issues.map(issue => issue.message).join(' ');
}

async function register(req, res, next) {
    try {
        const body = req.body || {};
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return res.status(400).json({ error: formatZodError(parsed.error) });
        }

        const { email, password } = parsed.data;
        const displayName = parsed.data.displayName || body.displayName || body.name;

        if (!displayName || !displayName.trim()) {
            return res.status(400).json({ error: 'Display name is required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        const passwordHash = await User.hashPassword(password);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = new User({
            email,
            passwordHash,
            displayName: displayName.trim(),
            emailVerificationToken,
            emailVerificationExpires
        });

        await user.save();

        // Send verification email via stubbed service
        const emailService = getEmailService();
        await emailService.sendVerificationEmail({
            to: user.email,
            displayName: user.displayName,
            token: emailVerificationToken
        });

        // Set up session for newly registered user
        req.session.userId = user._id.toString();

        return res.status(201).json({
            message: 'Registration successful. A verification link has been sent to your email.',
            user: user.toPublicJSON()
        });
    } catch (error) {
        return next(error);
    }
}

async function login(req, res, next) {
    try {
        const body = req.body || {};
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return res.status(400).json({ error: formatZodError(parsed.error) });
        }

        const { email, password, remember } = parsed.data;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await user.verifyPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Set session
        req.session.userId = user._id.toString();

        if (remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else {
            req.session.cookie.expires = false; // Browser session
        }

        return res.status(200).json({
            message: 'Logged in successfully.',
            user: user.toPublicJSON()
        });
    } catch (error) {
        return next(error);
    }
}

async function logout(req, res, next) {
    try {
        const cookieName = config.SESSION_COOKIE_NAME || 'ls.sid';
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
            }
            res.clearCookie(cookieName, { path: '/' });
            return res.status(200).json({ success: true, message: 'Logged out successfully.' });
        });
    } catch (error) {
        return next(error);
    }
}

async function getMe(req, res, next) {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ authenticated: false, error: 'Not authenticated.' });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.destroy(() => {});
            return res.status(401).json({ authenticated: false, error: 'User not found.' });
        }

        return res.status(200).json({
            authenticated: true,
            user: user.toPublicJSON()
        });
    } catch (error) {
        return next(error);
    }
}

async function forgotPassword(req, res, next) {
    try {
        const body = req.body || {};
        const parsed = forgotPasswordSchema.safeParse(body);
        if (!parsed.success) {
            return res.status(400).json({ error: formatZodError(parsed.error) });
        }

        const { email } = parsed.data;
        const user = await User.findOne({ email });

        if (user) {
            const resetToken = crypto.randomBytes(32).toString('hex');
            user.passwordResetToken = resetToken;
            user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
            await user.save();

            const emailService = getEmailService();
            await emailService.sendPasswordResetEmail({
                to: user.email,
                displayName: user.displayName,
                token: resetToken
            });
        }

        // Always return generic success message to prevent user enumeration
        return res.status(200).json({
            message: 'If an account with that email exists, a password reset link has been sent.'
        });
    } catch (error) {
        return next(error);
    }
}

async function resetPassword(req, res, next) {
    try {
        const body = req.body || {};
        const parsed = resetPasswordSchema.safeParse(body);
        if (!parsed.success) {
            return res.status(400).json({ error: formatZodError(parsed.error) });
        }

        const { token, password } = parsed.data;
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired password reset token.' });
        }

        user.passwordHash = await User.hashPassword(password);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password has been reset successfully. You can now log in.'
        });
    } catch (error) {
        return next(error);
    }
}

async function verifyEmail(req, res, next) {
    try {
        const token = (req.body && req.body.token) || req.query.token;
        const parsed = verifyEmailSchema.safeParse({ token });
        if (!parsed.success) {
            return res.status(400).json({ error: formatZodError(parsed.error) });
        }

        const user = await User.findOne({
            emailVerificationToken: parsed.data.token,
            emailVerificationExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token.' });
        }

        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Email address verified successfully.',
            user: user.toPublicJSON()
        });
    } catch (error) {
        return next(error);
    }
}

async function resendVerification(req, res, next) {
    try {
        let user = null;
        if (req.session?.userId) {
            user = await User.findById(req.session.userId);
        } else if (req.body?.email) {
            user = await User.findOne({ email: String(req.body.email).toLowerCase().trim() });
        }

        if (!user) {
            return res.status(400).json({ error: 'User not found or not authenticated.' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ error: 'This email is already verified.' });
        }

        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = emailVerificationToken;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        const emailService = getEmailService();
        await emailService.sendVerificationEmail({
            to: user.email,
            displayName: user.displayName,
            token: emailVerificationToken
        });

        return res.status(200).json({
            success: true,
            message: 'Verification email has been resent.'
        });
    } catch (error) {
        return next(error);
    }
}

async function getSession(req, res, next) {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(200).json({ authenticated: false });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.destroy(() => {});
            return res.status(200).json({ authenticated: false });
        }

        return res.status(200).json({
            authenticated: true,
            user: user.toPublicJSON()
        });
    } catch (error) {
        return next(error);
    }
}

function googleRedirect(req, res) {
    const { client, config } = getOAuth2Client();

    if (!config.clientId || !config.clientSecret) {
        return res.status(503).json({
            error: 'Google OAuth is not configured on this server. Please provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env or place your Google client secret JSON file in backend/service/ or backend/.'
        });
    }

    // Clean up expired states
    const now = Date.now();
    for (const [state, entry] of oauthStates) {
        const ts = typeof entry === 'number' ? entry : entry.timestamp;
        if (now - ts > STATE_LIFETIME_MS) oauthStates.delete(state);
    }

    const state = crypto.randomBytes(16).toString('hex');
    const returnUrl = req.query.returnUrl || req.query.redirect || null;
    oauthStates.set(state, { timestamp: Date.now(), returnUrl });

    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['openid', 'email', 'profile'],
        state,
        prompt: 'select_account'
    });

    return res.redirect(authUrl);
}

async function googleCallback(req, res) {
    const { code, state, error } = req.query;
    const frontendBase = getFrontendBase(req);

    if (error) {
        console.warn('Google OAuth error from provider:', error);
        return res.redirect(`${frontendBase}/pages/auth.html?error=google_failed`);
    }

    // Validate CSRF state
    if (!state || !oauthStates.has(state)) {
        return res.redirect(`${frontendBase}/pages/auth.html?error=invalid_state`);
    }
    const stateData = oauthStates.get(state);
    oauthStates.delete(state);

    if (!code) {
        return res.redirect(`${frontendBase}/pages/auth.html?error=missing_code`);
    }

    try {
        const { client, config } = getOAuth2Client();

        // Exchange code for tokens
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        // Verify and decode the id_token
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: config.clientId
        });
        const payload = ticket.getPayload();

        const googleId = payload.sub;
        const name = payload.name || payload.given_name || (payload.email ? payload.email.split('@')[0] : 'Learner');
        const email = payload.email;

        if (!googleId || !email) {
            return res.redirect(`${frontendBase}/pages/auth.html?error=google_profile_missing`);
        }

        // Find or create user in MongoDB User model
        const user = await User.findOrCreateByGoogle(googleId, { name, email });

        // Populate unified session
        req.session.userId = user._id.toString();

        req.session.save((err) => {
            if (err) {
                console.error('Session save error during Google OAuth:', err);
            }
            const returnUrl = stateData?.returnUrl;
            let redirectUrl = `${frontendBase}/path`;
            if (returnUrl && typeof returnUrl === 'string') {
                if (returnUrl.startsWith('http://') || returnUrl.startsWith('https://')) {
                    redirectUrl = returnUrl;
                } else {
                    redirectUrl = `${frontendBase}${returnUrl.startsWith('/') ? returnUrl : '/' + returnUrl}`;
                }
            }
            return res.redirect(redirectUrl);
        });
    } catch (err) {
        console.error('Google OAuth callback error:', err.message);
        return res.redirect(`${frontendBase}/pages/auth.html?error=google_failed`);
    }
}

function getCsrf(req, res) {
    const token = ensureCsrfToken(req, res);
    return res.status(200).json({ csrfToken: token });
}

module.exports = {
    register,
    login,
    logout,
    getMe,
    getSession,
    googleRedirect,
    googleCallback,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    getCsrf,
    oauthStates
};
