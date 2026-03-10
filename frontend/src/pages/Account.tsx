import React, { useState } from 'react';
import { Plus, Eye, Search } from 'lucide-react';
import OpenAccount from './OpenAccount'; // 🛡️ Institutional Ledger Portal
import './Account.scss';

interface AccountData {
  id: string;
  accountNo: string;
  customer: string;
  type: 'Savings' | 'Current' | 'Fixed Deposit';
  balance: number;
  interest: string;
  status: 'active' | 'closed';
}

const mockAccounts: AccountData[] = [
  { id: '1', accountNo: 'SB001001', customer: 'Priya Sharma', type: 'Savings', balance: 125000, interest: '4.5%', status: 'active' },
  { id: '2', accountNo: 'CA001002', customer: 'Amit Patel', type: 'Current', balance: 450000, interest: '0%', status: 'active' },
  { id: '3', accountNo: 'SB001003', customer: 'Sneha Reddy', type: 'Savings', balance: 78500, interest: '4.5%', status: 'active' },
  { id: '4', accountNo: 'SB001004', customer: 'Rahul Gupta', type: 'Savings', balance: 5200, interest: '4.5%', status: 'closed' },
  { id: '5', accountNo: 'FD001005', customer: 'Ananya Singh', type: 'Fixed Deposit', balance: 500000, interest: '7.1%', status: 'active' },
];

const Account: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOpenModal, setShowOpenModal] = useState(false); // 🚦 Modal State

  const filteredAccounts = mockAccounts.filter(acc => 
    acc.accountNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="accounts-root">
      {/* 🏛️ Initialize New Account Modal (Form 104-B) */}
      <OpenAccount 
        isOpen={showOpenModal} 
        onClose={() => setShowOpenModal(false)} 
      />

      <header className="accounts-header">
        <div className="header-text">
          <h1>Accounts</h1>
          <p>Manage all bank accounts across branches</p>
        </div>
        {/* ⚡ Trigger Ledger Initialization */}
        <button className="open-account-btn" onClick={() => setShowOpenModal(true)}>
          <Plus size={18} /> Open Account
        </button>
      </header>

      <div className="ledger-container">
        {/* --- 🔍 Search Utility --- */}
        <div className="ledger-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by account no. or customer name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* --- 📜 Institutional Accounts Table --- */}
        <div className="table-wrapper">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>ACCOUNT NO.</th>
                <th>CUSTOMER</th>
                <th>TYPE</th>
                <th>BALANCE</th>
                <th>INTEREST</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => (
                <tr key={acc.id}>
                  <td><span className="acc-no">{acc.accountNo}</span></td>
                  <td><span className="cust-name">{acc.customer}</span></td>
                  <td>
                    <span className={`type-badge ${acc.type.toLowerCase().replace(' ', '-')}`}>
                      {acc.type}
                    </span>
                  </td>
                  <td>
                    <span className="balance-text">
                      ₹{acc.balance.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td><span className="interest-text">{acc.interest}</span></td>
                  <td>
                    <span className={`status-pill ${acc.status}`}>
                      {acc.status}
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

export default Account;