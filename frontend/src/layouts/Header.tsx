import React from 'react';
import { FaSearch, FaBell, FaCog } from 'react-icons/fa';
import './Header.scss';

const Header: React.FC = () => {
  // Retrieve the user session data
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // High-fidelity fallback logic for Cloudinary Profile Sync
  const avatarUrl = user.profileImage 
    ? user.profileImage 
    : `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=7c8894&color=fff`;

  return (
    <header className="header-navbar-modern">
      <div className="header-left">
        <div className="search-box-modern">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search transactions, clients, or files..." />
        </div>
      </div>

      <div className="header-right">
        <div className="action-icons">
          <button className="icon-btn-modern" title="Notifications">
            <FaBell />
            <span className="notification-dot"></span>
          </button>
          <button className="icon-btn-modern" title="System Settings">
            <FaCog />
          </button>
        </div>
        
        <div className="divider-vertical"></div>

        <div className="user-profile-modern">
          <div className="user-meta">
            <p className="user-name">{user.name || "Anoop Prakash"}</p>
            <span className="user-role">{user.role || "Manager"}</span>
          </div>
          <div className="avatar-container">
            <img src={avatarUrl} alt="Profile" className="profile-img-modern" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;