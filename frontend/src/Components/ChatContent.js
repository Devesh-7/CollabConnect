import React, { Component, createRef } from "react";
import sendIcon from "../Assets/sendIcon.svg";
import attachfilesIcon from "../Assets/attachfiles.svg";
import "./ChatContent.css";
import ChatItem from "./ChatItem.js";
import axios from 'axios';

export default class ChatContent extends Component {
  messagesEndRef = createRef();

  constructor(props) {
    super(props);
    this.state = {
      msg: "",
    };
  }

  scrollToBottom = () => {
    this.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    this.scrollToBottom();
    // Listen for enter key press to send a message
    window.addEventListener("keydown", this.handleKeyDown);
    console.log(this.props.userId);
    // Add other class to message item based on user
    const chatItems = document.querySelectorAll('.chat__item');
    const myuserId = this.props.userId;
    chatItems.forEach((item) => {
      // get the second class of the item
      const senderId = item.classList[1];
      //console.log('Sender ID:', senderId);
      //console.log('Reciever ID:', myuserId);
      if(myuserId != senderId) {
        item.classList.add('other');
      }
    });

    // Setup socket listener for incoming messages
    this.props.socket.on('receive-message', (data) => {
      console.log('Received message:', data);
      // Assuming `updateMessages` is a method passed from the parent component
      // this.props.updateMessages(prevMessages => [...prevMessages, { userID: data.userID, message: data.message.message }]);
      this.props.updateMessages([...this.props.messages, { userID: data.userID, message: data.message.message}]);
      
      this.scrollToBottom();
    });

  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages.length < this.props.messages.length) {
        this.scrollToBottom();
    }
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.key === "Enter" && this.state.msg !== "") {
      this.handleSendMessage();
    }
  };

  handleSendMessage = async () => {
    const { msg } = this.state;
    const { userId, selectedProject, socket, messages, updateMessages } = this.props;
    
    if (msg.trim() !== '') {
      const newMessage = { userID: userId, message: msg};
      console.log(newMessage);
      await axios.post(`http://localhost:5500/api/collab/chat/${selectedProject}`, newMessage);
      socket.emit('send-message', { userID: userId, message: newMessage, sendTo: selectedProject});

      updateMessages([...messages, newMessage]);
      this.setState({ msg: '' });
      this.scrollToBottom();
    }
  };


  onStateChange = (e) => {
    this.setState({ msg: e.target.value });
  };

  render() {
    return (
      <div className="main__chatcontent">
        <div className="content__body">
          <div className="chat__items">
            {this.props.messages.map((msg, index) => (
              <ChatItem 
                myuserId={this.props.userId}
                animationDelay={index + 2}
                index={index}
                key={index} // Consider using a unique identifier if available
                user={msg.userID}
                username={JSON.parse(localStorage.getItem('allUsers')).find(user => user._id === msg.userID).email.split('@')[0]}
                msg={msg.message}
              />
            ))}
            <div ref={this.messagesEndRef} />
          </div>
        </div>
        <div className="content__footer">
          <div className="sendNewMessage">
            <input
              type="text"
              placeholder="Type a message here"
              onChange={this.onStateChange}
              value={this.state.msg}
            />
            <button className="btnSendMsg" id="sendMsgBtn" onClick={this.handleSendMessage}>
              <img src={sendIcon} alt="send" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}



// handleAddFilesClick = () => {
//   //file picker dialog here
//   const fileInput = document.createElement("input");
//   fileInput.type = "file";
//   fileInput.click();
// };