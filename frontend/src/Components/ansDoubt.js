import React, { useState } from 'react';
import './askAnsDoubt.css';

function AnsDoubt({quesid}) {
    const [submitClicked, setSubmitClicked] = useState(false);
    const [answer, setAnswer] = useState('');

    const handleAnswerChange = (event) => {
        setAnswer(event.target.value);
    };
    const user=JSON.parse(localStorage.getItem("userData"));
    const userid=user._id;
    const handleSubmit = () => {
        if(user.questionList.includes(quesid)){
            alert("You have already answered this question");
            return;
        }
        setSubmitClicked(true);
        fetch(`http://localhost:5500/api/doubts/postans/${userid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answer: answer, quesid: quesid, userid: userid }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert("Answer to this question submitted successfully");
            window.location.href = "/dashboard";

            // Handle success, maybe clear the form or show a success message
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors here, such as showing an error message
        });
    };

    return (
        <div className="form">
            <div className="search">
                <textarea placeholder="Answer the question..." className="search-bar" value={answer}
                    onChange={handleAnswerChange}/>
            </div>
            <div className="lower-part">
                <div className="dummy"></div>
                <button className='submit' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default AnsDoubt;
