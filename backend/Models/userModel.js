const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, default: '' }, 
  email: { type: String, unique: true, default: '' }, 
  creditScore: { type: Number, default: 30 },
  tags: [{ type: String, default: [] }], 
  profilePic: { type: String, default: '' },
  githubID: { type: String, default: '' },
  designation: { type: String, default: '' },
  questionList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doubt', default: [] }],
  myLikedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: [] }],
  myProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: [] }],
  myCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: [] }],
  myCollabedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: [] }],
  upVoted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: [] }],
  downVoted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: [] }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
