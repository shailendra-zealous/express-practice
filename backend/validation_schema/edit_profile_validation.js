const joi = require('joi');

const editProfileValidation = joi.object({
    name: joi.string().min(3).max(30).pattern(/^[A-Za-z\s]+$/, 'alphabets and spaces').optional(),
    bio: joi.string().max(500).optional(),
})

module.exports = {
    editProfileValidation
}