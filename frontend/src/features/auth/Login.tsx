import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, Mail, Lock, ArrowRight, ShieldCheck, UserPlus, Fingerprint, KeySquare } from 'lucide-react';
import InstitutionalAlert, { AlertType } from '../../components/InstitutionalAlert';
import VaultLoader from '../../components/VaultLoader'; 
import './Login.scss';

const API_BASE = "http://127.0.0.1:5000";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [alert, setAlert] = useState<{ isVisible: boolean; message: string; type: AlertType }>({
    isVisible: false,
    message: '',
    type: 'info'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/login`, { email, password });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setAlert({
        isVisible: true,
        message: "Vault Identity Verified. Decrypting Dashboard...",
        type: 'success'
      });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Biometric/Server authentication failed";
      setAlert({ isVisible: true, message: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <InstitutionalAlert 
        isVisible={alert.isVisible}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, isVisible: false })}
      />

      <div className="login-card">
        <div className="text-center mb-8 md:mb-10">
          <div className="logo-box">
            <Landmark size={40} className="text-blue-400" />
          </div>
          <h1 className="brand-name">Anoop Industry</h1>
          <div className="sub-header">
            <span className="line"></span>
            <p className="sub-text">Institutional Banking</p>
            <span className="line"></span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <div className="input-wrapper">
              <Mail className="icon" size={20} />
              <input 
                type="email" 
                placeholder="Secure Email Access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <Lock className="icon" size={20} />
              <input 
                type="password" 
                placeholder="Private Key / Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Added: Secure Recovery Link */}
            <div className="forgot-password-wrapper">
              <Link to="/forgot-password" title="Initiate Recovery Protocol">
                <KeySquare size={14} /> Forgot Key?
              </Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`btn-vault ${loading ? 'syncing' : ''} active:scale-95 transition-transform`}
          >
            {loading ? (
              <VaultLoader size={24} label="" /> 
            ) : (
              <>
                <Fingerprint size={20} /> 
                <span>Unlock My Vault</span> 
                <ArrowRight size={18} className="arrow-icon" />
              </>
            )}
          </button>
        </form>

        <div className="card-footer">
          <p className="footer-link-text">
            New client?{' '}
            <Link to="/register" className="register-link">
              Establish Account <UserPlus size={16} />
            </Link>
          </p>
          
          <div className="security-badge">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>Federal SSL 256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;