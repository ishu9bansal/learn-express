const express = require('express');
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

router.post("/", async (req, res) => {
    console.log(req.body);
    try {
        const acknowledgement = await collection.insertOne(req.body);
        res.json(acknowledgement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

router.patch("/:id", getObjectId, async (req, res) => {
    console.log("Editing:", req.params.id);
    console.log(req.body);
    try {
        const acknowledgement = await collection.updateOne({ _id: req.o_id }, {
            $set: req.body,
        });
        res.json(acknowledgement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", getObjectId, async (req, res) => {
    console.log("Deleting:", req.params.id);
    try {
        const acknowledgement = await collection.deleteOne({ _id: req.o_id });
        res.json(acknowledgement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

function getObjectId(req, res, next) {
    const o_id = new mongodb.ObjectId(req.params.id);
    req.o_id = o_id;
    next();
}

module.exports = router;