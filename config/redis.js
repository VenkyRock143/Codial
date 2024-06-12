const redis = require('redis');
require('dotenv').config();
const RedisStore = require('connect-redis').default;

// Initialize Redis client
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    legacyMode: true // add this if you're using redis v4+
});

redisClient.connect().catch(console.error);

redisClient.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
});

// Initialize Redis store
const redisStore = new RedisStore({ client: redisClient });

module.exports = {
    redisClient,
    redisStore
};
