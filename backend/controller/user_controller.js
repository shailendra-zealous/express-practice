const userController = {};
const db = require('../models');
const { successResponse, errorResponse } = require("../helper/response")
const { editProfileValidation } = require("../validation_schema/edit_profile_validation")
const { formatJoiErrors } = require("../helper/format_validation_error")
const { uploadFileAppwrite, deleteAppwriteFile, viewAppwriteFile } = require("../helper/appwrite")


userController.getUser = async (req, res) => {
    const profileImage = await req.user.getImage()

    if (profileImage) {
        const image = await viewAppwriteFile(profileImage.file_url)
        if (image) {
            req.user.profileImage = image
        }
    }

    return successResponse(res, {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage || null,
    }, "User fetched successfully")
}

userController.editProfile = async (req, res) => {

    const profileImage = req.files[0];

    if (profileImage) {
        const allowedTypes = ['image/png', 'image/jpeg'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(profileImage.mimetype)) {
            return errorResponse(res, 'Only PNG and JPEG files are allowed.', 400);
        }

        if (profileImage.size > maxSize) {
            return errorResponse(res, 'File size must be less than 5 MB.', 400);
        }

        const fileId = await uploadFileAppwrite(profileImage)

        if (fileId !== null) {
            const existingImage = await req.user.getImage({
                where: {
                    imageableType: 'user',
                    imageableId: req.user.id
                }
            })
            if (existingImage) {
                await deleteAppwriteFile(existingImage.file_url)
                await existingImage.update({ file_url: fileId })
            } else {
                await req.user.createImage({
                    file_url: fileId,
                    imagebleType: 'user',
                    imageableId: req.user.id
                })
            }
        }
    }

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
        !existingProfile ? await req.user.createProfile({ bio: req.body.bio }) : await existingProfile.update({ bio: req.body.bio })
    }

    return successResponse(res, null, "User profile updated successfully")
}

module.exports = userController;