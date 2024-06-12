const kue = require('kue');

// Create a new Kue queue with custom Redis configuration
const queue = kue.createQueue({
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    auth: process.env.REDIS_PASS,
  }
});

// Handle Kue queue errors
queue.on('error', (err) => {
  console.log('Kue error: ', err);
});

// Export the queue for use in other modules
module.exports = queue;



