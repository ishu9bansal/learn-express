const express = require('express');
const router = express.Router();
const Student = require('../models/student');

router.get("/", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    console.log(req.body);
    try {

        const newStudent = new Student(req.body);
        const student = await newStudent.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/:id", async (req, res) => {
    console.log("Editing:", req.params.id);
    console.log(req.body);
    try {
        const student = await Student.findById(req.params.id);
        Object.assign(student, req.body);
        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    console.log("Deleting:", req.params.id);
    try {
        const acknowledgement = await Student.findByIdAndDelete(req.params.id);
        res.json(acknowledgement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;