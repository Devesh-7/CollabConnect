const mongoose = require('mongoose');

const collaboratorSchema = new mongoose.Schema({ // Define sub-schema for clarity
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' } // Added 'rejected' status
}, { _id: false }); // Don't create separate _id for collaborators array elements

const projectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  tags: [{ type: String }],
  status: { type: String, enum: ['completed', 'ongoing'], default: 'ongoing' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Made owner required
  perHeadCredits: { type: Number, default: 0 },
  collaborators: [collaboratorSchema], // CHANGED: Renamed from Devesh Dhyanis
  rating: { type: Number, min: 0, max: 5, default: 0},
  deployedLink: { type: String, default: '' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Removed problematic pre-save hook
}, { timestamps: true });

// REMOVED: Custom validation pre-save hook for comments.
// Handle comment uniqueness logic in the controller if needed.

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;