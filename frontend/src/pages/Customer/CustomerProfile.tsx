import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  LuUser, LuMail, LuPhone, LuShieldCheck, 
  LuHistory, LuArrowLeft, LuCreditCard 
} from 'react-icons/lu';
import VaultLoader from '../../components/VaultLoader';
import './CustomerPages.scss';

const CustomerProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        // Fetch user details and their linked accounts
        const res = await axios.get(`http://127.0.0.1:5000/users/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Profile decryption failed");
      } finally {
        setLoading(false);
      }
    };
    fetchFullProfile();
  }, [id]);

  if (loading) return <VaultLoader label="Decrypting Vault Identity..." />;

  return (
    <div className="institutional-container">
      <div className="profile-grid-layout">
        
        {/* --- 🛡️ Left: Identity Card --- */}
        <aside className="identity-sidebar">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <LuArrowLeft /> Registry
          </button>
          
          <div className="biometric-frame">
            {profile.user.clientSign ? (
              <img src={profile.user.clientSign} alt="KYC Signature" />
            ) : (
              <div className="placeholder-bio"><LuUser size={48} /></div>
            )}
          </div>

          <div className="identity-details">
            <h2>{profile.user.fullName}</h2>
            <span className="role-tag">{profile.user.role}</span>
            <hr className="divider" />
            <div className="detail-item">
              <LuMail /> <span>{profile.user.email}</span>
            </div>
            <div className="detail-item">
              <LuPhone /> <span>{profile.user.phone || "Not Linked"}</span>
            </div>
            <div className="detail-item">
              <LuShieldCheck className="text-emerald-400" /> 
              <span>Aadhar: {profile.user.aadharNo}</span>
            </div>
          </div>
        </aside>

        {/* --- 📊 Right: Ledger & Accounts --- */}
        <main className="ledger-main">
          <section className="account-overview">
            <h3>Active Institutional Accounts</h3>
            <div className="accounts-flex">
              {profile.accounts.map((acc: any) => (
                <motion.div key={acc.id} className="mini-vault-card" whileHover={{ scale: 1.02 }}>
                  <LuCreditCard className="card-icon" />
                  <div className="acc-info">
                    <p className="acc-num">{acc.accountNumber}</p>
                    <p className="acc-type">{acc.accountType}</p>
                  </div>
                  <h4 className="balance">₹{acc.balance.toLocaleString()}</h4>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="recent-activity">
            <div className="section-header">
              <LuHistory /> <h3>Recent Vault Operations</h3>
            </div>
            <table className="institutional-table">
              <thead>
                <tr><th>Date</th><th>Type</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {profile.transactions.slice(0, 5).map((tx: any) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td><span className={`tx-type ${tx.transactionType}`}>{tx.transactionType}</span></td>
                    <td className="amount">₹{tx.amount}</td>
                    <td><span className="status-dot"></span> Verified</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CustomerProfile;