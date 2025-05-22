const postController = {}

const { formatJoiErrors } = require("../helper/format_validation_error")
const { successResponse, errorResponse } = require("../helper/response")
const { createPostValidation } = require("../validation_schema/post/create_post_validation")
const { updatePostValidation } = require("../validation_schema/post/update_post_validation")
const db = require("../models")
const { Op } = require("sequelize")
const pagination = require("../helper/pagination")

postController.bindPost = async (req, res, next) => {
    const post = await db.Post.findByPk(req.params.post);
    if (!post) {
        return errorResponse(res, "Post not found", 404);
    }
    req.post = post;
    next();
}

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

postController.postListing = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const search = req.query.search || ""
    let searchCondition = {}

    if (search != "") {
        searchCondition = {
            [Op.or]: [
                {
                    title: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    content: {
                        [Op.like]: `%${search}%`
                    }
                }
            ]
        }
    }

    const posts = await db.Post.findAll({
        attributes: ['id', 'title', 'content'],
        where: searchCondition,
        include: [
            {
                model: db.User,
                attributes: ['id', 'name', 'email'],
            }
        ],
        limit,
        offset,
    })

    const totalRecords = await db.Post.count({
        where: searchCondition,
    });

    const paginationData = await pagination(page, limit, totalRecords)

    return successResponse(res, posts, "Post listing", paginationData)
}

postController.viewPost = async (req, res) => {
    return successResponse(res, req.post, "Post fetched successfully")
}

postController.updatePost = async (req, res) => {
    const { error } = updatePostValidation.validate(req.body, { abortEarly: false })
    if (error && error.details && Array.isArray(error.details) && error.details.length > 0) {
        const formattedErrors = formatJoiErrors(error.details, {
            title: 'Title',
            content: 'Content'
        }, null)
        return errorResponse(res, formattedErrors, 422)
    }

    if (req.post.user_id != req.user.id) {
        return errorResponse(res, "You are not authorized to update this post", 403)
    }

    const updateData = {}

    if (req.body.title) {
        updateData.title = req.body.title
    }
    if (req.body.content) {
        updateData.content = req.body.content
    }

    if (updateData.title || updateData.content) {
        await req.post.update(updateData)
    }

    return successResponse(res, req.post, "Post updated successfully")
}

postController.deletePost = async (req, res) => {
    await req.post.destroy();
    return successResponse(res, {}, "Post deleted successfully")
}


module.exports = postController