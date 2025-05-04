import React, { useState } from 'react';
import ProfilesTabs from './SearchCardProfile.js';
import ProjectsTabs from './SearchCardProject.js';
import CoursesTabs from './SearchCardCourse.js';
import './SearchCard.css'


function SearchCard() {
  const [activeTab, setActiveTab] = useState('Profiles');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTabs = () => {
    switch (activeTab) {
      case 'Profiles':
        return (
          <div className="profiles-tab">
            <ProfilesTabs />
          </div>
        );
      case 'Projects':
        return (
          <div className="projects-tab">
            <ProjectsTabs />
          </div>
        );
      case 'Courses':
        return (
          <div className="courses-tab">
            <CoursesTabs />
          </div>
        );
      default:
        return (
          <div className="profiles-tab">
            <ProfilesTabs />
          </div>
        );
    }
  };
  

  return (
    <div>
      {/* <section> */}
        <div className="search-card-container">
          <div className="cards">
            <div className="card">
              <input type="text" placeholder={`Search ${activeTab}`} className="search-bar" />
              <div>
                <div className="buttons">
                  <button className={`btn-rectangular ${activeTab === 'Profiles' ? 'active' : ''}`} onClick={() => handleTabClick('Profiles')}>Profiles</button>
                  <button className={`btn-rectangular ${activeTab === 'Projects' ? 'active' : ''}`} onClick={() => handleTabClick('Projects')}>Projects</button>
                  <button className={`btn-rectangular ${activeTab === 'Courses' ? 'active' : ''}`} onClick={() => handleTabClick('Courses')}>Courses</button>
                </div>
                {renderTabs()}
              </div>
            </div>
          </div>
        </div>
      {/* </section> */}
    </div>
  );
}

export default SearchCard;
