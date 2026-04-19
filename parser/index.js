const express=require("express");
const mongoose=require("mongoose");
const mongoConfig=require("./database/db");
const logModel=require("./model/log");
const parseLog=require("./modules/parser");
const serviceModel = require("./model/service");
const app=express();
const port=5000;

app.use(express.json());
app.use(express.text({type:"text/plain"}));

mongoose.connect(mongoConfig.mongouri)
    .then(()=>console.log("connected to db"))
    .catch((err)=>console.log("connection error",err))

app.post("/logs",async(req,res)=>{
    try{ 
        const apiKey=req.headers["api_key"];
        
        if (!apiKey) {
            return res.status(401).json({ error: "API key missing" });
        }

        const service= await serviceModel.findOne({api_key:apiKey});

        if (!service) {
            return res.status(403).json({ error: "Invalid API key" });
        }

        const applicationId=service._id;

        const parsed=parseLog(req.body);
        parsed.applicationId=applicationId;
        await logModel.create(parsed);
    }catch(err){
        console.log(err);
        res.json({error: "something went wrong"});
    }
})

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})