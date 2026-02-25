import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router'; // Import your centralized router configuration
import './App.css';

/**
 * Main Application Component
 * Uses RouterProvider to deliver the centralized routing map defined in router.tsx.
 */
const App: React.FC = () => {
  return (
    <React.StrictMode>
      {/* RouterProvider is the modern way to provide routing in React Router v6.4+.
        It handles all the route switching and protection defined in router.tsx.
      */}
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default App;