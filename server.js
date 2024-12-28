const express = require('express');
const fs = require('fs');

const PORT = 5050;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    console.log(req.method);
    console.log(req.url);
    console.log(req.query);
    res.json({ message: "Hey Everone!" });
});

app.get("/students", (req, res) => {
    console.log(req.method);
    console.log(req.url);
    console.log(req.query);
    fs.readFile('./students.json', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "unable to open a file on server" });
            return;
        }
        const dataJson = JSON.parse(data);
        res.json(dataJson);
    });
});

app.get("/students/:id", (req, res) => {
    console.log(req.method);
    console.log(req.url);
    console.log("Fetching:", req.params.id);
    console.log(req.query);
    fs.readFile('./students.json', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "unable to open a file on server" });
            return;
        }
        const students = JSON.parse(data);
        const student = students.find(student => student.id == req.params.id);
        res.json(student);
    });
});

app.post("/students", (req, res) => {
    console.log(req.method);
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
    const { id, name } = req.body;
    const newStudent = { id, name };
    students.push(newStudent);
    fs.writeFile('./students.json', JSON.stringify(students), function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "unable to open a file while writing on server" });
            return;
        }
        res.status(201).json(newStudent);
    })
});

app.patch("/students/:id", (req, res) => {
    console.log(req.method);
    console.log(req.url);
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

app.delete("/students/:id", (req, res) => {
    console.log(req.method);
    console.log(req.url);
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
    res.json(students);
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

app.listen(PORT);
