import React, { useState } from 'react';
import { Copy, Check, Server, Mail, Globe, Hash, FileText, ArrowRight } from 'lucide-react';

export const RecordCard = ({ type, data, errorInfo }) => {
  const [copied, setCopied] = useState(false);

  const getCardIcon = () => {
    switch (type) {
      case 'A': return <Server size={18} color="var(--cyan-accent)" />;
      case 'AAAA': return <Globe size={18} color="#818cf8" />;
      case 'MX': return <Mail size={18} color="#f59e0b" />;
      case 'NS': return <Hash size={18} color="var(--blue-accent)" />;
      case 'CNAME': return <ArrowRight size={18} color="#ec4899" />;
      case 'TXT': return <FileText size={18} color="#a855f7" />;
      default: return <Server size={18} />;
    }
  };

  const getRecordTitle = () => {
    switch (type) {
      case 'A': return 'A Record — IPv4 Host Address';
      case 'AAAA': return 'AAAA Record — IPv6 Host Address';
      case 'MX': return 'MX Record — Mail Exchange Servers';
      case 'NS': return 'NS Record — Authoritative Name Servers';
      case 'CNAME': return 'CNAME Record — Canonical Name Alias';
      case 'TXT': return 'TXT Record — Text / SPF / DKIM Verification';
      default: return `${type} Record`;
    }
  };

  const handleCopy = () => {
    if (!data) return;
    const textToCopy = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAvailable = Boolean(data && (!Array.isArray(data) || data.length > 0));

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '160px',
        borderLeft: `4px solid ${isAvailable ? 'var(--cyan-accent)' : 'var(--border-subtle)'}`,
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {getCardIcon()}
            <div>
              <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {type}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                {getRecordTitle().split('—')[1]}
              </span>
            </div>
          </div>

          {isAvailable && (
            <button
              onClick={handleCopy}
              className="btn btn-outline"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              title="Copy Record Data"
            >
              {copied ? <Check size={13} color="var(--cyan-accent)" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        {/* Content Section */}
        {isAvailable ? (
          <div style={{ marginTop: '0.5rem' }}>
            {type === 'MX' && Array.isArray(data) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {data.map((mx, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(3, 7, 18, 0.5)',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-main)' }}>{mx.exchange}</span>
                    <span
                      style={{
                        color: '#f59e0b',
                        background: 'rgba(245, 158, 11, 0.1)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                      }}
                    >
                      Priority: {mx.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : Array.isArray(data) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {data.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(3, 7, 18, 0.5)',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--text-main)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {String(item)}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(3, 7, 18, 0.5)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  wordBreak: 'break-all',
                }}
              >
                {String(data)}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(11, 19, 43, 0.3)',
              borderRadius: '6px',
              border: '1px dashed var(--border-subtle)',
              marginTop: '0.5rem',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
              {errorInfo?.reason || `No ${type} record found for this domain (ENODATA).`}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-subtle)',
        }}
      >
        <span>Type: {type}</span>
        <span>
          {isAvailable ? (
            <span style={{ color: 'var(--cyan-accent)', fontWeight: '600' }}>
              ● {Array.isArray(data) ? `${data.length} entries` : 'Available'}
            </span>
          ) : (
            <span style={{ color: 'var(--text-subtle)' }}>○ Not Published</span>
          )}
        </span>
      </div>
    </div>
  );
};
