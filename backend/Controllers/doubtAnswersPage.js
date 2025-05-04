const Doubt = require('../Models/questionModel.js');
const Answer = require('../Models/answerModel.js');
const User = require('../Models/userModel.js');
const mongoose = require('mongoose');

const postDoubts = async (req, res, next) => {
  const { question, tags } = req.body;
  const { userID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ message: "Invalid User ID format." });
  }
  if (!question || question.trim() === '') {
    return res.status(400).json({ message: "Question text cannot be empty." });
  }

  try {
    // Verify user exists
    const user = await User.findById(userID);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    const newDoubt = new Doubt({
      question: question,
      userID: userID,
      answers: [],
      tags: tags || [] // Ensure tags is an array
    });

    const savedDoubt = await newDoubt.save();
    console.log("Saved Doubt: ", savedDoubt);
    // Optionally populate user info before sending back
    await savedDoubt.populate('userID', 'username email profilePic');
    res.status(201).json(savedDoubt);
  } catch (error) {
    console.error("Error posting doubt:", error)
    res.status(500).json({ message: "Failed to post doubt. " + error.message });
    // next(error);
  }
};

const postAnswers = async (req, res, next) => {
  try {
    const { answer, quesid } = req.body; // Removed userid from body, use param
    const { userID } = req.params; // Get user ID from route parameter

     if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(quesid)) {
       return res.status(400).json({ message: "Invalid User or Question ID format." });
     }
     if (!answer || answer.trim() === '') {
       return res.status(400).json({ message: "Answer text cannot be empty." });
     }

    // Find question and user concurrently
    const [question, user] = await Promise.all([
        Doubt.findById(quesid),
        User.findById(userID)
    ]);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
     if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // --- Optional: Check if user already answered this question ---
    // const existingAnswer = await Answer.findOne({ question: quesid, userID: userID });
    // if (existingAnswer) {
    //     return res.status(400).json({ error: 'You have already answered this question.' });
    // }
    // --- End Check ---


    const newAnswer = new Answer({
      userID: userID,
      answerText: answer,
      upvote: 0,
      downvote: 0,
      question: quesid
    });
    const savedAnswer = await newAnswer.save();

    // Add answer ref to question and user (if needed)
    question.answers.push(savedAnswer._id);
    // user.questionList.push(quesid); // This seems wrong, user didn't ASK the question by answering
    await Promise.all([question.save()/*, user.save()*/]); // Save concurrently


    // Populate user info before sending back
    await savedAnswer.populate('userID', 'username email profilePic');
    res.status(201).json(savedAnswer); // Use 201 for created

  } catch (error) {
    console.error("Error posting answer:", error);
    res.status(500).json({ message: "Failed to post answer. " + error.message });
    // next(error);
  }
};

const getDoubts = async (req, res, next) => {
  try {
    const doubts = await Doubt.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('userID', 'username email profilePic') // Populate author details
      .populate({ // Populate answers and their authors
           path: 'answers',
           populate: {
             path: 'userID',
             select: 'username email profilePic' // Select fields for answer author
           },
           options: { sort: { upvote: -1, createdAt: 1 } } // Sort answers by votes, then date
         })
      .exec();
    res.status(200).json(doubts);
  } catch (error) {
    console.error("Error getting doubts:", error);
    res.status(500).json({ message: "Failed to get doubts. " + error.message });
    // next(error);
  }
};

const getAnswers = async (req, res, next) => {
    const { doubtID } = req.params; // Use doubtID for clarity
    if (!mongoose.Types.ObjectId.isValid(doubtID)) {
       return res.status(400).json({ message: "Invalid Doubt ID format." });
     }
  try {
    // Check if doubt exists
    const doubtExists = await Doubt.findById(doubtID).select('_id');
    if(!doubtExists){
        return res.status(404).json({ message: "Doubt/Question not found." });
    }

    const answers = await Answer.find({ question: doubtID })
                                .populate('userID', 'username email profilePic') // Populate author details
                                .sort({ upvote: -1, createdAt: 1 }); // Sort by votes, then date

    res.status(200).json(answers); // Just return the array of answers
  } catch (error) {
    console.error("Error getting answers:", error);
    res.status(500).json({ message: "Failed to get answers. " + error.message });
    // next(error);
  }
};

