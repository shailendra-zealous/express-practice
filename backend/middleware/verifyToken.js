
const jwt = require('jsonwebtoken')
const db = require("../models")
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) {
        return res.status(403).json({ message: "No token provided!" })
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized!" })
        }
        const user = await db.User.findOne({ where: { id: decoded.id } })
        if (!user) {
            return res.status(404).json({ message: "User not found!" })
        }

        req.user = user
        req.userId = user.id

        next()
    })

}

module.exports = verifyToken