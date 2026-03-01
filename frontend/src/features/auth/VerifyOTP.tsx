import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, RefreshCcw, Lock } from 'lucide-react';
import InstitutionalAlert, { AlertType } from '../../components/InstitutionalAlert';
import VaultLoader from '../../components/VaultLoader';
import './VerifyOTP.scss';

const API_BASE = "http://127.0.0.1:5000";

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "user@example.com";
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60); // ⏱️ 60-second cooldown
  const [canResend, setCanResend] = useState(false);
  
  const [alert, setAlert] = useState<{ isVisible: boolean; message: string; type: AlertType }>({
    isVisible: false, message: '', type: 'info'
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 🛡️ Countdown Logic
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      // Endpoint using your Resend integration in app.py
      await axios.post(`${API_BASE}/auth/recover-vault`, { email }); 
      setAlert({ isVisible: true, message: "New Security Key dispatched.", type: 'success' });
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setAlert({ isVisible: true, message: "Node synchronization failed.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/\D/g, ''); // Numeric only
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val !== "" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp: otp.join("") });
      setAlert({ isVisible: true, message: "Digital Signature Verified.", type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setAlert({ isVisible: true, message: "Invalid Security Key.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <InstitutionalAlert 
        isVisible={alert.isVisible}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, isVisible: false })}
      />

      <div className="otp-card">
        <div className="text-center">
          <div className="icon-box-lock"><Lock size={32} className="text-blue-400" /></div>
          <h1 className="brand-name">Security Gateway</h1>
          <p className="sub-text-muted">Enter key sent to {email}</p>
        </div>

        <form onSubmit={handleVerification} className="otp-form">
          <div className="otp-input-grid">
            {otp.map((data, index) => (
              <input
                key={`otp-slot-${index}`}
                type="text"
                maxLength={1}
                value={data}
                ref={(el) => { inputRefs.current[index] = el; }}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="otp-field"
              />
            ))}
          </div>

          <button type="submit" disabled={loading || otp.join("").length < 6} className="btn-verify">
            {loading ? <VaultLoader size={24} label="" /> : (
              <><span>Verify Signature</span> <ShieldCheck size={18} /></>
            )}
          </button>
        </form>

        <div className="otp-footer">
          <button 
            className={`resend-btn ${!canResend ? 'disabled' : ''}`} 
            type="button"
            onClick={handleResend}
            disabled={!canResend}
          >
            <RefreshCcw size={14} className={!canResend ? 'spin-slow' : ''} /> 
            {canResend ? "Request New Key" : `Wait ${timer}s for New Key`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;