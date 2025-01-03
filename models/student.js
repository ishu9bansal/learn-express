const mongoose = require('mongoose');
const gradeSchema = mongoose.Schema({
    course: String,
    score: Number,
    maxScore: Number,
    date: {
        type: Date,
        default: Date.now,
    },
});

const StudentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gpa: {
        type: Number,
        default: 3,
    },
    courses: {
        type: [String],
        default: ["Math"]
    },
    age: {
        type: Number,
        max: 100,
        min: 1,
        validate: {
            validator: val => val % 2 === 0,
            message: prop => `${prop.value} is not an even number`,
        }
    },
    grades: {
        type: [gradeSchema],
        default: [],
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    clubs: [{
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
    }],
});

module.exports = mongoose.model('Student', StudentSchema);
