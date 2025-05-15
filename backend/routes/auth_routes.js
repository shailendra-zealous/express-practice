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

    // let id_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImUxNGMzN2Q2ZTVjNzU2ZThiNzJmZGI1MDA0YzBjYzM1NjMzNzkyNGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNzQ0NDk0MDM1MzMtMGVlb2xzaHA5a2wwOTZvZ2pyaGM2aGtnOGg3djBpcnQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNzQ0NDk0MDM1MzMtMGVlb2xzaHA5a2wwOTZvZ2pyaGM2aGtnOGg3djBpcnQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIzNDE4MjM3MTYxMzk0NDM4MzIiLCJoZCI6InplYWxvdXN3ZWIuY29tIiwiZW1haWwiOiJzaGFpbGVuZHJhQHplYWxvdXN3ZWIuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0NzMxODEzNiwibmFtZSI6IlNoYWlsZW5kcmEgU2hhcm1hIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xDejFWZzFZUTRWY09IM1o3NDk5N1lYYVBSeFZTRm80bkpwcFFBQWhfTnR6N01Qams9czk2LWMiLCJnaXZlbl9uYW1lIjoiU2hhaWxlbmRyYSIsImZhbWlseV9uYW1lIjoiU2hhcm1hIiwiaWF0IjoxNzQ3MzE4NDM2LCJleHAiOjE3NDczMjIwMzYsImp0aSI6ImUyYjNlMzM1MDdlMGFiODNhMWU5M2ZhNWVmMzhmOGNlYThhYWYxYTQifQ.VkGRnoJkfOk1_euVjUYxgTY83gEXQFy4u8RtGz3e6XI4MaytO5_YN_n6BBvBevukW_OGhOTQkwzUSn5MOfxz3WZYiTWUI_nEgr877z45cbf8zM4-6PT7_LBym9vHDLN_xy-TE6h2bNDRQyi8zIWeGsoaz5SfY5p7hLbI6573fUehZOMtS9jR72k4w2GuHZqBGpGIYVqMKEquUkRpT59PafrpDGW45hXAPfiqzO743YEvN5MUUfdOlpz1eKG-jP1zwj6ji8Q4qwKP_Yb7nOzHqETWLM5kaACweeO3Bfp8W5eOEphTtaA4Zvt2_Pe52B14dB7Afpyih19wZ8Ujyc926Q"

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