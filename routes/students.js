const express = require('express');
const fs = require('fs');
const router = express.Router();
const db = require('../connection');
const collection = db.collection('students');
const mongodb = require('mongodb');


router.get("/", async (req, res) => {
    try {
        const students = await collection.find().toArray();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", getObjectId, async (req, res) => {
    try {
        const student = await collection.findOne({
            _id: req.o_id,
        });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", (req, res) => {
    console.log(req.body);

    const { id, name } = req.body;
    const newStudent = { id, name };
    req.students.push(newStudent);
    fs.writeFile('./students.json', JSON.stringify(req.students), function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "unable to open a file while writing on server" });
            return;
        }
        res.status(201).json(newStudent);
    })
});

router.patch("/:id", (req, res) => {
    console.log("Editing:", req.params.id);
    console.log(req.body);
    let students;
    try {
        students = fs.readFileSync('./students.json');
        students = JSON.parse(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "unable to open a file on server" });
        return;
    }
    students = students.map(student => {
        return student.id == req.params.id ? { ...student, ...req.body, id: req.params.id } : student;
    });
    fs.writeFile('./students.json', JSON.stringify(students), function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "unable to open a file while writing on server" });
            return;
        }
        res.json({
            message: "Updated successfully"
        });
    })
});

router.delete("/:id", (req, res) => {
    console.log("Deleting:", req.params.id);
    let students;
    try {
        students = fs.readFileSync('./students.json');
        students = JSON.parse(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "unable to open a file on server" });
        return;
    }
    students = students.filter(student => student.id != req.params.id);
    fs.writeFile('./students.json', JSON.stringify(students), function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "unable to open a file while writing on server" });
            return;
        }
        res.json({
            message: "Deleted successfully"
        });
    })
});

function getObjectId(req, res, next) {
    const o_id = new mongodb.ObjectId(req.params.id);
    req.o_id = o_id;
    next();
}

module.exports = router;