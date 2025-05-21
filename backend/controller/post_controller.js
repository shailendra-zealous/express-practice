const postController = {}

const { formatJoiErrors } = require("../helper/format_validation_error")
const { successResponse, errorResponse } = require("../helper/response")
const { createPostValidation } = require("../validation_schema/post/create_post_validation")
const db = require("../models")

postController.createPost = async (req, res) => {
    const { error } = createPostValidation.validate(req.body, { abortEarly: false })
    if (error && error.details && Array.isArray(error.details) && error.details.length > 0) {
        const formattedErrors = formatJoiErrors(error.details, {
            title: 'Title',
            content: 'Content'
        }, null)
        return errorResponse(res, formattedErrors, 422)
    }

    const { title, content } = req.body

    const post = await db.Post.create({
        title,
        content,
        user_id: req.user.id
    })

    if (!post) {
        return errorResponse(res, "Post creation failed", 500)
    }

    return successResponse(res, post, "Post created successfully")
}

module.exports = postController