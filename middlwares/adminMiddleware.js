
const adminMiddleware = (req, res, next) => {
    
    if (req.user.role !== "admin") {
        return res.status(401).json({ message: "UnAuthorized" })
    }
    next()
}


module.exports = adminMiddleware