const Result = require('../models/Result');

// @desc    Submit a quiz result and save it to the database
// @route   POST /api/results
exports.submitResult = async (req, res, next) => {
    try {
        // The request body will contain all the quiz result data sent from the frontend
        const resultData = req.body; 

        // Create a new result document in the database
        const result = await Result.create(resultData);

        // Send a success response back to the frontend
        res.status(201).json({ 
            success: true, 
            data: result 
        });
    } catch (error) {
        // If there's an error, send a failure response
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};
