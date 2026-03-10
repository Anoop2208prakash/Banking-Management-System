import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';
import emailjs from '@emailjs/browser'; 
import InstitutionalAlert, { AlertType } from '../../components/InstitutionalAlert';
import VaultLoader from '../../components/VaultLoader';
import EnvDebugger from '../../components/EnvDebugger'; // 🛡️ Integrity Debugger
import './ForgotPassword.scss';

const API_BASE = "http://127.0.0.1:5000";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
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

    // 1. Generate 6-digit Secure Vault Key
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // 🛡️ Accessing variables with Type Assertion to bypass TS ImportMeta errors
      const env = (import.meta as any).env;

      // 2. Dispatch via Institutional EmailJS Node
      const templateParams = {
        to_email: email,
        recovery_code: otpCode, // Matches {{recovery_code}} in your EmailJS dashboard
      };

      await emailjs.send(
        env.VITE_EMAILJS_SERVICE_ID,
        env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        env.VITE_EMAILJS_PUBLIC_KEY
      );

      // 3. Commit OTP to MongoDB Ledger via FastAPI for Verification
      await axios.post(`${API_BASE}/auth/store-otp`, { email, otp: otpCode });
      
      setAlert({
        isVisible: true,
        message: "Institutional Recovery Key dispatched. Check your secure inbox.",
        type: 'success'
      });

      // 4. Secure Handover to Verification Gateway
      setTimeout(() => navigate('/verify-otp', { state: { email } }), 2500);

    } catch (err: any) {
      console.error("Encryption Node Sync Error:", err);
      setAlert({
        isVisible: true,
        message: "Vault Node Failure. Ensure environment keys are active.",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-container">
      {/* 🔍 Automated Integrity Check */}
      <EnvDebugger />

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
              <VaultLoader size={24} label="Encrypting Key..." /> 
            ) : (
              <>
                <span>Dispatch Recovery Key</span> 
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
            <span>Institutional SMTP Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;