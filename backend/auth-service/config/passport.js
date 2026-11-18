const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const env = require("./env");

// Registrazione della strategia Google in Passport
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
                callbackURL: env.GOOGLE_REDIRECT_URI || "http://localhost:3007/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                const user = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName:
                        profile.name?.givenName ||
                        profile.displayName?.split(" ")[0] ||
                        "Utente",
                    email: profile.emails?.[0]?.value,
                };
                return done(null, user);
            }
        )
    );
}

// Gestione serializzazione e deserializzazione sessione
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
