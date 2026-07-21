const { Redis } = require('@upstash/redis');

const client = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const connectRedis = async () => {
  console.log("Redis Connected");
};

module.exports = { client, connectRedis };