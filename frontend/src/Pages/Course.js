// CoursePage.js
import React, { useEffect, useState } from "react";
import CourseCard from "../Components/courseCard";
import "./Course.css";
import Popup from 'reactjs-popup';
const Course = () => {
  

  const [selectedCourseType, setSelectedCourseType] = useState("All");
  // const [courses, setCourses] = useState([]); // State to store fetched courses
  // const [myCourses, setMyCourses] = useState([]); 
  const [selectedCourse, setSelectedCourse] = useState(null); // State to track the selected course for detailed view


  const user=JSON.parse(localStorage.getItem("userData"));
  const userid=user._id;
  const allcourses=JSON.parse(localStorage.getItem("courseData"));
  const allcoursedata=allcourses.data;
  console.log('All Courses:', allcoursedata);
  const mycoursesdata = allcoursedata.filter(course => course.addedBy === userid);
  console.log('My Courses:', mycoursesdata);

  const handleClickCourseType = (data) => {
    setSelectedCourseType(data);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };
  const coursesToDisplay = selectedCourseType === "All" ? allcoursedata : mycoursesdata;

  return (
    <div>

      <div className="welcome-message">
        <div className="text-welcome">
          Would you like <br /> to take a Course ?
        </div>
      </div>
      <div className="add-course">
              <button className="add-course-btn"><a href='/addcourse'>Add Course</a></button>
            
          </div>
      <div className="small-navbar">
      
        <button
          onClick={() => handleClickCourseType("All")}
          className={
            selectedCourseType === "All"
              ? "small-buttons-selected"
              : "small-buttons-not-selected"
          }
        >
          All Courses
        </button>
        <button
          onClick={() => handleClickCourseType("My")}
          className={
            selectedCourseType === "My"
              ? "small-buttons-selected"
              : "small-buttons-not-selected"
          }
        >
          My Courses
        </button>
      </div>
      <div className="small-screen">
      
      <div className="carousal-space">

          <div className="category_name">{selectedCourseType === "All" ? "New Arrivals" : "Courses added by me"}</div>
          <div className="rule_r"></div>
          <div className="projects">
            {coursesToDisplay.map((course) => (
              <div key={course.id} onClick={() => handleCourseClick(course)}>
                <CourseCard key={course._id} link={course.linkToCourse} rating={course.rating} courseName={course.courseName} course={course}/>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* {selectedCourse && (
        <Popup open={!!selectedCourse} onClose={() => setSelectedCourse(null)} modal>
          <ExtendedCourseCard course={selectedCourse} />
        </Popup> */}
      {/* )} */}


      {/* {selectedCourseType === "All" && courses.map((course, index) => (
          <div key={index} className="carousal-space">
            <div className="category_name">New Arrivals</div>
            <div className="rule_r"></div>
            <div className="projects">
              <CourseCard course={course} />
            </div>
          </div>
        ))}
        
        {selectedCourseType === "My" &&
          <div className="carousal-space">
            <div className="category_name">Courses added by me</div>
            <div className="rule_r"></div>
            <div className="projects">
              <CourseCard />
            </div>
          </div>
        }
        
      </div> */}
      <div className="center">
       
        <footer className="footer">Thank you for visiting</footer>
      </div>
    </div>
  );
};

export default Course;
