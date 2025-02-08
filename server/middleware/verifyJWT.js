

const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    console.log("789");
    
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(405).json({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({message:'Forbidden'})
            req.apartment = decoded
            next()
        }
    )
}
module.exports = verifyJWT