import React, { useState } from 'react';
import { 
  Plus, Search, Eye, FileText, 
  TrendingUp, AlertCircle, CheckCircle2 
} from 'lucide-react';
import './Loan.scss';

interface LoanRecord {
  id: string;
  customer: string;
  type: 'Home' | 'Personal' | 'Education' | 'Vehicle';
  amount: number;
  tenure: string;
  interest: string;
  progress: number;
  status: 'Approved' | 'Pending' | 'Active' | 'Rejected';
}

const mockLoans: LoanRecord[] = [
  { id: 'L-758301', customer: 'Amit Patel', type: 'Home', amount: 4500000, tenure: '15 Yrs', interest: '8.5%', progress: 12, status: 'Active' },
  { id: 'L-758302', customer: 'Priya Sharma', type: 'Personal', amount: 500000, tenure: '3 Yrs', interest: '12%', progress: 65, status: 'Active' },
  { id: 'L-758303', customer: 'Vikram Joshi', type: 'Education', amount: 1500000, tenure: '7 Yrs', interest: '7.5%', progress: 0, status: 'Pending' },
  { id: 'L-758304', customer: 'Ananya Singh', type: 'Vehicle', amount: 800000, tenure: '5 Yrs', interest: '9.2%', progress: 100, status: 'Approved' },
];

const Loan: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLoans = mockLoans.filter(loan => 
    loan.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.id.includes(searchTerm)
  );

  return (
    <div className="loan-root">
      <header className="loan-header">
        <div className="header-text">
          <h1>Loan Management</h1>
          <p>Institutional debt monitoring and asset recovery</p>
        </div>
        <button className="apply-loan-btn">
          <Plus size={18} /> Apply for Loan
        </button>
      </header>

      {/* --- 📊 Loan Performance Summary --- */}
      <div className="loan-metrics">
        {[
          { label: "Active Portfolio", val: "₹8.42 Cr", icon: <TrendingUp size={20}/> },
          { label: "Pending Approvals", val: "14", icon: <AlertCircle size={20}/> },
          { label: "Recovery Rate", val: "98.2%", icon: <CheckCircle2 size={20}/> },
        ].map((m, i) => (
          <div key={i} className="mini-metric-card">
            <div className="icon-box">{m.icon}</div>
            <div className="text-box">
              <span className="label">{m.label}</span>
              <span className="value">{m.val}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ledger-container">
        <div className="ledger-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by Loan ID or customer name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="loan-table">
            <thead>
              <tr>
                <th>LOAN ID</th>
                <th>CUSTOMER</th>
                <th>TYPE</th>
                <th>PRINCIPAL</th>
                <th>REPAYMENT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => (
                <tr key={loan.id}>
                  <td><span className="loan-id">{loan.id}</span></td>
                  <td><span className="cust-name">{loan.customer}</span></td>
                  <td>
                    <span className={`type-tag ${loan.type.toLowerCase()}`}>
                      {loan.type}
                    </span>
                  </td>
                  <td>
                    <div className="amount-stack">
                      <span className="principal">₹{loan.amount.toLocaleString()}</span>
                      <span className="rate">{loan.interest} @ {loan.tenure}</span>
                    </div>
                  </td>
                  <td>
                    <div className="progress-stack">
                      <div className="bar-bg">
                        <div className="bar-fill" style={{ width: `${loan.progress}%` }}></div>
                      </div>
                      <span className="percent">{loan.progress}% Paid</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${loan.status.toLowerCase()}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn"><Eye size={18} /></button>
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

export default Loan;