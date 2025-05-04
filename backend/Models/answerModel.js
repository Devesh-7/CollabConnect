const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: `User` },
  answerText: { type: String },
  timestamp: { type: Date, default: Date.now },
  upvote: { type: Number, default: 0},
  downvote: { type: Number, default: 0},
  question: { type: mongoose.Schema.Types.ObjectId, ref: `Doubt` },
});

const Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;
