import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import AdminPanel from './pages/AdminPanel'; // Matching your folder structure

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
 * Only allows access if the user's role is MANAGER or ACCOUNTANT.
 */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/" replace />;
  
  const user = JSON.parse(userStr);
  const allowedRoles = ['MANAGER', 'ACCOUNTANT'];
  
  // If user is a CUSTOMER or CASHIER, they are bounced back to the dashboard
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  { 
    path: "/register", 
    element: <Register /> 
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />, // Global redirect for invalid URLs
  },
]);