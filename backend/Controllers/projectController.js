// ... other imports ...
const Project = require("../Models/projectModel");
const Comment = require("../Models/commentModel.js");
const User = require("../Models/userModel");
const cloudinary = require("cloudinary").v2; // Assuming you might use this later
const streamifier = require("streamifier"); // Assuming you might use this later
const Chat = require("../Models/chatModel");

// Configure Cloudinary if needed (using .env variables)
// if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
//   cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET,
//   });
// } else {
//   console.warn("Cloudinary config not found in .env, image uploads may fail.");
// }


const postProject = async (req, res, next) => { // Added next for error handling
  const projectData = req.body;
  const userID = req.params.userID;

  if (!userID) {
      return res.status(400).json({ message: "User ID parameter is missing." });
  }
  if (!projectData.title || !projectData.description) {
      return res.status(400).json({ message: "Project title and description are required." });
  }


  try {
    const ownerUser = await User.findById(userID);
    if (!ownerUser) {
        return res.status(404).json({ message: "Owner user not found." });
    }

    const newProject = new Project({
      title: projectData.title,
      description: projectData.description,
      tags: projectData.tags || [],
      githubLink: projectData.githubLink,
      deployedLink: projectData.deployedLink,
      owner: userID,
      perHeadCredits: projectData.credits || 0,
      // CHANGED: Add owner as the first collaborator, status approved by default
      collaborators: [{ userID: userID, status: 'approved' }],
      comments: [],
      rating: 0,
      status: projectData.status || 'ongoing'
    });

    const savedProject = await newProject.save();

    // Update the owner User's record
    ownerUser.myProjects.push(savedProject._id);
    // NOTE: Add to myCollabedProjects only if owner should also be listed there by default
    ownerUser.myCollabedProjects.push(savedProject._id);
    await ownerUser.save();

    // Create the associated Chat
    const newChat = new Chat({
      projectID: savedProject._id,
      projectName: savedProject.title,
      members: [userID], // Start with owner
      messages: []
    });
    await newChat.save();

    res.status(201).json(savedProject);

  } catch (error) {
    console.error("Error posting project:", error);
    // Pass error to a potential central error handler
    // next(error);
    // Or send specific response
     if (error.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation Error: " + error.message });
     }
    res.status(500).json({ message: "Failed to create project. " + error.message });
  }
};

function calculateRating(comments) { // Ensure comments is always an array
  if (!comments || comments.length === 0) return 0;
  let sum = 0.0;
  for (let i = 0; i < comments.length; i++) {
     // Check if rating exists and is a number
     if (comments[i] && typeof comments[i].rating === 'number') {
        sum += comments[i].rating;
     }
  }
  return sum / comments.length;
}


const getAllProjects = async (req, res, next) => {
  // const { tags } = req.body; // GET request shouldn't typically have a body for filtering tags
  const tagsQuery = req.query.tags; // Use query parameters for tags: /projects?tags=react,node

  try {
    let query = {};
    if (tagsQuery) {
       const tagsArray = tagsQuery.split(',').map(tag => tag.trim());
       query.tags = { $in: tagsArray }; // Find projects containing any of the specified tags
    }

    // Populate owner details and maybe collaborators count?
    const projects = await Project.find(query)
                                  .populate('owner', 'username email profilePic') // Populate owner info
                                  .sort({ createdAt: -1 }); // Sort by newest first

    // Optionally filter based on tags *after* fetching if complex logic is needed
    // (Using $in is generally more efficient in the DB query)

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects. " + error.message });
    // next(error);
  }
};

const getProjectById = async (req, res, next) => {
    const projectId = req.params.id; // Use a more descriptive name
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Invalid Project ID format." });
    }
    try {
        const project = await Project.findById(projectId)
                                    .populate('owner', 'username email profilePic') // Populate owner
                                    .populate('collaborators.userID', 'username email profilePic') // Populate collaborators
                                    .populate('comments'); // Populate comments (maybe populate user within comments too?)

        if (!project) {
          return res.status(404).json({ message: "Project not found." }); // Use return to stop execution
        }
        res.status(200).json(project);
    } catch(error) {
         console.error(`Error fetching project ${projectId}:`, error);
         res.status(500).json({ message: "Failed to fetch project. " + error.message });
        // next(error);
    }
};

