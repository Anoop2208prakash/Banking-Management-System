import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LuUsers, LuSearch, LuShieldAlert, LuTrendingUp,
  LuFilter, LuDownload, LuFileCheck
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminPanel.scss';
import { LucideMoreVertical } from 'lucide-react';

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
  profileImage?: string; // Sync with your Cloudinary logic
  accounts: Account[];
  createdAt: string;
}

const API_BASE = "http://127.0.0.1:5000";

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch bank registry. Ensure Unicorn is active at port 5000");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const totalLiquidity = users.reduce((total, user) => 
    total + user.accounts.reduce((acc, curr) => acc + curr.balance, 0), 0
  );

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-terminal-container">
      {/* 🚀 Page Header */}
      <header className="terminal-header">
        <div>
          <h1>Global Account Registry</h1>
          <p>Institutional Oversight • Real-time Ledger Audit</p>
        </div>
        <button onClick={fetchUsers} className="refresh-btn">
          <LuFileCheck size={18} /> Sync Registry
        </button>
      </header>

      {/* 📊 Intelligence Overview Stats */}
      <div className="stats-intelligence-grid">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="intel-card">
          <div className="icon-box emerald"><LuTrendingUp size={24} /></div>
          <div className="card-data">
            <span className="label">Total Vault Deposits</span>
            <h4 className="val">₹{totalLiquidity.toLocaleString('en-IN')}</h4>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="intel-card">
          <div className="icon-box blue"><LuUsers size={24} /></div>
          <div className="card-data">
            <span className="label">Registered Identities</span>
            <h4 className="val">{users.length} Clients</h4>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="intel-card secure">
          <div className="icon-box gold"><LuShieldAlert size={24} /></div>
          <div className="card-data">
            <span className="label">System Shield</span>
            <h4 className="val">ACTIVE</h4>
          </div>
        </motion.div>
      </div>

      {/* 🏛️ The Global Registry Table */}
      <div className="registry-card">
        <div className="card-toolbar">
          <div className="search-barrier">
            <LuSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by Identity or Secure Email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="toolbar-actions">
            <button className="tool-btn"><LuFilter size={18} /> Filter</button>
            <button className="tool-btn"><LuDownload size={18} /> Export</button>
          </div>
        </div>

        <div className="table-wrapper custom-scrollbar">
          <table className="registry-table">
            <thead>
              <tr>
                <th>Identity Details</th>
                <th>Institutional Role</th>
                <th>Liquidity Profile</th>
                <th className="text-right">Ledger Balance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  <tr><td colSpan={5} className="empty-row">Retrieving Secure Records...</td></tr>
                ) : filteredUsers.map((u, idx) => (
                  <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="user-row"
                  >
                    <td>
                      <div className="user-profile-cell">
                        <img 
                          src={u.profileImage || `https://ui-avatars.com/api/?name=${u.fullName}&background=f1f5f9&color=64748b`}
                          alt="avatar"
                        />
                        <div className="user-text">
                          <p className="name">{u.fullName}</p>
                          <p className="email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${u.role.toLowerCase()}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <p className="account-count">{u.accounts.length} Active Segment(s)</p>
                      <p className="last-activity">Member since {new Date(u.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="text-right">
                      <p className="balance-val">
                        ₹{u.accounts.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString('en-IN')}
                      </p>
                    </td>
                    <td className="text-right">
                      <button className="more-btn"><LucideMoreVertical size={20} /></button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;