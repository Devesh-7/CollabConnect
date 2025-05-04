// src/Pages/Login.js
import React from "react"; 
import GoogleIcon from "../Assets/google-icon.svg"; 
import EduCollabImg from "../Assets/eduCollab.png"; 
import "./Login.css";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
// import { useNavigate } from "react-router-dom"; 

const APP_NAME = "CollabConnect";

const Login = () => {
  // const navigate = useNavigate(); // Not needed here anymore

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Firebase Google Sign-In successful:", result.user);
      // App.js onAuthStateChanged handles the rest
    } catch (error) {
      console.error("Firebase Google Sign-In Error:", error.code, error.message);
      alert(`Login Failed: ${error.message}`);
    }
  };

  return (
    // signIn_body class controls the full page background and centering
    <div className="signIn_body">
      {/* signin_maindiv is the white centered box */}
      <div className="signin_maindiv">

        {/* signinUpperdiv contains the text and image */}
        <div className="signinUpperdiv">
          <div className="signInHeading">
            <span className="login_welcome">Welcome</span>
                     </div>
          <img className="signInImg" src={EduCollabImg} alt={`${APP_NAME} Visuals`} />
        </div>

        {/* loginSection contains the button */}
        <div className="loginSection">
          <button type="button" className="loginbtn" onClick={handleGoogleSignIn}>
            <img src={GoogleIcon} alt="Google G" className="googleIconImg" /> {/* Use consistent class */}
            <span>Login with Google</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;