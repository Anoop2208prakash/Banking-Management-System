import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Landmark, Wallet, ArrowUpRight, ArrowDownLeft, 
  History, LogOut, RefreshCw, Plus, Send 
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Dashboard.scss';

// Interfaces for Type Safety
interface Transaction {
  id: string;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_IN' | 'TRANSFER_OUT';
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const API_BASE = "http://127.0.0.1:5000";

const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data on load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchAccountDetails("USER_ACCOUNT_HERE"); // Replace with dynamic logic later
    }
  }, []);

  const fetchAccountDetails = async (accNum: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/accounts/history/${accNum}`);
      setBalance(res.data.balance);
      setHistory(res.data.history);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container p-4 md:p-8 font-sans">
      {/* Top Navigation */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Landmark size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800">Anoop Industry Bank</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-500 font-bold uppercase">Customer</p>
            <p className="font-semibold text-slate-700">{user?.name || "Anoop Prakash"}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Account & Actions (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="balance-card p-8 rounded-[2.5rem] text-white"
          >
            <p className="text-blue-100 text-sm font-medium mb-1">Current Balance</p>
            <h2 className="text-4xl font-black mb-6">
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex justify-between items-center pt-6 border-t border-white/10">
              <div>
                <p className="text-[10px] text-blue-200 uppercase font-bold">Status</p>
                <p className="text-sm font-medium">Active Account</p>
              </div>
              <RefreshCw size={18} className={`text-blue-200 ${loading ? 'animate-spin' : ''}`} />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl border border-slate-200 hover:border-blue-500 transition-all group">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Plus size={24} />
              </div>
              <span className="text-sm font-bold text-slate-700">Deposit</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl border border-slate-200 hover:border-blue-500 transition-all group">
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Send size={24} />
              </div>
              <span className="text-sm font-bold text-slate-700">Transfer</span>
            </button>
          </div>
        </div>

        {/* Right Section: History (8 Columns) */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <History className="text-blue-600" size={22} />
            <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-center py-20 text-slate-400 italic">No transactions recorded yet.</p>
            ) : (
              history.map((tx) => (
                <div key={tx.id} className="transaction-item flex justify-between items-center p-4 rounded-2xl border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      tx.transactionType.includes('IN') || tx.transactionType === 'DEPOSIT' 
                      ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {tx.transactionType.includes('IN') || tx.transactionType === 'DEPOSIT' 
                        ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />
                      }
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-none mb-1">{tx.transactionType.replace('_', ' ')}</p>
                      <p className="text-xs text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`text-lg font-black ${
                    tx.transactionType.includes('IN') || tx.transactionType === 'DEPOSIT' 
                    ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {tx.transactionType.includes('IN') || tx.transactionType === 'DEPOSIT' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;