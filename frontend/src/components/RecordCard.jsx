import React, { useState } from 'react';
import { Copy, Check, Server, Globe, Mail, Hash, ArrowRight, FileText } from 'lucide-react';

export const RecordCard = ({ type, data, errorInfo }) => {
  const [copied, setCopied] = useState(false);

  const getCardIcon = () => {
    switch (type) {
      case 'A': return <Server size={16} color="var(--primary)" />;
      case 'AAAA': return <Globe size={16} color="#6366f1" />;
      case 'MX': return <Mail size={16} color="#d97706" />;
      case 'NS': return <Hash size={16} color="var(--teal-accent)" />;
      case 'CNAME': return <ArrowRight size={16} color="#ec4899" />;
      case 'TXT': return <FileText size={16} color="#8b5cf6" />;
      default: return <Server size={16} />;
    }
  };

  const getRecordTitle = () => {
    switch (type) {
      case 'A': return 'IPv4 Host Address';
      case 'AAAA': return 'IPv6 Host Address';
      case 'MX': return 'Mail Exchange Servers';
      case 'NS': return 'Authoritative Name Servers';
      case 'CNAME': return 'Canonical Name Alias';
      case 'TXT': return 'Text & Verification Records';
      default: return `${type} Records`;
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
        minHeight: '170px',
        backgroundColor: '#ffffff',
      }}
    >
      <div>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getCardIcon()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    color: 'var(--text-main)',
                  }}
                >
                  {type}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {getRecordTitle()}
                </span>
              </div>
            </div>
          </div>

          {isAvailable && (
            <button
              onClick={handleCopy}
              className="btn btn-outline"
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                borderRadius: '4px',
              }}
              title="Copy Record Data"
            >
              {copied ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        {/* Record Values Content */}
        {isAvailable ? (
          <div style={{ marginTop: '0.35rem' }}>
            {type === 'MX' && Array.isArray(data) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {data.map((mx, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '5px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-main)', wordBreak: 'break-all' }}>
                      {mx.exchange}
                    </span>
                    <span
                      style={{
                        color: '#b45309',
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fde68a',
                        padding: '0.05rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        marginLeft: '0.5rem',
                      }}
                    >
                      Priority {mx.priority}
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
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '5px',
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
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '5px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
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
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '6px',
              border: '1px dashed var(--border-subtle)',
              marginTop: '0.35rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              {errorInfo?.reason || `No ${type} record published for this domain (ENODATA).`}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div
        style={{
          marginTop: '0.85rem',
          paddingTop: '0.55rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)' }}>Type {type}</span>
        <span>
          {isAvailable ? (
            <span style={{ color: 'var(--status-success)', fontWeight: '600' }}>
              ● {Array.isArray(data) ? `${data.length} ${data.length === 1 ? 'entry' : 'entries'}` : 'Available'}
            </span>
          ) : (
            <span style={{ color: 'var(--text-subtle)' }}>○ Not Published</span>
          )}
        </span>
      </div>
    </div>
  );
};
