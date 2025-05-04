import React, { useState } from 'react';
// import dollar from '../Assets/dollar.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faStar} from '@fortawesome/free-solid-svg-icons'
import './SearchCardCourse.css'

function CoursesTabs() {
  const [name, setName] = useState('Frontend Developer Job');
  const [number, setNumber] = useState('5.2k');
  const [name2, setName2] = useState('Backend Developer Job');
  const [number2, setNumber2] = useState('5.2k');
  const [name3, setName3] = useState('Design Job');
  const [number3, setNumber3] = useState('5.2k');
  const [job1, setJob1] = useState('Python');
  const [job2, setJob2] = useState('Figma');
  const [job3, setJob3] = useState('Java');
  const [contactNumber, setContactNumber] = useState('1234'); // Change this to the desired number
  const [showTabs, setShowTabs] = useState(true);

  const handleFocus = () => {
    setShowTabs(true);
  };

  const handleBlur = () => {
    setShowTabs(false);
  };

  const cards = [
    {
      title: 'Card-1',
      text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus corporis reprehenderit in deleniti maxime laudantium modi repellat laborum, debitis consequatur!'
    },
  ];

  return (
    <div className="tabs">
      <div className="tab">
        <div className="tab-content">
          <div className="tab-info">
            <p className='name'>{name}</p>
            <div className="underline"></div>
            <p className='number'>{number}</p>
            <div className="tab-buttons">
              <div className="tab-btn-container">
                <button className="tab-btn">{job1}</button>
                <button className="tab-btn">{job2}</button>
                <button className="tab-btn">{job3}</button>
              </div>
              <div className="spacer"></div>
              {/* <p className="tab-btn-right">{contactNumber}</p> */}
            </div>
          </div>
          {/* <img src={dollar} alt="dollarsvg" className='svg-dollar'/> */}
          <FontAwesomeIcon className='svg-star' icon={faStar} style={{color: "#FFD43B",}} />
        </div>
      </div>
      <div className="tab">
        <div className="tab-content">
          <div className='tab-info'>
            <p className='name'>{name2}</p>
            <div className="underline"></div>
            <p className='number'>{number2}</p>
            <div className="tab-buttons">
              <div className="tab-btn-container">
                <button className="tab-btn">{job1}</button>
                <button className="tab-btn">{job2}</button>
                <button className="tab-btn">{job3}</button>
              </div>
              <div className="spacer"></div>
              {/* <p className="tab-btn-right">{contactNumber}</p> */}
            </div>
          </div>
          {/* <img src={dollar} alt="dollarsvg" className='svg-dollar'/> */}
          <FontAwesomeIcon className='svg-star' icon={faStar} style={{color: "#FFD43B",}} />
        </div>
      </div>
      <div className="tab">
        <div className="tab-content">
          <div className='tab-info'>
            <p className='name'>{name3}</p>
            <div className="underline"></div>
            <p className='number'>{number3}</p>
            <div className="tab-buttons">
              <div className="tab-btn-container">
                <button className="tab-btn">{job1}</button>
                <button className="tab-btn">{job2}</button>
                <button className="tab-btn">{job3}</button>
              </div>
              <div className="spacer"></div>
              {/* <p className="tab-btn-right">{contactNumber}</p> */}
            </div>
          </div>
          {/* <img src={dollar} alt="dollarsvg" className='svg-dollar'/> */}
          <FontAwesomeIcon className='svg-star' icon={faStar} style={{color: "#FFD43B",}} />
        </div>
      </div>
    </div>
  );
}

export default CoursesTabs;
