const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    applicationId:{
        type:String
    },
    service:{
        type:String
    },
    exceptionType:{
        type:String
    },
    severity:{
        type:String
    },
    message:{
        type:String
    },
    stack:{
        type:String
    },
    endpoint:{
        type:String
    },
    line:{
        type:Number
    },
    className:{
        type:String
    },
    fileName:{
        type:String
    },
    methodName:{
        type:String
    },
    timestamp:{
        type:String
    },
    AiFix:{
        type:String
    },
    parsedHash:{
        type:String
    },
    issueType:{
        type:String
    },
    clusterId:{
        type:String
    }

})

const logModel=mongoose.model("Logs",logSchema);
module.exports=logModel;
