// Config/db.js
require("dotenv").config({path: __dirname+'/../.env'}); // Adjust path if .env is in root
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Ensure MONGO_URI is loaded correctly from .env
    if (!process.env.MONGO_URI) {
        console.error("Error: MONGO_URI is not defined in your .env file.");
        process.exit(1); // Exit if URI is missing
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true, // These options are deprecated in recent Mongoose versions
      // useUnifiedTopology: true, // And can be removed
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`); // Use console.error for errors
    process.exit(1); // Exit on connection error
  }
};

// --- THIS IS THE IMPORTANT LINE ---
module.exports = connectDB; // Make sure you are exporting the function directly
// --- END OF IMPORTANT LINE ---

// --- DO NOT do this: ---
// module.exports = { connectDB }; // Exporting an object containing the function
// --- OR ---
// exports.connectDB = connectDB; // Also exporting an object property