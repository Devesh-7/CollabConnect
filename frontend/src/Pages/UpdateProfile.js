import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import "./updateprofile.css";

const UpdateProfile = () => {
  const [userData, setUserData] = useState(() =>
    JSON.parse(localStorage.getItem("userData") || "{}")
  );

  // Initialize form values directly from userData state
  const initialValues = {
    githubID: userData?.githubID || "",
    designation: userData?.designation || "",
    tags: [""], // Assuming tags always start empty or can be populated similarly if needed
  };

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleSubmit = async (values) => {
    if (!userData) return; // Exit if no userData is found
    const userID = userData._id;

    try {
      console.log("In update profile: ", userData);
      const response = await fetch(
        `http://localhost:5500/users/update/${userID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("User profile updated successfully");
      setUpdateSuccess(true); // Set flag to true on successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error updating profile: ${error.message}`); // Show error alert
    }
  };

  useEffect(() => {
    // If update was successful, redirect to dashboard
    if (updateSuccess) {
      window.location.href = "/dashboard";
    }
  }, [updateSuccess]);

  return (
    <div className="update-profile-container">
      <h2 className="update_profile_heading">Update Profile</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values }) => (
          <Form className="update-profile-form">
            <div className="form-group">
              <label className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                value={userData.username || ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                value={userData.email || ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="githubLink" className="form-label">
                GitHub Link:
              </label>
              <Field
                type="text"
                id="githubLink"
                name="githubID"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="designation" className="form-label">
                Designation:
              </label>
              <Field
                type="text"
                id="designation"
                name="designation"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags:</label>
              <FieldArray name="tags">
                {({ remove, push }) => (
                  <div>
                    {values.tags.map((tag, index) => (
                      <div key={index} className="tag-field-group">
                        <Field
                          type="text"
                          name={`tags[${index}]`}
                          className="form-control"
                        />
                        <ErrorMessage
                          name={`tags[${index}]`}
                          component="div"
                          className="error-message"
                        />
                        {values.tags.length > 1 && (
                          <button
                            type="button"
                            className="skill-remove-btn"
                            onClick={() => remove(index)}
                          >
                            Remove Tag
                          </button>
                        )}
                        <div className="spacer"></div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="skill-add-btn"
                      onClick={() => push("")}
                    >
                      Add Tag
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateProfile;
