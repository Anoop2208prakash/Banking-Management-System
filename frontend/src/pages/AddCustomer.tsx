import React, { useState } from 'react';
import { LuX, LuChevronRight, LuChevronLeft, LuUpload } from 'react-icons/lu';
import './AddCustomer.scss';

type Step = 'Personal' | 'Contact' | 'KYC' | 'Account' | 'Nominee' | 'Security';

const AddCustomer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<Step>('Personal');
  const steps: Step[] = ['Personal', 'Contact', 'KYC', 'Account', 'Nominee', 'Security'];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-customer-modal">
        <header className="modal-header">
          <h2>Add New Customer</h2>
          <button className="close-btn" onClick={onClose}><LuX /></button>
        </header>

        {/* --- 🚦 Stepper Navigation --- */}
        <nav className="step-nav">
          {steps.map((step) => (
            <button 
              key={step} 
              className={`step-tab ${currentStep === step ? 'active' : ''}`}
              onClick={() => setCurrentStep(step)}
            >
              {step}
            </button>
          ))}
        </nav>

        <div className="form-body custom-scrollbar">
          {/* --- 👤 Step 1: Personal --- */}
          {currentStep === 'Personal' && (
            <div className="form-grid">
              <div className="input-group">
                <label>Customer ID</label>
                <input type="text" placeholder="CUST758315" disabled />
              </div>
              <div className="input-group">
                <label>Full Name <span className="req">*</span></label>
                <input type="text" placeholder="Enter full name" />
              </div>
              <div className="input-group">
                <label>Father's Name</label>
                <input type="text" placeholder="Enter father's name" />
              </div>
              <div className="input-group">
                <label>Date of Birth <span className="req">*</span></label>
                <input type="date" />
              </div>
              <div className="input-group">
                <label>Gender <span className="req">*</span></label>
                <select><option>Select gender</option><option>Male</option><option>Female</option></select>
              </div>
              <div className="input-group">
                <label>Marital Status</label>
                <select><option>Select status</option><option>Single</option><option>Married</option></select>
              </div>
            </div>
          )}

          {/* --- 📞 Step 2: Contact --- */}
          {currentStep === 'Contact' && (
            <div className="form-grid">
              <div className="input-group">
                <label>Mobile Number <span className="req">*</span></label>
                <input type="text" placeholder="10-digit mobile" />
              </div>
              <div className="input-group">
                <label>Email Address <span className="req">*</span></label>
                <input type="email" placeholder="Enter email" />
              </div>
              <div className="input-group full">
                <label>Residential Address</label>
                <textarea placeholder="Full address" rows={3}></textarea>
              </div>
            </div>
          )}

          {/* --- 🛡️ Step 3: KYC --- */}
          {currentStep === 'KYC' && (
            <div className="form-grid">
              <div className="input-group">
                <label>Aadhar Number <span className="req">*</span></label>
                <input type="text" placeholder="XXXX-XXXX-XXXX" />
              </div>
              <div className="input-group">
                <label>PAN Number <span className="req">*</span></label>
                <input type="text" placeholder="ABCDE1234F" />
              </div>
              <div className="input-group file-upload full">
                <label>Aadhar Card Upload</label>
                <div className="upload-box">
                  <input type="file" id="aadhar" />
                  <label htmlFor="aadhar"><LuUpload /> Choose File</label>
                </div>
              </div>
            </div>
          )}

          {/* --- 🏦 Step 4: Account --- */}
          {currentStep === 'Account' && (
            <div className="form-grid">
              <div className="input-group">
                <label>Account Number</label>
                <input type="text" value="SB345988" disabled />
              </div>
              <div className="input-group">
                <label>Account Type <span className="req">*</span></label>
                <select><option>Savings Account</option><option>Current Account</option></select>
              </div>
              <div className="input-group">
                <label>Initial Deposit (₹)</label>
                <input type="number" placeholder="Minimum ₹500" />
              </div>
            </div>
          )}

          {/* --- 🔑 Step 6: Security --- */}
          {currentStep === 'Security' && (
            <div className="form-grid">
              <div className="input-group">
                <label>Username</label>
                <input type="text" placeholder="Choose username" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="Min 8 characters" />
              </div>
              <div className="input-group">
                <label>Transaction PIN</label>
                <input type="password" placeholder="4-digit PIN" />
              </div>
            </div>
          )}
        </div>

        <footer className="modal-footer">
          {currentStep !== 'Personal' && (
            <button className="btn-prev" onClick={() => setCurrentStep(steps[steps.indexOf(currentStep) - 1])}>
              <LuChevronLeft /> Previous
            </button>
          )}
          <button 
            className="btn-next" 
            onClick={() => currentStep === 'Security' ? onClose() : setCurrentStep(steps[steps.indexOf(currentStep) + 1])}
          >
            {currentStep === 'Security' ? 'Submit' : 'Next'} <LuChevronRight />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddCustomer;