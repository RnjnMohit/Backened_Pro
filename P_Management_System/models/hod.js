const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {  
        type: String,  
        required:true,
    },
    id:{
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
    }
})

module.exports = mongoose.model('hod', hodSchema);
