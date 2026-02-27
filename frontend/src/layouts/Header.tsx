// src/components/Header.tsx
import React from 'react';
import { FaSearch, FaBell, FaCog } from 'react-icons/fa';
import './Header.scss';

const Header: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // FIXED: Fallback logic for Cloudinary Profile Sync
  const avatarUrl = user.profileImage 
    ? user.profileImage 
    : `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=7c8894&color=fff`;

  return (
    <header className="header-navbar">
      <div className="header-left">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search transactions..." />
        </div>
      </div>

      <div className="header-right">
        <button className="icon-btn"><FaBell /><span className="dot"></span></button>
        <button className="icon-btn"><FaCog /></button>
        
        <div className="user-profile">
          <div className="user-text">
            <p className="user-name">{user.name}</p>
            <span className="user-role">{user.role}</span>
          </div>
          <img src={avatarUrl} alt="Profile" className="profile-img" />
        </div>
      </div>
    </header>
  );
};

export default Header;