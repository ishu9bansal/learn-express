const express = require('express');
const fs = require('fs');
const url = require('url');

const app = express();

app.use(express.json());

app.get("/students", (req, res) => {
    console.log(req.url);
    const parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl.query.result);
    fs.readFile('./data.json', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.json(JSON.parse(data));
    })
});

app.post("/students", (req, res) => {
    console.log(req.url);
    console.log(req.body);
    res.json(req.body);
});

app.listen(5050);
