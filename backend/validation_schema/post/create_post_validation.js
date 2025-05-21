const joi = require('joi');

const createPostValidation = joi.object({
    title: joi.string().min(3).max(30).required(),
    content: joi.string().required(),
})

module.exports = {
    createPostValidation
}