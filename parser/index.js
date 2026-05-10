const express=require("express");
const mongoose=require("mongoose");
const mongoConfig=require("./database/db");
const logModel=require("./model/log");
const parseLog=require("./modules/parser");
const serviceModel = require("./model/service");
const { connectProducer, sendLog } = require("./kafka/producer");
const app=express();
const port=5000;

app.use(express.json());
app.use(express.text({type:"text/plain"}));

const startServer = async () => {
    try {
        await connectProducer();
        console.log("Producer connected successfully");
        
        await mongoose.connect(mongoConfig.mongouri);
        console.log("Connected to database");
        
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

app.post("/logs",async(req,res)=>{
    try{ 
        const apiKey=req.headers["api_key"];                
        
        if (!apiKey) {
            return res.status(401).json({ error: "API key missing" });
        }

        console.log(apiKey);
        
        
        const service= await serviceModel.findOne({api_key:apiKey});
        
        if (!service) {
            return res.status(403).json({ error: "Invalid API key" });
        }

        const applicationId=service._id;

        const parsed=parseLog(req.body);
        console.log("Parsed log:", parsed);
        parsed.applicationId=applicationId;
        
        const kafkaResult = await sendLog(parsed);
        console.log("Kafka send result:", kafkaResult);
        
        res.status(200).json({ 
            success: true, 
            message: "Log received and sent to Kafka",
            kafkaResult 
        });
    }catch(err){
        console.error("Error in /logs endpoint:", err);
        res.status(500).json({error: "Internal server error", details: err.message});
    }
})