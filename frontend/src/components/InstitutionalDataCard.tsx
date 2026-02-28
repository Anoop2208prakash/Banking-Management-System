// src/components/InstitutionalDataCard.tsx
import React from 'react';
// import { LuInfo, LuShieldCheck, LuAlertTriangle, LuCheckCircle2 } from 'react-icons/lu'; // Modern Lucide icons
import './InstitutionalDataCard.scss';

// Type definition for a single data field
export type DataField = {
  label: string;
  value: string | number;
  type?: 'text' | 'tag' | 'icon-tag'; // Special handling for tags/icons
  icon?: React.ReactNode;
};

interface InstitutionalDataCardProps {
  title?: string;
  icon?: React.ReactNode;
  fields: DataField[];
}

const InstitutionalDataCard: React.FC<InstitutionalDataCardProps> = ({ title, icon, fields }) => {
  return (
    <div className="institutional-data-card">
      {(title || icon) && (
        <div className="card-header-minimal">
          {icon && <span className="header-icon">{icon}</span>}
          {title && <h3 className="header-title">{title}</h3>}
        </div>
      )}

      <div className="card-body-grid">
        {fields.map((field, index) => (
          <div key={`${field.label}-${index}`} className="data-field">
            <span className="data-label">{field.label}</span>

            {/* Render based on field type */}
            {field.type === 'tag' && (
              <span className={`data-tag ${field.value.toString().toLowerCase()}`}>
                {field.value}
              </span>
            )}
            
            {field.type === 'icon-tag' && (
              <span className={`data-tag-icon ${field.value.toString().toLowerCase()}`}>
                {field.icon}
                <span>{field.value}</span>
              </span>
            )}
            
            {(!field.type || field.type === 'text') && (
              <span className="data-value">{field.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstitutionalDataCard;