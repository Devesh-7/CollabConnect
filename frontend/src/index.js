// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// REMOVED: MSAL related imports/setup

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode> // Temporarily disable StrictMode if causing double renders/fetches during dev
    <App />
  // </React.StrictMode>
);

