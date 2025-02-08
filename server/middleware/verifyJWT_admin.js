const jwt = require('jsonwebtoken')

const verifyJWT_admin = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({message:'Forbidden'})
            if(!decoded.is_admin) return res.status(403).json({message:'Forbidden'})
            req.admin = decoded
            next()
        }
    )
}
module.exports = verifyJWT_admin