import React, { useState } from 'react';
import { LuX, LuChevronRight, LuChevronLeft, LuSearch, LuShieldCheck, LuCalendar } from 'react-icons/lu';
import './OpenAccount.scss';

type Step = 'Identification' | 'Account' | 'Deposit' | 'Nominee' | 'KYC';

const OpenAccount: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<Step>('Identification');
  const [customerFound, setCustomerFound] = useState(false);
  const steps: Step[] = ['Identification', 'Account', 'Deposit', 'Nominee', 'KYC'];

  if (!isOpen) return null;

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      onClose(); // Submit logic
    }
  };

  const handlePrev = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="open-account-modal">
        <header className="modal-header">
          <div className="title-area">
            <h2>Initialize New Account</h2>
            <span className="form-id">FORM 104-B / LEDGER INIT</span>
          </div>
          <button className="close-btn" onClick={onClose}><LuX /></button>
        </header>

        {/* --- 🚦 Navigation Stepper --- */}
        <nav className="step-nav">
          {steps.map((step) => (
            <button 
              key={step} 
              className={`step-btn ${currentStep === step ? 'active' : ''}`}
              onClick={() => setCurrentStep(step)}
            >
              {step}
            </button>
          ))}
        </nav>

        <div className="form-body custom-scrollbar">
          {/* --- 1️⃣ Customer Identification --- */}
          {currentStep === 'Identification' && (
            <div className="form-section">
              <div className="full-search-group">
                <label>Customer ID (Search) *</label>
                <div className="search-input-wrap">
                  <input type="text" placeholder="Enter CUST ID (e.g., CUST758315)" />
                  <button className="verify-btn" onClick={() => setCustomerFound(true)}>
                    <LuSearch size={16} /> Verify
                  </button>
                </div>
              </div>
              
              <div className={`result-grid ${customerFound ? 'visible' : ''}`}>
                <div className="field-box">
                  <label>Customer Name</label>
                  <input type="text" value="Ananya Singh" disabled />
                </div>
                <div className="field-box">
                  <label>Date of Birth</label>
                  <input type="text" value="1993-11-28" disabled />
                </div>
                <div className="field-box">
                  <label>Mobile Number</label>
                  <input type="text" value="+91 9876543214" disabled />
                </div>
                <div className="field-box">
                  <label>Email Address</label>
                  <input type="text" value="ananya@email.com" disabled />
                </div>
              </div>
            </div>
          )}

          {/* --- 2️⃣ Account Information --- */}
          {currentStep === 'Account' && (
            <div className="form-grid">
              <div className="field-box">
                <label>Account Number</label>
                <input type="text" value="SB345988" disabled />
              </div>
              <div className="field-box">
                <label>Account Type *</label>
                <select><option>Savings Account</option><option>Current Account</option></select>
              </div>
              <div className="field-box">
                <label>Branch Name</label>
                <input type="text" placeholder="Enter branch" defaultValue="Main Branch" />
              </div>
              <div className="field-box">
                <label>IFSC Code</label>
                <input type="text" value="SECB0001234" disabled />
              </div>
              <div className="field-box">
                <label>Account Opening Date</label>
                <div className="date-input">
                  <input type="text" value="03/07/2026" disabled />
                  <LuCalendar className="icon" />
                </div>
              </div>
              <div className="field-box">
                <label>Currency</label>
                <input type="text" value="INR" disabled />
              </div>
            </div>
          )}

          {/* --- 3️⃣ Initial Deposit --- */}
          {currentStep === 'Deposit' && (
            <div className="form-grid">
              <div className="field-box">
                <label>Initial Deposit (₹)</label>
                <input type="number" placeholder="Minimum ₹500" />
              </div>
              <div className="field-box">
                <label>Deposit Method</label>
                <select><option>Cash</option><option>Cheque</option><option>Online Transfer</option></select>
              </div>
              <div className="field-box full">
                <label>Reference Number</label>
                <input type="text" placeholder="Enter transaction reference" />
              </div>
            </div>
          )}

          {/* --- 4️⃣ Nominee Info --- */}
          {currentStep === 'Nominee' && (
            <div className="form-grid">
              <div className="field-box">
                <label>Nominee Name</label>
                <input type="text" placeholder="Full name" />
              </div>
              <div className="field-box">
                <label>Relationship</label>
                <select><option>Select</option><option>Father</option><option>Spouse</option></select>
              </div>
              <div className="field-box">
                <label>Nominee DOB</label>
                <input type="date" />
              </div>
              <div className="field-box">
                <label>Nominee Contact</label>
                <input type="text" placeholder="Phone number" />
              </div>
            </div>
          )}

          {/* --- 5️⃣ KYC Section --- */}
          {currentStep === 'KYC' && (
            <div className="kyc-vault-check">
              <div className="integrity-card">
                <LuShieldCheck size={32} className="shield" />
                <div className="text">
                  <h4>Vault Integrity Check</h4>
                  <p>Pulling document verification for CUST758315</p>
                </div>
              </div>
              <div className="kyc-list">
                <div className="kyc-row"><span>Aadhar Number</span> <strong>XXXX-XXXX-4321</strong></div>
                <div className="kyc-row"><span>PAN Number</span> <strong>ABCDE1234F</strong></div>
                <div className="kyc-row"><span>KYC Status</span> <strong className="v-tag">VERIFIED</strong></div>
              </div>
            </div>
          )}
        </div>

        <footer className="modal-footer">
          {currentStep !== 'Identification' && (
            <button className="prev-pill" onClick={handlePrev}>Previous</button>
          )}
          <button className="next-pill" onClick={handleNext}>
            {currentStep === 'KYC' ? 'Submit' : 'Next'}
            {currentStep !== 'KYC' && <LuChevronRight size={16} />}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default OpenAccount;