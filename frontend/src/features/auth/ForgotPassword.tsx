import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Landmark, Mail, ArrowRight, ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';
import InstitutionalAlert, { AlertType } from '../../components/InstitutionalAlert';
import VaultLoader from '../../components/VaultLoader';
import './ForgotPassword.scss';

const API_BASE = "http://127.0.0.1:5000";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ isVisible: boolean; message: string; type: AlertType }>({
    isVisible: false,
    message: '',
    type: 'info'
  });

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Endpoint to be added to your FastAPI app.py
      await axios.post(`${API_BASE}/auth/recover-vault`, { email });
      
      setAlert({
        isVisible: true,
        message: "Recovery protocol initiated. Check your secure inbox.",
        type: 'success'
      });
      setEmail('');
    } catch (err: any) {
      setAlert({
        isVisible: true,
        message: err.response?.data?.detail || "Recovery node unreachable. Verify email.",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-container">
      <InstitutionalAlert 
        isVisible={alert.isVisible}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, isVisible: false })}
      />

      <div className="recovery-card">
        <div className="text-center mb-8">
          <div className="logo-box">
            <KeyRound size={40} className="text-blue-400" />
          </div>
          <h1 className="brand-name">Vault Recovery</h1>
          <p className="sub-text-muted">Restore Access to Anoop Industry Ledger</p>
        </div>

        <form onSubmit={handleRecovery} className="recovery-form">
          <div className="input-group">
            <div className="input-wrapper">
              <Mail className="icon" size={20} />
              <input 
                type="email" 
                placeholder="Registered Institutional Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-recovery"
          >
            {loading ? (
              <VaultLoader size={24} label="" /> 
            ) : (
              <>
                <span>Request Access Key</span> 
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="card-footer">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to Secure Login
          </Link>
          
          <div className="security-badge">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>RSA-4096 Encrypted Recovery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;