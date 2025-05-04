// index.js (Backend Root)

// Load environment variables FIRST
require('dotenv').config();

// --- DEBUGGING ---
// Add these lines to check if the variables are loaded from .env
console.log('--- DEBUGGING process.env ---');
console.log('MONGO_URI from env:', process.env.MONGO_URI);
console.log('GOOGLE_APPLICATION_CREDENTIALS from env:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log('--- END DEBUGGING ---');
// --- END DEBUGGING ---


// --- Core Dependencies ---
const express = require('express');
const cors = require('cors');

// --- Database Connection ---
const connectDB = require('./Config/db'); // Assuming db.js is in Config relative to index.js
// Connect to MongoDB early
connectDB(); // This will now use the potentially debugged value

// --- Route Handlers ---
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoute');
const courseRoutes = require('./routes/courseRoute');
const userRoutes = require('./routes/userRoute');
const collabsRoutes = require('./routes/collabsRoute');
const doubtsRoutes = require('./routes/doubtsRoute');

// --- Initialize Express App ---
const app = express();

// --- Core Middleware ---
// Enable CORS - Adjust origin for production!
app.use(cors({ origin: 'http://localhost:3000' })); // Allows requests from your default React frontend port
// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
// Mount the routers onto specific base paths
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collabs', collabsRoutes); // Handles chat, etc. Base path looks okay.
app.use('/api/doubts', doubtsRoutes);

// --- Simple Root Route for Testing ---
app.get('/', (req, res) => {
    res.send('CollabConnect API Running!');
});

// --- Central Error Handling Middleware (Must be defined AFTER routes) ---
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err); // Log the full error stack or error itself
    res.status(err.status || 500).json({
         message: err.message || 'Something went wrong on the server!',
         // Provide error stack in development environment only for debugging
         stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// --- Start Server ---
const PORT = process.env.PORT || 3001; // Use port from .env or default to 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));