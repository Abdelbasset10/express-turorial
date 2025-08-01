const express = require("express")
const router = express.Router()
const authMiddleWare = require("../middlwares/authMiddleware")
const adminMiddleWare = require("../middlwares/adminMiddleware")
const { getAllTodos, createTodo, updateTodo, getTodoDetails, deleteTodo } = require("../controllers/todos")

router.get("/",authMiddleWare,getAllTodos );

router.post("/", authMiddleWare, adminMiddleWare,createTodo );

router.get("/:id",getTodoDetails );


router.put("/:id",updateTodo );

router.delete("/:id",deleteTodo );


module.exports  = router


