import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import AdminPanel from './pages/AdminPanel'; 
import CustomerOnboarding from './pages/CustomerOnboarding';
import MainLayout from './layouts/MainLayout'; // Newly created Layout

/**
 * ProtectedRoute Component
 * Prevents unauthenticated users from accessing the bank's internal pages.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

/**
 * AdminRoute Component
 * Strict role-gating for high-level operations.
 * Allows access for MANAGER and ACCOUNTANT roles.
 */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/" replace />;
  
  const user = JSON.parse(userStr);
  const allowedRoles = ['MANAGER', 'ACCOUNTANT'];
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  // --- Public Routes ---
  {
    path: "/",
    element: <Login />,
  },
  { 
    path: "/register", 
    element: <Register /> 
  },

  // --- 🏛️ Internal Banking Shell (Protected) ---
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/onboard",
        element: (
          <AdminRoute>
            <CustomerOnboarding />
          </AdminRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        ),
      },
    ]
  },

  // --- Global Redirect ---
  {
    path: "*",
    element: <Navigate to="/" replace />, 
  },
]);