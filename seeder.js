const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Load models
// IMPORTANT: Make sure the path to your Question model is correct!
const Question = require('./models/Question'); 

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Read JSON files
const questions = JSON.parse(
    fs.readFileSync(`${__dirname}/data/questions.json`, 'utf-8')
);

// Import data into DB
const importData = async () => {
    try {
        await Question.create(questions);
        console.log('Data Imported Successfully...');
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Delete data from DB
const deleteData = async () => {
    try {
        await Question.deleteMany();
        console.log('Data Destroyed Successfully...');
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Check for command line arguments
if (process.argv[2] === '-i') {
    // To import, run: node seeder.js -i
    importData();
} else if (process.argv[2] === '-d') {
    // To delete, run: node seeder.js -d
    deleteData();
} else {
    console.log('Please add an option: -i to import data, -d to delete data');
    process.exit();
}