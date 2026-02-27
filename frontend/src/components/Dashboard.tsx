import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Send, CreditCard, UserPlus, History, RefreshCw, 
  ArrowUpRight, ArrowDownLeft 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Dashboard.scss';

const API_BASE = "http://127.0.0.1:5000";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch real-time ledger data from your Flask backend
  const fetchLedger = async () => {
    // Only customers have a balance ledger to display in this view
    if (user.role !== 'CUSTOMER') return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/accounts/history/${user.email}`); 
      setBalance(res.data.balance);
      setHistory(res.data.history);
    } catch (err) {
      console.error("Ledger sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLedger(); }, []);

  return (
    <div className="dashboard-content-grid">
      {/* 📈 Top Summary Row */}
      <div className="stats-grid-row">
        <div className="stat-widget">
          <span className="label">Spent this month</span>
          <span className="value">₹{(balance * 0.4).toLocaleString()}</span>
        </div>
        <div className="stat-widget">
          <span className="label">Received this month</span>
          <span className="value">₹{(balance * 0.1).toLocaleString()}</span>
        </div>
        <div className="stat-widget">
          <span className="label">Investments</span>
          <span className="value">₹24,461</span>
        </div>
        <div className="stat-widget">
          <span className="label">Cashback</span>
          <span className="value">₹1,897</span>
        </div>
        <div onClick={fetchLedger} className="stat-widget sync-widget">
          <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
        </div>
      </div>

      {/* 🏛️ Main Operational Section */}
      <div className="main-dashboard-columns">
        
        {/* 💳 Left Column: Bank Card & Actions */}
        <div className="column-left space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bank-card-preview">
            <div className="card-chip"></div>
            <p className="balance-label">Institutional Balance</p>
            <p className="balance-val">₹{balance.toLocaleString('en-IN')}</p>
            <div className="mt-8 flex justify-between items-center">
              <span className="text-xs tracking-widest uppercase">{user.role} LEDGER</span>
              <div className="flex gap-1">
                <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
                <div className="w-6 h-6 bg-orange-500 rounded-full -ml-3 opacity-80"></div>
              </div>
            </div>
          </motion.div>

          {/* 📝 Accountant Enrollment Portal */}
          {user.role === 'ACCOUNTANT' && (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/onboard')} 
              className="bg-blue-600 p-8 rounded-[2rem] text-white cursor-pointer shadow-lg shadow-blue-600/20"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">Onboard Client</h3>
                  <p className="text-xs opacity-70">Form 104-A • KYC Process</p>
                </div>
                <UserPlus size={30} />
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all">
              <Plus className="text-blue-500" />
              <span className="text-[10px] font-black uppercase">Deposit</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all">
              <Send className="text-blue-500" />
              <span className="text-[10px] font-black uppercase">Transfer</span>
            </button>
          </div>
        </div>

        {/* 📜 Middle Column: Live Transaction Feed */}
        <div className="column-middle">
          <div className="transaction-feed-light h-full">
            <div className="feed-header">
              <h3>Recent Transactions</h3>
              <span className="view-all">View History</span>
            </div>
            
            <div className="tx-list custom-scrollbar">
              {history.length > 0 ? history.map((tx, idx) => (
                <div key={idx} className="tx-item">
                  <div className="tx-info">
                    <div className="icon-box">
                      {tx.transactionType.includes('IN') ? <ArrowDownLeft size={18} className="text-emerald-500"/> : <ArrowUpRight size={18} className="text-rose-500"/>}
                    </div>
                    <div>
                      <p className="name">{tx.transactionType.replace('_', ' ')}</p>
                      <p className="type">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`amount ${tx.transactionType.includes('IN') ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {tx.transactionType.includes('IN') ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </span>
                </div>
              )) : (
                <div className="text-center py-20 opacity-20 italic">
                  <History size={40} className="mx-auto mb-4" />
                  <p>No verified movements found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 📅 Right Column: Offers & Schedule */}
        <div className="column-right space-y-6">
          <div className="bg-slate-800 p-8 rounded-[2rem] text-white relative overflow-hidden">
            <span className="text-[10px] uppercase font-bold opacity-60 tracking-widest">Offers For You</span>
            <h4 className="font-bold text-lg mt-3">100% Welcome Bonus</h4>
            <p className="text-xs opacity-50 mt-2">Institutional rewards active.</p>
          </div>
          
          <div className="schedule-widget">
            <h4 className="font-bold text-sm text-slate-800">Payment Schedule</h4>
            <div className="calendar-grid">
              {['M','T','W','T','F','S','S'].map(d => <span key={d} className="day-label">{d}</span>)}
              {Array.from({length: 14}).map((_, i) => (
                <span key={i} className={`date-cell ${i === 4 ? 'active' : ''}`}>
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;