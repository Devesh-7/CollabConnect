// src/Components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// user prop will come from App.js state (Firebase auth.currentUser)
function ProtectedRoute({ user, children }) {
  const location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    // Using "/" as login page as per App.js structure
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children; // Render the children components if user is authenticated
}

export default ProtectedRoute;