var mongoose = require("mongoose")

const EmployeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
})

module.exports = mongoose.model("employes", EmployeeSchema)