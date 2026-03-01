import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import './InstitutionalAlert.scss';
import { LucideAlertTriangle, LucideCheckCircle2, LucideInfo, LucideXCircle } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface InstitutionalAlertProps {
  message: string;
  type?: AlertType;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: number;
}

const InstitutionalAlert: React.FC<InstitutionalAlertProps> = ({ 
  message, 
  type = 'info', 
  isVisible, 
  onClose, 
  autoClose = 5000 
}) => {

  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, onClose]);

  const icons = {
    success: <LucideCheckCircle2 size={20} />,
    error: <LucideXCircle size={20} />,
    warning: <LucideAlertTriangle size={20} />,
    info: <LucideInfo size={20} />
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`outlined-alert-box ${type}`}
        >
          <div className="alert-flex">
            <div className="alert-icon-wrapper">
              {icons[type]}
            </div>
            <p className="alert-text-content">{message}</p>
            <button className="alert-dismiss-btn" onClick={onClose}>
              <LucideXCircle size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstitutionalAlert;