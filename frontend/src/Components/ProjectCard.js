// import './ProjectCard.css'
// import ProjectPopOut from './ProjectPopOut'
// import likeSVG from '../Assets/heart.svg'
// import dollarSVG from "../Assets/dollar.svg";
// import Popup from 'reactjs-popup';
// function ProjectCard() {
// return(
//    <div className="ProjectCardBox">
//     <div className="ProjectCardBoxUpper">
//       <div className="ProjectCardBoxUpperLeft">
//           <div className='ProjectCardBoxUpperLeftName'>Jv</div>
//       </div>
//       <div className="ProjectCardBoxUpperRight">
//         <div className="ProjectCardBoxUpperRightCW">
//           <div className='ProjectCardBoxUpperRightCWLikes'>1.7k</div>
//           <div className="ProjectCardBoxUpperRightCWCircle"><img src={likeSVG} alt="My SVG" className="ProjectCardBoxUpperRightCWCircleImg" /></div>     
//         </div>
//         <div className="ProjectCardBoxUpperRightName">
//           <div className='ProjectCardBoxUpperRightProjectName'>Frontend Developer Job</div>
//           <hr className='ProjectCardBoxUpperRightProjectNameHR'/>
//         </div>
//       </div>
//     </div>
//     <div className="ProjectCardBoxLower">
//       <div className="ProjectCardBoxLowerCredits">
//         <div className='ProjectCardBoxLowerCreditsContainer'><img src={dollarSVG} className="ProjectCardBoxLowerCreditsDollar" alt="dollarsvg" /></div>
//         <div className="ProjectCardBoxLowerCreditsAmount">25</div>
//       </div>
//       <div className="ProjectCardBoxLowerViewPopup">
//         <Popup trigger = 
//           {<button className="ProjectCardBoxLowerViewPopupButton"><p className="ProjectCardBoxLowerViewPopupView">View</p></button>}
//           modal nested>
//             {
//             close => (
//               <div className='modal'>
//                 <div className='content'>
//                     <ProjectPopOut/>
//                 </div>
//               </div>
//             )
//           }
//         </Popup>
//       </div>
//     </div>
//    </div>
// )

// }
// export default ProjectCard;

import "./ProjectCard.css";
import ProjectPopOut from "./ProjectPopOut";
import likeSVG from "../Assets/filledStarIcon.svg";
import dollarSVG from "../Assets/dollar.svg";
import Popup from "reactjs-popup";
import { useEffect } from "react";
const ProjectCard = ({ projectData }) => {
  console.log("Project Data in project card : ", projectData);

  useEffect(() => {
    console.log(projectData);
  }, [])

  return (
    <div className="ProjectCardBox">
      {projectData && (
        <>
          <div className="ProjectCardBoxUpper">
            <div className="ProjectCardBoxUpperLeft">
              <div className="ProjectCardBoxUpperLeftName">{projectData.title.substring(0, 2)}</div>
            </div>
            <div className="ProjectCardBoxUpperRight">
              <div className="ProjectCardBoxUpperRightCW">
                <div className="ProjectCardBoxUpperRightCWLikes">{projectData.rating}</div>
                <div className="ProjectCardBoxUpperRightCWCircle">
                  <img
                    src={likeSVG}
                    alt="My SVG"
                    className="ProjectCardBoxUpperRightCWCircleImg"
                  />
                </div>
              </div>
              <div className="ProjectCardBoxUpperRightName">
                <div className="ProjectCardBoxUpperRightProjectName">
                  {projectData.title}
                </div>
                <hr className="ProjectCardBoxUpperRightProjectNameHR" />
              </div>
            </div>
          </div>
          <div className="ProjectCardBoxLower">
            <div className="ProjectCardBoxLowerCredits">
              <div className="ProjectCardBoxLowerCreditsContainer">
                <img
                  src={dollarSVG}
                  className="ProjectCardBoxLowerCreditsDollar"
                  alt="dollarsvg"
                />
              </div>
              <div className="ProjectCardBoxLowerCreditsAmount">{projectData.perHeadCredits}</div>
            </div>
            <div className="ProjectCardBoxLowerViewPopup">
              <Popup projectData={projectData} className="Popup_projectCard"
                trigger={
                  <button className="ProjectCardBoxLowerViewPopupButton">
                    <p className="ProjectCardBoxLowerViewPopupView">View</p>
                  </button>
                }
                modal
                nested
              >
                {(close) => (
                  <div className="modal">
                    <div className="content">
                      <ProjectPopOut projectData={projectData} />
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default ProjectCard;
