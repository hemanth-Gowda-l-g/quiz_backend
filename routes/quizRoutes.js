const express = require('express');
const {
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getEasyQuestions, // Import the new controller
} = require('../controllers/quizController');

const router = express.Router();

// Define the new route for stats before the route with a parameter
router.route('/stats/easy').get(getEasyQuestions);

// Route for getting all questions and creating a new one
router.route('/').get(getQuestions).post(createQuestion);

// Route for updating and deleting a specific question by its ID
router.route('/:id').put(updateQuestion).delete(deleteQuestion);

module.exports = router;
