const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: `User` },
  courseID: { type: mongoose.Schema.Types.ObjectId, ref: `Course` },
  review: { type: String },
  rating: { type: Number, min: 0, max: 5 },
});

// export const Feedback = mongoose.model('Feedback', feedbackSchema);

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;

// const User = mongoose.model('User', userSchema);
// module.exports = User;
