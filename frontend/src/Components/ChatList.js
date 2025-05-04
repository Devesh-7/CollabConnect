import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Pages/CollabPage.css";
import ellipse from "../Assets/ellipse.svg";
import homeIcon from "../Assets/home.svg";

export default class ChatList extends Component {
  constructor(props) {
    super(props);
    this.chatListItemRefs = [];
    this.state = {
      currentIndex: 0, // Keeps track of the current index for scrolling functionality
    };
  }

  scrollToNextItem = () => {
    const { collabedProjects } = this.props; // Destructure collabedProjects from props
    if (this.state.currentIndex < collabedProjects.length - 1) {
      this.setState(
        (prevState) => ({
          currentIndex: prevState.currentIndex + 1,
        }),
        () => {
          const element = this.chatListItemRefs[this.state.currentIndex];
          if (element && element.listItemRef.current) {
            element.listItemRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      );
    }
  };

  render() {
    const { collabedProjects } = this.props; // Use collabedProjects from props

    return (
      <div className="main__chatlist">
        <div className="chatroom__left__header">
          <div className="chat-heading">
            <div className="home"><Link to="/dashboard"><img src={homeIcon} /></Link></div>
            <div className="chatroom">Chat Room</div>
          </div>
          <div className="ruler"></div>
        </div>
        <div className="chatRoom_job_names">
          {collabedProjects.map((item, index) => (
            <ChatListItems
              projectName={item.title}
              projectDescription={item.description}
              key={item._id}
              animationDelay={index + 1}
              active={item.active ? "active" : ""}
              onClick={() => this.props.onProjectClick(item._id)} // Use arrow function to pass item.id
              ref={(el) => (this.chatListItemRefs[index] = el)}
            />
          ))}
        </div>
        {/* <button className="scroll-button" onClick={this.scrollToNextItem}>
          <img src={ellipse} alt="scroll down" />
        </button> */}
      </div>
    );
  }
}

class ChatListItems extends Component {
  constructor(props) {
    super(props);
    this.listItemRef = React.createRef();
  }

  selectChat = (e) => {
    for (let index = 0; index < e.currentTarget.parentNode.children.length; index++) {
      e.currentTarget.parentNode.children[index].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    this.props.onClick(); // Call the onClick function from props
  };

  render() {
    const { projectName, projectDescription, active, animationDelay } = this.props; // Destructure onClick from props
    return (
      <div
        ref={this.listItemRef}
        style={{ animationDelay: `0.${animationDelay}s` }}
        onClick={this.selectChat} // Attach onClick handler here
        className={`jobname ${active}`}
      >
        <div className="job">
          <div><strong>{projectName}</strong></div>
          <div>{projectDescription}</div>
          <div className="ruler"></div>
        </div>
      </div>
    );
  }
}

// import "../Pages/CollabPage.css";
// import React, { Component } from "react";
// import ellipse from "../Assets/ellipse.svg";
// export default class ChatList extends Component {
//   allChatUsers = [
//     {
//       id: 1,
//       name: "front end Devesh Dhyani",
//       active: true,
//     },
//     {
//       id: 2,
//       name: "back end Devesh Dhyani",
//       active: false,
//     },
//     {
//       id: 3,
//       name: "ui/ux designer",
//       active: false,
//     },
//     {
//       id: 4,
//       name: "react js",
//       active: false,
//     },
//     {
//       id: 5,
//       name: "back end Devesh Dhyani",
//       active: false,
//     },
//     {
//       id: 6,
//       name: "ui/ux designer",
//       active: false,
//     },
//     {
//       id: 7,
//       name: "react js",
//       active: false,
//     },
//     {
//       id: 8,
//       name: "back end Devesh Dhyani",
//       active: false,
//     },
//     {
//       id: 9,
//       name: "ui/ux designer",
//       active: false,
//     },
//     {
//       id: 10,
//       name: "react js",
//       active: false,
//     },
//     {
//       id: 11,
//       name: "back end Devesh Dhyani",
//       active: false,
//     },
//     {
//       id: 12,
//       name: "ui/ux designer",
//       active: false,
//     },
//     {
//       id: 13,
//       name: "react js",
//       active: false,
//     },
//   ];

//   constructor(props) {
//     super(props);
//     this.chatListItemRefs = [];
//     this.state = {
//       allChats: this.allChatUsers,
//       currentIndex: 0, // Initialize currentIndex
//     };
//   }

//   scrollToNextItem = () => {
//     // Check if there are more items to scroll
//     if (this.state.currentIndex < this.state.allChats.length - 1) {
//       // Increment the currentIndex
//       this.setState(
//         (prevState) => ({
//           currentIndex: prevState.currentIndex + 1,
//         }),
//         () => {
//           // Scroll to the next item
//           const element = this.chatListItemRefs[this.state.currentIndex];

//           if (element && element.listItemRef.current) {
//             element.listItemRef.current.scrollIntoView({
//               behavior: "smooth",
//               block: "start",
//             });
//           }
//         }
//       );
//     }
//   };

//   render() {
//     return (
//       <div className="chatroom_left">
//         <div className="chatroom">Chat Room</div>
//         <div className="ruler"></div>
//         <div className="chatRoom_job_names">
//           {this.state.allChats.map((item, index) => (
//             <ChatListItems
//               name={item.name}
//               key={item.id}
//               animationDelay={index + 1}
//               active={item.active ? "active" : ""}
//               ref={(el) => (this.chatListItemRefs[index] = el)}
//             />
//           ))}
//         </div>
//         <button className="scroll-button" onClick={this.scrollToNextItem}>
//           <img src={ellipse} alt="scroll down" />
//         </button>
//       </div>
//     );
//   }
// }

// class ChatListItems extends Component {
//   constructor(props) {
//     super(props);
//     this.listItemRef = React.createRef();
//   }

//   selectChat = (e) => {
//     for (
//       let index = 0;
//       index < e.currentTarget.parentNode.children.length;
//       index++
//     ) {
//       e.currentTarget.parentNode.children[index].classList.remove("active");
//     }
//     e.currentTarget.classList.add("active");
//   };

//   render() {
//     return (
//       <div
//         ref={this.listItemRef}
//         style={{ animationDelay: `0.${this.props.animationDelay}s` }}
//         onClick={this.selectChat}
//         className={`jobname ${this.props.active ? this.props.active : ""} `}
//       >
//         <div className="job">
//           <div>{this.props.name}</div>
//         </div>
//       </div>
//     );
//   }
// }


