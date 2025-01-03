const mongoose = require('mongoose');

const clubSchema = mongoose.Schema({
    name: String,
    description: String,
    students: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Student',
    }
});

module.exports = mongoose.model('Club', clubSchema);