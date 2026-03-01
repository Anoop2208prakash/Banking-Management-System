import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LuSearch, LuChevronRight } from 'react-icons/lu';
import './CustomerPages.scss';
import { LucideEdit, LucideUserCircle } from 'lucide-react';

const CustomerDirectory: React.FC = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch from FastAPI
    axios.get("http://127.0.0.1:5000/users/customers").then(res => setCustomers(res.data));
  }, []);

  const filtered = customers.filter((c: any) => c.fullName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="institutional-container">
      <div className="directory-header">
        <h1>Institutional Registry</h1>
        <div className="search-bar">
          <LuSearch />
          <input type="text" placeholder="Search by name or Aadhar..." onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="table-responsive">
        <table className="institutional-table">
          <thead>
            <tr><th>Client</th><th>Aadhar ID</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((client: any) => (
              <tr key={client.id}>
                <td>
                  <div className="client-info">
                    <LucideUserCircle /> {client.fullName}
                  </div>
                </td>
                <td>{client.aadharNo}</td>
                <td><span className="badge">{client.role}</span></td>
                <td className="actions">
                  <button onClick={() => window.location.href=`/update-customer/${client.id}`}><LucideEdit /></button>
                  <button onClick={() => window.location.href=`/profile/${client.id}`}><LuChevronRight /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDirectory;