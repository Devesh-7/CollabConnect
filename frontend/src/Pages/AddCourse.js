// src/Pages/AddCourse.js
import React, { useState } from "react"; // Removed useEffect - not needed here now
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import "./AddCourse.css"; // Ensure CSS path is correct
import axiosInstance from '../api/axiosInstance'; // ----> IMPORT axiosInstance
// import { useNavigate } from 'react-router-dom'; // Import if needed

// CHANGED: Accept dbUser prop
const AddCourse = ({ dbUser }) => {
  // const navigate = useNavigate(); // Initialize if needed

  // Use dbUser passed from App.js
  const user = dbUser;
  const userId = user?._id; // Get user ID safely

  const initialValues = {
    courseName: "",
    courseDesc: "",
    linkToCourse: "",
    tags: [""], // Initialize tags as an array with one empty string
  };

  // ADDED: State for submission status/errors
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Manual submitting state

  const handleSubmit = async (values) => {
    setSubmitError(null);
    setIsSubmitting(true); // Set submitting state

    if (!userId) {
      setSubmitError("User not logged in or user data not available.");
      alert("User not logged in or user data not available.");
      setIsSubmitting(false);
      return;
    }
    // Basic validation
     if (!values.courseName || !values.courseDesc || !values.linkToCourse || !values.tags || values.tags.length === 0 || values.tags.every(t => !t)) {
        setSubmitError("Course Name, Description, Link, and at least one Tag are required.");
        alert("Course Name, Description, Link, and at least one Tag are required.");
        setIsSubmitting(false);
        return;
    }

    console.log("Submitting new course:", values);
    console.log("Using User ID:", userId); // Log the userId being used

    // Prepare data for backend, filtering empty tags
    const courseData = {
      tag: values.tags.filter(t => t && t.trim() !== ''), // Filter out empty/whitespace tags
      courseName: values.courseName,
      courseDesc: values.courseDesc,
      linkToCourse: values.linkToCourse,
      // addedBy will be handled by the backend using the authenticated user
    };

    // Ensure at least one tag remains after filtering
    if (courseData.tag.length === 0) {
       setSubmitError("At least one valid Tag is required.");
       alert("At least one valid Tag is required.");
       setIsSubmitting(false);
       return;
    }


    try {
      // Use axiosInstance and the simplified POST /api/courses/add route
      // Backend should get userID from req.fire_user._id via middleware
      const response = await axiosInstance.post(`/courses/add`, courseData);

      console.log('Add Course Success:', response.data);
      alert("Course Added Successfully!");

      // Redirect after success
      // navigate('/dashboard'); // Use this if useNavigate is imported
      window.location.href = "/dashboard"; // Simple redirect

    } catch (error) {
      // Log detailed error information
      console.error('Error adding course:', error);
      let errorMsg = 'Failed to add course. Please try again.'; // Default message
      if (error.response) {
        console.error("Backend Error Data:", error.response.data);
        console.error("Backend Error Status:", error.response.status);
        console.error("Backend Error Headers:", error.response.headers);
        errorMsg = error.response.data?.message || `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        console.error("No response received:", error.request);
        errorMsg = 'Could not reach the server. Please check your connection and if the backend is running.';
      } else {
        console.error('Error setting up request:', error.message);
        errorMsg = `Error setting up request: ${error.message}`;
      }
      setSubmitError(errorMsg); // Set error state
      alert(`Error adding course: ${errorMsg}`); // Show error alert
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  // Show loading or prevent rendering if user data isn't ready
  if (!user) {
    return <div>Loading user data or user not logged in...</div>;
  }

  return (
    // Assuming class names from AddCourse.css
    <div className="update-course-container">
      <h2 className="update_course_heading">Add Course</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values }) => (
          <Form className="update-course-form">
            {/* Course Name */}
            <div className="form-group">
              <label htmlFor="courseName" className="form-label">Course Name:</label>
              <Field id="courseName" type="text" className="form-control" name="courseName" required/>
              <ErrorMessage name="courseName" component="div" className="error-message" />
            </div>

            {/* Course Description */}
            <div className="form-group">
              <label htmlFor="courseDesc" className="form-label">Course Description:</label>
              <Field id="courseDesc" as="textarea" className="form-control" name="courseDesc" required/>
              <ErrorMessage name="courseDesc" component="div" className="error-message" />
            </div>

            {/* Course Link */}
            <div className="form-group">
              <label htmlFor="linkToCourse" className="form-label">Course Link:</label>
              <Field id="linkToCourse" type="url" name="linkToCourse" className="form-control" placeholder="https://example.com/course" required/>
               <ErrorMessage name="linkToCourse" component="div" className="error-message" />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">Tags:</label>
              <FieldArray name="tags">
                {({ remove, push }) => (
                  <div>
                    {values.tags && values.tags.map((tag, index) => (
                      <div key={index} className="tag-field-group">
                        <Field name={`tags.${index}`} type="text" className="form-control" placeholder="e.g., webdev, python"/>
                        <ErrorMessage name={`tags.${index}`} component="div" className="error-message" />
                        {/* Allow removing only if more than one tag exists */}
                        {values.tags.length > 1 ? (
                          <button
                            type="button"
                            className="skill-remove-btn" // Use consistent class name
                            onClick={() => remove(index)}
                          >
                            Remove
                          </button>
                        ) : null }
                      </div>
                    ))}
                    <button
                      type="button"
                      className="skill-add-btn" // Use consistent class name
                      onClick={() => push("")}
                    >
                      Add Tag
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

             {/* Display submission error */}
            {submitError && <div className="error-message" style={{ marginTop: '1rem', textAlign: 'center' }}>{submitError}</div>}

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Course'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCourse;