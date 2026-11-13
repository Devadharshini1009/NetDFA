import React from 'react';
import { Shield, GitBranch, Cpu, Network } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(3, 7, 18, 0.95)',
        padding: '2.5rem 0 1.5rem',
        marginTop: '4rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Shield size={20} color="var(--cyan-accent)" />
              <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                Net<span style={{ color: 'var(--cyan-accent)' }}>DFA</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              An interdisciplinary computer science project combining Full Stack Web Development, Computer Networks, and Formal Languages & Automata Theory into an enterprise-grade DNS research platform.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              ACADEMIC PILLARS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={14} color="var(--cyan-accent)" />
                <span><strong>FSWD:</strong> React 18, Node.js, Express, MongoDB</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Network size={14} color="var(--blue-accent)" />
                <span><strong>CN:</strong> Native OS Stub Resolver, RFC 1035 RRs</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GitBranch size={14} color="#818cf8" />
                <span><strong>FLAT:</strong> Deterministic Finite Automaton (DFA) M</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              DNS STANDARDS & SPECIFICATIONS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
              <span>• RFC 1034: Domain Concepts and Facilities</span>
              <span>• RFC 1035: Implementation and Specification</span>
              <span>• RFC 1123: Host Requirements & Label Rules</span>
              <span>• Chomsky Type-3 Regular Grammars</span>
            </div>
          </div>
        </div>

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
            gap: '1rem',
          }}
        >
          <div>
            College Interdisciplinary Project — Domain Name Validation and DNS Lookup Tool
          </div>
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            Status: Production Ready • OS Resolver Active
          </div>
        </div>
      </div>
    </footer>
  );
};
