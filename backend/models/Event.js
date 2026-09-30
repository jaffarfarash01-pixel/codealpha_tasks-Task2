const mongoose=require("mongoose");
const schema=new mongoose.Schema({title:{type:String,required:true,trim:true},description:{type:String,required:true,trim:true},date:{type:Date,required:true},location:{type:String,required:true,trim:true},capacity:{type:Number,required:true,min:1}},{timestamps:true});
module.exports=mongoose.model("Event",schema);