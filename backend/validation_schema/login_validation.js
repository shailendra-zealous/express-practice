const joi = require('joi');

const loginValidation = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})

module.exports = {
    loginValidation
}