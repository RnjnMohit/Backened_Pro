const express = require('express')
const router = express.Router();
const User = require('../models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');
const bcrypt = require('bcrypt');
const Book = require('../models/books');

router.get('/getAllBooks', async(req,res) => {
    try{
        const books = await Book.find({});
        if(!Book){
            return res.status(400).json({message: 'No books found'});
        }

        return res.status(200).json({message: 'Successfully retrieved all books', data : books});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Internal server error'});
    }
})

module.exports = router;