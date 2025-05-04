// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');
const { verifyFirebaseToken } = require('../middleware/authMiddleware'); // We'll create this middleware

// POST /api/auth/verify
// Client sends Firebase ID Token in Authorization header: Bearer <token>
// Middleware verifies token, finds/creates user, attaches user to req.fire_user
router.post('/verify', verifyFirebaseToken, async (req, res) => {
    // If middleware succeeds, req.fire_user contains the user document from MongoDB
    if (req.fire_user) {
        // You might want to generate your own session token/JWT here
        // or just confirm success and let the client store the Firebase token
        res.status(200).json({
            message: "Token verified successfully.",
            user: req.fire_user // Send back the user data found/created in DB
        });
    } else {
        // This case should ideally be handled by the middleware sending a 401/403
        res.status(401).json({ message: "Authentication failed." });
    }
});

// Example: Get current logged-in user data (protected route)
// GET /api/auth/me
router.get('/me', verifyFirebaseToken, (req, res) => {
     res.status(200).json(req.fire_user);
});


// REMOVED: All /microsoft routes
// REMOVED: /userData route (client handles Firebase state)

// Kept /userdata/mobile - Check if this endpoint is truly needed with Firebase Client SDK
// If it's just fetching user by email, it's redundant if client has Firebase Auth state.
// If needed, protect it properly.
router.get('/userdata/mobile', async (req, res) => { // Needs protection!
    try {
        const userEmail = req.query.email;
        if (!userEmail) {
            return res.status(400).json({ error: 'Email parameter is required' });
        }
        // TODO: Add protection - Is the requestor allowed to fetch this user's data?
        let existingUser = await User.findOne({ email: userEmail }).select('-password'); // Exclude sensitive fields if any
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(existingUser);
    } catch (error) {
        console.error('Error fetching mobile user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;