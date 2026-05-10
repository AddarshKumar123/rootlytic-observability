const {Kafka} = require("kafkajs")

const kafka=new Kafka({
    clientId:"logs_producer",
    brokers:["localhost:9092"]
})

const producer=kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer Connected");
  } catch (error) {
    console.error("Failed to connect Kafka producer:", error);
    throw error;
  }
};

const sendLog = async (log) => {
  
  try {    
    const result = await producer.send({
      topic: "logs",
      messages: [
        {
          value: JSON.stringify(log),
        },
      ],
    });
    console.log("Message sent to Kafka successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to send message to Kafka:", error);
    throw error;
  }
};

module.exports = {
  connectProducer,
  sendLog,
};
