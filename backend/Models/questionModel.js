const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  question: { type: String, required: true },
  userID: {  type: mongoose.Schema.Types.ObjectId, ref: `User`, required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: `Answer` }],
  tags: [{ type: String }],
});

const Doubt = mongoose.model('Doubt', doubtSchema);
module.exports = Doubt;
