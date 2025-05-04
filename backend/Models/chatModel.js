const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  projectID: {type: mongoose.Schema.Types.ObjectId, ref: `Project`},
  projectName: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: `User` }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: `Message` }],
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports=Chat;
