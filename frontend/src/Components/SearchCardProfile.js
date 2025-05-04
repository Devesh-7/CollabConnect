import React, { useState } from 'react';
import dollar from '../Assets/dollar.svg';
import './SearchCardProfile.css';

function ProfilesTabs() {
  const [name, setName] = useState('Naman Tiwari');
  const [username, setUsername] = useState('@n.tiwari');
  const [number, setNumber] = useState('1525');
  const [name2, setName2] = useState('Naman Sharma');
  const [username2, setUsername2] = useState('@n.sharma');
  const [number2, setNumber2] = useState('978');
  const [name3, setName3] = useState('Naman Tripathi');
  const [username3, setUsername3] = useState('@n.tripathi');
  const [number3, setNumber3] = useState('7478');
  const [name4, setName4] = useState('Naman Mishra');
  const [username4, setUsername4] = useState('@n.mishra');
  const [number4, setNumber4] = useState('456');
  const [showTabs, setShowTabs] = useState(true);
  const [activeTab, setActiveTab] = useState('Profiles');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowTabs(true);
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
          <div className="blue-box"></div>
          <div className="tab-info">
            <p className='name'>{name}</p>
            <p className='username'>{username}</p>
            <p className='number'>{number}</p>
          </div>
          <img src={dollar} alt="dollar" className='svg-dollar'/>
        </div>
      </div>
      <div className="tab">
        <div className="tab-content">
          <div className="blue-box"></div>
          <div className='tab-info'>
            <p className='name'>{name2}</p>
            <p className='username'>{username2}</p>
            <p className='number'>{number2}</p>
          </div>
          <img src={dollar} alt="dollar" className='svg-dollar'/>
        </div>
      </div>
      <div className="tab">
        <div className="tab-content">
          <div className="blue-box"></div>
          <div className='tab-info'>
            <p className='name'>{name3}</p>
            <p className='username'>{username3}</p>
            <p className='number'>{number3}</p>
          </div>
          <img src={dollar} alt="dollar" className='svg-dollar'/>
        </div>
      </div>
    </div>
  );
}

export default ProfilesTabs;
