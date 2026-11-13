import React, { useState } from 'react';
import { Activity, Clock, Terminal, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const DfaVisualizer = ({ currentState, transitions = [] }) => {
  const [showLog, setShowLog] = useState(false);

  // States definition
  const states = [
    { code: 'S0', name: 'INPUT', label: 'S0: User Input', desc: 'Awaiting domain submission' },
    { code: 'S1', name: 'VALIDATION', label: 'S1: Lexical Check', desc: 'RFC 1035 regex analysis' },
    { code: 'S2', name: 'DNS_QUERY', label: 'S2: DNS Query', desc: 'Concurrent stub resolution' },
    { code: 'S3', name: 'RESULT', label: 'S3: Results (F)', desc: 'Telemetry & synthesis', isAccepting: true },
  ];

  // Helper to check if state is active
  const activeCode = currentState?.code || (transitions.length > 0 ? transitions[transitions.length - 1].toState : 'S0');

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--cyan-accent)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-main)' }}>
              DETERMINISTIC FINITE AUTOMATON (DFA) STATE TRACKER
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Formal Automata Model: <code>M = (Q, Σ, δ, q0, F)</code> — FLAT Integration
          </p>
        </div>

        <button
          className="btn btn-outline"
          onClick={() => setShowLog(!showLog)}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
        >
          <Clock size={14} />
          <span>Transition Log ({transitions.length})</span>
          {showLog ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* DFA Nodes Diagram */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          position: 'relative',
        }}
      >
        {states.map((st, idx) => {
          const isActive = activeCode === st.code;
          return (
            <div
              key={st.code}
              style={{
                background: isActive ? 'rgba(0, 245, 212, 0.08)' : 'rgba(11, 19, 43, 0.4)',
                border: `2px ${st.isAccepting ? 'double' : 'solid'} ${
                  isActive ? 'var(--cyan-accent)' : 'rgba(56, 189, 248, 0.2)'
                }`,
                borderRadius: '10px',
                padding: '1rem',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 0 15px rgba(0, 245, 212, 0.3)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '800',
                    fontSize: '1rem',
                    color: isActive ? 'var(--cyan-accent)' : 'var(--blue-accent)',
                  }}
                >
                  {st.code}
                </span>

                {isActive && (
                  <span
                    style={{
                      background: 'var(--cyan-accent)',
                      color: '#030712',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    ACTIVE STATE
                  </span>
                )}

                {!isActive && st.isAccepting && (
                  <span
                    style={{
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-subtle)',
                      fontSize: '0.65rem',
                      fontWeight: '600',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    ACCEPTING (F)
                  </span>
                )}
              </div>

              <div style={{ marginTop: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {st.name}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
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
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <Terminal size={15} color="var(--blue-accent)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--blue-accent)' }}>
              STATE TRANSITION AUDIT TRAIL
            </span>
          </div>

          {transitions.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              No state transitions executed yet. Machine resting at initial state S0.
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxHeight: '220px',
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
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(3, 7, 18, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: 'var(--cyan-accent)', fontWeight: '700' }}>
                      #{item.step || idx + 1}
                    </span>
                    <span style={{ color: 'var(--text-main)' }}>
                      {item.fromState ? `${item.fromState} → ${item.toState}` : `Initial: ${item.toState}`}
                    </span>
                    <span
                      style={{
                        padding: '0.1rem 0.4rem',
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: 'var(--blue-accent)',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                      }}
                    >
                      {item.symbol}
                    </span>
                  </div>

                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                    {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
