const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleStrategy = () => {
    return new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile)
                const user = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value,
                    accessToken
                };
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
}

module.exports = googleStrategy