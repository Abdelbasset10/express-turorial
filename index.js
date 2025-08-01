const express = require("express")
const mongoose = require("mongoose")
const Todo = require('./models/Todo')
const User = require("./models/User")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authMiddleWare = require("./middlwares/authMiddleware")
const adminMiddleWare = require("./middlwares/adminMiddleware")

//create the server
const app = express()

let corsOptions = {
    origin: ['http://localhost:5173'],
}

app.use(cors(corsOptions))

app.use(express.json())



//get all todos
app.get("/todos", authMiddleWare, async (req, res) => {
    try {
        const todos = await Todo.find()

        res.json({ message: "Todos has been fetched successfuly", data: todos })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

// create new todo
app.post("/todos", authMiddleWare, adminMiddleWare, async (req, res) => {
    try {
        console.log("post todods", req.user.email)
        const newTodo = new Todo({
            name: req.body.name,
            createdBy: req.user.email
        })

        await newTodo.save()

        const todos = await Todo.find()

        res.json({ message: "Todo has been created succesfully", todos: todos })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

// get todo details

app.get("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id })

        res.json({ message: "Todo details", todo: todo })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

// Update specific todo

app.put("/todos/:id", async (req, res) => {
    try {
        const todoId = req.params.id;

        const todo = await Todo.findOne({ _id: todoId })

        if (!todo) {
            return res.status(404).json({ message: "Todo does not exists" })
        }

        await Todo.updateOne({ _id: todoId }, {
            name: req.body.name
        })

        const updatedTodo = await Todo.findOne({ _id: todoId })

        res.status(200).json({ message: "Todo has been updated successfully", todo: updatedTodo })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete user

app.delete("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id })

        if (!todo) {
            return res.status(404).json({ message: "Todo does not exists" })
        }

        await Todo.deleteOne({ _id: req.params.id })


        res.status(200).json({ message: `Todo with name of ${todo.name} has been deleted succesfully` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post("/register", async (req, res) => {
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
})

app.post("/login", async (req, res) => {
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

        const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, "SECRET_JWT", {
            expiresIn: "1h"
        })

        res.status(200).json({ message: "Loged in successfully", user: user, token: token })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

app.get("/profile", authMiddleWare, async (req, res) => {
    try {
        const userId = req.user.id

        const connectedUser = await User.findOne({_id:userId})

        res.status(200).json({message:"User details",user:connectedUser})
    } catch (error) {
        res.status(500).json(error.message)
    }
})

//Connect to Database and start the server in success state
mongoose.connect("mongodb://localhost:27017/todos-app")
    .then(() => {
        console.log("Connected to MongoDb...")
        app.listen(5000, () => {
            console.log("The server is starting")
        })
    }).catch((err) => {
        console.log(err)
    })
