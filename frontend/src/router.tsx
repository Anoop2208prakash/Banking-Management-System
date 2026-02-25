import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';

/**
 * ProtectedRoute Component
 * Checks if a user session exists in localStorage.
 * If not, it redirects them to the login page.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  { path: "/register", element: <Register /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />, // Catch-all redirect to Login
  },
]);