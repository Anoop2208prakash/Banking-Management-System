import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LuLayoutDashboard, LuUsers, LuWallet, LuArrowLeftRight, 
  LuFileText, LuPiggyBank, LuSettings,
  LuBell, LuLogOut, LuChevronLeft, LuLandmark
} from 'react-icons/lu';
import { motion } from 'framer-motion';
import './Sidebar.scss';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { name: 'Dashboard', icon: <LuLayoutDashboard />, path: '/dashboard', roles: ['ADMIN', 'MANAGER', 'CUSTOMER'] },
    { name: 'Customers', icon: <LuUsers />, path: '/customers', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Accounts', icon: <LuWallet />, path: '/accounts', roles: ['ADMIN', 'MANAGER', 'CUSTOMER'] },
    { name: 'Transactions', icon: <LuArrowLeftRight />, path: '/transactions', roles: ['ADMIN', 'MANAGER', 'CUSTOMER'] },
    { name: 'Loans', icon: <LuFileText />, path: '/loans', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Fixed Deposits', icon: <LuPiggyBank />, path: '/fixed-deposits', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Employees', icon: <LuSettings />, path: '/employees', roles: ['ADMIN'] },
    { name: 'Reports', icon: <LuBell />, path: '/reports', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Notifications', icon: <LuBell />, path: '/notifications', roles: ['ADMIN', 'MANAGER', 'CUSTOMER'] },
  ];

  return (
    <aside className="securbank-sidebar">
      {/* 🏛️ SecurBank Branding */}
      <div className="sidebar-header">
        <div className="brand-box" onClick={() => navigate('/dashboard')}>
          <div className="brand-logo">
            <LuLandmark size={24} />
          </div>
          <span className="brand-name">SecurBank</span>
        </div>
        {user.role === 'ADMIN' && <div className="admin-badge">ADMIN</div>}
      </div>

      {/* 🚦 Navigation */}
      <nav className="sidebar-nav custom-scrollbar">
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
                <motion.div layoutId="nav-indicator" className="nav-indicator" />
              )}
            </NavLink>
          ))}
      </nav>

      {/* 👤 Profile Section */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar-circle">
            {user.name?.charAt(0) || 'R'}
          </div>
          <div className="user-info">
            <span className="name">{user.name || 'Rajesh Kumar'}</span>
            <span className="role">{user.role?.toLowerCase() || 'admin'}</span>
          </div>
        </div>
        
        <div className="footer-actions">
          <button 
            onClick={() => { localStorage.clear(); navigate('/'); }} 
            className="logout-btn"
          >
            <LuLogOut size={18} />
            <span>Logout</span>
          </button>
          <button className="collapse-btn">
            <LuChevronLeft size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;