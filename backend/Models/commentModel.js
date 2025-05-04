const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: `User` },
  projectID: { type: mongoose.Schema.Types.ObjectId, ref: `Project` },
  review: { type: String },
  rating: { type: Number, min: 0, max: 5 },
});

// export const Feedback = mongoose.model('Feedback', feedbackSchema);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;

// const User = mongoose.model('User', userSchema);
// module.exports = User;