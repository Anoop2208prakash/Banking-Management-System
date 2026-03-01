import React, { useState } from 'react';
import axios from 'axios';
import './CustomerPages.scss';
import { LucideUploadCloud } from 'lucide-react';

const KYCUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      // ☁️ Direct Cloudinary Upload
      await axios.patch("http://127.0.0.1:5000/users/kyc-sync", formData);
      alert("Biometric Signature Synced.");
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  return (
    <div className="kyc-dropzone">
      <div className="upload-box">
        <LucideUploadCloud size={48} />
        <h3>KYC Biometric Sync</h3>
        <p>Upload digital signature or Aadhar scan</p>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Syncing..." : "Commit to Vault"}
        </button>
      </div>
    </div>
  );
};

export default KYCUpload;