const mongoose = require('mongoose');

require('dotenv').config();

const mongoURL = process.env.MONGODB_URL

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected', () => {
    console.log('MongoDB connected successfully');
});

db.on('error', () => {
    console.log('mongodb connection error');
});

db.on('disconnected', () => {
    console.log('Mongodb disconnected successfully');
});

module.exports = db;
