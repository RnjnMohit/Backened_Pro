const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type: String,
        required:true,
    
    },
    department:{
        type:String,
        required:true,
    },
    experience:{
        type:String,
        required:true,
    },
    id:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required: true,
    },
    studentEnrolled:{
        type:mongoose.Types.ObjectId,
    }
})

module.exports = mongoose.model('teacher', teacherSchema);