// const kue = require('kue');

// const queue = kue.createQueue();

// module.exports = queue;
const kue = require('kue');

// Create a new Kue queue with custom Redis configuration
const queue = kue.createQueue({
  redis: {
    host: 'redis-13613.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 13613,
    auth: '5JOmbb7y6q7PTaiAd2j7e4qwbqPcLyoj'
  }
});

// Handle Kue queue errors
queue.on('error', (err) => {
  console.log('Kue error: ', err);
});

// Export the queue for use in other modules
module.exports = queue;



