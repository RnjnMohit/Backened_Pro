const express = require('express')
const router = express.Router()
const hod = require('../models/hod');
const teacher = require('../models/teacher');
const student = require('../models/student');
const { jwtAuthMiddleware, generateToken } = require('../jwt');


const checkAdminRole = async (userID) => {
    try{
        const user = await hod.findById(userID);
        if(user.role === "HOD"){
            return true;
        }
    }catch(err){
        return false;
    }
}

router.post('/signup', jwtAuthMiddleware, async(req,res) => {
    try{
        if(!(await checkAdminRole(req.userId))){
            return res.status(403).json({message: "User is not a HOD, No Authentication"});
        }
        const data = req.body;
        const hodUser = await hod.findOne({role: "HOD"});
        const teacherUser = await teacher.findOne({email: data.email});
        const studentUser = await student.findOne({regno: data.regno});
        console.log(data.role);

        if(data.role === "HOD" && hodUser){
            return res.status(400).json({message: 'HOD already exists'});
        }

        if(data.role === "teacher" && teacherUser){
            return res.status(400).json({message: "Teacher already exists"});
        }else{
            const newTeacher = new teacher(data);
            const response = await newTeacher.save();
            console.log('Teacher data created');
        }

        if(data.role === "student" && studentUser){
            return res.status(400).json({message: 'Student already exists'});
        }

        const newStudent = new student(data);
        const response = await newStudent.save();
        console.log('Student data created');

    }catch(error){
        console.log(error);
        console.log('Internal server error');
    }
})