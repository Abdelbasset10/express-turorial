const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
    name:String,
    isArchived:Boolean,
    createdBy:String
})

module.exports = mongoose.model("Todo",todoSchema)