const postProjectComment = async (req, res, next) => {
  try {
    const { review, rating } = req.body;
    const { projectID, userID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectID) || !mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).json({ message: "Invalid Project or User ID format." });
    }

    if (!review || rating === undefined || rating === null || rating < 0 || rating > 5) {
        return res.status(400).json({ message: "Review text and a valid rating (0-5) are required." });
    }

    // Verify the project exists
    const project = await Project.findById(projectID);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found!" });
    }

    // --- Check if user has already commented (Logic moved from model) ---
    const existingComment = await Comment.findOne({ projectID: projectID, userID: userID });
    if (existingComment) {
       return res.status(400).json({ success: false, message: "You have already reviewed this project." });
    }
    // --- End Check ---

    // Create and save the new comment
    const newComment = new Comment({
      userID,
      projectID,
      review,
      rating,
    });
    const savedComment = await newComment.save();

    // Add comment reference to project and recalculate rating
    project.comments.push(savedComment._id); // Add the new comment's ID
    const allComments = await Comment.find({ projectID: projectID }); // Fetch all comments for rating calculation
    project.rating = calculateRating(allComments).toFixed(1); // Use 1 decimal place for average

    const updatedProject = await project.save(); // Save the project with new comment ref and rating

    res.status(201).json({ success: true, data: updatedProject, message: "Comment added successfully!" });
  } catch (error) {
    console.error("Error posting project comment:", error);
    res.status(500).json({ success: false, message: "Failed to post comment. " + error.message });
    // next(error);
  }
};

const getProjectComment = async (req, res, next) => {
  try {
    const projectID = req.params.projectID;
    if (!mongoose.Types.ObjectId.isValid(projectID)) {
        return res.status(400).json({ message: "Invalid Project ID format." });
    }

    // Populate user details within comments
    const comments = await Comment.find({ projectID })
                                  .populate('userID', 'username email profilePic')
                                  .sort({ createdAt: -1 }); // Show newest first

    res.status(200).json({ success: true, data: comments, message: "Comments fetched successfully!" });
  } catch (error) {
    console.error("Error fetching project comments:", error);
    res.status(500).json({ message: "Failed to fetch comments. " + error.message });
    // next(error);
  }
};

// Renamed from addCollaborators to requestToJoinProject for clarity
const requestToJoinProject = async (req, res, next) => {
  const { projectID, userID } = req.params; // Requesting user ID

  if (!mongoose.Types.ObjectId.isValid(projectID) || !mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ message: "Invalid Project or User ID format." });
  }

  try {
    const project = await Project.findById(projectID);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is the owner
    if (project.owner.equals(userID)) {
         return res.status(400).json({ message: "Owner cannot request to join their own project." });
    }

    // Check if user is already a collaborator (regardless of status)
    // CHANGED: Use collaborators field
    const existingCollaborator = project.collaborators.find(
      (c) => c.userID.equals(userID)
    );

    if (existingCollaborator) {
      return res.status(400).json({ message: `User already ${existingCollaborator.status} for this project.` });
    }

    // Add user to project collaborators with status 'pending'
    // CHANGED: Use collaborators field
    project.collaborators.push({ userID: userID, status: 'pending' });
    await project.save();

    // NOTE: Do NOT add to user.myCollabedProjects or chat here. Do that upon APPROVAL.

    res.status(200).json({ message: "Request to join project sent successfully." });
  } catch (error) {
    console.error("Error requesting to join project:", error);
    res.status(500).json({ message: "Internal server error joining project." });
    // next(error);
  }
};

// Renamed from acceptCollaborator
const approveCollaborator = async (req, res, next) => {
  // User ID being approved, Project ID
  const { projectId, userId } = req.params;
  // We need the ID of the person *performing* the approval (should be project owner)
  // This should come from verified authentication token (req.user.id)
  // const approvingUserId = req.user.id; // Placeholder for auth

   if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid Project or User ID format." });
   }

  try {

    const project = await Project.findById(projectId);
    if (!project) {
         return res.status(404).json({ message: "Project not found" });
    }

    // --- AUTHORIZATION CHECK (Placeholder) ---
    // if (!project.owner.equals(approvingUserId)) {
    //    return res.status(403).json({ message: "Only the project owner can approve collaborators." });
    // }
    // --- End Placeholder ---


    // Update project, setting the status of the specified user to 'approved'
    // CHANGED: Use collaborators field and check existence before updating
    const collaboratorIndex = project.collaborators.findIndex(c => c.userID.equals(userId));

    if (collaboratorIndex === -1) {
         return res.status(404).json({ message: "Collaborator request not found for this user." });
    }

    if(project.collaborators[collaboratorIndex].status === 'approved') {
        return res.status(400).json({ message: "Collaborator already approved." });
    }

    project.collaborators[collaboratorIndex].status = 'approved';
    const updatedProject = await project.save();


    // NOW add project to user's collabed list and add user to chat
     const collaboratorUser = await User.findById(userId);
     if(collaboratorUser && !collaboratorUser.myCollabedProjects.includes(projectId)){
         collaboratorUser.myCollabedProjects.push(projectId);
         await collaboratorUser.save();
     }

     const chat = await Chat.findOne({ projectID: projectId });
     if(chat && !chat.members.includes(userId)){
         chat.members.push(userId);
         await chat.save();
     }


    res.status(200).json({ message: "Collaborator approved successfully" });
  } catch (error) {
    console.error("Error approving collaborator:", error);
    res.status(500).json({ message: "Error approving collaborator. " + error.message });
    // next(error);
  }
};

