const mongoose= require('mongoose')
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        default:'https://img.icons8.com/fluency/96/000000/user-male-circle.png'
    }

},{timestamps:true})


const UserSchema= new mongoose.model('User',userSchema)

module.exports=UserSchema;
