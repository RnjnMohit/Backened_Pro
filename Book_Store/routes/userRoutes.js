const express = require('express')
const router = express.Router()
const User = require('../models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');
const bcrypt = require('bcrypt');

router.post('/signup', async(req,res) => {
    try{
        const data = req.body;
        const adminUser = await User.findOne({role: "admin"})
        console.log(data.role);

        if(data.role === 'admin' && adminUser){
            return res.status(400).json({message: 'admin already exist'});
        }

        const existingUser = await User.findOne({email: data.email});
        if(existingUser){
            return res.status(400).json({message: 'User already exist'});
        }

        const newUser = new User(data);
        const response = await newUser.save();
        console.log('data created');
        
        //generate token and set it
        const payload = {
            id: response.id
        }

        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        
        return res.status(200).json({response: response, token: token });
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.post('/login', async(req,res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password ) {
            return res.status(400).json({ message: "Missing fields" })
        }
        // Find the user by their Aadhar card number in the database
        let user = await User.findOne({email: email});

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid email and Password'});
        }

        const payload = {
            id: user.id,
        }

        const token = generateToken(payload);

        console.log(`Welcome  ${user.name}`); 
        return res.status(200).json({message: 'Logged In successfully', token: token});
    }catch(err){
        console.log(err);
        res.status(200).json({error: 'Interna server error'});
    }
})

module.exports = router;