// Renamed from rejectCollaborator
 const rejectCollaborator = async (req, res, next) => {
  const { projectId, userId } = req.params;
   // const rejectingUserId = req.user.id; // Placeholder for auth (owner)

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid Project or User ID format." });
   }

  try {

    const project = await Project.findById(projectId);
    if (!project) {
         return res.status(404).json({ message: "Project not found" });
    }

    // --- AUTHORIZATION CHECK (Placeholder) ---
    // if (!project.owner.equals(rejectingUserId)) {
    //    return res.status(403).json({ message: "Only the project owner can reject collaborators." });
    // }
    // --- End Placeholder ---

    // Update project, changing status to 'rejected' or removing
    // Option 1: Set status to rejected
    const collaboratorIndex = project.collaborators.findIndex(c => c.userID.equals(userId));
     if (collaboratorIndex === -1) {
         return res.status(404).json({ message: "Collaborator request not found for this user." });
    }
     if(project.collaborators[collaboratorIndex].status === 'rejected') {
        return res.status(400).json({ message: "Collaborator already rejected." });
    }
    project.collaborators[collaboratorIndex].status = 'rejected'; // Keep record but mark as rejected

    // Option 2: Remove collaborator completely (if you don't need history)
    // project.collaborators.pull({ userID: userId });

    const updatedProject = await project.save();


    // Ensure user is removed from chat and project list if they were added prematurely
    const collaboratorUser = await User.findById(userId);
    if(collaboratorUser){
         collaboratorUser.myCollabedProjects.pull(projectId);
         await collaboratorUser.save();
     }
    const chat = await Chat.findOne({ projectID: projectId });
     if(chat){
         chat.members.pull(userId);
         await chat.save();
     }


    res.status(200).json({ message: "Collaborator rejected successfully" });
  } catch (error) {
    console.error("Error rejecting collaborator:", error);
    res.status(500).json({ message: "Error rejecting collaborator. " + error.message });
    // next(error);
  }
};

const completeProject = async (req, res, next) => {
  const projectID = req.params.projectID;
   // const completingUserID = req.user.id; // Placeholder for auth (owner)

    if (!mongoose.Types.ObjectId.isValid(projectID)) {
      return res.status(400).json({ message: "Invalid Project ID format." });
   }

  try {
    const project = await Project.findById(projectID);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // --- AUTHORIZATION CHECK (Placeholder) ---
    // if (!project.owner.equals(completingUserID)) {
    //    return res.status(403).json({ message: "Only the project owner can mark the project as complete." });
    // }
    // --- End Placeholder ---


    if (project.status === "completed") {
         return res.status(400).json({ message: "Project is already marked as completed." });
    }

    project.status = "completed";
    await project.save();

    // Award credits only to APPROVED collaborators (including owner)
    const approvedCollaboratorIDs = project.collaborators
        .filter(c => c.status === 'approved')
        .map(c => c.userID);

    // Update credit score for all approved collaborators
    await User.updateMany(
        { _id: { $in: approvedCollaboratorIDs } },
        { $inc: { creditScore: project.perHeadCredits || 0 } } // Increment score
    );

    res.status(200).json({ message: "Project completed successfully and credits awarded." });

  } catch (error) {
    console.error("Error completing project:", error);
    res.status(500).json({ message: "Failed to complete project. " + error.message });
    // next(error);
  }
}

module.exports = {
  postProject,
  getAllProjects,
  getProjectById,
  requestToJoinProject, // Renamed
  approveCollaborator,  // Renamed
  rejectCollaborator,   // Renamed
  postProjectComment,
  getProjectComment,
  completeProject
};
