import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Added for navigation
import { Landmark, Mail, Lock, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import './Login.scss';

const API_BASE = "http://127.0.0.1:5000";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/login`, { email, password });
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/dashboard'; // Redirect on success
    } catch (err: any) {
      setError(err.response?.data?.error || "Connection to bank server failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-3 rounded-2xl text-white mb-4 shadow-lg">
            <Landmark size={32} />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Anoop Industry Bank</h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em] mt-2">Secure Gateway</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : (
              <>
                Access Vault <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Navigation to Registration */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            New to Anoop Bank?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1">
              Create Account <UserPlus size={14} />
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex justify-center items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-tighter">
          <ShieldCheck size={14} className="text-blue-500" />
          <span>Encrypted with 256-bit SSL</span>
        </div>
      </div>
    </div>
  );
};

export default Login;