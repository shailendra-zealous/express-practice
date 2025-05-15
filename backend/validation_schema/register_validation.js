const joi = require('joi');


const db = require("../models")
const registerSchema = joi.object({
    firstname: joi.string().min(3).max(30).required(),
    lastname: joi.string().min(3).max(30).required(),
    email: joi.string().email().required().custom(async (value, helpers) => {
        const user = await db.User.findOne({ where: { email: value } })
        if (user) {
            return helpers.error('string.emailNotUnique', { value });
        }
        return value
    }, 'Unique Email').messages({
        "string.emailNotUnique": "Email already exists",
    }),
    password: joi.string().min(8).max(30).required().pattern(new RegExp('^[a-zA-Z0-9]+$')),
})

module.exports = {
    registerSchema
}