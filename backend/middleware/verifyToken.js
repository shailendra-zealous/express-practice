const jwt = require('jsonwebtoken')
const db = require("../models")
const { errorResponse } = require("../helper/response")


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) {
        return res.status(403).json({ message: "No token provided!" })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return errorResponse(res, "Unauthorized!", 401)
        }

        if (!decoded.id) {
            return errorResponse(res, "Invalid token!", 401)
        }

        const user = await db.User.findOne({ where: { id: decoded.id } })
        if (!user) {
            return errorResponse(res, "User not found!", 404)
        }

        req.user = user
        req.userId = user.id

        next()
    })

}

module.exports = verifyToken