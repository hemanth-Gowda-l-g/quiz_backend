const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: [true, 'Please add question text'],
        trim: true,
    },
    options: {
        type: [String],
        required: true,
        validate: [val => val.length > 1, 'Please provide at least two options'],
    },
    correctAnswer: {
        type: String,
        required: [true, 'Please specify the correct answer'],
    },
    questionType: {
        type: String,
        required: [true, 'Please specify a question type'],
        default: 'General',
        trim: true,
    },
    difficulty: {
        type: String,
        required: [true, 'Please specify a difficulty level'],
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    marks: {
        type: Number,
        default: 1,
    },
    hasNegativeMarking: {
        type: Boolean,
        default: false,
    },
    negativeMarks: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Question', QuestionSchema);

