const express = require('express');
const router = express.Router();

const { errorResponse, successResponse } = require("../helper/response")
const auth_controller = require("../controller/auth_controller")
const verifyToken = require("../middleware/verifyToken");

const passport = require('passport');

router.post("/login", auth_controller.login)

router.post("/register", auth_controller.register)

router.get('/user', verifyToken, auth_controller.getUser)

router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) {
            return errorResponse(res, 'Authentication error', 500);
        }

        if (!user) {
            return errorResponse(res, 'Authentication failed', 500);
        }

        return successResponse(res, { user }, "User authenticated successfully", 200);

    })(req, res, next);
});


module.exports = router;