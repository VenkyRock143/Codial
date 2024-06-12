// // config/redis.js
const Redis = require('ioredis');

// Load environment variables
require('dotenv').config();

const redis = new Redis({
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1',
    username: process.env.REDIS_USER || '',  // Optional
    password: process.env.REDIS_PASS || '',  // Optional
});

redis.on('connect', () => {
    console.log('Redis Connected');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = redis;




// // require('dotenv').config();
// // const RedisStore = require('connect-redis').default;

// // // Initialize Redis client
// // const redisClient = redis.createClient({
// //     url: process.env.REDIS_URL,
// //     legacyMode: true // add this if you're using redis v4+
// // });

// // redisClient.connect().catch(console.error);

// // redisClient.on('error', (err) => {
// //     console.error('Error connecting to Redis:', err);
// // });

// // redisClient.on('connect', () => {
// //     console.log('Connected to Redis successfully');
// // });

// // // Initialize Redis store
// // const redisStore = new RedisStore({ client: redisClient });

// // module.exports = {
// //     redisClient,
// //     redisStore
// // };
