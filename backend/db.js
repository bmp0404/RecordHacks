// handles connection to MongoDB
// db.js
require('dotenv').config();
const mongoose = require('mongoose');


async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}


module.exports = connectDB;


// file exports a function that you can call in your entry point before starting your server.