const putVotes = async (req, res, next) => {
  try {
    // userID of the person VOTING (should come from auth middleware)
    // const votingUserID = req.fire_user._id; // Placeholder
    const { userid: votingUserID_from_body, type } = req.body; // TEMPORARY: Get voter from body until auth is implemented
    const { answerID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(answerID) || !mongoose.Types.ObjectId.isValid(votingUserID_from_body)) {
       return res.status(400).json({ error: 'Invalid Answer or User ID format.' });
    }
    if (type !== 'upvote' && type !== 'downvote') {
        return res.status(400).json({ error: 'Invalid vote type. Must be "upvote" or "downvote".' });
    }

    // Find Answer, Answer's Author (userToCredit), and Voter concurrently
    const [answer, voter] = await Promise.all([
        Answer.findById(answerID),
        User.findById(votingUserID_from_body) // Use ID from body TEMPORARILY
    ]);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
     if (!voter) {
      return res.status(404).json({ error: 'Voting user not found' });
    }

    // Find the user whose answer is being voted on
    const userToCredit = await User.findById(answer.userID);
     if (!userToCredit) {
      // This case is unlikely if answer exists, but good to handle
      return res.status(404).json({ error: 'Author of the answer not found' });
    }

    // --- Prevent Self-Voting (Optional) ---
    // if (answer.userID.equals(votingUserID_from_body)) {
    //     return res.status(400).json({ error: "You cannot vote on your own answer." });
    // }
    // --- End Self-Voting Check ---


    const alreadyUpvoted = voter.upVoted.includes(answerID);
    const alreadyDownvoted = voter.downVoted.includes(answerID);

    let scoreChange = 0;
    let pullFromUpvoted = false;
    let pushToUpvoted = false;
    let pullFromDownvoted = false;
    let pushToDownvoted = false;

    if (type === 'upvote') {
      if (alreadyUpvoted) {
        // Remove upvote (toggle off)
        scoreChange = -1;
        pullFromUpvoted = true;
      } else {
        // Add upvote
        scoreChange = 1;
        pushToUpvoted = true;
        if (alreadyDownvoted) {
          // Remove downvote if switching
          scoreChange += 1; // Extra point for removing downvote
          pullFromDownvoted = true;
        }
      }
    } else { // type === 'downvote'
      if (alreadyDownvoted) {
        // Remove downvote (toggle off)
        scoreChange = +1; // Give back the point
        pullFromDownvoted = true;
      } else {
        // Add downvote
        scoreChange = -1;
        pushToDownvoted = true;
        if (alreadyUpvoted) {
          // Remove upvote if switching
          scoreChange -= 1; // Remove the point from the upvote
          pullFromUpvoted = true;
        }
      }
    }

    // Update voter's voted lists
    if (pullFromUpvoted) voter.upVoted.pull(answerID);
    if (pushToUpvoted) voter.upVoted.addToSet(answerID); // Use addToSet to be safe
    if (pullFromDownvoted) voter.downVoted.pull(answerID);
    if (pushToDownvoted) voter.downVoted.addToSet(answerID); // Use addToSet

    // Update answer's vote counts (more reliable way)
    answer.upvote = await User.countDocuments({ upVoted: answerID });
    answer.downvote = await User.countDocuments({ downVoted: answerID });


    // Update credit score of the answer's author
    userToCredit.creditScore += scoreChange;


    // REMOVED: Unnecessary timestamp manipulation
    // const seconds = Math.floor(answer.timestamp.getTime() / 1000);
    // const dateFromTimestamp = new Date(seconds * 1000);
    // answer.timestamp = dateFromTimestamp;


    // Save all changes concurrently
    await Promise.all([answer.save(), voter.save(), userToCredit.save()]);

    res.status(200).json({
        message: 'Vote processed successfully',
        data: { upvote: answer.upvote, downvote: answer.downvote }
    });

  } catch (error) {
    console.error("Error processing vote:", error);
    res.status(500).json({ error: 'Failed to process vote. ' + error.message });
    // next(error);
  }
}


module.exports = {
  postDoubts,
  postAnswers,
  getDoubts,
  getAnswers,
  putVotes
};