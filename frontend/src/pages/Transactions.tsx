import React, { useState } from 'react';
import { 
  Download, Search, ArrowUpRight, ArrowDownLeft, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import './Transactions.scss';

interface TransactionRecord {
  id: string;
  type: 'Transfer' | 'Deposit' | 'Withdrawal' | 'Upi' | 'Neft' | 'Imps';
  fromTo: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: TransactionRecord[] = [
  { id: 'TXN20240301001', type: 'Transfer', fromTo: 'SB001001 → CA001002', amount: 15000, date: '2024-03-01', status: 'completed' },
  { id: 'TXN20240302002', type: 'Deposit', fromTo: '— → SB001001', amount: 50000, date: '2024-03-02', status: 'completed' },
  { id: 'TXN20240303003', type: 'Withdrawal', fromTo: 'CA001002 → —', amount: 25000, date: '2024-03-03', status: 'completed' },
  { id: 'TXN20240304004', type: 'Upi', fromTo: 'SB001003 → SB001001', amount: 8500, date: '2024-03-04', status: 'completed' },
  { id: 'TXN20240305005', type: 'Neft', fromTo: 'SB001001 → CA001002', amount: 100000, date: '2024-03-05', status: 'pending' },
  { id: 'TXN20240306006', type: 'Imps', fromTo: 'CA001002 → SB001003', amount: 30000, date: '2024-03-06', status: 'completed' },
  { id: 'TXN20240307007', type: 'Withdrawal', fromTo: 'SB001003 → —', amount: 5000, date: '2024-03-07', status: 'failed' },
];

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesFilter = filter === 'All' || tx.type.toLowerCase() === filter.toLowerCase();
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.fromTo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="transactions-root">
      <header className="transactions-header">
        <div className="header-text">
          <h1>Transactions</h1>
          <p>View and manage all banking transactions</p>
        </div>
        <button className="export-btn">
          <Download size={18} /> Export
        </button>
      </header>

      <div className="ledger-card">
        {/* --- 🔍 Toolbar Row --- */}
        <div className="ledger-toolbar">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-scroll">
            {['All', 'Deposit', 'Withdrawal', 'Transfer', 'Upi', 'Neft', 'Imps'].map((tab) => (
              <button 
                key={tab} 
                className={`tab-btn ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- 📜 Transaction Table --- */}
        <div className="table-responsive">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>TRANSACTION ID</th>
                <th>TYPE</th>
                <th>FROM → TO</th>
                <th>AMOUNT</th>
                <th>DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td><span className="txn-id">{tx.id}</span></td>
                  <td>
                    <div className="type-cell">
                      <div className={`icon-ring ${tx.type.toLowerCase()}`}>
                        {tx.type === 'Deposit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      </div>
                      <span className="type-label">{tx.type}</span>
                    </div>
                  </td>
                  <td><span className="path-text">{tx.fromTo}</span></td>
                  <td><span className="amount-text">₹{tx.amount.toLocaleString('en-IN')}</span></td>
                  <td><span className="date-text">{tx.date}</span></td>
                  <td>
                    <span className={`status-pill ${tx.status}`}>
                      {tx.status}
                    </span>
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

export default Transactions;