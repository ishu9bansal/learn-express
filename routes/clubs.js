const express = require('express');
const router = express.Router();
const Club = require('../models/club');
const Student = require('../models/student');

router.get("/", async (req, res) => {
    try {
        const clubs = await Club.find();
        res.json(clubs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        const students = await Student.find({ clubs: club.id }, { grades: 0, gpa: 0, courses: 0 }).populate('profile');
        res.json({ club, students });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    console.log(req.body);
    try {
        const newClub = new Club(req.body);
        const club = await newClub.save();
        res.json(club);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
