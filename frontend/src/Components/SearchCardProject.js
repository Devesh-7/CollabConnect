import React, { useState } from 'react';
import dollar from '../Assets/dollar.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import './SearchCardProject.css';

function ProjectsTabs() {
  const [name, setName] = useState('Figma Ui workshop');
  const [number, setNumber] = useState('5.2k');
  const [name2, setName2] = useState('Figma Ui workshop');
  const [number2, setNumber2] = useState('5.2k');
  const [name3, setName3] = useState('Figma Ui workshop');
  const [number3, setNumber3] = useState('5.2k');
  const [skill1, setSkill1] = useState('Python');
  const [skill2, setSkill2] = useState('Figma');
  const [skill3, setSkill3] = useState('Java');
  const [contactNumber, setContactNumber] = useState('765');
  const [showTabs, setShowTabs] = useState(true);

  const handleFocus = () => {
    setShowTabs(true);
  };

  const handleBlur = () => {
    setShowTabs(false);
  };

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
                <button className="tab-btn">{skill1}</button>
                <button className="tab-btn">{skill2}</button>
                <button className="tab-btn">{skill3}</button>
              </div>
              <div className="spacer"></div>
              <p className="tab-btn-right">{contactNumber}</p>
            </div>
          </div>
          <img src={dollar} alt="dollar" className='svg-dollar'/>
          <FontAwesomeIcon  className='svg-heart' icon={faHeart} style={{color: "#c51b4e",}} />
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
                <button className="tab-btn">{skill1}</button>
                <button className="tab-btn">{skill2}</button>
                <button className="tab-btn">{skill3}</button>
              </div>
              <div className="spacer"></div>
              <p className="tab-btn-right">{contactNumber}</p>
            </div>
          </div>
          <img src={dollar} alt="dollar" className='svg-dollar'/>
          <FontAwesomeIcon  className='svg-heart' icon={faHeart} style={{color: "#c51b4e",}} />
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
                <button className="tab-btn">{skill1}</button>
                <button className="tab-btn">{skill2}</button>
                <button className="tab-btn">{skill3}</button>
              </div>
              <div className="spacer"></div>
              <p className="tab-btn-right">{contactNumber}</p>
            </div>
          </div>
          <img src={dollar} alt="dollar" className='svg-dollar'/>
          <FontAwesomeIcon  className='svg-heart' icon={faHeart} style={{color: "#c51b4e",}} />
        </div>
      </div>
    </div>
  );
}

export default ProjectsTabs;
