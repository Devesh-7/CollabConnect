// src/Components/Navbar.js
import React, { useState } from "react";
import Popup from 'reactjs-popup';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { signOut } from "firebase/auth";
import "./Navbar.css";
import ProfileCard from '../Components/ProfileCard';
import mySVGURL from '../Assets/userDummy.svg';
// REMOVED: Search components - add back if needed
// import SearchCard from './SearchCard';
// import searchSVGURL from '../Assets/search.svg';
// import FilledStarIcon from '../Assets/heart.svg'; // Assuming this was for wishlist?

// CHANGED: App Name
const APP_NAME = "CollabConnect";

// CHANGED: Receive user (Firebase) and dbUser (MongoDB) as props
function Navbar({ user, dbUser }) {
  const navigate = useNavigate(); // Hook for navigation

  // REMOVED: Search state

  // ADDED: Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out via Navbar");
      // Navigation to home/login will be handled by App.js based on auth state change
      // navigate('/'); // Optional: force immediate navigation
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="ellipse-container">
          
          <div className="home-name-container">
            {/* CHANGED: App Name */}
            <div className="home-name">{APP_NAME}</div>
          </div>
        </div>

        {/* Links are already conditional in App.js, but could be done here too */}
        <div className="navbar-links">
          <div>
            <Link to="/dashboard">PROJECTS</Link>
          </div>
          <div>
            {/* Ensure ChatRoom link works correctly */}
            <Link to={`/chatroom`}>COLLABS</Link>
          </div>
          <div>
            <Link to="/course">COURSES</Link>
          </div>
          <div>
            <Link to="/doubts">DOUBTS</Link>
          </div>
        </div>

        {/* CHANGED: Only show profile if user exists */}
        {user && (
          <div className="search-and-profile">
            {/* REMOVED: Search button - Add back if needed */}
            {/* REMOVED: Wishlist button - Add back if needed */}

            <div className="profile-button">
              <Popup
                trigger={
                  <div className="navbar-right-circle">
                    {/* Use Firebase profile pic if available */}
                    {user.photoURL ? (
                       <img src={user.photoURL} alt="User profile" className="navbar-right-circle-img" style={{ borderRadius: '50%'}}/>
                    ) : (
                       <img src={mySVGURL} alt="Profile" className="navbar-right-circle-img"/>
                    )}
                   </div>
                  }
                modal nested>
                {
                  close => (
                    <div className='modal'>
                      <div className='content'>
                         {/* Pass user and dbUser down */}
                        <ProfileCard user={user} dbUser={dbUser} />
                      </div>
                      {/* ADDED: Logout button inside profile popup */}
                       <button onClick={handleLogout} style={{ marginTop: '10px', padding: '8px 15px', cursor: 'pointer' }}>Logout</button>
                       {/* ADDED: Close button for popup */}
                       <button onClick={close} style={{ marginLeft: '10px', padding: '8px 15px', cursor: 'pointer' }}>Close</button>
                    </div>
                  )
                }
              </Popup>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;