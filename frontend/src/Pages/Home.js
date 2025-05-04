// src/Pages/Home.js
import React, { useEffect, useState } from "react";
import ProjectCard from "../Components/ProjectCard"; // Ensure correct path
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // Use axios instance
import "./Home.css"; // Import the updated CSS

// NOTE: Navbar is rendered by App.js now

const Home = ({ dbUser }) => { // Receive dbUser prop
  const [allProjects, setAllProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [collabProjects, setCollabProjects] = useState([]); // State for collaborations
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProjectType, setSelectedProjectType] = useState("All"); // Default to 'All'

  const handleClickProjectType = (type) => {
    setSelectedProjectType(type);
  };

  // Fetch projects when the component mounts or dbUser becomes available
  useEffect(() => {
    const fetchProjects = async () => {
      if (!dbUser) { // Don't fetch if dbUser isn't loaded yet
        setIsLoading(false); // Stop loading if no user
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/projects/fetch/all");
        setAllProjects(response.data);
        console.log("Fetched all projects:", response.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try refreshing.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [dbUser]); // Re-fetch if dbUser changes (e.g., after login)

  // Filter projects based on dbUser and allProjects
  useEffect(() => {
    if (dbUser && allProjects.length > 0) {
      const owned = allProjects.filter(p =>
        dbUser.myProjects?.includes(p._id)
      );
      const collaborated = allProjects.filter(p =>
        dbUser.myCollabedProjects?.includes(p._id) && !dbUser.myProjects?.includes(p._id) // Only those NOT owned
      );
      setMyProjects(owned);
      setCollabProjects(collaborated);
      console.log("Filtered My Projects:", owned);
      console.log("Filtered Collaborations:", collaborated);
    } else {
      setMyProjects([]);
      setCollabProjects([]);
    }
  }, [dbUser, allProjects]);

  // Determine which projects to show in the grid based on the selected tab
  const projectsToDisplay = selectedProjectType === "All" ? allProjects : myProjects;

  return (
    // Container for overall page padding
    <div className="home-container">
      {/* Render content only if dbUser exists */}
      {dbUser ? (
        <>
          {/* Header Section */}
          <div className="home-header">
            <div className="welcome-message">
              <div className="text-welcome">
                Hi, {dbUser.username || 'User'} <br /> {/* Use DB username */}
                Welcome to '<span className="brand-name-inline">CollabConnect</span>' {/* Styled app name */}
              </div>
            </div>
            <div className="home-actions">
              <div className="add-project">
                <Link to="/addproject">
                  <button className="add-project-btn">+ Add Project</button>
                </Link>
              </div>
              <div className="project-type-toggle">
                <button
                  onClick={() => handleClickProjectType("All")}
                  className={`toggle-button ${selectedProjectType === "All" ? "active" : ""}`}
                >
                  All Projects
                </button>
                <button
                  onClick={() => handleClickProjectType("My")}
                  className={`toggle-button ${selectedProjectType === "My" ? "active" : ""}`}
                >
                  My Work
                </button>
              </div>
            </div>
          </div>

          {/* Main Project Display Area */}
          <div className="project-display-area">
            {isLoading && <div className="no-projects-message">Loading projects...</div>}
            {error && <div className="no-projects-message" style={{ color: 'red' }}>{error}</div>}

            {!isLoading && !error && (
              <>
                {/* Section for "All" or "My Owned" Projects */}
                <div className="project-category-section">
                  <div className="category_name">{selectedProjectType === "All" ? "New Arrivals" : "My Projects"}</div>
                  <div className="projects-grid">
                    {projectsToDisplay.length > 0 ? (
                      projectsToDisplay.map((project) => (
                        <ProjectCard key={project._id} projectData={project} />
                      ))
                    ) : (
                      <div className="no-projects-message">No projects to show in this category.</div>
                    )}
                  </div>
                </div>

                {/* Section for "Collaborations" - only shows when "My Work" is selected */}
                {selectedProjectType === "My" && (
                  <div className="project-category-section">
                    <div className="category_name">Collaborations</div>
                    <div className="projects-grid">
                      {collabProjects.length > 0 ? (
                        collabProjects.map((project) => (
                          <ProjectCard key={project._id} projectData={project} />
                        ))
                      ) : (
                        <div className="no-projects-message">You haven't collaborated on other projects yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="center">
            <footer className="footer">Thank you for visiting CollabConnect</footer>
          </div>
        </>
      ) : (
         // Optional: Show something if dbUser hasn't loaded yet after auth loading finished
         !isLoading && <div>Loading user data...</div>
      )}
    </div>
  );
};

export default Home;