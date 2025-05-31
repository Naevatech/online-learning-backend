import mongoose from "mongoose";
const adminSchema =  new mongoose.Schema({
    name:{type:String, required: true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    course:[]
})

const adminModel =mongoose.models.admin || mongoose.model("admin", adminSchema)

export default adminModel


