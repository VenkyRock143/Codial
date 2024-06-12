const mongoose = require('mongoose');
const env = require('./environment');


mongoose.connect(env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});
// }).then(() => {
//     console.log('MongoDB connected successfully');
// }).catch((err) => {
//     console.error('Error connecting to MongoDB:', err.message);
// });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

module.exports = db;
