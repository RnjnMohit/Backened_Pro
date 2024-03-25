const express = require('express')
const  app = express()
const db = require('./db');
require('dotenv').config();

const  PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const userRouter = require('./routes/userRoutes');
const booksRouter = require('./routes/booksRoutes');
app.use('/user', userRouter);
app.use('/books', booksRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

