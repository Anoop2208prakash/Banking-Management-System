import React, { useState } from 'react';
import axios from 'axios';
import { 
  User, MapPin, Users, ArrowRight, ArrowLeft, ChevronDown, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './CustomerOnboarding.scss';

const CustomerOnboarding: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: 'Client@Pass123',
    phone: '', aadharNo: '', age: '', gender: 'Male',
    address: '', city: '', landmark: '', pincode: '', state: '',
    nomineeName: '', nomineePhone: '', nomineeAddress: '', nomineeEmail: ''
  });
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const navigate = useNavigate();

  // 📸 Handle Image Selection and Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🚀 Using FormData for Cloudinary + Multer-style backend processing
    const submissionData = new FormData();
    
    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });

    // Append the actual file object for Cloudinary upload
    if (profileImage) {
      submissionData.append('profileImage', profileImage);
    }

    try {
      await axios.post("http://127.0.0.1:5000/register", submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("✅ Enrollment Successful! Digital Vault Established.");
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Check Connection/Aadhar Uniqueness";
      alert("❌ Enrollment Failed: " + errorMsg);
    } finally { setLoading(false); }
  };

  return (
    <div className="onboard-wrapper">
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="form-container">
        
        <header className="enrollment-header">
          <div className="header-left">
            <div onClick={() => navigate('/dashboard')} className="back-nav">
              <ArrowLeft size={14} /> System Dashboard
            </div>
            <h1>KYC Enrollment</h1>
            <p>Anoop Industry Bank • Institutional Access</p>
          </div>

          <label className="profile-upload-zone">
            <input type="file" hidden onChange={handleImageChange} accept="image/*" />
            {previewUrl ? (
              <img src={previewUrl} alt="Profile Preview" />
            ) : (
              <>
                <Camera className="upload-icon" size={32} />
                <span>Add Photo</span>
              </>
            )}
          </label>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Section 01: Identification */}
          <section className="form-section">
            <div className="section-tag">
              <h3><User size={16}/> 01. Identification Details</h3>
              <div className="tag-line"></div>
            </div>
            <div className="modern-grid">
              <div className="field"><input type="text" placeholder="First Name" onChange={e => setFormData({...formData, firstName: e.target.value})} required /></div>
              <div className="field"><input type="text" placeholder="Last Name" onChange={e => setFormData({...formData, lastName: e.target.value})} required /></div>
              <div className="field"><input type="text" placeholder="Aadhar Card ID" onChange={e => setFormData({...formData, aadharNo: e.target.value})} required /></div>
              <div className="field"><input type="email" placeholder="Secure Email" onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
              <div className="field third"><input type="text" placeholder="Phone" onChange={e => setFormData({...formData, phone: e.target.value})} required /></div>
              <div className="field third"><input type="number" placeholder="Age" onChange={e => setFormData({...formData, age: e.target.value})} required /></div>
              <div className="field third">
                <div className="custom-select-modern">
                  <div className={`trigger-btn ${isGenderOpen ? 'active' : ''}`} onClick={() => setIsGenderOpen(!isGenderOpen)}>
                    <span>{formData.gender}</span>
                    <ChevronDown size={16} />
                  </div>
                  <AnimatePresence>
                    {isGenderOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="menu-list">
                        {["Male", "Female", "Other"].map(g => (
                          <div key={g} className="item-opt" onClick={() => { setFormData({...formData, gender: g}); setIsGenderOpen(false); }}>{g}</div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Location */}
          <section className="form-section">
            <div className="section-tag">
              <h3><MapPin size={16}/> 02. Residential Data</h3>
              <div className="tag-line"></div>
            </div>
            <div className="modern-grid">
              <div className="field full"><input type="text" placeholder="Full Street Address" onChange={e => setFormData({...formData, address: e.target.value})} required /></div>
              <div className="field third"><input type="text" placeholder="City" onChange={e => setFormData({...formData, city: e.target.value})} required /></div>
              <div className="field third"><input type="text" placeholder="Landmark" onChange={e => setFormData({...formData, landmark: e.target.value})} required /></div>
              <div className="field third"><input type="text" placeholder="Pincode" onChange={e => setFormData({...formData, pincode: e.target.value})} required /></div>
              <div className="field full"><input type="text" placeholder="State" onChange={e => setFormData({...formData, state: e.target.value})} required /></div>
            </div>
          </section>

          {/* Section 03: Nominee */}
          <section className="form-section">
            <div className="section-tag">
              <h3><Users size={16}/> 03. Nominee Authorization</h3>
              <div className="tag-line"></div>
            </div>
            <div className="modern-grid">
              <div className="field"><input type="text" placeholder="Nominee Name" onChange={e => setFormData({...formData, nomineeName: e.target.value})} required /></div>
              <div className="field"><input type="text" placeholder="Nominee Phone" onChange={e => setFormData({...formData, nomineePhone: e.target.value})} required /></div>
              <div className="field full"><input type="text" placeholder="Nominee Address" onChange={e => setFormData({...formData, nomineeAddress: e.target.value})} required /></div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="submit-btn-institutional">
            {loading ? "Establishing Vault..." : "Finalize Enrollment"} <ArrowRight size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CustomerOnboarding;