const User = require("../models/User")

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id

        const connectedUser = await User.findOne({ _id: userId }).populate("todos",{name:1,_id:0,user:0,isArchived:1})

        res.status(200).json({ message: "User details", user: connectedUser })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = {
    getProfile
}