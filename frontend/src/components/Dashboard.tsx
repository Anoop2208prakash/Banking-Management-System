import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Landmark, Wallet, ArrowUpRight, ArrowDownLeft, 
  History, LogOut, RefreshCw, Plus, Send, Shield, Users, BarChart3, UserPlus, LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Dashboard.scss';

// Interfaces remain the same for logic consistency
interface Transaction {
  id: string;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_IN' | 'TRANSFER_OUT';
  createdAt: string;
  processedBy?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'MANAGER' | 'ACCOUNTANT' | 'CASHIER' | 'CUSTOMER';
}

const API_BASE = "http://127.0.0.1:5000";

const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'CUSTOMER') fetchAccountDetails("USER_ACCOUNT_HERE");
      else setLoading(false);
    }
  }, []);

  const fetchAccountDetails = async (accNum: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/accounts/history/${accNum}`);
      setBalance(res.data.balance);
      setHistory(res.data.history);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-wrapper">
      {/* 🏛️ Modern Sidebar */}
      <aside className="sidebar">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Landmark size={24} />
          </div>
          <span className="text-lg font-bold tracking-tight">Anoop Industry</span>
        </div>

        <nav className="space-y-2 flex-1">
          <div className="nav-item active"><LayoutDashboard size={20} /> Dashboard</div>
          <div className="nav-item"><History size={20} /> Transactions</div>
          {user?.role === 'MANAGER' && <div onClick={() => navigate('/admin')} className="nav-item"><Users size={20} /> Staff Hub</div>}
          <div className="nav-item"><Shield size={20} /> Security</div>
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button onClick={handleLogout} className="nav-item text-rose-400 hover:bg-rose-500/10 w-full">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* 🚀 Main Viewport */}
      <main className="main-viewport">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Welcome, {user?.name.split(' ')[0]}</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Today is Wednesday, Feb 25, 2026</p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-white/5">
            <div className="text-right px-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">{user?.role}</span>
              <p className="text-sm font-bold">{user?.name}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
              {user?.name[0]}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Card & Quick Actions */}
          <div className="col-span-12 lg:col-span-5 space-y-8">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="balance-card-modern">
              <div className="relative z-10">
                <p className="text-blue-100/70 text-sm font-bold uppercase tracking-wider mb-2">Total Liquidity</p>
                <h2 className="text-5xl font-black">₹{balance.toLocaleString('en-IN')}</h2>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
                   <div><p className="text-[10px] text-blue-200 font-bold uppercase">Status</p><p className="font-bold">Verified Account</p></div>
                   <RefreshCw className={loading ? "animate-spin" : ""} size={20} />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {user?.role === 'ACCOUNTANT' ? (
                <>
                  <div onClick={() => navigate('/register')} className="action-tile cursor-pointer">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><UserPlus /></div>
                    <span className="font-bold text-xs uppercase">Onboard Client</span>
                  </div>
                  <div className="action-tile">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl"><BarChart3 /></div>
                    <span className="font-bold text-xs uppercase">Audit Log</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="action-tile">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><Plus /></div>
                    <span className="font-bold text-xs uppercase">Deposit</span>
                  </div>
                  <div className="action-tile">
                    <div className="p-3 bg-slate-500/10 text-slate-400 rounded-2xl"><Send /></div>
                    <span className="font-bold text-xs uppercase">Transfer</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="col-span-12 lg:col-span-7">
            <div className="glass-panel h-full">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Transaction Ledger</h3>
                <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-slate-400 font-bold uppercase tracking-tighter">Real-time sync</span>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[450px] custom-scrollbar pr-2">
                {history.map((tx) => (
                  <div key={tx.id} className="tx-row group">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${tx.transactionType.includes('IN') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {tx.transactionType.includes('IN') ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{tx.transactionType.replace('_', ' ')}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-black ${tx.transactionType.includes('IN') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.transactionType.includes('IN') ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;