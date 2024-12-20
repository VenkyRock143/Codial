const mongoose = require('mongoose');
const env = require('./environment');


mongoose.connect(env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

module.exports = db;
