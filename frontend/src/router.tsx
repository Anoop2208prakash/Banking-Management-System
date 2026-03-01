import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AdminPanel from './pages/AdminPanel'; 
import DepositPage from './pages/DepositPage';
import MainLayout from './layouts/MainLayout'; 
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import VerifyOTP from './features/auth/VerifyOTP';
import AddCustomer from './pages/Customer/AddCustomer';
import CustomerDirectory from './pages/Customer/CustomerDirectory';
import KYCUpload from './pages/Customer/KYCUpload';
import UpdateCustomer from './pages/Customer/UpdateCustomer';
import CustomerProfile from './pages/Customer/CustomerProfile';

// --- New Institutional Client Pages ---
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
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  // --- Public Routes ---
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/verify-otp", element: <VerifyOTP /> },

  // --- 🏛️ Internal Banking Shell (Protected) ---
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      
      // --- 👥 Client Management Suite ---
      {
        path: "/add-customer",
        element: (
          <RoleRoute allowedRoles={['MANAGER', 'ACCOUNTANT', 'ADMIN']}>
            <AddCustomer />
          </RoleRoute>
        ),
      },
      {
        path: "/view-customers",
        element: (
          <RoleRoute allowedRoles={['MANAGER', 'ACCOUNTANT', 'ADMIN']}>
            <CustomerDirectory />
          </RoleRoute>
        ),
      },
      {
        path: "/update-customer/:id",
        element: (
          <RoleRoute allowedRoles={['MANAGER', 'ACCOUNTANT', 'ADMIN']}>
            <UpdateCustomer />
          </RoleRoute>
        ),
      },
      {
        path: "/profile/:id",
        element: <CustomerProfile />, // Accessible by owner and staff
      },
      {
        path: "/kyc-upload",
        element: (
          <RoleRoute allowedRoles={['MANAGER', 'ACCOUNTANT', 'ADMIN']}>
            <KYCUpload />
          </RoleRoute>
        ),
      },

      // --- 💸 Transaction Terminals ---
      {
        path: "/deposit",
        element: (
          <RoleRoute allowedRoles={['CASHIER', 'MANAGER', 'ADMIN']}>
            <DepositPage />
          </RoleRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <RoleRoute allowedRoles={['MANAGER', 'ADMIN']}>
            <AdminPanel />
          </RoleRoute>
        ),
      },
    ]
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);