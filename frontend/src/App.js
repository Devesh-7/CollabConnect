// src/App.js
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig'; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";
import axiosInstance from './api/axiosInstance'; // Import Axios instance

// --- Pages ---
import Home from './Pages/Home';
import Course from './Pages/Course';
import ChatRoom from './Pages/ChatRoom';
import Doubts from './Pages/Doubts';
import Login from './Pages/Login'; // Login page component
import Background from './Pages/Background';
import UpdateProfile from './Pages/UpdateProfile';
import AddProject from './Pages/AddProject';
import AddCourse from './Pages/AddCourse';

// --- Components ---
import Navbar from './Components/Navbar'; // Import Navbar
import ProtectedRoute from './Components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  const [currentUser, setCurrentUser] = useState(null); // Firebase user object
  const [dbUser, setDbUser] = useState(null); // User profile from our MongoDB
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Loading state

  // Listener for Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user); // Set Firebase user object (or null)
      if (user) {
        // If user logs in (or is already logged in), verify token with backend
        // and get/create the user profile from our DB
        console.log("Firebase user found, verifying with backend...");
        try {
          // The token will be attached automatically by the interceptor
          const response = await axiosInstance.post('/auth/verify'); // Call backend verify endpoint
          setDbUser(response.data.user); // Store the DB user profile
          console.log("Backend verification successful, DB user:", response.data.user);
          // Store dbUser in localStorage for components that haven't been refactored yet
          // TODO: Remove this localStorage usage once all components use state/context
          localStorage.setItem("userData", JSON.stringify(response.data.user));
          localStorage.setItem("allUsers", JSON.stringify([])); // Clear or fetch actual users if needed
          localStorage.setItem("projectsData", JSON.stringify([])); // Clear or fetch actual projects if needed
          localStorage.setItem("courseData", JSON.stringify({data: []})); // Clear or fetch actual courses if needed
          localStorage.setItem("allDoubts", JSON.stringify([])); // Clear or fetch actual doubts if needed

        } catch (error) {
          console.error("Backend verification failed:", error);
          setDbUser(null); // Clear db user on backend error
          // Handle error - maybe sign out from Firebase?
          // auth.signOut();
        }
      } else {
        // User is logged out
        setDbUser(null); // Clear db user profile
        // Clear local storage
        // TODO: Remove this localStorage usage once all components use state/context
        localStorage.removeItem("userData");
        localStorage.removeItem("allUsers");
        localStorage.removeItem("projectsData");
        localStorage.removeItem("courseData");
        localStorage.removeItem("allDoubts");
      }
      setIsLoadingAuth(false); // Auth check complete
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount


  if (isLoadingAuth) {
    return <div>Loading...</div>; // Or a better loading indicator
  }

  return (
    <Router>
      <Background />
      {/* Render Navbar only if NOT on the Login page (assuming Login is the root "/") */}
      {/* You might need more sophisticated logic if login isn't the root */}
      {currentUser && <Navbar user={currentUser} dbUser={dbUser} />}
      <Routes>
        {/* Login Page - Public */}
        <Route path="/" element={!currentUser ? <Login /> : <Home dbUser={dbUser} />} /> {/* Show Login if no user, else Home */}

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={currentUser}>
              <Home dbUser={dbUser}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/course"
          element={
            <ProtectedRoute user={currentUser}>
              <Course dbUser={dbUser}/>
            </ProtectedRoute>
          }
        />
        {/* CHAT ROUTES - Ensure protection and pass necessary user info */}
        <Route
          path="/chatroom"
          element={
            <ProtectedRoute user={currentUser}>
              <ChatRoom dbUser={dbUser} />
            </ProtectedRoute>
          }
        />
         <Route
          path="/chatroom/:projectID" // Keep parameterized route
          element={
            <ProtectedRoute user={currentUser}>
              <ChatRoom dbUser={dbUser} />
            </ProtectedRoute>
          }
        />
     
        <Route
          path='/updateProfile'
          element={
            <ProtectedRoute user={currentUser}>
              <UpdateProfile dbUser={dbUser}/>
            </ProtectedRoute>
          }
        />
        <Route
          path='/addproject'
          element={
            <ProtectedRoute user={currentUser}>
              <AddProject dbUser={dbUser}/>
            </ProtectedRoute>
          }
        />
       // Inside App.js Routes
 <Route
    path='/addcourse'
    element={
      <ProtectedRoute user={currentUser}>
        <AddCourse dbUser={dbUser}/> {/* Pass dbUser */}
      </ProtectedRoute>
    }
  />
  <Route
    path='/doubts'
    element={
      <ProtectedRoute user={currentUser}>
        <Doubts dbUser={dbUser} /> {/* Pass dbUser */}
      </ProtectedRoute>
    }
  />
         {/* ADDED: Catch-all for unknown routes - redirect home or show 404 */}
         <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;