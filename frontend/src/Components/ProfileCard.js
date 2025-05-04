// src/Components/ProfileCard.js
import "./ProfileCard.css";
import EditProfileIcon from '../Assets/editprofileicon.svg';
import dollarSVG from "../Assets/dollar.svg";
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../firebaseConfig'; // Import auth for logout
import { signOut } from "firebase/auth";

// CHANGED: Accept dbUser and optionally closePopup function as props
const ProfileCard = ({ user, dbUser, closePopup }) => {
  const navigate = useNavigate();

  // Use dbUser for most displayed info, user for potential photoURL fallback
  const profileUser = dbUser || {}; // Use empty object as fallback if dbUser is null temporarily
  const firebaseUser = user || {};

  const handleGithubLinkClick = () => {
    if (profileUser.githubID) {
        // Basic validation to ensure it looks like a URL
        let url = profileUser.githubID;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`; // Add protocol if missing
        }
        window.open(url, '_blank', 'noopener,noreferrer'); // Open in new tab safely
    } else {
        console.log("No GitHub ID set.");
    }
  };

  const handleEditProfileClick = () => {
    if (closePopup) closePopup(); // Close the popup first
    navigate('/updateProfile'); // Navigate to the update page
  };

  // ADDED: Logout handler
  const handleLogout = async () => {
    if (closePopup) closePopup(); // Close popup first
    try {
      await signOut(auth);
      console.log("User logged out from Profile Card");
      // App.js handles navigation/state update
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="ProfileCardBox">
      <div className="ProfileCard-leftPart">
        <div className="ProfileCard-image-container">
          {/* Use Firebase photoURL first, then initials from dbUser */}
          {firebaseUser.photoURL ? (
             <img src={firebaseUser.photoURL} alt="Profile" className="ProfileCard-image"/>
          ) : (
             // Generate initials from dbUser username
             profileUser.username
              ? (profileUser.username.split(' ').map(n => n[0]).join('').toUpperCase() || '?') // Handle names like "Devesh" -> "D"
              : '?' // Fallback if no username
          )}
        </div>

        {/* Display Tags if they exist */}
        {profileUser.tags && profileUser.tags.length > 0 && (
          <div className="ProfileCard-tag_storer-parent">
            <div className="ProfileCard-tag_storer">
              {profileUser.tags.map((tag, index) => (
                tag && <span key={index} className="ProfileCard-tag">{tag}</span> // Only render if tag is not empty
              ))}
            </div>
          </div>
        )}

        {/* GitHub Link */}
        {profileUser.githubID && (
            <div className="ProfileCard-link-container" onClick={handleGithubLinkClick} title={`Visit ${profileUser.githubID}`}>
                <div className="ProfileCard-link">GitHub: {profileUser.githubID}</div>
            </div>
        )}

        {/* Email */}
        <div className="ProfileCard-link-container" title={profileUser.email || 'Email not available'}>
            <div className="ProfileCard-link">Email: {profileUser.email || 'N/A'}</div>
        </div>

      </div>

      <div className="ProfileCard-rightPart">
        <div className="ProfileCard-rightPart-upper-part">
          <div className="ProfileCard-rightPart-upper-part-name-side">
            <div className="ProfileCard-rightPart-upper-part-name">
              {/* CHANGED: Name to Devesh Dhyani */}
              Devesh Dhyani
              {/* Use dbUser username if needed: {profileUser.username || 'User Name'} */}
              <img src={EditProfileIcon} alt="Edit Profile" className="editProfileIcon" onClick={handleEditProfileClick} />
            </div>
            <div className="ProfileCard-rightPart-upper-part-post">
              {/* CHANGED: Designation */}
              BITS Pilani Student
              {/* Use dbUser designation: {profileUser.designation || 'No designation set'} */}
            </div>
          </div>
          <div className="ProfileCard-rightPart-upper-part-credits-side">
            <img src={dollarSVG} alt="Credits"/>
            <div className="ProfileCard-rightPart-upper-part-credits">{profileUser.creditScore ?? 0}</div> {/* Use ?? for default */}
          </div>
        </div>
        <div className="ProfileCard-rightPart-project-space">
          {/* TODO: Add logic here to display user's projects/collabs */}
          {/* You would likely fetch these based on dbUser._id or use data passed down */}
        </div>
         {/* ADDED: Action Buttons at the bottom of the card/popup */}
         <div className="profile-popup-actions">
             
             {closePopup && <button className="profile-popup-btn" onClick={closePopup}>Close</button>}
         </div>
      </div>
    </div>
  );
};

export default ProfileCard;