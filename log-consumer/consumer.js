const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const express = require("express");
const mongoConfig  = require("./database/db");
const checkDuplicate = require("./dedupService");
const {client, connectRedis} = require('./redisClient');

const logSchema = new mongoose.Schema({}, { strict: false });
const Log = mongoose.model("Logs", logSchema);

const kafka = new Kafka({
  clientId: "logs-consumer",
  brokers: [process.env.KAFKA_BROKERS || "localhost:9092"],
  ssl: process.env.KAFKA_SSL === "true" ? {
    rejectUnauthorized: false
  } : false,
  sasl: process.env.KAFKA_SASL_MECHANISM ? {
    mechanism: process.env.KAFKA_SASL_MECHANISM,
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD
  } : undefined
});

const consumer = kafka.consumer({ groupId: "log-group" });

let kafkaConnected = false;
let redisConnected = false;
let mongoConnected = false;

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      kafka: kafkaConnected ? 'connected' : 'disconnected',
      redis: redisConnected ? 'connected' : 'disconnected',
      mongodb: mongoConnected ? 'connected' : 'disconnected'
    }
  };
  
  const allConnected = kafkaConnected && redisConnected && mongoConnected;
  res.status(allConnected ? 200 : 503).json(health);
});

const run = async () => {
  try {
    await connectRedis();
    redisConnected = true;
    console.log("Redis Connected");
    
    await mongoose.connect(mongoConfig.mongouri);
    mongoConnected = true;
    console.log("Connected to MongoDB");
    
    await consumer.connect();
    kafkaConnected = true;
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

    app.listen(PORT, () => {
      console.log(`Health check server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Consumer error:", error);
  }
};

run();