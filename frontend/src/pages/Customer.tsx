import React, { useState } from 'react';
import { 
  Plus, Search, Eye, MoreVertical, 
  Filter, ChevronLeft, ChevronRight 
} from 'lucide-react';
import AddCustomer from './AddCustomer'; // 🛡️ Institutional Enrollment Portal
import './Customer.scss';

interface CustomerData {
  id: string;
  name: string;
  dob: string;
  accountNo: string;
  email: string;
  phone: string;
  kyc: 'verified' | 'pending' | 'rejected';
  status: 'active' | 'inactive' | 'pending';
}

const mockCustomers: CustomerData[] = [
  { id: '1', name: 'Priya Sharma', dob: '1990-05-15', accountNo: 'SB001001', email: 'priya@email.com', phone: '9876543210', kyc: 'verified', status: 'active' },
  { id: '2', name: 'Amit Patel', dob: '1988-08-22', accountNo: 'SB001002', email: 'amit@email.com', phone: '9876543211', kyc: 'verified', status: 'active' },
  { id: '3', name: 'Sneha Reddy', dob: '1995-12-03', accountNo: 'SB001003', email: 'sneha@email.com', phone: '9876543212', kyc: 'pending', status: 'active' },
  { id: '4', name: 'Rahul Gupta', dob: '1992-07-18', accountNo: 'SB001004', email: 'rahul@email.com', phone: '9876543213', kyc: 'rejected', status: 'inactive' },
  { id: '5', name: 'Ananya Singh', dob: '1993-11-28', accountNo: 'SB001005', email: 'ananya@email.com', phone: '9876543214', kyc: 'verified', status: 'active' },
  { id: '6', name: 'Vikram Joshi', dob: '1985-03-10', accountNo: 'SB001006', email: 'vikram@email.com', phone: '9876543215', kyc: 'pending', status: 'pending' },
];

const Customer: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false); // 🚦 Modal State

  const filteredData = mockCustomers.filter(customer => {
    const matchesFilter = filter === 'All' || customer.status === filter.toLowerCase();
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.accountNo.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="customer-root">
      {/* 🏛️ Add Customer Modal (Vault Form 104-A) */}
      <AddCustomer 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />

      <header className="customer-header">
        <div className="header-text">
          <h1>Customers</h1>
          <p>Manage customer accounts and KYC verification</p>
        </div>
        {/* ⚡ Trigger Modal */}
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Customer
        </button>
      </header>

      <div className="table-container">
        {/* --- 🔍 Search & Filter Row --- */}
        <div className="table-controls">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, account number, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {['All', 'Active', 'Inactive', 'Pending'].map((tab) => (
              <button 
                key={tab} 
                className={`tab ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- 📜 Customer Ledger Table --- */}
        <div className="customer-table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>ACCOUNT NO.</th>
                <th>CONTACT</th>
                <th>KYC</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-info">
                      <div className="avatar">{customer.name.charAt(0)}</div>
                      <div className="meta">
                        <p className="name">{customer.name}</p>
                        <p className="dob">{customer.dob}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="account-text">{customer.accountNo}</span></td>
                  <td>
                    <div className="contact-info">
                      <p className="email">{customer.email}</p>
                      <p className="phone">{customer.phone}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`badge kyc-${customer.kyc}`}>
                      {customer.kyc}
                    </span>
                  </td>
                  <td>
                    <span className={`badge status-${customer.status}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-icon-btn"><Eye size={18} /></button>
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

export default Customer;