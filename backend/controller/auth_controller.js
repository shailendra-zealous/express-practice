const auth_controller = {}

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../models")

const { successResponse, errorResponse } = require("../helper/response")
const { formatJoiErrors } = require("../helper/format_validation_error")
const { registerValidation } = require("../validation_schema/register_validation")
const { loginValidation } = require("../validation_schema/login_validation")

auth_controller.register = async (req, res) => {

    const { error } = registerValidation.validate(req.body, { abortEarly: false })

    if (error && error.details && Array.isArray(error.details) && error.details.length > 0) {
        const formattedErrors = formatJoiErrors(error.details, {
            email: 'Email Address',
            password: 'Password',
            firstname: 'First Name',
            lastname: 'Last Name'
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

    const { firstname, lastname, email, password } = req.body

    const defaultSalt = +process.env.JWT_SALT || 10
    const salt = await bcrypt.genSalt(defaultSalt)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await db.User.create({
        first_name: firstname,
        last_name: lastname,
        email,
        password: hashedPassword
    })

    if (!newUser) {
        return errorResponse(res, "User registration failed", 500)
    }

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    return successResponse(res, { token }, "User registered successfully")
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

    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    return successResponse(res, { token }, "User logged in successfully")
}

auth_controller.logout = async (req, res) => { }

auth_controller.getUser = async (req, res) => {
    return successResponse(res, {
        id: req.user.id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email
    }, "User fetched successfully")
}



module.exports = auth_controller