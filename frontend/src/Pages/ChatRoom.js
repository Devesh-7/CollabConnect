// import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';
// import io from 'socket.io-client';
// const socket = io.connect('http://localhost:5500');
// const ChatRoom = () => {
//   const userId = useParams().userID;
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [collabedProjects, setCollabedProjects] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCollabedProjects = async () => {
//       try {
//         console.log(userId);
//         const response = await axios.get(`http://localhost:5500/api/collab/collabs/${userId}`);
//         setCollabedProjects(response.data);
//       } catch (error) {
//         console.error('Error fetching collabed projects:', error);
//       }
//     };

//     fetchCollabedProjects();
//   }, []);

//   const handleProjectSelect = async (projectId) => {
//     // Clear existing messages when selecting a new project
//     setMessages([]);
//     setLoading(true);
//     setError(null);
//     socket.emit('join-room', {room : projectId});
//     try {
//       // Fetch chat messages for the selected project
//       const response = await axios.get(`http://localhost:5500/api/collab/chat/${projectId}`);
//       setMessages(response.data);
//     } catch (error) {
//       console.error('Error fetching chat messages:', error);
//       setError('Error fetching chat messages. Please try again.');
//     } finally {
//       setLoading(false);
//     }

//     setSelectedProject(projectId);
//   };

//   const handleSendMessage = async () => {
//     if (messageInput.trim() !== '') {
//     // Create a new message object
//     const newMessage = { userID: userId, message: messageInput };
//     // Make a POST request to store the message
//     await axios.post(`http://localhost:5500/api/collab/chat/${selectedProject}`,  newMessage );
//     socket.emit('send-message', {user : userId, message : newMessage, sendTo : selectedProject});
//     }
//     setMessages([...messages, { userID: userId, message: messageInput }]);
//     setMessageInput('');
//   };

//   useEffect(() => {
//       socket.on('receive-message', (data) => {
//       console.log(data);
//       setMessages([...messages, { userID: data.user, message: data.message.message }]);
//       setMessageInput('');
//     });
//   }
//   , [socket,messages]);

//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       {/* Left Panel - Project Cards */}
//       <div style={{ flex: '1', overflowY: 'auto', padding: '10px', borderRight: '1px solid #ccc' }}>
//         <h2>Projects</h2>
//         {collabedProjects.map((project) => (
//           <Link to={`/chatroom/${userId}/${project._id}`} style={{ textDecoration: 'none' }}>
//             <div
//               key={project._id}
//               onClick={() => handleProjectSelect(project._id)}
//               style={{
//                 cursor: 'pointer',
//                 padding: '10px',
//                 border: selectedProject === project._id ? '2px solid orange' : '2px solid transparent',
//                 backgroundColor: selectedProject === project._id ? '#f8f8f8' : 'transparent',
//                 marginBottom: '10px',
//                 borderRadius: '5px',
//               }}
//             >
//               <h3>{project.title}</h3>
//               <p>{project.description}</p>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {/* Right Panel - Chat Room */}
//       <div style={{ flex: '3', padding: '10px' }}>
//         {selectedProject ? (
//           <>
//             {/* Message Display Window (80% width) */}
//             <div style={{ width: '80%', border: '1px solid #ccc', minHeight: '400px', marginBottom: '10px', padding: '10px', borderRadius: '5px', overflowY: 'auto' }}>
//               {/* Display messages here */}
//               {loading && <p>Loading messages...</p>}
//               {error && <p>{error}</p>}
//               {!loading && !error && messages.map((message, index) => (
//                 <div key={index}>
//                   <strong>{message.userID}:</strong> {message.message}
//                 </div>
//               ))}
//             </div>

//             {/* Message Input and Send Button (20% width) */}
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//               <input
//                 type="text"
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 style={{ flex: '1', marginRight: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
//                 placeholder="Type your message"
//               />
//               <button onClick={handleSendMessage} style={{ backgroundColor: 'orange', padding: '5px', borderRadius: '5px', cursor: 'pointer' }}>
//                 Send
//               </button>
//             </div>
//           </>
//         ) : (
//           <p>Select a project to start chatting</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import ChatContent from '../Components/ChatContent';
import ChatList from '../Components/ChatList';
import'./CollabPage.css';

const socket = io.connect('http://localhost:5500');

const CollabPage = () => {
  const navigate = useNavigate();
  const [collabedProjects, setCollabedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const userId =  JSON.parse(localStorage.getItem('userData'))._id;

  useEffect(() => {
    const fetchCollabedProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:5500/api/collab/collabs/${userId}`);
        setCollabedProjects(response.data);
      } catch (error) {
        console.error('Error fetching collabed projects:', error);
      }
    };

    fetchCollabedProjects();
  }, [userId]);

  // Handler for when a project is clicked in the ChatList
  const handleProjectClick = async (projectId) => {
    console.log("Project clicked:", projectId);
    navigate(`/chatroom/${projectId}`);
    setMessages([]);
    setError(null);
    socket.emit('join-room', { room: projectId });
    try {
      // Fetch chat messages for the selected project
      const response = await axios.get(`http://localhost:5500/api/collab/chat/${projectId}`);
      setMessages(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setError('Error fetching chat messages. Please try again.');
    }

    setSelectedProject(projectId);
  };

  const updateMessages = (newMessages) => {
    setMessages(newMessages);
  };

  return (
    <div className="chatroom_holder">
      <div className="chatroom_left">
      <ChatList collabedProjects={collabedProjects} onProjectClick={handleProjectClick} socket={socket} />
      </div>
      {selectedProject ? (
        <div className="chatroom_right">
        <ChatContent userId={userId} selectedProject={selectedProject} messages={messages} socket={socket} updateMessages={updateMessages} />
      </div>) : 
      (<div className="chatroom_right">
        <p> Select a project to start chatting </p>
        </div>) }

    </div>
  );
};

export default CollabPage;
