const express = require('express');

const PORT = 5050;

const app = express();

app.use(express.json());

app.use(logger);

app.get("/", (req, res) => {
    console.log(req.query);
    res.json({ message: "Hey Everone!" });
});


const studentsRouter = require('./routes/students');
app.use('/students', studentsRouter);

function logger(req, res, next) {
    console.log(req.method);
    console.log(req.url);
    next();
}

app.listen(PORT);
