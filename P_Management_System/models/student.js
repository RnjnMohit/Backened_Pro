const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    regno:{
        type:String,
        required:true,
        unique:true,
    },
    year:{
        type:Number,
        required:true,
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    emailId :{
        type: String,  
        lowercase: true,  
        // trim: true,  
        required: [true,"Please provide an Email Id"],  
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid e-mail address"]  
    },
    branch:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
})

module.exports = mongoose.model('student', studentSchema);