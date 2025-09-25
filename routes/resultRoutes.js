const express = require('express');
const { submitResult } = require('../controllers/resultController');

// Initialize the express router
const router = express.Router();

// Define the route for submitting a result.
// A POST request to /api/results/ will trigger the submitResult function from the "Result Controller" Canvas.
router.route('/').post(submitResult);

module.exports = router;

