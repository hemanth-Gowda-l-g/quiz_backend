const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Utility function to sign a JWT
const getSignedJwtToken = (id, role, username) => {
    return jwt.sign({ user: { id, role, username } }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};


// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    // Destructure all the new fields from the request body
    const { username, name, email, age, gender, password, role } = req.body;

    try {
        // Check if a user with the given email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User with that email already exists' });
        }

        // Create a new user instance with all the new data.
        // The password will be automatically hashed by the pre-save hook in the User model from the Canvas.
        user = await User.create({
            username,
            name,
            email,
            age,
            gender,
            password,
            role, // role will be 'user' or 'admin' based on frontend logic
        });

        // Create a token for the new user to log them in immediately
        const token = getSignedJwtToken(user._id, user.role, user.username);
        res.status(201).json({ success: true, token });

    } catch (error) {
        console.error(error.message);
        // Provide more specific error messages if possible (e.g., from mongoose validation)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages });
        }
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

// @desc    Login a user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Use bcrypt to compare the submitted password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // If credentials are correct, issue a new token
        const token = getSignedJwtToken(user._id, user.role, user.username);
        res.status(200).json({ success: true, token });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

