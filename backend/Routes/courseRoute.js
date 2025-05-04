const express = require("express");
const router = express.Router();
const {
  getCourseById,
  postCourse,
  getAllCourses,
  getFeedback,
  postFeedback,
  postCourseToProfile,
} = require("../Controllers/courseController.js");

router.get("/fetch/:courseID", getCourseById);
router.post("/add", postCourse);
router.get("/all", getAllCourses);
router.get("/getfeedback/:courseID", getFeedback);
router.post("/addFeedback/:courseID/:userID/add", postFeedback);
router.post("/add/:userID/addCourse", postCourse);
router.post("/add", /* protect, */ postCourse);
module.exports = router;
