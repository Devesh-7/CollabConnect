// import React from "react";
// import "./courseCard.css";
// import Popup from 'reactjs-popup';
// import mySVGURL from '../Assets/userDummy.svg';
// import Popoutcourse from './popoutcourse';
// import FilledStarIcon from '../Assets/heart.svg'


// function CourseCard({link, rating, courseName, course}) {
//   const ensureFullURL = (link) => {
//             if (!link.startsWith('http://') && !link.startsWith('https://')) {
//               return `https://${link}`;
//             }
//             return link;
//           };
//   return (
//     <div className="ParentCourseCard">
//       <div className="card-container">
//         {/* <div className="card-header">
//           <div className="user-name">
//             <div className='name'>Mr. Aman Sharma</div>
//             <div className='icon'>
//             <FontAwesomeIcon  icon={faUser} style={{color: "#0059CD", width:"2vw"}} />
//             </div>
//           </div>
//           <div className="likes">3.6k</div>
//           <div className="heart">
//             <div className='heart-icon'>
//               <FontAwesomeIcon  icon={faHeart} style={{color: "#ff0000", width:"1.2vw"}} />
//             </div>
//           </div>
//         </div> */}
//         <div className="card-header">
//             <div className="course_card_owner">
//               <div className="course_card_owner_name"><a href={ensureFullURL(link)}>Link</a></div>
//               <div className="course_card_owner_profile-button">
                
//               </div>
//             </div>
//             <div className="course_top_right_div">
//                 <div className="course_no_of_likes">{rating}</div>
//                 <div className="course-right-circle">
//                 <img
//                     src={FilledStarIcon}
//                     alt="My SVG"
//                     className="navbar-right-circle-img"
//                 />
//                 </div>
//             </div>
//         </div>

//         <div className="card-content">
//           <div className="logo">
//             <div className="logo-text">{courseName.slice(0, 3)}</div>
//           </div>
//           <div className="course-title">
//             <div className="Course">{courseName}</div>
//           </div>
//         </div>
//         <div className="card-footer">
//           <div className="hz-line">
//             <div className="line"></div>
//           </div>
//           <Popup
//                   trigger={
//                     <button className="join-btn">View</button>
//                   }
//                 modal nested
//                 >
//                   {(close) => (
//                     <div className="modal">
//                       <div className="content">
//                         <Popoutcourse course={course} />
//                       </div>
//                     </div>
//                   )}
//                 </Popup>
          
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CourseCard;


import React from "react";
import "./courseCard.css";
import Popup from 'reactjs-popup';
import mySVGURL from '../Assets/userDummy.svg';
import Popoutcourse from './popoutcourse';
import FilledStarIcon from '../Assets/filledStarIcon.svg'


function CourseCard({link, rating, courseName, course}) {
  const ensureFullURL = (link) => {
            if (!link.startsWith('http://') && !link.startsWith('https://')) {
              return (`https://${link}`);
            }
            return link;
          };
  return (
    <div className="ParentCourseCard">
      <div className="card-container">
        {/* <div className="card-header">
          <div className="user-name">
            <div className='name'>Mr. Aman Sharma</div>
            <div className='icon'>
            <FontAwesomeIcon  icon={faUser} style={{color: "#0059CD", width:"2vw"}} />
            </div>
          </div>
          <div className="likes">3.6k</div>
          <div className="heart">
            <div className='heart-icon'>
              <FontAwesomeIcon  icon={faHeart} style={{color: "#ff0000", width:"1.2vw"}} />
            </div>
          </div>
        </div> */}
        <div className="card-header">
            <div className="course_card_owner">
              <div className="course_card_owner_name"><a href={ensureFullURL(link)}>Course Link</a></div>
              <div className="course_card_owner_profile-button">
                
              </div>
            </div>
            <div className="course_top_right_div">
                <div className="course_no_of_likes">{rating}</div>
                <div className="course-right-circle">
                <img
                    src={FilledStarIcon}
                    alt="My SVG"
                    className="fsi-right-circle-img"
                />
                </div>
            </div>
        </div>

        <div className="card-content">
          <div className="logo">
            <div className="logo-text">{courseName.slice(0, 3)}</div>
          </div>
          <div className="course-title">
            <div className="Course">{courseName}</div>
          </div>
        </div>
        <div className="card-footer">
          <div className="hz-line">
            <div className="line"></div>
          </div>
          <Popup
                  trigger={
                    <button className="join-btn">View</button>
                  }
                modal nested
                >
                  {(close) => (
                    <div className="modal">
                      <div className="content">
                        <Popoutcourse course={course} />
                      </div>
                    </div>
                  )}
                </Popup>
          
        </div>
      </div>
    </div>
  );
}

export default CourseCard;