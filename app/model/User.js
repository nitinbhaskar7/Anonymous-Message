import mongoose from 'mongoose'
const MessageSchema = new mongoose.Schema({
    content: {
        type: String, 
        required: true

    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
    password : {
        type : String ,
        required : true 
    }, 
    verifyCode : {
        type : String ,
        required : true 
    },
    isVerified : {
        type : Boolean ,
        default : false 
    },
    verifyCodeExpiry : {
        type : Date ,
        required : true 
    },
    isAcceptingMessages : {
        type : Boolean ,
        defualt : true 
    },
    messages : {
        type : [MessageSchema]
    }
})

// in NextJS multiple times we might make of model because of Edge type nature of NextJS 

const userModel = mongoose.models.User || mongoose.model("User" , UserSchema) ;
export default userModel ;