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
    updatedAt: Date,
});

StudentSchema.methods.calculateGpa = function () {
    if (!this.grades.length) return 0;

    const totalScore = this.grades.reduce((sum, grade) => sum + grade.score, 0);
    const totalMaxScore = this.grades.reduce((sum, grade) => sum + grade.maxScore, 0);
    return (totalScore / totalMaxScore) * 10; // Example GPA calculation
};

StudentSchema.virtual('clubsCount').get(function () {
    return this.clubs.length;
});

StudentSchema.virtual('currentGpa').get(function () {
    return this.calculateGpa();
});

StudentSchema.set('toJSON', { virtuals: true });

StudentSchema.pre('save', function (next) {
    console.log(`Student ${this.name} is about to be saved.`);
    this.updatedAt = Date.now();
    next();
});

StudentSchema.post('save', function (doc, next) {
    console.log(`Student ${doc.name} has been saved.`);
    next();
});

module.exports = mongoose.model('Student', StudentSchema);
