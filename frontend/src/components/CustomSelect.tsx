// src/components/CustomSelect.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './CustomSelect.scss';

interface Option {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string | number;
  onChange: (value: any) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(opt => opt.value === value)?.label || "Select";

  return (
    <div className="custom-select-container">
      <label className="select-label">{label}</label>
      <div className={`select-trigger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedLabel}</span>
        <ChevronDown size={16} className={`icon ${isOpen ? 'rotate' : ''}`} />
      </div>

      {isOpen && (
        <div className="select-dropdown glass-panel">
          {options.map((option) => (
            <div 
              key={option.value} 
              className={`select-item ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;