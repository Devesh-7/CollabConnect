// Config/db_fire.js
require("dotenv").config({ path: __dirname + '/../.env' }); // Adjust path if .env is in root
const { Firestore } = require('@google-cloud/firestore'); // Correct import capitalization

let dbInstance = null;

const connectDB_fire = () => {
    if (dbInstance) {
        // console.log("Returning existing Firestore instance."); // Optional logging
        return dbInstance;
    }

    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
         console.error("Firestore connection failed: GOOGLE_APPLICATION_CREDENTIALS environment variable not set.");
         // Decide how to handle this: throw error, return null, etc.
         // For now, we'll let it potentially crash later if accessed, forcing setup.
         // Or return null and check elsewhere:
          return null;
    }

    try {
        // Extract projectId from credentials if not set explicitly
        const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const serviceAccount = require(keyFilename); // Load the key file
        const projectId = serviceAccount.project_id; // Get projectId from the key file


        console.log(`Attempting to connect Firestore with Project ID: ${projectId}`);
        dbInstance = new Firestore({
            projectId: projectId, // Use projectId from service account
            keyFilename: keyFilename,
        });
        console.log(`Firestore Connected (Project: ${projectId})`);
        return dbInstance;
    } catch (error) {
        console.error(`Firestore Connection Error: ${error.message}`);
        // Consider if process.exit() is too drastic. Maybe just log and return null.
        // process.exit(1);
        return null; // Allow app to potentially run without Firestore if it's optional
    }
};

// Call connectDB_fire() once when the module loads to initialize
const firestoreDB = connectDB_fire();

// Export the instance directly or a function to get it
module.exports = firestoreDB; // Export the initialized instance
// Or: module.exports = { getFirestoreInstance: connectDB_fire };

