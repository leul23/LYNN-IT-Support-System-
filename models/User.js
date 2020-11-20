const mongoose =require('mongoose');
const UserSchema=new mongoose.Schema({
    First_name:{
        type:String,
        required:true
    },
    Last_name:{
        type:String,
        required:true
    },
    Signup_username:{ 
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    signup_password:{
        type:String,
        required:true
    },
    Signup_plan:{
        type:String,
        required:true
    }
   

});


const User=mongoose.model('User', UserSchema);
module.exports=User;