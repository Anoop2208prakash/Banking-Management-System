// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import './MainLayout.scss';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  return (
    <div className="app-container">
      {/* Sidebar stays fixed on the left */}
      <Sidebar />

      <main className="main-viewport">
        {/* Header stays at the top of the content area */}
        <Header />
        
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;