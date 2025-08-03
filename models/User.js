const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    name:{type:String,required:true},
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
})

// connect the user with todos by creating virtual populate 
userSchema.virtual("todos",{
    ref:"Todo",
    localField:"_id",
    foreignField:"user"
})

//Ensure virtuals are included in json output
userSchema.set("toObject",{virtuals:true})
userSchema.set("toJSON",{virtuals:true})


module.exports = mongoose.model("User",userSchema)

