// src/components/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaUserPlus, FaUsers, FaShieldAlt, FaSignOutAlt 
} from 'react-icons/fa';
import './Sidebar.scss';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { name: 'Overview', icon: <FaShieldAlt />, path: '/dashboard', roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'CASHIER', 'CUSTOMER'] },
    { name: 'Onboard Client', icon: <FaUserPlus />, path: '/onboard', roles: ['ACCOUNTANT', 'MANAGER'] },
    { name: 'Staff Hub', icon: <FaUsers />, path: '/admin', roles: ['MANAGER', 'ADMIN'] },
    { name: 'Security', icon: <FaShieldAlt />, path: '/security', roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'CASHIER', 'CUSTOMER'] },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-area">
          <div className="logo-icon"></div>
          <span>ABC BANK</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems
          .filter(item => item.roles.includes(user.role))
          .map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;