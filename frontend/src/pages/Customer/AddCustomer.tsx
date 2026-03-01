import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LuUserPlus, LuMail, LuPhone, LuFingerprint, LuMapPin } from 'react-icons/lu';
import InstitutionalAlert, { AlertType } from '../../components/InstitutionalAlert';
import VaultLoader from '../../components/VaultLoader';
import './CustomerPages.scss';

const AddCustomer: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: 'InitialPass123!', 
    phone: '', aadharNo: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '', type: 'info' as AlertType });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🛡️ Registration logic with Aadhar validation
      await axios.post("http://127.0.0.1:5000/register", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAlert({ isVisible: true, message: "Identity Pre-enrolled. Awaiting Signature.", type: 'success' });
      // Redirect to OTP gate
      setTimeout(() => navigate('/verify-otp', { state: { email: formData.email } }), 2000);
    } catch (err: any) {
      setAlert({ isVisible: true, message: err.response?.data?.detail || "Enrollment Failure", type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <div className="institutional-container">
      <InstitutionalAlert {...alert} onClose={() => setAlert({ ...alert, isVisible: false })} />
      <div className="form-card-outlined">
        <header className="form-header">
          <LuUserPlus size={32} />
          <h2>New Client Enrollment</h2>
          <p>Institutional Ledger Entry Protocol</p>
        </header>
        <form onSubmit={handleSubmit} className="grid-form">
          <div className="input-field">
            <label>Full Legal Name</label>
            <input type="text" required onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div className="input-field">
            <label>Secure Email</label>
            <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="input-field">
            <label>Aadhar ID (12-digit)</label>
            <input type="text" maxLength={12} required onChange={(e) => setFormData({...formData, aadharNo: e.target.value})} />
          </div>
          <button type="submit" className="btn-institutional" disabled={loading}>
            {loading ? <VaultLoader size={20} label="" /> : "Initiate Verification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;