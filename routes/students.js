const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Profile = require('../models/profile');
const Club = require('../models/club');

router.get("/", async (req, res) => {
    try {
        const students = await Student.find().populate('profile');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('profile');
        const currentGpa = student.currentGpa;

        res.json({ student, currentGpa });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post("/:id/club", async (req, res) => {
    try {
        const club = await Club.findById(req.body._id);
        const student = await Student.findById(req.params.id);
        if (club.students.includes(student.id)) {
            return res.status(400).json({ message: "Student already registered" });
        }
        club.students.push(student.id);
        await club.save();
        student.clubs.push({
            _id: club.id,
            name: club.name,
        });
        const ack = await student.save();
        res.json(ack);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/:id/profile", async (req, res) => {
    try {
        const newProfile = new Profile(req.body);
        const profile = await newProfile.save();

        const student = await Student.findById(req.params.id);
        student.profile = profile._id;
        const ack = await student.save();
        res.json(ack);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/:id/grades", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        student.grades.push(req.body);
        const ack = await student.save();
        res.json(ack);
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