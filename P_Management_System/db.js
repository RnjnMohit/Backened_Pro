const mongoose = require('mongoose');

require('dotenv').config();

const mongoUrl = process.env.MONGODB_URL

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('MongoDB connection successfull');
})

db.on('error', () => {
    console.log('MongoDB connection error');
})

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
})

module.exports = db;