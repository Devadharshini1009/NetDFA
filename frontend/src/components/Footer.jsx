import React from 'react';
import { Globe, GitBranch, Cpu, Network } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#ffffff',
        padding: '2.5rem 0 1.75rem',
        marginTop: '3.5rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {/* Column 1: Brand & Purpose */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
              >
                <Globe size={14} />
              </div>
              <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>
                Net<span style={{ color: 'var(--primary)' }}>DFA</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              An academic and professional DNS analysis platform integrating Full Stack Web Development, Computer Networks, and Formal Languages & Automata Theory.
            </p>
          </div>

          {/* Column 2: Academic Pillars */}
          <div>
            <h4
              style={{
                fontSize: '0.8rem',
                fontWeight: '700',
                color: 'var(--text-main)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
              }}
            >
              Academic Pillars
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                fontSize: '0.85rem',
                color: 'var(--text-body)',
              }}
            >
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Cpu size={14} color="var(--primary)" />
                <span><strong>FSWD:</strong> React 18, Express, Node.js, MongoDB</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Network size={14} color="var(--teal-accent)" />
                <span><strong>CN:</strong> Native OS Resolver, RFC 1035 Resource Records</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <GitBranch size={14} color="#6366f1" />
                <span><strong>FLAT:</strong> 4-State Deterministic Finite Automaton (M)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Standards */}
          <div>
            <h4
              style={{
                fontSize: '0.8rem',
                fontWeight: '700',
                color: 'var(--text-main)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
              }}
            >
              Specifications & RFCs
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span>• RFC 1034 — Concepts & Facilities</span>
              <span>• RFC 1035 — Implementation & Specification</span>
              <span>• RFC 1123 — Host Requirements & Labels</span>
              <span>• Chomsky Type-3 Regular Grammars</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-subtle)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            Domain Name Validation and DNS Lookup System • College Project
          </div>
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            System Status: Operational
          </div>
        </div>
      </div>
    </footer>
  );
};
