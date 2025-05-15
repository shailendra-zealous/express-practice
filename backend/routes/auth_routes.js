const express = require('express');
const router = express.Router();
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const { errorResponse, successResponse } = require("../helper/response")
const auth_controller = require("../controller/auth_controller")
const verifyToken = require("../middleware/verifyToken");

router.post("/login", auth_controller.login)

router.post("/register", auth_controller.register)

router.get('/user', verifyToken, auth_controller.getUser)

router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
    // https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email  redirect to this URL
);


router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) {
            return errorResponse(res, 'Authentication error', 500);
        }

        if (!user) {
            return errorResponse(res, 'Authentication failed', 500);
        }

        return successResponse(res, { user }, "User authenticated successfully");

    })(req, res, next);
});

// This needs testing
router.post('/auth/google-token', async (req, res) => {
    const { id_token } = req.body;

    if (!id_token) {
        return res.status(400).json({ success: false, message: 'Missing id_token' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { sub, name, email, picture } = payload;

        const user = {
            googleId: sub,
            name,
            email,
            photo: picture
        };

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token', error });
    }
});

module.exports = router;