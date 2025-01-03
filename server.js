const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
const express = require('express');
require('./mongoose_conn');

const app = express();

app.use(express.json());

app.use(logger);

app.get("/", async (req, res) => {
    console.log(req.query);
    const cursor = collection.find();
    const results = await cursor.toArray();
    res.json(results);
});


const studentsRouter = require('./routes/students');
app.use('/students', studentsRouter);
const clubsRouter = require('./routes/clubs');
app.use('/clubs', clubsRouter);

function logger(req, res, next) {
    console.log(req.method);
    console.log(req.url);
    next();
}

app.listen(PORT);
