const express = require("express");
const router = express.Router();
const {
  getProjectById,
  postProject,
  getAllProjects,
  requestToJoinProject, // CHANGED
  approveCollaborator, // CHANGED
  rejectCollaborator,  // CHANGED
  getProjectComment,
  postProjectComment,
  completeProject
} = require("../Controllers/projectController.js");
// const { protect } = require('../middleware/authMiddleware'); // Placeholder for auth middleware

// --- Project CRUD ---
// POST /api/projects/add/:userID (UserID of creator)
router.post("/add/:userID", postProject); // Consider using protect middleware here
// GET /api/projects/fetch/all (?tags=tag1,tag2)
router.get("/fetch/all", getAllProjects);
// GET /api/projects/:id
router.get("/:id", getProjectById); // Changed param name for consistency
// POST /api/projects/complete/:projectID
router.post("/complete/:projectID", completeProject); // Consider using protect middleware (owner only)

// --- Comments ---
// GET /api/projects/comments/:projectID
router.get("/comments/:projectID", getProjectComment);
// POST /api/projects/comments/:projectID/:userID (UserID of commenter)
router.post("/comments/:projectID/:userID", postProjectComment); // Consider using protect middleware

// --- Collaborators ---
// POST /api/projects/join/:projectID/:userID (UserID requesting to join)
router.post("/join/:projectID/:userID", requestToJoinProject); // CHANGED, Consider using protect middleware
// POST /api/projects/approve/:projectId/:userId (User being approved)
router.post("/approve/:projectId/:userId", approveCollaborator); // CHANGED, Consider using protect middleware (owner only)
 // POST /api/projects/reject/:projectId/:userId (User being rejected)
router.post("/reject/:projectId/:userId", rejectCollaborator); // CHANGED, Consider using protect middleware (owner only)


module.exports = router;