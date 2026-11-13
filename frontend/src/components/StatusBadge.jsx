import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'SUCCESS':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.4)',
          text: '#10b981',
          label: 'SUCCESS',
          icon: <CheckCircle2 size={14} />,
        };
      case 'PARTIAL':
        return {
          bg: 'rgba(56, 189, 248, 0.15)',
          border: 'rgba(56, 189, 248, 0.4)',
          text: '#38bdf8',
          label: 'PARTIAL (ACTIVE)',
          icon: <Info size={14} />,
        };
      case 'NXDOMAIN':
        return {
          bg: 'rgba(244, 63, 94, 0.15)',
          border: 'rgba(244, 63, 94, 0.4)',
          text: '#f43f5e',
          label: 'NXDOMAIN (NOT FOUND)',
          icon: <XCircle size={14} />,
        };
      case 'NO_DATA':
        return {
          bg: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.4)',
          text: '#f59e0b',
          label: 'NO RR DATA',
          icon: <AlertTriangle size={14} />,
        };
      case 'SYNTAX_INVALID':
        return {
          bg: 'rgba(244, 63, 94, 0.15)',
          border: 'rgba(244, 63, 94, 0.4)',
          text: '#f43f5e',
          label: 'SYNTAX INVALID',
          icon: <XCircle size={14} />,
        };
      case 'ERROR':
      default:
        return {
          bg: 'rgba(244, 63, 94, 0.15)',
          border: 'rgba(244, 63, 94, 0.4)',
          text: '#f43f5e',
          label: status || 'ERROR',
          icon: <AlertTriangle size={14} />,
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
        padding: '0.25rem 0.65rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '0.05em',
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
