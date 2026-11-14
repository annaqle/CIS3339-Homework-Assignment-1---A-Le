const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });
const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const app = express();
app.use(cors());
app.use(express.json());

// Return students in the same format as before: { name, id, phone, zip }
const STUDENT_FIELDS = { _id: 0, name: 1, id: 1, phone: 1, zip: 1 };
const COURSE_FIELDS = { _id: 0, courseId: 1, courseName: 1 };

// Endpoint to list all students
app.get('/list-students', async (req, res) => {
    try {
        const students = await Student.find({}, STUDENT_FIELDS).sort({ name: 1 });
        res.send(students);
    } catch (error) {
        console.error('Error listing students:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to search for a student by name
app.post('/find-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const student = await Student.findOne({ name }, STUDENT_FIELDS);
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        res.send(student);
    } catch (error) {
        console.error('Error finding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to save a student
app.post('/add-student', async (req, res) => {
    try {
        const { name, id, phone, zip } = req.body;
        if (!name || !id || !phone || !zip) {
            return res.status(400).send({ error: 'All fields (name, id, phone, zip) are required' });
        }

        const newStudent = { name, id, phone, zip };
        await Student.create(newStudent);

        res.status(201).send({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({ error: 'A student with this ID already exists' });
        }
        console.error('Error adding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to delete a student by name
app.post('/delete-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const deletedStudent = await Student.findOneAndDelete({ name });
        if (!deletedStudent) {
            return res.status(404).send({ error: 'Student not found' });
        }

        // Also remove this student's enrollments
        await Enrollment.deleteMany({ student: deletedStudent._id });

        const { id, phone, zip } = deletedStudent;
        res.send({ message: 'Student deleted successfully', student: { name, id, phone, zip } });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to list all courses
app.get('/list-courses', async (req, res) => {
    try {
        const courses = await Course.find({}, COURSE_FIELDS).sort({ courseId: 1 });
        res.send(courses);
    } catch (error) {
        console.error('Error listing courses:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to save a course
app.post('/add-course', async (req, res) => {
    try {
        const { courseId, courseName } = req.body;
        if (!courseId || !courseName) {
            return res.status(400).send({ error: 'All fields (courseId, courseName) are required' });
        }

        const newCourse = { courseId, courseName };
        await Course.create(newCourse);

        res.status(201).send({ message: 'Course added successfully', course: newCourse });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({ error: 'A course with this ID already exists' });
        }
        console.error('Error adding course:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to delete a course by course ID
app.post('/delete-course', async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).send({ error: 'Course ID is required' });
        }

        const deletedCourse = await Course.findOneAndDelete({ courseId });
        if (!deletedCourse) {
            return res.status(404).send({ error: 'Course not found' });
        }

        // Also remove this course's enrollments
        await Enrollment.deleteMany({ course: deletedCourse._id });

        res.send({ message: 'Course deleted successfully', course: { courseId, courseName: deletedCourse.courseName } });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to enroll a student in a course
app.post('/enroll-student', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        if (!studentId || !courseId) {
            return res.status(400).send({ error: 'Student and course are required' });
        }

        const student = await Student.findOne({ id: studentId });
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).send({ error: 'Course not found' });
        }

        await Enrollment.create({ student: student._id, course: course._id });

        res.status(201).send({ message: 'Student enrolled successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({ error: 'This student is already enrolled in this course' });
        }
        console.error('Error enrolling student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to list the students enrolled in a course
app.post('/course-students', async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).send({ error: 'Course ID is required' });
        }

        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).send({ error: 'Course not found' });
        }

        const enrollments = await Enrollment.find({ course: course._id }).populate('student', STUDENT_FIELDS);
        res.send(enrollments.map((enrollment) => enrollment.student));
    } catch (error) {
        console.error('Error listing course students:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Serve the Vue production build (frontend/dist)
const DIST_DIR = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(DIST_DIR));

// Send index.html for any other page so Vue Router pages work after a refresh
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Start the server
const PORT = 3000;
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        // Create the collections and unique indexes if they do not exist yet
        await Student.init();
        await Course.init();
        await Enrollment.init();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Could not connect to MongoDB:', error.message);
        process.exit(1);
    });
