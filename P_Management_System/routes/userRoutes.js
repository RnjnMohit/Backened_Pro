const express = require('express')
const router = express.Router()
const Hod = require('../models/hod');
const Teacher = require('../models/teacher');
const Student = require('../models/student');
const { jwtAuthMiddleware, generatedToken } = require('../jwt');
const bcrypt = require("bcrypt");


const checkAdminRole = async (userID) => {
    try{
        const user = await Hod.findById(userID);
        if(user.role === "HOD"){
            return true;
        }
    }catch(err){
        return false;
    }
}

// Route for HOD sign-up
router.post('/signup', async (req, res) => {
    try {
        const { name, email, hid, password, department } = req.body;
        console.log(name);

        // Check if HOD with the same email already exists
        const existingHod = await Hod.findOne({ email });
        if (existingHod) {
            return res.status(400).json({ message: 'HOD already exists' });
        }

        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
        }
        catch(err) {
            return res.status(500).json({
                success:false,
                message:'Error inn hashing Password',
            });
        }


        // Create a new HOD
        const hod = new Hod({ name, email, hid, password:hashedPassword, department });
        const savedHod = await hod.save();

        // Generate JWT token for the HOD
        const token = generatedToken({ id: savedHod._id });

        res.status(201).json({ hod: savedHod, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Route for HOD login
router.post('/login', async (req, res) => {
    try {
        const data = req.body;

        // Check if HOD with the provided email exists
        const hod = await Hod.findOne({ hid: data.hid });
        
        if(!hod){
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            });
        }

        if (await bcrypt.compare(data.password, hod.password)) {
            // Passwords match
            const payload = {
                id: hod._id,
            };

            // Generate JWT token for the authenticated HOD
            const token = generatedToken(payload);

            res.status(200).json({
                success: true,
                token,
                message: 'User logged in successfully',
            });
        } else {
            // Passwords do not match
            return res.status(403).json({
                success: false,
                message: 'Password incorrect',
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 

// Route to get all students
router.get('/getStudents', jwtAuthMiddleware, async (req, res) => {
    try {
        // const students = await Student.find({year: {$gte:3}});
        let query = {};
        
        if(req.query.regno){
            query.regno = req.query.regno;
        }

        if(req.query.year){
            query.year = req.query.year;
        }

        if(req.query.phoneNumber){
            query.phoneNumber = req.query.phoneNumber;
        }

        const students = await Student.find(query);

        res.json(students);

        console.log(students.length);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to create a new student
router.post('/cstudent', jwtAuthMiddleware, async (req, res) => {
    if(!(await checkAdminRole(req.user.id))) {
        return res.status(403).json({message: 'User does not have admin access'});
    }
    const student = new Student({
        name: req.body.name,
        regno: req.body.regno,
        year: req.body.year,
        phoneNumber: req.body.phoneNumber,
        emailId: req.body.emailId,
        branch: req.body.branch,
        password: req.body.password
    });

    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to get a single student
router.get('/students/:id', jwtAuthMiddleware, getStudent, (req, res) => {
    res.json(res.student);
});

// Route to update a student
router.patch('/updateStudents/:id', jwtAuthMiddleware, getStudent, async (req, res) => {
    if (req.body.name != null) {
        res.student.name = req.body.name;
    }
    if (req.body.regno != null) {
        res.student.regno = req.body.regno;
    }
    // Update other fields as needed...

    try {
        const updatedStudent = await res.student.save();
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to delete a student
router.delete('/delStudents/:id', jwtAuthMiddleware, getStudent, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Student' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a single student by ID
async function getStudent(req, res, next) {
    let student;
    try {
        const student = await Student.findById(req.params.id);
        if (student == null) {
            return res.status(404).json({ message: 'Cannot find student' });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.student = student;
    next();
}

// Route to get all teachers
router.get('/getTeachers', jwtAuthMiddleware,  async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to create a new teacher
router.post('/cteachers', jwtAuthMiddleware,  async (req, res) => {
    const teacher = new Teacher({
        name: req.body.name,
        email: req.body.email,
        department: req.body.department,
        experience: req.body.experience,
        id: req.body.id,
        password: req.body.password
    });

    try {
        const newTeacher = await teacher.save();
        res.status(201).json(newTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to get a single teacher
router.get('/teacher/:id', jwtAuthMiddleware, getTeacher, (req, res) => {
    res.json(res.teacher);
});

// Route to update a teacher
router.patch('/updateTeacher/:id', jwtAuthMiddleware, getTeacher, async (req, res) => {
    if (req.body.name != null) {
        res.teacher.name = req.body.name;
    }
    // Update other fields as needed...

    try {
        const updatedTeacher = await res.teacher.save();
        res.json(updatedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to delete a teacher
router.delete('/delTeacher/:id', jwtAuthMiddleware, getTeacher, async (req, res) => {
    try {
        await Teacher.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Teacher' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a single teacher by ID
async function getTeacher(req, res, next) {
    let teacher;
    try {
        teacher = await Teacher.findOne({id: req.params.id});
        if (teacher == null) {
            return res.status(404).json({ message: 'Cannot find teacher' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.teacher = teacher;
    next();
}


module.exports = router;
