import React, { Component } from "react";
import './ChatContent.css';
export default class ChatItem extends Component {
  constructor(props) {
    super(props);
  }
  // componentDidMount() {
  //   const chatItems = document.querySelectorAll('.chat__item');
  //   chatItems.forEach((item) => {
  //     // get the second class of the item
  //     // console.log('Item:', item.classList);
  //     if(this.props.index === item.classList[1]) {
  //       const senderId = this.props.user;
  //       const myuserId = this.props.myuserId;
  //       console.log('Sender ID:', senderId);
  //       console.log('Reciever ID:', myuserId);
  //       if(myuserId != senderId) {
  //         item.classList.add('other');
  //       }
  //     }
  //   });
  // }
  render() {
    return (
      <div
        style={{ animationDelay: `0.8s` }}
        className={`chat__item ${this.props.user} ${this.props.myuserId === this.props.user ? '' : 'other'}`}
      >
        <div className="chat__item__content">
          <div className="chat__msg">{this.props.msg}</div>
          <div className="chat__meta">
            <span>{this.props.username}</span>
          </div>
        </div>
      </div>
    );
  }
}