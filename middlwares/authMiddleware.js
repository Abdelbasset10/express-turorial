const jwt = require("jsonwebtoken")

const authMiddleWare = (req, res, next) => {
    let token = req.headers.authorization
    if (token) {
        token = token.split(" ")[1]
        try {
            const decodedToken = jwt.verify(token, "SECRET_JWT")
            
            req.user = decodedToken
            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({message:"UnAuthorized"})
        }
        
    }else {
        res.status(401).json({message:"UnAuthorized"})
    }

}


module.exports = authMiddleWare