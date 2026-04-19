const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    _id:{
        type:String
    },
    api_key:{
        type:String
    }
    

})

const serviceModel=mongoose.model("applications",serviceSchema);
module.exports=serviceModel;
