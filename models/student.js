const mongoose = require('mongoose');
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
    age: Number,
});

module.exports = mongoose.model('Student', StudentSchema);
