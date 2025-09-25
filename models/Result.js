const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    userAnswer: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
    },
}, {_id: false});

const ResultSchema = new mongoose.Schema({
    // This will be added later when you have user authentication
    // userId: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'User' 
    // },
    quizType: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    correctAnswers: {
        type: Number,
        required: true,
    },
    incorrectAnswers: {
        type: Number,
        required: true,
    },
    answers: [AnswerSchema], // This embeds the array of answers
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Result', ResultSchema);
