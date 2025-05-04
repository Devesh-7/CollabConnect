const User = require("../Models/userModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json({ success: true, data: users, message: "All users fetched!" });
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userID);
    res
      .status(200)
      .json({ success: true, data: user, message: "User fetched!" });
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Data to update

  try {
    // Separate tags and potentially empty githubID from other update data
    const { tags, githubID, ...otherUpdateData } = updateData;

    // Prepare the update operation object
    const updateOperation = { ...otherUpdateData };

    // Only include githubID in the update if it has been provided
    if (githubID && githubID.trim() !== "") {
      updateOperation.githubID = githubID;
    }

    // Handle tags update separately if provided
    if (tags && tags.length) {
      updateOperation.$push = { tags: { $each: tags } }; // Append new tags to the existing ones
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateOperation, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUserProfile };
