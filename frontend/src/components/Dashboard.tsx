import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Plus, Send, History, RefreshCw, 
  ArrowUpRight, ArrowDownLeft,
  LucideUserPlus,
  LucideTrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
      console.error("Ledger sync failed:", err);
    } finally {
      setLoading(false);
    }
  }, [user.email, user.role]);

  useEffect(() => { fetchLedger(); }, [fetchLedger]);

  return (
    <div className="dashboard-content-grid">
      {/* 📊 High-Intelligence Summary Row */}
      <div className="stats-grid-row">
        {[
          { label: "Monthly Outflow", value: `₹${(balance * 0.4).toLocaleString()}` },
          { label: "Institutional Inflow", value: `₹${(balance * 0.1).toLocaleString()}` },
          { label: "Asset Valuation", value: "₹24,461" },
          { label: "Vault Rewards", value: "₹1,897" },
        ].map((stat, i) => (
          <div key={i} className="stat-widget-modern">
            <span className="label">{stat.label}</span>
            <span className="value">{stat.value}</span>
          </div>
        ))}
        
        <button onClick={fetchLedger} className={`sync-action-btn ${loading ? 'active' : ''}`}>
          <RefreshCw size={24} />
        </button>
      </div>

      <div className="main-dashboard-columns">
        
        {/* 💳 Left Column: Premium Card & CTA */}
        <div className="column-left">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="premium-bank-card"
          >
            <div className="card-chip-gold"></div>
            <div className="card-body">
              <p className="balance-label">Institutional Balance</p>
              <p className="balance-val">₹{balance.toLocaleString('en-IN')}</p>
            </div>
            <div className="card-footer">
              <span className="role-ledger">{user.role} LEDGER</span>
              <div className="brand-logo-circles">
                <div className="c-red"></div>
                <div className="c-orange"></div>
              </div>
            </div>
          </motion.div>

          {/* 📝 Stylish Enrollment Portal */}
          {user.role === 'ACCOUNTANT' && (
            <motion.button 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/onboard')} 
              className="onboard-portal-btn"
            >
              <div className="btn-content">
                <LucideUserPlus size={28} />
                <div className="text-left">
                  <h3>Onboard New Client</h3>
                  <p>Initialize Vault Form 104-A</p>
                </div>
              </div>
              <ArrowUpRight size={20} className="arrow-accent" />
            </motion.button>
          )}

          {/* ⚡ Quick Action Grid */}
          <div className="quick-action-button-row">
            <button className="modern-action-btn deposit">
              <div className="icon-ring"><Plus size={22} /></div>
              <span>Deposit</span>
            </button>
            <button className="modern-action-btn transfer">
              <div className="icon-ring"><Send size={22} /></div>
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* 📜 Middle Column: Live Transaction Feed */}
        <div className="column-middle">
          <div className="transaction-glass-feed">
            <header className="feed-header">
              <h3>Live Ledger Activity</h3>
              <button className="text-action-btn">View All History</button>
            </header>
            
            <div className="tx-list-modern custom-scrollbar">
              <AnimatePresence>
                {history.length > 0 ? history.map((tx, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className="tx-item-modern"
                  >
                    <div className="tx-left">
                      <div className={`status-icon ${tx.transactionType.includes('IN') ? 'in' : 'out'}`}>
                        {tx.transactionType.includes('IN') ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                      </div>
                      <div className="tx-meta">
                        <p className="name">{tx.transactionType.replace('_', ' ')}</p>
                        <p className="date">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`tx-amount ${tx.transactionType.includes('IN') ? 'gain' : 'loss'}`}>
                      {tx.transactionType.includes('IN') ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </span>
                  </motion.div>
                )) : (
                  <div className="empty-state">
                    <History size={48} className="opacity-20" />
                    <p>No verified movements found.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 📅 Right Column: Intelligence & Ads */}
        <div className="column-right">
          <div className="premium-banner-btn">
            <LucideTrendingUp size={24} className="banner-icon" />
            <div className="banner-text">
              <h4>Institutional Bonus</h4>
              <p>100% Welcome Rewards Active</p>
            </div>
          </div>
          
          <div className="calendar-widget-modern">
            <h4>Payment Schedule</h4>
            <div className="calendar-grid">
              {['M','T','W','T','F','S','S'].map(d => <span key={d} className="day-name">{d}</span>)}
              {Array.from({length: 14}).map((_, i) => (
                <span key={i} className={`day-cell ${i === 4 ? 'current' : ''}`}>{i + 1}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;