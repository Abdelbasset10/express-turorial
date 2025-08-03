const Todo = require("../models/Todo")

const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find().populate("user",{name:1,email:1,_id:0})

        res.json({ message: "Todos has been fetched successfuly", data: todos })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const createTodo = async (req, res) => {
    try {
        const newTodo = new Todo({
            name: req.body.name,
            user:req.user.id
        })

        await newTodo.save()

        const todos = await Todo.find()

        res.json({ message: "Todo has been created succesfully", todos: todos })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }
}

const getTodoDetails = async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id }).populate("user",{name:1})

        res.json({ message: "Todo details", todo: todo })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

const updateTodo = async (req, res) => {
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
}

const deleteTodo = async (req, res) => {
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
}

module.exports = {
    getAllTodos,
    createTodo,
    getTodoDetails,
    updateTodo,
    deleteTodo
}

