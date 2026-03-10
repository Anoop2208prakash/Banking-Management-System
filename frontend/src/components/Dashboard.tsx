import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Users, Wallet, FileText, BarChart3, 
  ArrowUpRight, ArrowDownLeft, RefreshCw, Clock, MoreVertical
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Cell, PieChart, Pie 
} from 'recharts';
import { motion } from 'framer-motion';
import './Dashboard.scss';

const API_BASE = "http://127.0.0.1:5000";

// --- 📊 Target Analytics Data ---
const monthlyData = [
  { name: 'Jan', home: 4500, personal: 3200, education: 2100 },
  { name: 'Feb', home: 5200, personal: 3800, education: 2500 },
  { name: 'Mar', home: 4800, personal: 3500, education: 2300 },
  { name: 'Apr', home: 5500, personal: 4100, education: 2800 },
  { name: 'May', home: 6100, personal: 4500, education: 3100 },
  { name: 'Jun', home: 5800, personal: 4200, education: 2900 },
];

const loanDistribution = [
  { name: 'Home Loan', value: 65, color: '#0a2558' },
  { name: 'Personal Loan', value: 20, color: '#10b981' },
  { name: 'Education Loan', value: 15, color: '#f59e0b' },
];

// --- 🎯 Custom Tooltip for Hover ---
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="pie-tooltip-card">
        <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLedger = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/accounts/history/${user.email}`); 
      setBalance(res.data.balance || 0);
      setHistory(res.data.history || []);
    } catch (err) { console.error("Sync Failure"); }
    finally { setLoading(false); }
  }, [user.email]);

  useEffect(() => { fetchLedger(); }, [fetchLedger]);

  return (
    <div className="dashboard-root">
      <header className="dash-header">
        <div className="welcome-section">
          <h1>Welcome back, {user.name?.split(' ')[0] || 'Anoop'}</h1>
          <p>Here's what's happening across your branches today.</p>
        </div>
        <button onClick={fetchLedger} className={`refresh-btn ${loading ? 'spinning' : ''}`}>
          <RefreshCw size={18} />
        </button>
      </header>

      {/* --- 💰 Top Summary --- */}
      <div className="metrics-grid">
        {[
          { label: "Total Customers", val: "1,247", icon: <Users size={20}/>, trend: "+12%" },
          { label: "Total Deposits", val: `₹${balance.toLocaleString()}`, icon: <Wallet size={20}/>, trend: "+8.5%" },
          { label: "Active Loans", val: "₹2,85,00,000", icon: <FileText size={20}/>, trend: "+3.2%" },
          { label: "Revenue", val: "₹32,00,000", icon: <BarChart3 size={20}/>, trend: "+15%" },
        ].map((m, i) => (
          <div key={i} className="metric-card">
            <div className="card-top">
              <div className="label-group">
                <span className="label">{m.label}</span>
                <h3>{m.val}</h3>
              </div>
              <div className="icon-circle">{m.icon}</div>
            </div>
            <div className="card-bottom">
              <span className="trend-up"><ArrowUpRight size={14}/> {m.trend}</span>
              <span className="trend-text">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="main-charts-row">
        {/* --- 📈 Triple Bar Chart --- */}
        <div className="chart-card bar-analytics">
          <div className="card-header">
            <h3>Monthly Transactions</h3>
            <MoreVertical size={18} className="muted" />
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Bar dataKey="home" fill="#0a2558" radius={[4, 4, 0, 0]} barSize={18} />
                <Bar dataKey="personal" fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
                <Bar dataKey="education" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- 🥧 Donut Chart with Hover Tooltip --- */}
        <div className="chart-card pie-analytics">
          <h3>Loan Distribution</h3>
          <div className="pie-wrapper">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie 
                  data={loanDistribution} 
                  innerRadius={70} 
                  outerRadius={95} 
                  paddingAngle={8} 
                  dataKey="value" 
                  stroke="none"
                >
                  {loanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {/* 🎯 Hover Card Implementation */}
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {loanDistribution.map((d, i) => (
                <div key={i} className="legend-item">
                  <span className="dot" style={{background: d.color}}></span>
                  <span className="text">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="feed-row">
        <div className="feed-card">
          <div className="card-header"><h3>Recent Transactions</h3></div>
          <div className="tx-list">
            {history.slice(0, 5).map((tx, i) => (
              <div key={i} className="tx-row">
                <div className="row-left">
                  <div className={`tx-icon ${tx.amount > 0 ? 'in' : 'out'}`}>
                    {tx.amount > 0 ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                  </div>
                  <div className="tx-info">
                    <p className="title">{tx.transactionType}</p>
                    <p className="subtitle">TXN20240301{i}</p>
                  </div>
                </div>
                <div className="row-right">
                  <p className={`amount ${tx.amount > 0 ? 'pos' : 'neg'}`}>
                    {tx.amount > 0 ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <span className="status">completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;