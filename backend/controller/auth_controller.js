const auth_controller = {}

const db = require("../models")

const { successResponse, errorResponse } = require("../helper/response")
const { formatJoiErrors } = require("../helper/format_validation_error")
const { registerSchema } = require("../validation_schema/register")

auth_controller.register = async (req, res) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false })

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
    return successResponse(res, null, "User registered successfully")
}

auth_controller.login = async (req, res) => {
    return successResponse(res, null, "User registered successfully")
}

auth_controller.logout = async (req, res) => { }

auth_controller.getUser = async (req, res) => { }



module.exports = auth_controller