import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Landmark, Mail, Lock, ArrowRight, ShieldCheck, UserPlus, Fingerprint } from 'lucide-react';
import './Login.scss';

const API_BASE = "http://127.0.0.1:5000";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/login`, { email, password });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.error || "Biometric/Server authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Branding Section */}
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

        {error && (
          <div className="error-alert">
            <div className="error-indicator"></div>
            {error}
          </div>
        )}

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
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-vault active:scale-95 transition-transform"
          >
            {loading ? "Decrypting..." : (
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