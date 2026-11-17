import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'SUCCESS':
        return {
          bg: '#ecfdf5',
          border: '#a7f3d0',
          text: '#059669',
          label: 'RESOLVED',
          icon: <CheckCircle2 size={13} />,
        };
      case 'PARTIAL':
        return {
          bg: '#f0f9ff',
          border: '#bae6fd',
          text: '#0284c7',
          label: 'ACTIVE (PARTIAL)',
          icon: <Info size={13} />,
        };
      case 'NXDOMAIN':
        return {
          bg: '#fef2f2',
          border: '#fecaca',
          text: '#dc2626',
          label: 'NXDOMAIN',
          icon: <XCircle size={13} />,
        };
      case 'NO_DATA':
        return {
          bg: '#fffbeb',
          border: '#fde68a',
          text: '#d97706',
          label: 'NO RR DATA',
          icon: <AlertTriangle size={13} />,
        };
      case 'SYNTAX_INVALID':
        return {
          bg: '#fff1f2',
          border: '#fecdd3',
          text: '#e11d48',
          label: 'SYNTAX ERROR',
          icon: <XCircle size={13} />,
        };
      case 'ERROR':
      default:
        return {
          bg: '#fef2f2',
          border: '#fecaca',
          text: '#dc2626',
          label: status || 'ERROR',
          icon: <AlertTriangle size={13} />,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        letterSpacing: '0.02em',
        fontFamily: 'var(--font-mono)',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
      }}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
