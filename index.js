const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const todosRoutes = require("./routes/todos.routes")
const authsRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")

const app = express();

let corsOptions = {
    origin: ['http://localhost:5173'],
}

app.use(cors(corsOptions));

app.use(express.json());

app.use("/todos",todosRoutes)
app.use("/auth",authsRoutes)
app.use("",userRoutes)


mongoose.connect("mongodb://localhost:27017/todos-app")
    .then(() => {
        console.log("Connected to MongoDb...")
        app.listen(5000, () => {
            console.log("The server is starting")
        })
    }).catch((err) => {
        console.log(err)
    });
