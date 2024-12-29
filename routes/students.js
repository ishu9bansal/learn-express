const express = require('express');
const fs = require('fs');
const router = express.Router();

router.use(getAllStudents);

router.get("/", (req, res) => {
    res.json(req.students);
});

router.get("/:id", getStudentById, (req, res) => {
    res.json(req.student);
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

function getAllStudents(req, res, next) {
    try {
        const students = fs.readFileSync('./students.json');
        req.students = JSON.parse(students);
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "unable to open a file on server" });
        return;
    }
    console.log("I will run too!");
}

function getStudentById(req, res, next) {
    req.student = req.students.find(student => student.id == req.params.id);
    if (!req.student) {
        console.log("No student found with id: ", req.params.id);
    }
    next();
}

module.exports = router;