const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  tag: [{ type: String, required: true }],
  courseName: { type: String, required: true },
  courseDesc: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: `User` },
  feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: `Feedback` }],
  rating: { type: Number, min: 0, max: 5 },
  linkToCourse: { type: String },
});

// export const Course = mongoose.model('Course', courseSchema);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

// const User = mongoose.model('User', userSchema);
// module.exports = User;
