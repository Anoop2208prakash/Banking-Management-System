import React, { useEffect, useState } from 'react';
import { LuTerminal } from 'react-icons/lu';
import './EnvDebugger.scss';
import { LucideAlertTriangle } from 'lucide-react';

const EnvDebugger: React.FC = () => {
  const [issues, setIssues] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const requiredVars = [
      'VITE_EMAILJS_SERVICE_ID',
      'VITE_EMAILJS_TEMPLATE_ID',
      'VITE_EMAILJS_PUBLIC_KEY'
    ];

    // 🛡️ Bypass strict typing to check for existence
    const env = (import.meta as any).env;
    const missing = requiredVars.filter(v => !env || !env[v]);
    
    setIssues(missing);
    
    if (missing.length > 0) {
      console.error("🚨 Institutional Vault Error: Missing Environment Variables", missing);
    }
  }, []);

  if (issues.length === 0) return null;

  return (
    <div className={`env-debug-terminal ${isOpen ? 'expanded' : 'collapsed'}`}>
      <div className="terminal-header" onClick={() => setIsOpen(!isOpen)}>
        <LuTerminal size={14} />
        <span>Vault Integrity Check: {issues.length} Critical Issues</span>
        <LucideAlertTriangle className="blink-icon" size={14} />
      </div>
      
      {isOpen && (
        <div className="terminal-body">
          <p className="error-text">ERR: Authentication tokens not found in .env</p>
          <ul>
            {issues.map(issue => (
              <li key={issue}>[MISSING] {issue}</li>
            ))}
          </ul>
          <div className="instruction">
            Action: Restart Vite server after updating .env file.
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvDebugger;