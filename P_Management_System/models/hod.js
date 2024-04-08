const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const hodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {  
        type: String,  
        required:true,
    },
    hid:{
        type:String,
        required:true,
    },
    password :{ 
        type: String,  
        required: true  
    },
    department:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
        enum:['HOD','Teacher','Student'],
        default:'HOD',
    }
})

module.exports = mongoose.model('hod', hodSchema);