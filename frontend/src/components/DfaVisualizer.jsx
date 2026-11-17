import React, { useState } from 'react';
import { GitBranch, Clock, ChevronDown, ChevronUp, ArrowRight, Check } from 'lucide-react';

export const DfaVisualizer = ({ currentState, transitions = [] }) => {
  const [showLog, setShowLog] = useState(false);

  // States definition
  const states = [
    { code: 'S0', name: 'INPUT', label: 'User Input', desc: 'Awaiting domain submission' },
    { code: 'S1', name: 'VALIDATION', label: 'Lexical Syntax', desc: 'RFC 1035 regex analysis' },
    { code: 'S2', name: 'DNS_QUERY', label: 'DNS Resolution', desc: 'Concurrent stub queries' },
    { code: 'S3', name: 'RESULT', label: 'Result Synthesis', desc: 'Output & audit logging', isAccepting: true },
  ];

  // Helper to determine active state code
  const activeCode = currentState?.code || (transitions.length > 0 ? transitions[transitions.length - 1].toState : 'S0');

  return (
    <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', backgroundColor: '#ffffff' }}>
      {/* Title & Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <GitBranch size={17} color="var(--primary)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              DFA State Machine Controller
            </h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Formal Model: <code style={{ color: 'var(--primary)', fontWeight: '600' }}>M = (Q, Σ, δ, q0, F)</code> — FLAT Process Orchestration
          </p>
        </div>

        <button
          className="btn btn-outline"
          onClick={() => setShowLog(!showLog)}
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
        >
          <Clock size={13} />
          <span>Transition Audit ({transitions.length})</span>
          {showLog ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Clean 4-State Pipeline Diagram */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          position: 'relative',
        }}
      >
        {states.map((st, idx) => {
          const isActive = activeCode === st.code;
          return (
            <div
              key={st.code}
              style={{
                backgroundColor: isActive ? 'var(--primary-light)' : 'var(--bg-secondary)',
                border: `${st.isAccepting ? '2px double' : '1px solid'} ${
                  isActive ? 'var(--primary)' : 'var(--border-subtle)'
                }`,
                borderRadius: '8px',
                padding: '0.9rem',
                position: 'relative',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 1px 3px 0 rgba(2, 132, 199, 0.15)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  }}
                >
                  {st.code}
                </span>

                {isActive && (
                  <span
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: '600',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    ACTIVE
                  </span>
                )}

                {!isActive && st.isAccepting && (
                  <span
                    style={{
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: '#ffffff',
                      color: 'var(--text-muted)',
                      fontSize: '0.65rem',
                      fontWeight: '600',
                      padding: '0.08rem 0.35rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    ACCEPTING (F)
                  </span>
                )}
              </div>

              <div style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                {st.name}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {st.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transition Log Collapsible Drawer */}
      {showLog && (
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.65rem' }}>
            <Clock size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-main)' }}>
              Execution Trace & Transition Sequence
            </span>
          </div>

          {transitions.length === 0 ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No state transitions executed yet. Machine resting at initial state S0.
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {transitions.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.75rem',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>
                      #{item.step || idx + 1}
                    </span>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                      {item.fromState ? `${item.fromState} → ${item.toState}` : `Initial ${item.toState}`}
                    </span>
                    <span
                      style={{
                        padding: '0.05rem 0.35rem',
                        backgroundColor: 'var(--primary-light)',
                        border: '1px solid var(--primary-border)',
                        color: 'var(--primary)',
                        borderRadius: '3px',
                        fontSize: '0.7rem',
                      }}
                    >
                      {item.symbol}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'none' }} className="trace-desc">
                      {item.description}
                    </span>
                  </div>

                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.7rem' }}>
                    {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 640px) {
          .trace-desc {
            display: inline !important;
          }
        }
      `}</style>
    </div>
  );
};
