import React, {useState, useEffect} from 'react'
import './Cards.css'
import upbutton from '../Assets/up.svg';
import downbutton from '../Assets/down.svg';
import defaultUser from '../Assets/userSVG.svg';
import AnsDoubt from './ansDoubt';
import Popup from 'reactjs-popup';

function Card({ques,ans}){
    console.log(ques);
    const [votes, setVotes] = useState(ans.map(answer => ({ upvote: answer.upvote, downvote: answer.downvote })));
    useEffect(() => {
        setVotes(ans.map(answer => ({ upvote: answer.upvote, downvote: answer.downvote })));
    }, [ans]);
    const handleVote = (index, type, answerID) => {
        const userid=JSON.parse(localStorage.getItem("userData"));
        
        fetch(`http://localhost:5500/api/doubts/votes/${answerID}`, {
        method: 'PUT',
        
        body: JSON.stringify({
            // Assuming your backend expects the new upvote count
            userid: userid._id,
            upvote: votes[index].upvote, // Increment the upvote count by 1
            downvote: votes[index].downvote, // Increment the upvote count by 1
            type: type
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update upvote count');
        }
        response.json().then(data => {
            // Use the data here
            console.log(data.data);
            if(data.data.upvote==votes[index].upvote && data.data.downvote===votes[index].downvote){
                alert("You have already voted for this answer.")
            }
            setVotes(prevVotes => {
                const newVotes = [...prevVotes];
                newVotes[index] = {...newVotes[index], upvote: data.data.upvote, downvote: data.data.downvote};
                return newVotes;
            });
        });
        
        // Handle successful response if needed
    })
    .catch(error => {
        console.log('Error updating upvote count:', error)
        // Handle error if needed
    });
    };


    const calculateDifference = (index) => {
        const vote = votes[index];
        if (!vote) {
            console.error(`Vote at index ${index} is undefined.`);
            return 0; // Return a default value or handle this case as needed
        }
        return vote.upvote - vote.downvote;
    };
    const sortedAnswers = ans.slice().sort((a, b) => calculateDifference(b) - calculateDifference(a));

    return(
        <div className='CardContainer'>
            <div className='question'>
                <div>
                         <img src={defaultUser}  className='dp' />
                                                           
                </div>
                <div>{ques.question}</div>
            </div>

            <div className='AnswerContainer' >
                
                {sortedAnswers.map((answer, index) => (
                    
                    
                    <div key={index} className='answer'>
                    <div>
                        
                            <img src={defaultUser} className='dp' />
                                                             
                    </div>
                    <div className='ans'>
                        <div className='SetAnsDiv'><div> {answer.answerText}</div> </div>
                        <div className='DoubtAnswerVote'>
                            <div className='DoubtUpvote-count'>
                                <button onClick={() => handleVote(index, 'upvote', answer._id)} className='DoubtAnswerUpVote'>
                                <img className='upimg' src={upbutton} alt="" />

                                </button>
                                <div className='count'>{votes[index].upvote}</div>
                            </div>
                            <div className='DoubtDownvote-count'>
                                <button onClick={() => handleVote(index, 'downvote', answer._id)} className='DoubtAnswerDownVote'>
                                <img className='downimg' src={downbutton} alt="" />                              
                                </button>
                                <div className='count'>{votes[index].downvote}</div>    
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
                    
                ))}
            </div>
            
            <div className='bottombar'>
            <Popup trigger=
            {<button className='AnswerBtn'>Answer</button>}
            modal nested>
            {
              close => (
                
                    <AnsDoubt quesid={ques._id}/>
                  
                
              )
            }
          </Popup>
                
            </div>
            
            
        </div>
    )
}
export default Card;

