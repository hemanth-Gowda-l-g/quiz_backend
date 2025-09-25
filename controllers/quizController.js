const Question = require('../models/Question');
const Result = require('../models/Result');

// @desc    Get all questions
// @route   GET /api/questions
exports.getQuestions = async (req, res, next) => {
    try {
        const questions = await Question.find();
        res.status(200).json({ success: true, count: questions.length, data: questions });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to fetch questions' });
    }
};
exports.getEasyQuestions = async (req, res, next) => {
    try {
        const stats = await Result.aggregate([
            // Stage 1: Deconstruct the answers array field from the input documents to output a document for each element.
            { $unwind: '$answers' },
            
            // Stage 2: Group documents by questionId and calculate the total attempts and correct attempts.
            {
                $group: {
                    _id: '$answers.questionId',
                    totalAttempts: { $sum: 1 },
                    correctAttempts: {
                        $sum: {
                            $cond: [{ $eq: ['$answers.isCorrect', true] }, 1, 0]
                        }
                    }
                }
            },

            // Stage 3: Filter groups to only include those where total attempts equals correct attempts.
            {
                $match: {
                    $expr: { $eq: ['$totalAttempts', '$correctAttempts'] }
                }
            },

            // Stage 4: Join with the questions collection to get the full question details.
            {
                $lookup: {
                    from: 'questions', // The name of the questions collection in MongoDB
                    localField: '_id',
                    foreignField: '_id',
                    as: 'questionDetails'
                }
            },
            
            // Stage 5: Deconstruct the questionDetails array.
            { $unwind: '$questionDetails' },

            // Stage 6: Replace the root with the questionDetails for a cleaner output.
            { $replaceRoot: { newRoot: '$questionDetails' } }
        ]);

        res.status(200).json({ success: true, count: stats.length, data: stats });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching stats' });
    }
};
// @desc    Create a question
// @route   POST /api/questions
exports.createQuestion = async (req, res, next) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json({ success: true, data: question });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
exports.updateQuestion = async (req, res, next) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the modified document
            runValidators: true, // Run schema validators
        });

        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        res.status(200).json({ success: true, data: question });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
exports.deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);

        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete question' });
    }
};

