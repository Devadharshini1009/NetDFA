import React from 'react';
import { BookOpen, GitBranch, Network, Cpu, Shield, Layers, Hash } from 'lucide-react';

export const Theory = () => {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: 'var(--blue-accent)',
            fontSize: '0.75rem',
            fontWeight: '700',
            fontFamily: 'var(--font-mono)',
            marginBottom: '0.75rem',
          }}
        >
          <BookOpen size={13} />
          <span>ACADEMIC FOUNDATION & INTERDISCIPLINARY DESIGN</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Theory & System Architecture
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '800px', marginTop: '0.5rem' }}>
          Comprehensive documentation of the interdisciplinary intersection of Formal Languages & Automata Theory (FLAT), Computer Networks (CN), and Full Stack Web Development (FSWD).
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Section 1: Formal Languages & Automata Theory (FLAT) */}
        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #818cf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(129, 140, 248, 0.15)' }}>
              <GitBranch size={22} color="#818cf8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>
                1. Formal Languages & Automata Theory (FLAT) Integration
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                Chomsky Type-3 Grammars & Deterministic Finite Automaton
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
            In theoretical computer science, a regular language is the simplest class of formal languages in the Chomsky hierarchy (Type-3). It can be equivalently described by a regular expression and decided by a Deterministic Finite Automaton (DFA).
          </p>

          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
            A. Formal 5-Tuple DFA Specification
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            The application workflow is strictly governed by a 4-state deterministic automaton:
          </p>

          <div
            style={{
              background: 'rgba(3, 7, 18, 0.8)',
              padding: '1rem 1.25rem',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              color: 'var(--cyan-accent)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem',
            }}
          >
            M = (Q, Σ, δ, q0, F)
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              • Q = {'{ S0: INPUT, S1: VALIDATION, S2: DNS_QUERY, S3: RESULT }'}<br />
              • Σ = {'{ SUBMIT_DOMAIN, SYNTAX_VALID, SYNTAX_INVALID, DNS_COMPLETE, DNS_ERROR, RESET }'}<br />
              • q0 = S0 (Initial State)<br />
              • F = {'{ S3 }'} (Accepting State)
            </div>
          </div>

          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '1.25rem', marginBottom: '0.75rem' }}>
            B. Complete State Transition Table (δ)
          </h3>

          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(11, 19, 43, 0.8)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>CURRENT STATE (q ∈ Q)</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>INPUT SYMBOL (σ ∈ Σ)</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>NEXT STATE δ(q, σ)</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>TRANSITION DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-accent)', fontWeight: '700' }}>S0 (INPUT)</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--blue-accent)' }}>SUBMIT_DOMAIN</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: '#818cf8', fontWeight: '700' }}>S1 (VALIDATION)</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>User enters a domain name and requests resolution.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: '#818cf8', fontWeight: '700' }}>S1 (VALIDATION)</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: '#10b981' }}>SYNTAX_VALID</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: '700' }}>S2 (DNS_QUERY)</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Domain passes all RFC 1035 lexical constraints and regex.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: '#818cf8', fontWeight: '700' }}>S1 (VALIDATION)</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: '#f43f5e' }}>SYNTAX_INVALID</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-accent)', fontWeight: '700' }}>S0 (INPUT)</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Domain violates syntax (e.g. consecutive dots, hyphen boundary). Returns to input.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: '700' }}>S2 (DNS_QUERY)</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: '#10b981' }}>DNS_COMPLETE</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-accent)', fontWeight: '700' }}>S3 (RESULT) [F]</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>OS resolver completes query for all 6 record types. Accepting state reached.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: '700' }}>S2 (DNS_QUERY)</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: '#f43f5e' }}>DNS_ERROR</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-accent)', fontWeight: '700' }}>S3 (RESULT) [F]</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>DNS resolver returns NXDOMAIN, SERVFAIL, or timeout. (Treated as a valid result).</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-accent)', fontWeight: '700' }}>S3 (RESULT)</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>RESET</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-accent)', fontWeight: '700' }}>S0 (INPUT)</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>User or client clears workbench to initiate a subsequent query.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
            C. RFC 1035 Regular Expression Grammar
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Domain names must conform to the formal regular expression:
          </p>
          <div
            style={{
              background: 'rgba(3, 7, 18, 0.8)',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--blue-accent)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            /^(?!-)[A-Za-z0-9-]{'{'}1,63{'}'}(?&lt;!-)(\.(?!-)[A-Za-z0-9-]{'{'}1,63{'}'}(?&lt;!-))*\.[A-Za-z]{'{'}2,{'}'}$/
          </div>
        </div>

        {/* Section 2: Computer Networks (CN) */}
        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--blue-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)' }}>
              <Network size={22} color="var(--blue-accent)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>
                2. Computer Networks (CN) Integration
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--blue-accent)', fontFamily: 'var(--font-mono)' }}>
                DNS Protocol Architecture, Resource Records & Disambiguation
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
            The Domain Name System is a hierarchical distributed database designed according to RFC 1034 and RFC 1035. Rather than implementing an unverified custom recursive resolver, this platform integrates directly with the host operating system's configured stub resolver via Node.js native <code>node:dns/promises</code>.
          </p>

          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
            A. Six Core Resource Record (RR) Types Supported
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <li><strong style={{ color: 'var(--cyan-accent)' }}>1. A (Address):</strong> 32-bit IPv4 address mapping (RFC 1035).</li>
            <li><strong style={{ color: '#818cf8)' }}>2. AAAA (IPv6 Address):</strong> 128-bit IPv6 address mapping (RFC 3596).</li>
            <li><strong style={{ color: '#f59e0b' }}>3. MX (Mail Exchange):</strong> Mail delivery servers with integer priority weighting (RFC 5321).</li>
            <li><strong style={{ color: 'var(--blue-accent)' }}>4. NS (Name Server):</strong> Authoritative name servers responsible for the DNS zone.</li>
            <li><strong style={{ color: '#ec4899' }}>5. CNAME (Canonical Name):</strong> Alias pointing to the canonical domain name.</li>
            <li><strong style={{ color: '#a855f7' }}>6. TXT (Text):</strong> Arbitrary human/machine-readable text used for SPF, DKIM, and site ownership.</li>
          </ul>

          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            B. DNS Error Taxonomy: NXDOMAIN vs. ENODATA
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              marginTop: '0.75rem',
            }}
          >
            <div style={{ background: 'rgba(3, 7, 18, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ color: '#f43f5e', fontSize: '0.9rem', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                NXDOMAIN (ENOTFOUND)
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                RCODE 3. The queried domain name does not exist within the authoritative zone hierarchy. The domain itself is unregistered or deleted.
              </p>
            </div>

            <div style={{ background: 'rgba(3, 7, 18, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                NODATA / ENODATA
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                RCODE 0 with an empty answer section. The domain exists and is valid, but the specific record type queried (e.g. CNAME on an apex domain or IPv6 on an IPv4-only host) is not published.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Full Stack Web Development (FSWD) */}
        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--cyan-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(0, 245, 212, 0.15)' }}>
              <Cpu size={22} color="var(--cyan-accent)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>
                3. Full Stack Web Development (FSWD) Integration
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)' }}>
                MERN-adjacent Architecture: React 18, Node.js, Express, MongoDB
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
            The system demonstrates production-grade full-stack architecture principles:
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <li>
              <strong style={{ color: 'var(--text-main)' }}>• RESTful API Endpoints:</strong> Clean HTTP interface adhering to JSON standards (<code>POST /api/dns/lookup</code>, <code>GET /api/dns/history</code>, <code>DELETE /api/dns/history/:id</code>, <code>GET /api/health</code>).
            </li>
            <li>
              <strong style={{ color: 'var(--text-main)' }}>• Rate Limiting & Protection:</strong> In-memory sliding window limiter restricting requests per IP to mitigate query flooding attacks.
            </li>
            <li>
              <strong style={{ color: 'var(--text-main)' }}>• Graceful Database Degradation:</strong> Non-blocking MongoDB connection lifecycle with explicit offline state messaging—ensuring DNS resolutions work seamlessly even when database service is down, without falsely pretending data was saved.
            </li>
            <li>
              <strong style={{ color: 'var(--text-main)' }}>• Reactive Component Architecture:</strong> Modular UI components in React 18 leveraging state hooks, responsive styling, and accessible WCAG contrast standards.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
