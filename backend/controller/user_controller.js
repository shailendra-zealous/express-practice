const userController = {};
const db = require('../models');
const { successResponse, errorResponse } = require("../helper/response")
const { editProfileValidation } = require("../validation_schema/edit_profile_validation")
const { formatJoiErrors } = require("../helper/format_validation_error")

userController.getUser = async (req, res) => {
    return successResponse(res, {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    }, "User fetched successfully")
}

userController.editProfile = async (req, res) => {
    const { error } = editProfileValidation.validate(req.body, { abortEarly: false })
    if (error && error.details && Array.isArray(error.details) && error.details.length > 0) {
        const formattedErrors = formatJoiErrors(error.details, {
            name: 'Name',
            bio: 'Bio'
        }, null)
        return errorResponse(res, formattedErrors, 422)
    }

    if (req.body.name) {
        await db.User.update({ name: req.body.name }, { where: { id: req.user.id } })
    }

    if (req.body.bio) {
        const existingProfile = await req.user.getProfile()
        if (!existingProfile) {
            await req.user.createProfile({ bio: req.body.bio })
        } else {
            await existingProfile.update({ bio: req.body.bio })
        }
    }

    return successResponse(res, null, "User profile updated successfully")
}

module.exports = userController;