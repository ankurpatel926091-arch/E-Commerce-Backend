const jwt = require('jsonwebtoken')
const auth = (req,res,next)=>{
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: "Token Missing" })
    }
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
    console.log('Auth middleware received authorization header:', authHeader)
    console.log('Auth middleware extracted token:', token)
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decode
        next()
    } catch (error) {
        console.error('Auth middleware error:', error.message)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token Expired', error: error.message })
        }
        res.status(401).json({ message: 'Invalid Token', error: error.message })
    }
}

module.exports=auth

