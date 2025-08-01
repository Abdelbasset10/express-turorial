const express = require("express")
const authMiddleWare = require("../middlwares/authMiddleware")
const { getProfile } = require("../controllers/user")

const router = express.Router()

router.get("/profile", authMiddleWare, getProfile)

module.exports = router;