import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LuLayoutDashboard, LuUserPlus, LuUsers, LuShieldCheck, 
  LuLogOut, LuFileSearch, LuFingerprint, LuGem
} from 'react-icons/lu'; 
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.scss';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { name: 'Overview', icon: <LuLayoutDashboard />, path: '/dashboard', roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'CASHIER', 'CUSTOMER'] },
    { name: 'Enrollment', icon: <LuUserPlus />, path: '/add-customer', roles: ['ACCOUNTANT', 'MANAGER', 'ADMIN'] },
    { name: 'Registry', icon: <LuFileSearch />, path: '/view-customers', roles: ['ACCOUNTANT', 'MANAGER', 'ADMIN'] },
    { name: 'Biometrics', icon: <LuFingerprint />, path: '/kyc-upload', roles: ['ACCOUNTANT', 'MANAGER', 'ADMIN'] },
    { name: 'Staff Hub', icon: <LuUsers />, path: '/admin', roles: ['MANAGER', 'ADMIN'] },
    { name: 'Security', icon: <LuShieldCheck />, path: '/verify-otp', roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'CASHIER', 'CUSTOMER'] },
  ];

  return (
    <aside className="sidebar-modern">
      {/* 🏛️ Institutional Branding with SVG Logo */}
      <div className="sidebar-header">
        <div className="brand-wrap" onClick={() => navigate('/dashboard')}>
          <div className="brand-logo">
             {/* 💎 Institutional SVG Diamond Logo */}
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="white" />
             </svg>
          </div>
          <div className="brand-text">
            <span className="main">ANOOP BANK</span>
            <span className="sub">INSTITUTIONAL NODES</span>
          </div>
        </div>
      </div>

      {/* 🚦 Scrollable Navigation Section */}
      <div className="scroll-wrapper">
        <nav className="sidebar-nav">
          <div className="nav-label">Vault Terminals</div>
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
                
                <AnimatePresence>
                  {location.pathname === item.path && (
                    <motion.div 
                      layoutId="active-pill" 
                      className="active-pill"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    />
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
        </nav>
      </div>

      {/* 🛠️ Modern Footer */}
      <div className="sidebar-footer">
        <div className="support-card">
          <LuGem className="support-icon" />
          <p>Institutional Support</p>
          <button onClick={() => window.open('https://anoop-prakash.com')}>Contact Developer</button>
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