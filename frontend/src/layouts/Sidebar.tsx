import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LuLayoutDashboard, LuUserPlus, LuUsers, LuShieldCheck, 
  LuLogOut
} from 'react-icons/lu'; // Switched to Lucide icons for a thinner, modern stroke
import { motion } from 'framer-motion';
import './Sidebar.scss';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { name: 'Overview', icon: <LuLayoutDashboard />, path: '/dashboard', roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'CASHIER', 'CUSTOMER'] },
    { name: 'Onboard Client', icon: <LuUserPlus />, path: '/onboard', roles: ['ACCOUNTANT', 'MANAGER'] },
    { name: 'Staff Hub', icon: <LuUsers />, path: '/admin', roles: ['MANAGER', 'ADMIN'] },
    { name: 'Security', icon: <LuShieldCheck />, path: '/security', roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'CASHIER', 'CUSTOMER'] },
  ];

  return (
    <aside className="sidebar-modern">
      {/* 🏛️ Premium Branding */}
      <div className="sidebar-header">
        <div className="brand-wrap" onClick={() => navigate('/dashboard')}>
          <div className="brand-logo">
            <div className="inner-diamond"></div>
          </div>
          <div className="brand-text">
            <span className="main">ABC BANK</span>
            <span className="sub">INSTITUTIONAL</span>
          </div>
        </div>
      </div>

      {/* 🚦 Navigation with Motion */}
      <nav className="sidebar-nav">
        <div className="nav-label">Main Menu</div>
        {menuItems
          .filter(item => item.roles.includes(user.role))
          .map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="icon-wrap">{item.icon}</span>
              <span className="label">{item.name}</span>
              {location.pathname === item.path && (
                <motion.div layoutId="active-pill" className="active-pill" />
              )}
            </NavLink>
          ))}
      </nav>

      {/* 🛠️ Modern Footer with Assistance Card */}
      <div className="sidebar-footer">
        <div className="support-card">
          {/* <LuHelpingHand className="support-icon" /> */}
          <p>Need assistance?</p>
          <button onClick={() => window.open('https://anoop-prakash.com')}>Contact Dev</button>
        </div>
        
        <button 
          onClick={() => { localStorage.clear(); navigate('/'); }} 
          className="logout-action"
        >
          <LuLogOut />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;