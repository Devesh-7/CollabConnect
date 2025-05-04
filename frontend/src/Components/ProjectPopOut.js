// src/Components/ProjectPopOut.js
import React, { useState, useEffect } from "react";
import "./ProjectPopOut.css";
import mySVGURL from "../Assets/userDummy.svg";
import FilledStarIcon from "../Assets/filledStarIcon.svg";
import EmptyStarIcon from "../Assets/emptyStarIcon.png";
import SubmitReviewIcon from "../Assets/submitReviewIcon.svg";
import axiosInstance from "../api/axiosInstance"; // ADDED: Use axiosInstance

// CHANGED: Accept dbUser (logged-in user) and projectData (the specific project) as props
const ProjectPopOut = ({ projectData, dbUser }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [projectComments, setProjectComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [isUserJoined, setIsUserJoined] = useState(false); // Tracks pending/approved status
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true); // Loading state for comments
  const [errorLoadingComments, setErrorLoadingComments] = useState(null); // Error state for comments

  // Get logged-in user ID safely
  const loggedInUserId = dbUser?._id;

  // --- Get Owner Info Safely ---
  // Access owner directly from projectData if populated by backend
  const projectOwner = projectData?.owner; // Example: { _id: "...", username: "...", email: "..." }

  // --- Fetch Comments Effect ---
  useEffect(() => {
    const fetchComments = async () => {
      if (!projectData?._id) return; // Don't fetch if no project ID

      setIsLoadingComments(true);
      setErrorLoadingComments(null);
      try {
        // CHANGED: Use axiosInstance
        const response = await axiosInstance.get(`/projects/comments/${projectData._id}`);
        setProjectComments(response.data.data || []); // Adjust according to actual response structure
      } catch (error) {
        console.error('Error fetching project comments:', error);
        setErrorLoadingComments('Failed to load comments.');
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();

    // Update local state based on projectData prop
    setTags(projectData?.tags || []);
    setIsCompleted(projectData?.status === 'completed');

    // Check if the logged-in user is already a collaborator (approved or pending)
    const userCollaboratorStatus = projectData?.collaborators?.find(
      c => c.userID === loggedInUserId
    )?.status;
    setIsUserJoined(userCollaboratorStatus === 'approved' || userCollaboratorStatus === 'pending');

  }, [projectData, loggedInUserId]); // Re-run if projectData or loggedInUserId changes


  // --- Handlers ---
  const handleJoinEvent = async () => {
    if (!loggedInUserId || !projectData?._id || isUserJoined || isCompleted) return; // Prevent joining if already joined, completed, or no user/project ID

    try {
      // CHANGED: Use axiosInstance
      const response = await axiosInstance.post(`/projects/join/${projectData._id}/${loggedInUserId}`);
      alert('Join request sent successfully!'); // Assuming backend sends request, owner approves later
      console.log('Join request success:', response.data);
      // Optionally update UI state immediately or wait for refresh/re-fetch
      setIsUserJoined(true); // Assume pending state after request
      // TODO: Consider refreshing project data or updating state more accurately
      // window.location.reload(); // Avoid full reload
    } catch (error) {
      console.error('Error joining project:', error.response ? error.response.data : error.message);
      alert(`Error sending join request: ${error.response?.data?.message || error.message}`);
    }
  };

  const submitReview = async () => {
    if (!loggedInUserId || !projectData?._id) return;

    // Check if user already reviewed
    const hasReviewed = projectComments.some(comment => comment.userID?._id === loggedInUserId); // Check against populated userID._id
     if (hasReviewed) {
        alert("You have already submitted your comment on this Project.");
        return;
    }

    if (!reviewText || rating === 0) {
        alert("Please provide both a review text and a star rating (1-5).");
        return;
    }

    try {
      // CHANGED: Use axiosInstance
      // Backend route expects projectID and userID in params
      const response = await axiosInstance.post(`/projects/comments/${projectData._id}/${loggedInUserId}`, {
        review: reviewText,
        rating: rating,
      });
      console.log('Submit review success:', response.data);
      // Add comment optimistically or re-fetch
      setProjectComments(prev => [...prev, { ...response.data.data, userID: dbUser }]); // Add new comment with user data (assuming backend sends updated project)
      setReviewText("");
      setRating(0);
      alert("Review added successfully!");
      // Consider closing popup or just showing success
      // window.location.href='/dashboard'; // Avoid full reload
    } catch (error) {
      console.error('Error submitting review:', error.response ? error.response.data : error.message);
      alert(`Error adding review: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCompleteClick = async () => {
     if (!loggedInUserId || !projectData?._id || isCompleted || projectOwner?._id !== loggedInUserId) return; // Only owner can complete

     try {
         // CHANGED: Use axiosInstance
         const response = await axiosInstance.post(`/projects/complete/${projectData._id}`);
         console.log('Complete project success:', response.data);
         setIsCompleted(true);
         alert(`Project marked as completed. Collaborators awarded ${projectData.perHeadCredits} credits.`);
         // TODO: Update parent state or trigger re-fetch instead of reload
         window.location.reload();
     } catch (error) {
          console.error('Error completing project:', error.response ? error.response.data : error.message);
          alert(`Error completing project: ${error.response?.data?.message || error.message}`);
     }
  };

  // --- Render ---
  // Show loading or error if projectData itself is missing
  if (!projectData) {
      return <div>Loading project details...</div>;
  }

  return (
    <div className="project_popoutbody">
      {/* Project Information */}
      <div className="project_pop_left">
        <div className="project_pop_profile">
          <div className="project_profile_tag">
            {/* CHANGED: Use populated owner data */}
            <div className="project_pop_name">{projectOwner?.username || 'Unknown Owner'}</div>
            {/* TODO: Add popup or link to owner's profile if needed */}
            <img src={projectOwner?.profilePic || mySVGURL} alt="Owner" className="project_pop_profileIcon" style={{borderRadius:'50%'}}/>
          </div>
          <div className="project_pop_likes">
            <span>{projectData.rating?.toFixed(1) || '0.0'}</span>
            <div className="project_pop_heartContainer">
              <img src={FilledStarIcon} alt="Rating" className="project_pop_heart"/>
            </div>
          </div>
        </div>
        {/* TODO: Add actual project image/icon display here if available */}
        <div className="project_pop_jv" style={{ backgroundColor: '#ccc', color: '#666' }}> {/* Placeholder background */}
          {projectData.title?.substring(0, 2).toUpperCase() || '??'} {/* Initials */}
        </div>
        <div className="project_pop_projectTitle">{projectData.title}</div>
        <div className="project_pop_describe">{projectData.description}</div>
        <div className="project_pop_tags_contain">
          <div className="project_pop_tags_text">Tags:</div>
          {tags.map((tag, index) => (
            tag && <div key={index} className="project_pop_individualTags">{tag}</div>
          ))}
        </div>

         {/* Buttons Section */}
        <div className="project__pop__btns">
            <button
                className="project_pop_joinBtn"
                onClick={handleJoinEvent}
                disabled={isCompleted || isUserJoined || projectOwner?._id === loggedInUserId} // Disable if completed, already joined/pending, or if owner
                style={{
                  backgroundColor: isCompleted ? '#6c757d' : (isUserJoined ? '#198754' : '#0d6efd'), // Grey if complete, Green if joined, Blue if can join
                  cursor: (isCompleted || isUserJoined || projectOwner?._id === loggedInUserId) ? 'not-allowed' : 'pointer',
                  marginBottom: '1rem' // Add space below
                }}
            >
                {isCompleted ? 'Completed' : (isUserJoined ? 'Joined / Pending' : 'Join Project')}
            </button>

            {/* Show Complete button only for the owner and if not completed */}
            {projectOwner?._id === loggedInUserId && !isCompleted && (
                <button
                    className="project_pop_joinBtn" // Can reuse style or create new
                    onClick={handleCompleteClick}
                    style={{ backgroundColor: '#198754', cursor: 'pointer' }} // Green
                >
                    Mark as Completed
                </button>
            )}
        </div>
      </div>


      {/* Reviews Section */}
      <div className="project_pop_right">
        <div className="project_pop_reviewsHeading">Reviews</div>
        <div className="project_pop_reviewContainer">
          {isLoadingComments && <div>Loading comments...</div>}
          {errorLoadingComments && <div style={{color: 'red'}}>{errorLoadingComments}</div>}
          {!isLoadingComments && !errorLoadingComments && projectComments.length === 0 && <div>No reviews yet.</div>}
          {!isLoadingComments && !errorLoadingComments && projectComments.map((comment, index) => (
            <div key={comment._id || index} className="project_pop_singleReview">
              <div className="project_pop_reviewText">{comment.review}</div>
              {/* TODO: Add commenter name/info if available */}
              <div className="project_pop_reviewStars">
                {[...Array(comment.rating)].map((e, i) => (
                  <img key={`filled-${i}`} src={FilledStarIcon} alt="Filled Star" />
                ))}
                {[...Array(5 - comment.rating)].map((e, i) => (
                  <img key={`empty-${i}`} src={EmptyStarIcon} alt="Empty Star" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <div className="project_pop_addReview">
          <input
            type="text"
            placeholder="Write a review..."
            className="project_pop_inputReview"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <div className="project_pop_inputStars">
            <div> {/* Star rating input */}
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < rating ? FilledStarIcon : EmptyStarIcon}
                  alt={i < rating ? "Filled Star" : "Empty Star"}
                  className="star-img"
                  onClick={() => setRating(i + 1)}
                  style={{ cursor: 'pointer', width: '20px', height: '20px', marginRight: '3px' }} // Basic styling
                />
              ))}
            </div>
            <img
              src={SubmitReviewIcon}
              alt="Submit Review"
              className="submitReviewIcon"
              onClick={submitReview}
              style={{ cursor: 'pointer', width: '24px', height: '24px', marginLeft: '10px' }} // Basic styling
            />
          </div>
        </div>
      </div>
    </div>
  )}
export default ProjectPopOut;