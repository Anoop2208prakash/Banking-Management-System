import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AdminPanel from './pages/AdminPanel'; 
import CustomerOnboarding from './pages/CustomerOnboarding';
import DepositPage from './pages/DepositPage'; // New Deposit Terminal
import MainLayout from './layouts/MainLayout'; 
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';

/**
 * ProtectedRoute Component
 * Prevents unauthenticated users from accessing internal vault pages.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

/**
 * RoleRoute Component
 * Flexible role-gating for different levels of institutional access.
 */
const RoleRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/" replace />;
  
  const user = JSON.parse(userStr);
  if (!allowedRoles.includes(user.role)) {
    // Redirect unauthorized users back to the safety of the Dashboard
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
  {
    path: "/forgot-password",
    element: <ForgotPassword />
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
      // Restricted to staff who handle client identity creation
      {
        path: "/onboard",
        element: (
          <RoleRoute allowedRoles={['MANAGER', 'ACCOUNTANT', 'ADMIN']}>
            <CustomerOnboarding />
          </RoleRoute>
        ),
      },
      // Restricted to high-level system oversight
      {
        path: "/admin",
        element: (
          <RoleRoute allowedRoles={['MANAGER', 'ADMIN']}>
            <AdminPanel />
          </RoleRoute>
        ),
      },
      // New Deposit route accessible by Cashiers and Managers
      {
        path: "/deposit",
        element: (
          <RoleRoute allowedRoles={['CASHIER', 'MANAGER', 'ADMIN']}>
            <DepositPage />
          </RoleRoute>
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