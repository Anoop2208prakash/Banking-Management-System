import React, { useState } from 'react';
import axios from 'axios';
import { User, ShieldCheck, MapPin, Users, PenTool, ArrowRight } from 'lucide-react';
import './OnboardClient.scss';

const OnboardClient: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: 'ClientPassword123',
    phone: '', aadharNo: '', age: '', gender: 'Male',
    address: '', city: '', landmark: '', pincode: '', state: '',
    nomineeName: '', nomineePhone: '', nomineeAddress: '', nomineeEmail: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/register", { ...formData, role: 'CUSTOMER' });
      alert("Account Successfully Created!");
    } catch (err) {
      alert("Error creating account. Check Aadhar or Email uniqueness.");
    }
  };

  return (
    <div className="onboard-container">
      <form className="bank-form" onSubmit={handleSubmit}>
        <header className="form-header">
          <ShieldCheck size={40} className="text-blue-500" />
          <div>
            <h1>Client Enrollment Form</h1>
            <p>Anoop Industry Bank • Institutional Onboarding</p>
          </div>
        </header>

        {/* Section 1: Personal Details */}
        <section className="form-section">
          <div className="section-title"><User size={18}/> Personal Details</div>
          <div className="grid-layout">
            <input type="text" placeholder="First Name" onChange={e => setFormData({...formData, firstName: e.target.value})} required />
            <input type="text" placeholder="Last Name" onChange={e => setFormData({...formData, lastName: e.target.value})} required />
            <input type="email" placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} required />
            <input type="text" placeholder="Phone Number" onChange={e => setFormData({...formData, phone: e.target.value})} required />
            <input type="text" placeholder="Aadhar Card No." onChange={e => setFormData({...formData, aadharNo: e.target.value})} required />
            <div className="flex-row">
              <input type="number" placeholder="Age" className="w-1/2" onChange={e => setFormData({...formData, age: e.target.value})} required />
              <select className="w-1/2" onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Address & Location */}
        <section className="form-section">
          <div className="section-title"><MapPin size={18}/> Permanent Address</div>
          <div className="grid-layout">
            <input type="text" placeholder="Full Address" className="col-span-2" onChange={e => setFormData({...formData, address: e.target.value})} required />
            <input type="text" placeholder="City" onChange={e => setFormData({...formData, city: e.target.value})} required />
            <input type="text" placeholder="Landmark" onChange={e => setFormData({...formData, landmark: e.target.value})} required />
            <input type="text" placeholder="Pincode" onChange={e => setFormData({...formData, pincode: e.target.value})} required />
            <input type="text" placeholder="State" onChange={e => setFormData({...formData, state: e.target.value})} required />
          </div>
        </section>

        {/* Section 3: Nominee Details */}
        <section className="form-section">
          <div className="section-title"><Users size={18}/> Nominee Information</div>
          <div className="grid-layout">
            <input type="text" placeholder="Nominee Name" onChange={e => setFormData({...formData, nomineeName: e.target.value})} required />
            <input type="text" placeholder="Nominee Phone" onChange={e => setFormData({...formData, nomineePhone: e.target.value})} required />
            <input type="text" placeholder="Nominee Address" className="col-span-2" onChange={e => setFormData({...formData, nomineeAddress: e.target.value})} required />
            <input type="email" placeholder="Nominee Email" onChange={e => setFormData({...formData, nomineeEmail: e.target.value})} required />
          </div>
        </section>

        {/* Section 4: Signatures Simulation */}
        <section className="form-section">
          <div className="section-title"><PenTool size={18}/> Authorization</div>
          <div className="signature-grid">
            <div className="sig-box">
              <p>Client Signature (Type Full Name)</p>
              <input type="text" className="sig-input" placeholder="Sign here..." required />
            </div>
            <div className="sig-box">
              <p>Nominee Signature (Type Full Name)</p>
              <input type="text" className="sig-input" placeholder="Sign here..." required />
            </div>
          </div>
        </section>

        <button type="submit" className="submit-btn">
          Confirm & Issue Account <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};

export default OnboardClient;