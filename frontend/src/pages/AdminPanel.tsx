import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Search, ShieldAlert, TrendingUp, 
  ArrowRight, Filter, Download, MoreVertical 
} from 'lucide-react';
import { motion } from 'framer-motion';
import './AdminPanel.scss';

interface Account {
  accountNumber: string;
  balance: number;
  accountType: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  accounts: Account[];
}

const API_BASE = "http://127.0.0.1:5000";

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch administrative data:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalLiquidity = () => {
    return users.reduce((total, user) => {
      const userTotal = user.accounts.reduce((acc, curr) => acc + curr.balance, 0);
      return total + userTotal;
    }, 0);
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-panel mt-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Deposits</p>
              <h4 className="text-2xl font-black text-slate-800 mt-1">₹{calculateTotalLiquidity().toLocaleString()}</h4>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp size={20} /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Users</p>
              <h4 className="text-2xl font-black text-slate-800 mt-1">{users.length}</h4>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Admin Status</p>
              <h4 className="text-2xl font-black text-purple-600 mt-1">SECURE</h4>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ShieldAlert size={20} /></div>
          </div>
        </motion.div>
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-800">Global Account Registry</h3>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100"><Filter size={18} /></button>
            <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100"><Download size={18} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Client Details</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Access Role</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Active Accounts</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Total Balance</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400">Loading bank registry...</td></tr>
              ) : filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-800">{u.fullName}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      u.role === 'MANAGER' ? 'bg-purple-100 text-purple-600' :
                      u.role === 'ACCOUNTANT' ? 'bg-amber-100 text-amber-600' :
                      u.role === 'CASHIER' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-600">
                    {u.accounts.length} Account(s)
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="font-black text-slate-800">
                      ₹{u.accounts.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;