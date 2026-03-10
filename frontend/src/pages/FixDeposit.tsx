import React, { useState } from 'react';
import { Plus, Eye, Search } from 'lucide-react';
import './FixDeposit.scss';

interface FixedDeposit {
  id: string;
  customer: string;
  principal: number;
  interest: string;
  tenure: string;
  maturityAmt: number;
  maturityDate: string;
  status: 'active' | 'matured';
}

const mockFDs: FixedDeposit[] = [
  { id: 'FD001', customer: 'Ananya Singh', principal: 500000, interest: '7.1%', tenure: '365 days', maturityAmt: 535500, maturityDate: '2025-04-12', status: 'active' },
  { id: 'FD002', customer: 'Priya Sharma', principal: 200000, interest: '6.8%', tenure: '180 days', maturityAmt: 206800, maturityDate: '2024-07-15', status: 'matured' },
  { id: 'FD003', customer: 'Amit Patel', principal: 1000000, interest: '7.5%', tenure: '730 days', maturityAmt: 1150000, maturityDate: '2026-02-10', status: 'active' },
];

const FixDeposit: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFDs = mockFDs.filter(fd => 
    fd.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fd-root">
      <header className="fd-header">
        <div className="header-text">
          <h1>Fixed Deposits</h1>
          <p>Manage fixed deposit accounts and maturity tracking</p>
        </div>
        <button className="create-fd-btn">
          <Plus size={18} /> Create FD
        </button>
      </header>

      <div className="ledger-container">
        {/* --- 🔍 Search Utility --- */}
        <div className="ledger-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by customer name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* --- 📜 Institutional FD Table --- */}
        <div className="table-wrapper">
          <table className="fd-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>PRINCIPAL</th>
                <th>INTEREST</th>
                <th>TENURE</th>
                <th>MATURITY AMT</th>
                <th>MATURITY DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredFDs.map((fd) => (
                <tr key={fd.id}>
                  <td><span className="cust-name">{fd.customer}</span></td>
                  <td><span className="amount-bold">₹{fd.principal.toLocaleString('en-IN')}</span></td>
                  <td><span className="meta-text">{fd.interest}</span></td>
                  <td><span className="meta-text">{fd.tenure}</span></td>
                  <td><span className="amount-bold">₹{fd.maturityAmt.toLocaleString('en-IN')}</span></td>
                  <td><span className="date-text">{fd.maturityDate}</span></td>
                  <td>
                    <span className={`status-pill ${fd.status}`}>
                      {fd.status}
                    </span>
                  </td>
                  <td>
                    <button className="view-btn"><Eye size={18} /></button>
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

export default FixDeposit;