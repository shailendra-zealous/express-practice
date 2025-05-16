const bcrypt = require("bcrypt")

async function hashedPassword(password) {
    const defaultSalt = +process.env.JWT_SALT || 10
    const salt = await bcrypt.genSalt(defaultSalt)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

module.exports = {
    hashedPassword
}
