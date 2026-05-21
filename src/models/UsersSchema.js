import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name:{
    type:String,
    required:true,
    minLength:[4,"minimum 4 required"]
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"mini 8 characters"]
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'

    }
},
{
    timestamps:true
}


)

 const Users = mongoose.model('user',UserSchema)
 export default Users