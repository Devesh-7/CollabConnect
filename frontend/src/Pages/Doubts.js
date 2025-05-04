import React, { useState, useEffect } from 'react';
import Card from '../Components/Cards.js';
import searchbar from '../Assets/searchbar.svg';
import add from '../Assets/add.svg';
import './Doubts.css';
import Popup from 'reactjs-popup';
import AskDoubt from '../Components/askDoubt';
const Doubts = () => {
    const [doubts, setDoubts] = useState([]);
    const [displayedDoubts, setDisplayedDoubts] = useState([]);
    const [text, setText] = useState('');

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    // Function to handle button click
    const handleButtonClick = () => {
        console.log(text);
        const filteredDoubts = doubts.filter(doubt => doubt.question.toLowerCase().includes(text.toLowerCase()));
        setDisplayedDoubts(filteredDoubts);
        
    };


    useEffect(() => {
        async function fetchDoubts() {
            try {
                const response = await fetch('http://localhost:5500/api/doubts');
                if (!response.ok) {
                    throw new Error('Failed to fetch doubts');
                }

                const data = await response.json();
                setDoubts(data);
                setDisplayedDoubts(data);
            } catch (error) {
                console.error('Error fetching doubts:', error);
            }
        }
        fetchDoubts();
    }, []);

    return (
        <div className='DoubtMainDiv'>
            <div className='doubtsHeading'>Get your doubts cleared!</div>
            <div className='addAndSearch'>
                <input
                    type="text"
                    value={text}
                    className='inputSearchbar'
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Search doubts..."
                />
                <button className='searchDiv' onClick={handleButtonClick}>
                    <img className='searchImg' src={searchbar}></img>
                </button>
                <Popup trigger=
                    {<button className='addDiv'>Ask Doubt</button>}
                    modal nested>
                    {
                        close => (
                            <AskDoubt />

                        )
                    }
                </Popup>

            </div>
            <div className='DoubtsAnswersDiv'>

                {displayedDoubts.map((doubt, index) => (
                    <Card
                        key={doubt._id}
                        ques={doubt}
                        ans={doubt.answers
                            .sort((a, b) => (b.upvote - b.downvote) - (a.upvote - a.downvote))
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default Doubts;