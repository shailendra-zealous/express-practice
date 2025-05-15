const joi = require('joi');

const registerSchema = joi.object({
    firstname: joi.string().min(3).max(30).required(),
    lastname: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(30).required().pattern(new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'))

})

module.exports = {
    registerSchema
}