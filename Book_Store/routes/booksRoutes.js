const express = require('express')
const router = express.Router();
const User = require('../models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');
const bcrypt = require('bcrypt');
const Book = require('../models/books');


const checkAdminRole = async (userID) => {
    try{
        const user = await User.findById(userID);

        if(user.role === 'admin'){
            return true;
        }
    }catch(err){
        return false;
    }
}

router.get('/getAllBooks', async(req,res) => {
    try{
        const books = await Book.find({});
        console.log(books.length);
        if(!Book){
            return res.status(400).json({message: 'No books found'});
        }

        return res.status(200).json({message: 'Successfully retrieved all books', data : books});
    }catch(err){
        console.log(error);
        return res.status(500).json({message:'Internal server error'});
    }
})

router.get('/getbooksCat', async(req,res) => {
    try{
        const category = req.query.category;

        if(!category){
            return res.status(400).json({ message: 'Category parameter is not found' });
        }

        const books = await Book.find({category: category});

        if(books.length === 0){
            return res.status(400).json({ message: "No book found for the given category" });
        }

        console.log(`Number of books found for the category "${category}": ${books.length}`)

        return res.status(200).json({message: 'Successfully Books found', data: books});
 
    }catch(err){
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }
})

router.get('/getbooksStars', async(req,res) => {
    try{
        const stars = req.query.stars;

        if(!stars){
            return res.status(400).json({ message: 'Starts parameter is not found'});
        }
        const books = await  Book.find({stars: stars});

        if(books.length === 0){
            return res.status(400).json({message: "No book found with this number of starts."});
        }

        console.log(`Number of books with "${stars}" stars: ${books.length}`);

        return res.status(200).json({message: "Book found Successful", data: books});
    }catch(error){
        console.log(error);
        return res.status(500).json({message: 'Internal server error'});
    }
})

router.post('/addBooks', jwtAuthMiddleware,  async(req,res) => {
    try{
        if(!(await checkAdminRole(req.user.id)))
            return res.status(403).json({message: 'User does not have a admin role'});

        const data = req.body;

        const newBook = new Book(data);

        const response = await newBook.save();
        console.log('data saved');
        res.status(200).json({response: response});
    }catch(err){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
})

router.delete('/:bookID', jwtAuthMiddleware, async(req,res) => {
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'User does not have admin role'});

        const bookID = req.params.bookID;

        const response = await Book.findByIdAndDelete(bookID);

        if(!response){
            return res.status(404).json({message: 'USER NOT FOUND'});
        }       

        console.log('Book successfully removed');
        return res.status(200).json(response);

    }catch(error){
        console.log(error);
        return res.status(500).json({message: 'Internal server error'});
    }
})

module.exports = router;