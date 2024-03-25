const express = require('express')
const router = express.Router();
const User = require('../models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

router.post('/signup', async(req,res) => {
    try{
        //body se data nikalo
        const data = req.body;
        // Check if there is already an admin user
        const adminUser = await User.findOne( { role: 'admin' });

        if(data.role === 'admin' && adminUser){
            return res.status(400).json({message: 'admin user already exist'});
        }
        // Validate Aadhar Card Number must have exactly 12 digit
        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }
        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({aadharCardNumber: data.aadharCardNumber});
        if(existingUser){
            return res.status(400).json({message: 'User with same adhar number already exist'});
        }

        // Create a new User document using the Mongoose model
        const newUser = new User(data);
        // Save the new user to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);

        res.status(200).json({response: response, token: token});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.post('/login', async(req,res) => {
    try{
        const { aadharCardNumber, password } = req.body;

        if(!aadharCardNumber || !password ) {
            return res.status(400).json({ message: "Missing fields" })
        }
        // Find the user by their Aadhar card number in the database
        let user = await User.findOne({aadharCardNumber: aadharCardNumber});

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid Adhar Number and Password'});
        }

        const payload = {
            id: user.id,
        }

        const token = generateToken(payload);

        res.json({token})
    }catch(err){
        console.log(err);
        res.status(200).json({error: 'Interna server error'});
    }
})

//Profile Router
router.put('/profile/password',jwtAuthMiddleware,  async(req,res) => {
    try{
        const { currentPassword, newPassword } = req.body;

        if(!currentPassword || !newPassword) {
            return res.status(400).json({message:"Please provide all required information."});
        }

        const userId = req.user.id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(401).json({error: 'Invalid current password'});
        }
        user.password = newPassword;
        await user.save();

        console.log('Passsword Updated');
        res.status(200).json({message: 'Password Updated'});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})

module.exports = router;