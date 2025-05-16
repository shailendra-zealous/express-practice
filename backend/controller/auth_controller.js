const auth_controller = {}

const jwt = require("jsonwebtoken")
const db = require("../models")

const { successResponse, errorResponse } = require("../helper/response")
const { formatJoiErrors } = require("../helper/format_validation_error")
const { registerValidation } = require("../validation_schema/register_validation")
const { loginValidation } = require("../validation_schema/login_validation")
const { generateAccessToken, generateRefreshToken } = require("../helper/token")
const { hashedPassword } = require("../helper/hashed_password")

auth_controller.register = async (req, res) => {

    const { error } = registerValidation.validate(req.body, { abortEarly: false })

    if (error && error.details && Array.isArray(error.details) && error.details.length > 0) {
        const formattedErrors = formatJoiErrors(error.details, {
            email: 'Email Address',
            password: 'Password',
            name: 'Name',

        }, {
            "email.string.email": "Email must be a valid email address",
            "password.string.pattern.base": "Password must be alphanumeric and between 8 to 30 characters"
        });
        return errorResponse(res, formattedErrors, 422)
    }

    const existingUser = await db.User.findOne({ where: { email: req.body.email } })
    if (existingUser) {
        return errorResponse(res, { email: "Email already exists" }, 422)
    }

    const { name, lastname, email, password } = req.body

    const hashedPassword = await hashedPassword(password)

    const newUser = await db.User.create({
        name,
        email,
        password: hashedPassword
    })

    if (!newUser) {
        return errorResponse(res, "User registration failed", 500)
    }

    const accessToken = generateAccessToken({ id: newUser.id });
    const refreshToken = generateRefreshToken({ id: newUser.id });

    return successResponse(res, { accessToken, refreshToken }, "User registered successfully")
}

auth_controller.login = async (req, res) => {
    const { error } = loginValidation.validate(req.body, { abortEarly: false })
    if (error && error.details && Array.isArray(error.details) && error.details.length > 0) {
        const formattedErrors = formatJoiErrors(error.details, {
            email: 'Email Address',
            password: 'Password'
        }, {
            "email.string.email": "Email must be a valid email address",
            "password.string.pattern.base": "Password must be alphanumeric and between 8 to 30 characters"
        });
        return errorResponse(res, formattedErrors, 422)
    }

    const existingUser = await db.User.findOne({ where: { email: req.body.email } })
    if (!existingUser) {
        return errorResponse(res, { email: "Email not found" }, 422)
    }

    const accessToken = generateAccessToken({ id: existingUser.id });
    const refreshToken = generateRefreshToken({ id: existingUser.id });

    return successResponse(res, { accessToken, refreshToken }, "User registered successfully")

}

auth_controller.logout = async (req, res) => { }

auth_controller.getUser = async (req, res) => {
    return successResponse(res, {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    }, "User fetched successfully")
}

auth_controller.token = async (req, res) => {
    const { token } = req.body;
    if (!token) return errorResponse(res, "Refresh token not found", 401);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return errorResponse(res, "Invalid refresh token", 403);

        const newAccessToken = generateAccessToken({ user: user.id });
        return successResponse(res, { accessToken: newAccessToken }, "New access token generated successfully")
    });
}


module.exports = auth_controller