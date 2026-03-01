import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LuUserCheck, LuArrowLeft, LuSave } from 'react-icons/lu';
import InstitutionalAlert, { AlertType } from '../../components/InstitutionalAlert';
import VaultLoader from '../../components/VaultLoader';
import './CustomerPages.scss';

const UpdateCustomer: React.FC = () => {
  const { id } = useParams(); // Retrieves MongoDB _id from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    address: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '', type: 'info' as AlertType });

  // 🛰️ Fetch existing vault data on mount
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/users/${id}`);
        setFormData(response.data);
      } catch (err) {
        setAlert({ isVisible: true, message: "Failed to retrieve identity from vault.", type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // 🔄 Sync changes to FastAPI backend
      await axios.put(`http://127.0.0.1:5000/users/update/${id}`, formData);
      setAlert({ isVisible: true, message: "Institutional Ledger Updated Successfully.", type: 'success' });
      setTimeout(() => navigate('/view-customers'), 2000);
    } catch (err: any) {
      setAlert({ isVisible: true, message: "Update Protocol Failed. Check Node Sync.", type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <VaultLoader label="Decrypting Identity..." />;

  return (
    <div className="institutional-container">
      <InstitutionalAlert {...alert} onClose={() => setAlert({ ...alert, isVisible: false })} />
      
      <div className="form-card-outlined">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <LuArrowLeft /> Back to Registry
        </button>

        <header className="form-header">
          <LuUserCheck size={32} />
          <h2>Modify Client Identity</h2>
          <p>Vault ID: {id?.substring(0, 8)}...</p>
        </header>

        <form onSubmit={handleUpdate} className="grid-form">
          <div className="input-field">
            <label>Legal Full Name</label>
            <input 
              type="text" 
              value={formData.fullName} 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
            />
          </div>

          <div className="input-field">
            <label>Institutional Role</label>
            <select 
              value={formData.role} 
              className="institutional-select"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="CASHIER">Cashier</option>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>

          <div className="input-field">
            <label>Contact Phone</label>
            <input 
              type="text" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            />
          </div>

          <div className="input-field">
            <label>Verified Address</label>
            <input 
              type="text" 
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})} 
            />
          </div>

          <button type="submit" className="btn-institutional" disabled={updating}>
            {updating ? <VaultLoader size={20} label="" /> : (
              <><LuSave /> Commit Changes</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCustomer;