// import Card from "./reviewCard.js";
// import useremoji from "../Assets/userEmoji.png";
// import heartemoji from "../Assets/heartEmoji.png";
// import rectangle from "../Assets/Rectangle.png";
// import button from "../Assets/button.png";
// import Tags from './courseTags.js'
// import './popoutcourse.css';
// import { useState, useEffect } from 'react';
// const Popoutcourse=({course})=>
// {
//     // const dummytext = "When they are segmented, many long text messages are displayed in a random order. This can be extremely frustrating for the reader. To help solve this problem, Text magic displays long text messages as a single text. Unicode characters take up multiple GSM characters. When a Unicode symbol appears in a text, it is usually segmented at the 70-character mark, thus making it even harder for the recipient to decipher the message.";
//     // const badareview="When they are segmented, many long text messages are displayed in a random order.When they are segmented, many long text messages are displayed in a random order.When they are segmented, many long text messages are displayed in a random order.When they are segmented, many long text messages are displayed in a random order. This can be extremely frustrating for the reader. To help solve this problem, Text magic displays long text messages as a single text. Unicode characters take up multiple GSM characters. When a Unicode symbol appears in a text, it is usually segmented at the 70-character mark, thus making it even harder for the recipient to decipher the message.";
//     // const chotareview="When they are segmented, many long text messages are displayed in a random order.";
//     const [inputValue, setInputValue] = useState('');
//     const [feedbackData, setFeedbackData] = useState([]); // Use state for feedback data

//     const allusers=JSON.parse(localStorage.getItem("allUsers"));
//     // let feedbackdata=[];
//     console.log('All Users:', allusers);
//     const courseadder=allusers.filter(user => user._id === course.addedBy)[0];
//     console.log('course Adder:', courseadder);
//     useEffect(() => {
//     const fetchFeedback = async () => {
//         try {
//             const response = await fetch(`http://localhost:5500/courses/getfeedback/${course._id}`);
//             const feedback = await response.json();
//             console.log('All feedback:', feedback.data);
//             setFeedbackData(feedback.data);
//             // Process the feedback data here
//         } catch (error) {
//             console.error('Error fetching feedback:', error);
//         }
//     };
    
//     fetchFeedback();
//     }, [course._id]);
//     const handleInputChange = (event) => {
//       setInputValue(event.target.value);
//     };
  
//     const handleButtonClick = () => {
//       console.log('Button clicked with input value:', inputValue);
//     };
//     const ensureFullURL = (link) => {
//         if (!link.startsWith('http://') && !link.startsWith('https://')) {
//           return `https://${link}`;
//         }
//         return link;
//       };
//     return(
//         <div className="popoutcorseDiv">
//             <div className="leftSection"> 
//             <div className="nameAndLikes">
//             <div className="nameDiv">
//                 <div className="nameDivpop">
//                     {courseadder.username}
//                 </div>
//                 <div className="personEmoji">
//                     <img style={{ width: "1.5vw",height:"1.5vw"}} className="personimgdiv" src={useremoji}/>
//                 </div>
//             </div>
//             <div className="likes">
//                 <div className="countLikes">
//                     {course.rating}
//                 </div>
//                 <div className="heartEmoji">
//                 <img style={{ width: "1.7vw",height:"1.7vw", margin: 'auto'}} src={heartemoji}/>
//                 </div>
//             </div>
//             </div>
//             <div className="imgDiv">
//                 <img style={{width:"80%",height:"90%"}}  src={rectangle}/>
//             </div>
//             <div className="titleSection">
//                 {course.courseName}
//                 <hr className="horizontal-line" />
//             </div>
//             <div className="details">
//             {course.courseDesc}
//             </div>
//             <div className="tagsSection">
//                 <div className="headingTags">
//                     Tags:
//                 </div>
//                 {course.tag.map((tag) => (
//                     <Tags tag={tag}></Tags>
//                 ))}
                
//             </div>
//             <div className="joinButtonDiv">
//                 <button className="joinButton"><a href={ensureFullURL(course.linkTocourse)}>Link</a></button>
//             </div>
//             </div>
//             <div className="rightSection">
//                 <div className="reviewHeadingSection">Reviews</div>
//                 <div className="listOfReviewsDiv">
//                     {feedbackData.map((fb, index) => 
//                         // console.log('Feedback:', fb),
//                         <Card key={index} review={fb.review} rating={fb.rating}/>
//                     )}
//                 <Card review='When they are segmented, many long text messages are displayed in a random order. This can be extremely frustrating for the reader. To help solve this problem, Text magic displays long text messages as a single text. Unicode characters take up multiple GSM characters. When a Unicode symbol appears in a text, it is usually segmented at the 70-character mark, thus making it even harder for the recipient to decipher the message.' rating={10}/>
//                 </div>
//                 <div className="writeReviewsDiv">
//                 <input
//                     type="text"
//                     value={inputValue}
//                     onChange={handleInputChange}
//                     placeholder="Write Reviews"
//                     className={`inputStyle`}
//                 />
//                 <button className="buttonDiv" onClick={handleButtonClick}>
//                     <img className="buttonImg" src={button}/>
//                 </button>
//                 </div>
//             </div>


