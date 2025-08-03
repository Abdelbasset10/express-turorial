const User = require("../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    try {
        // Get the user informations
        const { userEmail, userPassword, userName } = req.body


        if (!userEmail || !userPassword || !userName) {
            return res.status(400).json({ message: "Missing informations" })
        }
        // Verify if the user already exists

        const isExistUser = await User.findOne({ email: userEmail });

        if (isExistUser) {
            return res.status(400).json({ message: "Email already has been taken" })
        }
        // add to DB

        const encryptedPassword = await bcrypt.hash(userPassword, 12)

        const newUser = new User({
            name: userName,
            email: userEmail,
            password: encryptedPassword
        })


        await newUser.save();
        // send the response

        res.status(201).json({ message: "User has been created succesfully", user: newUser })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const login = async (req, res) => {
    try {
        // get user inputs
        const { userEmail, userPassword } = req.body;

        // verify if some input is empty
        if (!userEmail || !userPassword) {
            return res.status(400).json({ message: "Missing data" })
        }
        // check if the user exists by eisValidPasswordmail
        const user = await User.findOne({ email: userEmail })

        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        //verify if is the password is valud
        const isValidPassword = await bcrypt.compare(userPassword, user.password)

        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        user.password = undefined

        const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })

        res.status(200).json({ message: "Loged in successfully", user: user, token: token })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    register,
    login
}