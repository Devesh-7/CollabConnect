import React from 'react'
import './DoubtCard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUp } from '@fortawesome/free-solid-svg-icons'
import { faCircleDown } from '@fortawesome/free-solid-svg-icons'

const upvoteCount = 20;
const downvoteCount = 0;

const DoubtCard = ({ques,ans}) => {
    return(
        <div className='CardContainer'>
            <div className='question'>
                <div>
                    <a href='https://shorturl.at/qKX58' target='_blank'>
                         <img src='https://shorturl.at/qKX58' className='dp' />
                    </a>                                       
                </div>
                <div>Q. {ques}</div>
            </div>
            <div className='AnswerContainer' >
                {/* {ans.map((item,i)=>{<Answer ans={item[i]}/>})} */}
                <Answer ans={ans} />
            </div>
            
            <div className='bottombar'>
                <button className='AnswerBtn'>Answer</button>
            </div>
            
            
        </div>
    )
}

function Answer({ans}){
    return(
        <div className='answer'>
                    <div>
                        <a href='https://shorturl.at/qKX58' target='_blank'>
                            <img src='https://shorturl.at/qKX58' className='dp' />
                        </a>                                       
                    </div>
                    <div className='ans'>
                        <div>Ans. </div>
                        <div>{ans}</div>
                        <div className='DoubtAnswerVote'>
                            <div className='DoubtUpvote-count'>
                                <button className='DoubtAnswerUpVote'>
                                <FontAwesomeIcon icon={faCircleUp} style={{color: "#146aff",}} /> 
                                </button>
                                <div className='count'>{upvoteCount}</div>
                            </div>
                            <div className='DoubtDownvote-count'>
                                <button className='DoubtAnswerDownVote'>
                                <FontAwesomeIcon icon={faCircleDown} style={{color: "#146aff",}} />                              
                                </button>
                                <div className='count'>{downvoteCount}</div>    
                            </div>
                            
                        </div>
                    </div>
                </div>
    )
}

export default DoubtCard;