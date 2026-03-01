import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Plus, Send, History, RefreshCw, 
  ArrowUpRight, ArrowDownLeft,
  UserPlus,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VaultLoader from './VaultLoader'; // Your custom progress circular
import './Dashboard.scss';

const API_BASE = "http://127.0.0.1:5000";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLedger = useCallback(async () => {
    if (user.role !== 'CUSTOMER') return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/accounts/history/${user.email}`); 
      setBalance(res.data.balance || 0);
      setHistory(res.data.history || []);
    } catch (err) {
      console.error("Vault synchronization failed. Check backend at port 5000");
    } finally {
      // Small delay to ensure the loader is seen
      setTimeout(() => setLoading(false), 800);
    }
  }, [user.email, user.role]);

  useEffect(() => { fetchLedger(); }, [fetchLedger]);

  return (
    <div className="dashboard-content-grid">
      {/* --- 🔐 Institutional Loading Overlay --- */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="vault-loading-overlay"
          >
            <VaultLoader label="Synchronizing Vault..." />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="stats-grid-row">
        {[
          { label: "Institutional Liquidity", value: `₹${balance.toLocaleString('en-IN')}` },
          { label: "Monthly Outflow", value: `₹${(balance * 0.4).toLocaleString('en-IN')}` },
          { label: "Asset Valuation", value: "₹24,461" },
          { label: "System Status", value: "Verified", isStatus: true },
        ].map((stat, i) => (
          <div key={`stat-${i}`} className="stat-widget-modern">
            <span className="label">{stat.label}</span>
            <span className={`value ${stat.isStatus ? 'status-active' : ''}`}>
              {stat.isStatus && <ShieldCheck size={14} className="inline mr-2" />}
              {stat.value}
            </span>
          </div>
        ))}
        
        <button 
          onClick={fetchLedger} 
          disabled={loading}
          className={`sync-action-btn ${loading ? 'active' : ''}`}
        >
          <RefreshCw size={24} />
        </button>
      </div>

      <div className="main-dashboard-columns">
        <div className="column-left">
          <motion.div whileHover={{ scale: 1.02, rotateY: 5 }} className="premium-bank-card">
            <div className="card-chip-gold"></div>
            <div className="card-body">
              <p className="balance-label">Institutional Balance</p>
              <p className="balance-val">₹{balance.toLocaleString('en-IN')}</p>
            </div>
            <div className="card-footer">
              <div className="user-details">
                <span className="role-ledger">{user.role} LEDGER</span>
                <p className="holder-name">{user.name || 'INTERNAL USER'}</p>
              </div>
              <div className="brand-logo-circles">
                <div className="c-red"></div><div className="c-orange"></div>
              </div>
            </div>
          </motion.div>

          {(user.role === 'ACCOUNTANT' || user.role === 'MANAGER') && (
            <motion.button 
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}
              onClick={() => navigate('/onboard')} 
              className="onboard-portal-btn"
            >
              <div className="btn-content">
                <UserPlus size={28} />
                <div className="text-left">
                  <h3>Onboard New Client</h3>
                  <p>Initialize Vault Form 104-A</p>
                </div>
              </div>
              <ArrowUpRight size={20} className="arrow-accent" />
            </motion.button>
          )}

          <div className="quick-action-button-row">
            <button onClick={() => navigate('/deposit')} className="modern-action-btn deposit">
              <div className="icon-ring"><Plus size={22} /></div>
              <span>Deposit</span>
            </button>
            <button onClick={() => navigate('/transfer')} className="modern-action-btn transfer">
              <div className="icon-ring"><Send size={22} /></div>
              <span>Transfer</span>
            </button>
          </div>
        </div>

        <div className="column-middle">
          <div className="transaction-glass-feed">
            <header className="feed-header">
              <h3>Verified Ledger Activity</h3>
              <button className="text-action-btn">Audit History</button>
            </header>
            
            <div className="tx-list-modern custom-scrollbar">
              <AnimatePresence>
                {history.length > 0 ? history.map((tx, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    key={`tx-${tx.id || idx}`} 
                    className="tx-item-modern"
                  >
                    <div className="tx-left">
                      <div className={`status-icon ${tx.transactionType.includes('IN') || tx.transactionType === 'DEPOSIT' ? 'in' : 'out'}`}>
                        {tx.transactionType.includes('IN') || tx.transactionType === 'DEPOSIT' 
                          ? <ArrowDownLeft size={16}/> 
                          : <ArrowUpRight size={16}/>}
                      </div>
                      <div className="tx-meta">
                        <p className="name">{tx.transactionType.replace('_', ' ')}</p>
                        <p className="date">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`tx-amount ${tx.transactionType.includes('IN') || tx.transactionType === 'DEPOSIT' ? 'gain' : 'loss'}`}>
                      {tx.transactionType.includes('IN') || tx.transactionType === 'DEPOSIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </span>
                  </motion.div>
                )) : (
                  <div className="empty-state">
                    <History size={48} className="opacity-10" />
                    <p>No verified movements found.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="column-right">
          <div className="premium-banner-btn">
            <TrendingUp size={24} className="banner-icon" />
            <div className="banner-text">
              <h4>Institutional Bonus</h4>
              <p>Rewards Active for {user.name?.split(' ')[0]}</p>
            </div>
          </div>
          
          <div className="calendar-widget-modern">
            <h4>Settlement Schedule</h4>
            <div className="calendar-grid">
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <span key={`day-label-${i}`} className="day-name">{d}</span>
              ))}
              {Array.from({length: 14}).map((_, i) => (
                <span key={`date-cell-${i}`} className={`day-cell ${i === 4 ? 'current' : ''}`}>{i + 1}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;