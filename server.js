const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Add this line

// Load env vars from the root .env file
dotenv.config();

// Connect to database
connectDB();

// Route files
const quizRoutes = require('./routes/quizRoutes');
const resultRoutes = require('./routes/resultRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Configure CORS
const allowedOrigins = [
  'http://localhost:3000', // Your local React development server
  'https://your-frontend-domain.netlify.app' // Replace with your Netlify URL
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions)); // Add this block

// Body parser middleware to accept JSON
app.use(express.json());

// Mount routers
app.use('/api/questions', quizRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));