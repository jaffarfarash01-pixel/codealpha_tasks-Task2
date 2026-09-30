const mongoose=require("mongoose");
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true,minlength:6},role:{type:String,enum:["user","organizer"],default:"user"}},{timestamps:true});
module.exports=mongoose.model("User",schema);