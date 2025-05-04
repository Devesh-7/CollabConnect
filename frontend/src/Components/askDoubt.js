import React, { useState } from 'react';
import './askAnsDoubt.css';
import axiosInstance from '../api/axiosInstance';
function AskDoubt() {
    const [submitClicked, setSubmitClicked] = useState(false);
    const [question, setQuestion] = useState('');

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
    };
    const user=JSON.parse(localStorage.getItem("userData"));
    const userid=user._id;  
    const handleSubmit = async () => {
        setSubmitClicked(true);
        await fetch(`http://localhost:5500/api/doubts/postdoubt/${userid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.reload();

            // Handle success, maybe clear the form or show a success message
        })
        .catch((error) => {
            console.error('Error posting:', error);
            // Handle errors here, such as showing an error message
        });
    };

    return (
        <div className="form">
            <div className="search">
                <textarea placeholder="Ask a Question..." className="search-bar" value={question}
                    onChange={handleQuestionChange}/>
            </div>
            <div className="lower-part">
                <div className="dummy"></div>
                <button className='submit' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default AskDoubt;