//         </div>
//     )
// }

// export default Popoutcourse;

import "./popoutcourse.css";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import mySVGURL from "../Assets/userDummy.svg";
import ProfileCard from "./ProfileCard";
import FilledStarIcon from "../Assets/filledStarIcon.svg";
import EmptyStarIcon from "../Assets/emptyStarIcon.png";
import SubmitReviewIcon from "../Assets/submitReviewIcon.svg";

//import { FaHeart, FaUser, FaSearch } from "react-icons/fa";
import dollarSVG from "../Assets/dollar.svg";
const Popoutcourse = ({ course }) => {


  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackData, setFeedbackData] = useState([]);
  const [tags, setTags] = useState([]); 
  const ensureFullURL = (link) => {
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      return `https://${link}`;
    }
    return link;
  };
  const user=JSON.parse(localStorage.getItem("userData"));
    const userid=user._id;
  const allusers=JSON.parse(localStorage.getItem("allUsers"));
  console.log('All Users:', allusers);
    const courseadder=allusers.filter(user => user._id === course.addedBy)[0];
    console.log('course Adder:', courseadder);
    useEffect(() => {
    const fetchFeedback = async () => {
        try {
            const response = await fetch(`http://localhost:5500/courses/getfeedback/${course._id}`);
            const feedback = await response.json();
            console.log('All feedback:', feedback.data);
            setFeedbackData(feedback.data);
            setTags(course.tag);
            // Process the feedback data here
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };
    fetchFeedback();
    }, [course._id]);
  const submitReview = () => {
    // Handle the review submission logic here
    for (let i = 0; i < feedbackData.length; i++) {
        if (feedbackData[i].userID === user._id) {
            // User ID is present in feedbackData[i].userID
            // Add your logic here
            alert("You have already submitted a review for this course");
            return;
        }
    }
    
    console.log(reviewText, rating);
    fetch(`http://localhost:5500/courses/addFeedback/${course._id}/${userid}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ review: reviewText, rating: rating}),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setFeedbackData([...feedbackData, {review: reviewText, rating: rating}]);
            setRating(data.data.rating);
            // Handle success, maybe clear the form or show a success message

        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors here, such as showing an error message
        });
    // Reset after submit
    setReviewText("");
    setRating(0);
    alert("Review submitted successfully");
    window.location.href = "/dashboard";
  };

  useEffect(() => {
    console.log(course);
  }, [course]);

  return (
    <>
      <div className="course_popoutbody">
        <div className="course_pop_left">
          <div className="course_pop_profile">
            <div className="course_profile_tag">
              <div className="course_pop_name">{courseadder.username}</div>
              <img src={mySVGURL} alt="" className="course_pop_profileIcon" />
            </div>
            <div className="course_pop_likes">
              <span>{course.rating}</span>
              <div className="course_pop_heartContainer">
                <img
                  src={FilledStarIcon}
                  alt=""
                  className="course_pop_heart"
                />
              </div>
            </div>
          </div>
          <div className="course_pop_jv">{course.courseName.slice(0,3)}</div>
          <div className="course_pop_courseTitle">{course.courseName}</div>
          <div className="course_pop_describe">
            {course.courseDesc}
          </div>
          <div className="course_pop_tags_contain">
            <div className="course_pop_tags_text">Tags:</div>
            {tags.map((tag, index) => (
                <div key={index} className="course_pop_individualTags">{tag}</div>
            ))}

          </div>
          <div className="course_pop_joinbtn"><a href={ensureFullURL(course.linkToCourse)}>Link to Course</a></div>
        </div>
        <div className="course_pop_right">
          <div className="course_pop_reviewsHeading">Reviews</div>
          <div className="course_pop_reviewContainer">

        {feedbackData.map((fb, index) => 
            <div key ={index } className="course_pop_singleReview">
                <div className="course_pop_reviewText">
                    {fb.review}
                </div>
                <div className="course_pop_reviewStars">
                    {[...Array(fb.rating)].map((_, index) => (
                        <img key={index} src={FilledStarIcon} alt="" />
                    ))}
                    {[...Array(5 - fb.rating)].map((_, index) => (
                        <img key={index} src={EmptyStarIcon} alt="" />
                    ))}
                </div>
            </div>
        )}
            
          </div>
            <div className="course_pop_addReview">
              <input
                type="text"
                placeholder="Write reviews"
                className="course_pop_inputReview"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <div className="course_pop_inputStars">
                <div className="course_pop_inputStars">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={i < rating ? FilledStarIcon : EmptyStarIcon}
                      alt={i < rating ? "Filled Star" : "Empty Star"}
                      className="star-img"
                      onClick={() => setRating(i + 1)}
                    />
                  ))}
                </div>
                <img
                  src={SubmitReviewIcon}
                  alt="Submit Review"
                  className="submitReviewIcon"
                  onClick={submitReview}
                />
              </div>
            </div>
        </div>
      </div>
C </>
  );
};

export default Popoutcourse;