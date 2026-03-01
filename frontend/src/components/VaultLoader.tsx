import React from 'react';
import { motion } from 'framer-motion';
import './VaultLoader.scss';

interface VaultLoaderProps {
  size?: number;
  label?: string;
}

const VaultLoader: React.FC<VaultLoaderProps> = ({ size = 60, label = "Synchronizing Ledger..." }) => {
  return (
    <div className="vault-loader-container">
      <div className="loader-relative" style={{ width: size, height: size }}>
        {/* Outer Pulsing Ring */}
        <motion.div
          className="outer-ring"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Main Rotating Spinner */}
        <motion.div
          className="main-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center Static Shield */}
        <div className="inner-dot" />
      </div>
      {label && <p className="loader-label">{label}</p>}
    </div>
  );
};

export default VaultLoader;