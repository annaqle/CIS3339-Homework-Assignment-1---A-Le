const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });
const Student = require('./models/Student');

const app = express();
app.use(cors());
app.use(express.json());

// Return students in the same format as before: { name, id, phone, zip }
const STUDENT_FIELDS = { _id: 0, name: 1, id: 1, phone: 1, zip: 1 };

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

        const deletedStudent = await Student.findOneAndDelete({ name }, { projection: STUDENT_FIELDS });
        if (!deletedStudent) {
            return res.status(404).send({ error: 'Student not found' });
        }

        res.send({ message: 'Student deleted successfully', student: deletedStudent });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Connect to MongoDB, then start the server
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        await Student.init(); // creates the collection and the unique index on id
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Could not connect to MongoDB:', error.message);
        process.exit(1);
    });
