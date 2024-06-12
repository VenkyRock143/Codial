const mongoose = require('mongoose');
const env = require('./environment');
<<<<<<< HEAD
// require('dotenv').config();
=======
>>>>>>> 7860ebadb21f87904f2c68df9a838b30a8a09eff

mongoose.connect(env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

module.exports = db;
