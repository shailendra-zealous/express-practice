const joi = require('joi');

const updatePostValidation = joi.object({
    title: joi.string().min(3).max(30).optional(),
    content: joi.string().optional(),
})

module.exports = {
    updatePostValidation
}