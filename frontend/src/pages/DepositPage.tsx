import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LuWallet, LuShieldCheck, LuArrowRight } from 'react-icons/lu';
import { LucideAlertCircle, LucideCheckCircle2 } from 'lucide-react';
import './DepositPage.scss';

const API_BASE = "http://127.0.0.1:5000";

const DepositPage: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  /**
   * 🛡️ Institutional Input Guard
   * Strictly enforces 12-digit numeric constraint.
   */
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip all non-numeric characters using Regex
    const val = e.target.value.replace(/\D/g, '');
    
    // Enforce hard cap of 12 digits
    if (val.length <= 12) {
      setAccountNumber(val);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic length validation before submission
    if (accountNumber.length < 12) {
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      // Integration with FastAPI TransactionRequest
      await axios.post(`${API_BASE}/accounts/deposit`, {
        accountNumber: accountNumber,
        amount: parseFloat(amount),
        staffId: "SYSTEM_AUTO" 
      });
      setStatus('success');
      setAmount('');
    } catch (err) {
      console.error("Vault sync failed:", err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-page-container">
      <header className="deposit-header">
        <h1>Institutional Deposit</h1>
        <p>Liquidity Injection • Secure Ledger Protocol</p>
      </header>

      <div className="deposit-grid">
        {/* 💳 Left: Card Preview & Security Info */}
        <div className="side-column">
          <motion.div 
            className="mini-card-preview"
            animate={{ rotateY: accountNumber.length > 5 ? 5 : 0 }}
          >
            <div className="card-chip-gold"></div>
            <div className="card-data">
              <span className="label">Target Account</span>
              <p className="val">{accountNumber || "XXXX-XXXX-XXXX"}</p>
            </div>
            <div className="card-footer">
              <span className="brand">ANOOP BANK</span>
              <div className="circles">
                <div className="c-red"></div>
                <div className="c-orange"></div>
              </div>
            </div>
          </motion.div>

          <div className="security-specs">
            <div className="spec-item">
              <LuShieldCheck className="text-emerald-500" />
              <span>256-bit AES Encryption Active</span>
            </div>
            <div className="spec-item">
              <LuShieldCheck className="text-blue-500" />
              <span>Real-time Prisma/MongoDB Sync</span>
            </div>
          </div>
        </div>

        {/* 📝 Right: Deposit Form */}
        <div className="main-form-column">
          <div className="deposit-form-card">
            <form onSubmit={handleDeposit}>
              <div className="input-group">
                <label>Account Number ({accountNumber.length}/12)</label>
                <div className="input-wrapper">
                  <LuWallet className="icon" />
                  <input 
                    type="text" 
                    inputMode="numeric" // Optimizes mobile numeric keyboard
                    placeholder="Enter 12-digit account number"
                    value={accountNumber}
                    onChange={handleAccountChange}
                    maxLength={12}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Deposit Amount (INR)</label>
                <div className="input-wrapper amount-input">
                  <span className="currency">₹</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`deposit-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? "Processing Ledger..." : "Confirm Deposit"}
                {!loading && <LuArrowRight />}
              </button>
            </form>

            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="status-msg success"
                >
                  <LucideCheckCircle2 size={18} /> 
                  <span>Liquidity Synced Successfully</span>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="status-msg error"
                >
                  <LucideAlertCircle size={18} /> 
                  <span>{accountNumber.length < 12 ? "Invalid Account Length" : "Transaction Rejected by Vault"}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;