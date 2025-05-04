const Course = require("../Models/courseModel.js");
const Feedback = require("../Models/feedbackModel.js");
const User = require("../Models/userModel.js");
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res
      .status(200)
      .json({ success: true, data: courses, message: "All courses fetched!" });
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};
const getCourseById = async (req, res) => {
  try {
    const course = Course.findById(req.params.courseID);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found !" });
    }
    res
      .status(200)
      .json({ success: true, data: course, message: "Course fetched!" });
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};
const postCourse = async (req, res, next) => {
  console.log("--- Entering postCourse ---"); // Added Log
  try {
    // Get userID from authenticated user attached by middleware
    if (!req.fire_user || !req.fire_user._id) {
       console.log("postCourse Error: No authenticated user found (req.fire_user missing)"); // Updated Log
       return res.status(401).json({ success: false, message: "Authentication required." });
    }
    const userID = req.fire_user._id; // Get ID from verified token data
    console.log("Authenticated User ID:", userID);

    const { tag, courseName, courseDesc, linkToCourse } = req.body;
    console.log("Received body:", req.body);

     // Basic validation
     if (!tag || tag.length === 0 || !courseName || !courseDesc || !linkToCourse) {
       console.log("postCourse Error: Missing required fields in body:", { tag, courseName, courseDesc, linkToCourse }); // Log missing fields
       return res.status(400).json({ success: false, message: "Missing required course fields (tag, courseName, courseDesc, linkToCourse)." });
     }

    const newCourse = new Course({
      tag: tag.filter(t => t), // Ensure tags is an array and filter empty ones
      courseName: courseName,
      courseDesc: courseDesc,
      rating: 0, // Default rating
      feedback: [], // Default empty feedback
      addedBy: userID, // Use ID from authenticated user
      linkToCourse: linkToCourse,
    });
    console.log("Attempting to save new course:", newCourse);

    await newCourse.save(); // Save the new course document
    console.log("Course saved successfully:", newCourse._id);

    // Find the user and update their myCourses array
    const user = await User.findById(userID);
    if (user) {
        console.log("Found user to update:", user._id);
        user.myCourses.push(newCourse._id);
        await user.save(); // Save the updated user document
        console.log("User's myCourses updated successfully.");
    } else {
        // This case should technically not happen if middleware succeeded, but good to log
        console.warn(`User ${userID} not found in DB after authentication when trying to add course to their list.`);
        // Optional: Could return an error here if user must exist
        // return res.status(404).json({ success: false, message: `User ${userID} not found.` });
    }

    // Send successful response
    res.status(201).json({ success: true, data: newCourse, message: "Course added!" });

  } catch (error) {
    // Catch block for errors during save operations or other issues
    console.error("!!! Error in postCourse catch block:", error);
    console.error("Error Stack:", error.stack);
    // Send a generic 500 error response
    res.status(500).json({ success: false, message: "Server error adding course. " + error.message });
    // next(error); // Optionally pass to Express error handler
  }
};

// Keep the rest of the functions (getAllCourses, getCourseById, postFeedback, etc.)
// and the module.exports line the same as in your original file.
function calculateRating(feedback) {
  let sum = 0.0;
  for (let i = 0; i < feedback.length; i++) {
    sum += feedback[i].rating;
  }
  return sum / feedback.length;
}

const postFeedback = async (req, res) => {
  try {
    const { review, rating } = req.body;

    const newFeedback = new Feedback({
      userID: req.params.userID,
      courseID: req.params.courseID,
      review: review,
      rating: rating,
    });
    await newFeedback.save();
    const feedback = await Feedback.find({ courseID: req.params.courseID });
    if(!feedback) {
      res.status(404).json({ success: false, message: "Course not found !" });
    }
    
    const rating1 = calculateRating(feedback);
    const course = await Course.findById(req.params.courseID);
    course.rating = rating1.toFixed(0);
    await course.save();

    res
      .status(201)
      .json({ success: true, data: course, message: "Feedback added!" });
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ courseID: req.params.courseID });
    
    res
      .status(200)
      .json({ success: true, data: feedback, message: "Feedback fetched!" });
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

const postCourseToProfile = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseID);
    const user = await User.findById(req.params.userID);
    user.myCourses.push(newCourse._id);
    await user.save();
    res
      .status(200)
      .json({ success: true, data: user, message: "Course added to profile!" });
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  postCourse,
  postFeedback,
  getFeedback,
  postCourseToProfile,
};
