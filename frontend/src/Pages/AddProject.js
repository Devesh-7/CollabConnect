// src/Pages/AddProject.js
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import "./AddProject.css"; // Ensure CSS path is correct
import axiosInstance from '../api/axiosInstance'; // Use the configured Axios instance
// import { useNavigate } from 'react-router-dom'; // Import if using navigate for redirection

// Accept dbUser prop from App.js
const AddProject = ({ dbUser }) => {
  // const navigate = useNavigate(); // Initialize if needed

  // Use dbUser passed from App.js; REMOVED localStorage access
  const user = dbUser;
  const userId = user?._id; // Get user ID safely

  // Initial values for the form fields
  const initialValues = {
    title: '',
    description: '', // <-- CORRECTED LINE
    status: 'ongoing', // Default status
    githubLink: '',
    deployedLink: '',
    credits: 0, // Default to 0 or a number type
    tags: [''], // Start with one empty tag field
  };

  const [submitError, setSubmitError] = useState(null); // State for submission errors
  // Note: Formik provides `isSubmitting` which we use on the button

  const handleSubmit = async (values, { setSubmitting }) => { // Get setSubmitting from Formik
    setSubmitError(null); // Clear previous errors

    if (!userId) {
      const errorMsg = "User not logged in or user data not available.";
      setSubmitError(errorMsg);
      alert(errorMsg);
      setSubmitting(false); // Important: Reset Formik's submitting state
      return;
    }

    // Basic validation (can be enhanced with Yup)
    if (!values.title || !values.description) {
      const errorMsg = "Title and Description are required.";
      setSubmitError(errorMsg);
      alert(errorMsg);
      setSubmitting(false);
      return;
    }
    if (isNaN(values.credits) || Number(values.credits) < 0) {
      const errorMsg = "Credits must be a non-negative number.";
      setSubmitError(errorMsg);
      alert(errorMsg);
      setSubmitting(false);
      return;
    }
    // Frontend Credit Check (Optional but good UX)
    if (user.creditScore !== undefined && Number(values.credits) > (user.creditScore / 10)) {
      const errorMsg = `Per head credits (${values.credits}) cannot be more than 10% of your score (${user.creditScore}). Max allowed: ${Math.floor(user.creditScore / 10)}`;
      setSubmitError(errorMsg);
      alert(errorMsg);
      setSubmitting(false);
      return;
    }

    console.log("Submitting project values:", values);

    try {
      // Use axiosInstance and relative path; pass userId in URL as per backend route
      const response = await axiosInstance.post(`/projects/add/${userId}`, values);

      console.log('Add Project Success:', response.data);
      alert('Project added successfully');

      // Redirect to the dashboard after successful submission
      // navigate('/dashboard'); // Use navigate if imported
      window.location.href = '/dashboard'; // Simple redirect for now

    } catch (error) {
      // Handle errors from the API call
      console.error('Error adding project:', error.response ? error.response.data : error.message);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to add project. Please check console or try again.';
      setSubmitError(errorMsg);
      alert(`Error adding project: ${errorMsg}`);
    } finally {
      setSubmitting(false); // Reset Formik's submitting state whether success or fail
    }
  };

  // Prevent rendering the form if user data is not available
  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading user data or user not logged in...</div>;
  }

  return (
    <div className="add-project-container">
      <h2 className="add_project_heading">Add Project</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        // TODO: Add validationSchema using Yup for better validation
        enableReinitialize // Ensures form resets if initialValues change (e.g., user logs out/in)
      >
        {({ values, isSubmitting }) => ( // Get isSubmitting state from Formik
          <Form className="add-project-form">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title:</label>
              <Field id="title" name="title" type="text" className="form-control" required />
              <ErrorMessage name="title" component="div" className="error-message" />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description:</label>
              <Field id="description" name="description" as="textarea" rows="4" className="form-control" required />
              <ErrorMessage name="description" component="div" className="error-message" />
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">Status:</label>
              <Field as="select" id="status" name="status" className="form-control">
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </Field>
              <ErrorMessage name="status" component="div" className="error-message" />
            </div>

            {/* GitHub Link */}
            <div className="form-group">
              <label htmlFor="githubLink" className="form-label">Github Link:</label>
              <Field id="githubLink" name="githubLink" type="url" className="form-control" placeholder="https://github.com/your/repo"/>
               <ErrorMessage name="githubLink" component="div" className="error-message" />
            </div>

            {/* Deployed Link */}
            <div className="form-group">
              <label htmlFor="deployedLink" className="form-label">Deployed Link:</label>
              <Field id="deployedLink" name="deployedLink" type="url" className="form-control" placeholder="https://your-deployed-site.com"/>
               <ErrorMessage name="deployedLink" component="div" className="error-message" />
            </div>

            {/* Credits */}
            <div className="form-group">
              <label htmlFor="credits" className="form-label">Per Head Credits:</label>
              <Field id="credits" name="credits" type="number" min="0" className="form-control" required/>
               <ErrorMessage name="credits" component="div" className="error-message" />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">Tags:</label>
              <FieldArray name="tags">
                {({ remove, push }) => (
                  <div>
                    {values.tags && values.tags.length > 0 ? values.tags.map((tag, index) => (
                      <div key={index} className="tag-field-group">
                        <Field name={`tags.${index}`} type="text" className="form-control" placeholder="e.g., react, nodejs" />
                        <ErrorMessage name={`tags.${index}`} component="div" className="error-message" />
                        {values.tags.length > 1 && (
                          <button type="button" className="tag-remove-btn" onClick={() => remove(index)}>
                            Remove
                          </button>
                        )}
                      </div>
                    )) : null /* Render nothing if array is empty initially */}
                    <button type="button" className="tag-add-btn" onClick={() => push('')}>
                      Add Tag
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Display submission error */}
            {submitError && <div className="error-message" style={{ marginTop: '1rem', textAlign: 'center', color: '#dc3545', fontWeight: 'bold' }}>{submitError}</div>}

            {/* Disable button while submitting */}
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Project'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProject;