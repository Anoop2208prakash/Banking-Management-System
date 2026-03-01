import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react';
import './Register.scss';

const API_BASE = "http://127.0.0.1:5000";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await axios.post(`${API_BASE}/register`, formData);
      setStatus({ type: 'success', msg: "Account created! Redirecting to login..." });
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        msg: err.response?.data?.error || "Registration failed. Check your connection." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container min-h-screen flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl text-white mb-4 shadow-lg">
            <UserPlus size={28} />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Join Anoop Industry Bank</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Open Your Digital Vault</p>
        </div>

        {status && (
          <div className={`mb-6 p-4 rounded-xl text-xs text-center border ${
            status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Full Name"
              className="w-full bg-slate-800/40 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full bg-slate-800/40 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="password" 
              placeholder="Create Password"
              className="w-full bg-slate-800/40 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Link to="/" className="text-slate-400 text-xs hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft size={14} /> Back to Login
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
            <ShieldCheck size={12} /> Data Protected by Industry Standard Encryption
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;