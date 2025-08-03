const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
    name:String,
    isArchived:{type:Boolean,default:false},
    createdAt:{type:Date,default:new Date()},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
})

module.exports = mongoose.model("Todo",todoSchema)





