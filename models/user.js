const mongoose=require("mongoose")

const userschema=new mongoose.Schema({
    username:{
      type:String,
     
    },
    password:{
    type:String,
   
    }
});


module.exports = mongoose.model('User',userschema);