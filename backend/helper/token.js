const jwt = require("jsonwebtoken")

function generateAccessToken(user) {
    return jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
}


function generateRefreshToken(user) {
    return jwt.sign({id: user.id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}