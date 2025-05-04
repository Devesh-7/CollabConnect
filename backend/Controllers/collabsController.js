// Controllers/collabsController.js
const User = require('../Models/userModel');
const Project = require('../Models/projectModel.js'); // Ensure correct path if needed
const Chat = require('../Models/chatModel.js');
const Message = require('../Models/messageModel.js');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const { getFirestoreInstance } = require("../Config/db_fire.js");

// --- Define functions as constants ---

const getCollabs = async (req, res, next) => { // Changed to const assignment
  try {
    const userId = req.params.userID;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID format." });
    }
    // console.log("Fetching collabs for UserID:", userId); // Optional debug log

    // Populate project details when fetching collabs
    const user = await User.findById(userId)
                           .populate({
                               path: 'myCollabedProjects',
                               model: 'Project', // Explicitly specify model name
                               select: 'title description owner rating status tags createdAt', // Select fields to populate
                               populate: { // Optionally populate owner within project
                                   path: 'owner',
                                   select: 'username email profilePic'
                               }
                           })
                           .lean(); // Use lean if you only need to read data

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const collabedProjects = user.myCollabedProjects || []; // Handle case where user might be found but has no projects
    res.status(200).json(collabedProjects); // Send back the populated projects array

  } catch (error) {
    console.error("Error fetching collabs:", error);
    res.status(500).json({ message: "Failed to fetch collaborations. " + error.message });
    // next(error); // Pass error to central handler if configured
  }
};

const getCollabById = async (req, res, next) => { // Changed to const assignment
  const projectId = req.params.projectID;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID format' });
  }

  try {
    // Find chat and populate messages, including the sender details within each message
    const chat = await Chat.findOne({ projectID: projectId })
                           .populate({
                               path: 'messages',
                               model: 'Message', // Explicitly specify model
                               options: { sort: { createdAt: 1 } }, // Sort messages chronologically
                               populate: { // Populate the user who sent the message
                                   path: 'userID',
                                   select: 'username email profilePic' // Select desired user fields
                               }
                           })
                           .lean(); // Use lean as we are just reading

    if (!chat) {
      // It's okay if a chat doesn't exist yet, return empty array
      // return res.status(404).json({ error: 'Chat not found for this project' });
      return res.status(200).json([]); // Return empty array if no chat found
    }

    // Messages are already sorted and populated by the query above
    const messages = chat.messages || [];

    res.status(200).json(messages); // Return the array of populated message objects

  } catch (error) {
     console.error("Error fetching chat messages:", error);
     res.status(500).json({ message: "Failed to fetch chat messages. " + error.message });
     // next(error);
  }
};


const postMessage = async (req, res, next) => { // Changed to const assignment
  try {
    const { userID, message } = req.body;
    const projectId = req.params.projectID;

    if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid User or Project ID format." });
    }
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: "Message content cannot be empty." });
    }

    const [user, chat] = await Promise.all([
      User.findById(userID).select('email username profilePic').lean(), // Include profilePic
      Chat.findOne({ projectID: projectId })
    ]);

    if (!user) return res.status(404).json({ error: 'User not found' });
    // If chat doesn't exist, we might want to create it? Or handle based on requirements.
    // For now, assume chat should exist if posting message is allowed.
    if (!chat) return res.status(404).json({ error: 'Chat not found for this project' });

    // --- Save to MongoDB ---
    const newMessageMongo = new Message({ userID: userID, message: message });
    const savedMongoMessage = await newMessageMongo.save();
    chat.messages.push(savedMongoMessage._id);
    await chat.save();

    // --- Save to Firestore ---
    const firestoreDB = getFirestoreInstance();
    if (firestoreDB) {
      try {
        const messageRef = firestoreDB.collection('chats').doc(projectId).collection('messages');
        await messageRef.add({
          mongoUserID: userID.toString(),
          username: user.username || user.email.split('@')[0],
          message: message,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          // Add user profile pic if available
          profilePic: user.profilePic || null
        });
        console.log("Message saved to Firestore.");
      } catch (firestoreError) {
        console.error("Failed to save message to Firestore:", firestoreError);
      }
    } else {
      console.warn("Firestore DB instance not available. Skipping Firestore save.");
    }

    // Respond with the newly created message, including populated sender info
    res.status(201).json({
      success: true,
      data: {
        _id: savedMongoMessage._id,
        message: savedMongoMessage.message,
        timestamp: savedMongoMessage.timestamp,
        userID: { // Embed sender details directly
          _id: user._id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic
        }
      },
      message: "Message added!"
    });

  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).send("Failed to post message. " + error.message);
  }
};


// --- Export the functions ---
module.exports = {
    getCollabs,
    getCollabById,
    postMessage
};
