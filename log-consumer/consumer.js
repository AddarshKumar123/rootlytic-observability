const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const mongoConfig  = require("./database/db");
const checkDuplicate = require("./dedupService");
const {client, connectRedis} = require('./redisClient');

const logSchema = new mongoose.Schema({}, { strict: false });
const Log = mongoose.model("Logs", logSchema);

const kafka = new Kafka({
  clientId: "logs-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "log-group" });

const run = async () => {
  try {
    await connectRedis();
    console.log("Redis Connected");
    
    await mongoose.connect(mongoConfig.mongouri);
    console.log("Connected to MongoDB");
    
    await consumer.connect();
    console.log("Kafka Consumer Connected");
    
    await consumer.subscribe({ topic: "logs", fromBeginning: true });
    console.log("Subscribed to topic: logs");

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const log = JSON.parse(message.value.toString());
          console.log("Received log:", log);

          const duplicateResult = await checkDuplicate(log);
          if (duplicateResult.isDuplicate) {
            console.log("Duplicate log detected, skipping...");
            return;
          }

          const savedLog = await Log.create(log);
          console.log("Log saved to MongoDB:", savedLog._id);
        } catch (parseError) {
          console.error("Failed to parse or save message:", parseError);
          console.error("Raw message:", message.value.toString());
        }
      },
    });
  } catch (error) {
    console.error("Consumer error:", error);
  }
};

run();