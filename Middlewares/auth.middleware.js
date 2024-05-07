const jwt = require('jsonwebtoken')
const User = require('../Models/user.model')

const authMiddlware = async  (req, res, next) => {
    const token = req.header("Authorization")
    if(!token){
        return res.status(401).json({
            message : "Token not found"
        })
    }

    const jwttoken = token.replace("Bearer ", "").trim()

    if(!jwttoken){
        return res.status(401).json({
            message : "Token not found"
        })
    }

    try {
        const decoded = await jwt.verify(jwttoken, "dkjfhskhfkjsdf")
        const user = await User.findById(decoded.id).select({password : 0})
        req.user = user
        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = authMiddlware