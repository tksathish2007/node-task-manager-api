const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.query.token || req.header('Authorization').replace('Bearer ','')
        // console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)  
        // console.log(decoded)      
        const user = await User.findOne({
            '_id' : decoded._id, 
            'tokens.token' : token
        })
        // console.log(user)

        if(!user) {
            res.status(500).send({error : 'User not found'})    
        }

        req.user = user
        next()
    } catch (e) {
        res.status(401).send({error : 'Authentication required'})
    }
}

module.exports = auth