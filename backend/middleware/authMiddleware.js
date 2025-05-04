// middleware/authMiddleware.js
const admin = require('firebase-admin');
const User = require('../Models/userModel'); // Adjust path: '../' goes up one level from middleware to backend root, then into Models
const mongoose = require('mongoose'); // Import mongoose if needed (e.g., for ID validation)
// const Project = require('../Models/projectModel'); // Import Project if using isProjectOwner

// --- Initialize Firebase Admin SDK ---
// This should run ONLY ONCE when the application starts
try {
  // Check if already initialized to prevent errors during hot-reloading
  if (!admin.apps.length) {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS)
      });
      console.log("Firebase Admin SDK Initialized Successfully.");
    } else {
      console.error("!!! Firebase Admin SDK Initialization Failed: GOOGLE_APPLICATION_CREDENTIALS environment variable not set.");
      // Consider how critical Firebase is. Exit or just warn?
      // process.exit(1); // Uncomment to exit if Firebase is essential
    }
  } else {
    console.log("Firebase Admin SDK already initialized."); // Log if already initialized
  }
} catch (error) {
  console.error("!!! Firebase Admin SDK Initialization Error:", error);
  // process.exit(1); // Uncomment to exit if Firebase is essential
}
// --- End Initialization ---


// --- Middleware Function ---
const verifyFirebaseToken = async (req, res, next) => {
  console.log(`--- verifyFirebaseToken Middleware running for URL: ${req.originalUrl} ---`); // Log entry

  // Check if SDK initialized before trying to use it
  if (!admin.apps.length) {
    console.error("Middleware Error: Firebase Admin SDK not initialized. Cannot verify token.");
    // Send a generic server error as this is a configuration issue
    return res.status(500).json({ message: 'Server configuration error preventing authentication.' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

  console.log("Received Token in Header:", token ? "Yes" : "No"); // Log if token exists

  if (!token) {
    console.log("Middleware Error: No token provided in Authorization header.");
    // Changed message to be more specific
    return res.status(401).json({ message: 'No authentication token provided. Access denied.' });
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Token verified successfully for UID:", decodedToken.uid);

    // Token is valid, get user details (email is often used as the unique link)
    const { email, name, picture } = decodedToken;

    if (!email) {
       console.error("Middleware Error: Token verified but email is missing.", decodedToken);
       return res.status(400).json({ message: 'Valid token but email missing from token.' });
    }

    // Find or create user in MongoDB based on email
    let user = await User.findOne({ email: email });

    if (!user) {
      // If user doesn't exist, create them
      console.log(`Creating new user in DB for email: ${email}`);
      user = new User({
        // firebaseUid: uid, // Consider adding this field to your userModel.js
        email: email,
        username: name || email.split('@')[0],
        profilePic: picture || '', // Use picture from token if available
        creditScore: 30, // Default score
        // Ensure other default fields from userModel are handled if needed
      });
      await user.save();
      console.log(`New user created with ID: ${user._id}`);
    } else {
      console.log(`Found existing user in DB with ID: ${user._id}`);
      // Optional: Update user info if it changed in Firebase (name, picture)
      let updated = false;
      if (name && user.username !== name) { user.username = name; updated = true; }
      if (picture && user.profilePic !== picture) { user.profilePic = picture; updated = true; }
      if (updated) {
        await user.save();
        console.log(`User profile updated for ID: ${user._id}`);
      }
    }

    // Attach the user document *from your MongoDB* to the request object
    req.fire_user = user; // Use this name consistently in controllers
    console.log("Middleware Success: Attaching dbUser:", user._id);

    next(); // Proceed to the next middleware or the route handler

  } catch (error) {
    // Handle token verification errors
    console.error('!!! Middleware Error: Error verifying Firebase token:', error.code, error.message);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Authentication token expired. Please log in again.' });
    }
    if (error.code === 'auth/argument-error') {
      return res.status(401).json({ message: 'Invalid authentication token format.' });
    }
    // For other verification errors (e.g., token revoked, invalid signature)
    return res.status(403).json({ message: 'Authentication token is invalid or could not be verified. Forbidden.' });
  }
};

// --- Optional: Middleware to check if user is project owner ---
// Ensure you import 'Project' model if using this
/*
const isProjectOwner = async (req, res, next) => {
    console.log(`--- isProjectOwner Middleware running for URL: ${req.originalUrl} ---`);
    try {
        const projectId = req.params.projectId || req.params.id || req.params.projectID;
        const userId = req.fire_user?._id; // Assumes verifyFirebaseToken ran first

        if (!userId) {
            return res.status(401).json({ message: "Authentication required (User ID missing)." });
        }
        if (!projectId) {
            return res.status(400).json({ message: "Project ID parameter is missing." });
        }
         if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid Project ID format." });
        }

        const project = await Project.findById(projectId).select('owner');
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        if (!project.owner.equals(userId)) {
            console.log(`Authorization Failed: User ${userId} is not owner of project ${projectId} (Owner: ${project.owner})`);
            return res.status(403).json({ message: "Forbidden: You are not the owner of this project." });
        }

        console.log(`Authorization Success: User ${userId} IS owner of project ${projectId}`);
        req.project = project; // Optionally attach project for downstream use
        next();
    } catch (error) {
         console.error("!!! Error in isProjectOwner middleware:", error);
         res.status(500).json({ message: "Server error during ownership check." });
    }
}
*/

// Export the middleware function(s)
module.exports = { verifyFirebaseToken /*, isProjectOwner */ };