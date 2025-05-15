const joi = require('joi');

const registerSchema = joi.object({
    firstname: joi.string().min(3).max(30).required(),
    lastname: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(30).required().pattern(/^[a-zA-Z0-9]{8,30}$/),
})

module.exports = {
    registerSchema
}