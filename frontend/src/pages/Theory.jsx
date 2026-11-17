import React from 'react';
import { BookOpen, GitBranch, Network, Cpu, ShieldCheck } from 'lucide-react';

export const Theory = () => {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            color: 'var(--primary)',
            fontSize: '0.75rem',
            fontWeight: '600',
            fontFamily: 'var(--font-mono)',
            marginBottom: '0.65rem',
          }}
        >
          <BookOpen size={13} />
          <span>ACADEMIC FOUNDATION & INTERDISCIPLINARY DESIGN</span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Theory & System Architecture
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '780px', marginTop: '0.25rem' }}>
          Comprehensive documentation of the interdisciplinary intersection of Formal Languages & Automata Theory (FLAT), Computer Networks (CN), and Full Stack Web Development (FSWD).
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Section 1: Formal Languages & Automata Theory (FLAT) */}
        <div className="glass-panel" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: '#eef2ff', color: '#6366f1' }}>
              <GitBranch size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
                1. Formal Languages & Automata Theory (FLAT)
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#6366f1', fontFamily: 'var(--font-mono)' }}>
                Chomsky Type-3 Grammars & Deterministic Finite Automaton
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '1rem' }}>
            In theoretical computer science, a regular language is the simplest class of formal languages in the Chomsky hierarchy (Type-3). It is equivalently recognizable by regular expressions and decidable by a Deterministic Finite Automaton (DFA).
          </p>

          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
            A. Formal 5-Tuple Mathematical Model
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            The application workflow is strictly governed by a 4-state deterministic finite automaton:
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '0.85rem 1.15rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--text-main)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.4rem' }}>
              M = (Q, Σ, δ, q0, F)
            </div>
            <div style={{ color: 'var(--text-body)', fontSize: '0.8rem', lineHeight: '1.7' }}>
              • <strong>Q</strong> = {'{ S0: INPUT, S1: VALIDATION, S2: DNS_QUERY, S3: RESULT }'}<br />
              • <strong>Σ</strong> = {'{ SUBMIT_DOMAIN, SYNTAX_VALID, SYNTAX_INVALID, DNS_COMPLETE, DNS_ERROR, RESET }'}<br />
              • <strong>q0</strong> = S0 (Initial State)<br />
              • <strong>F</strong> = {'{ S3 }'} (Accepting State)
            </div>
          </div>

          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '1.25rem', marginBottom: '0.65rem' }}>
            B. Complete State Transition Table (δ)
          </h3>

          <div style={{ overflowX: 'auto', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Current State (q ∈ Q)</th>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Input Symbol (σ ∈ Σ)</th>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Next State δ(q, σ)</th>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Transition Semantic</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '600' }}>S0 (INPUT)</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>SUBMIT_DOMAIN</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: '#6366f1', fontWeight: '600' }}>S1 (VALIDATION)</td>
                  <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-body)' }}>User enters a domain name and requests resolution.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: '#6366f1', fontWeight: '600' }}>S1 (VALIDATION)</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--status-success)' }}>SYNTAX_VALID</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--teal-accent)', fontWeight: '600' }}>S2 (DNS_QUERY)</td>
                  <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-body)' }}>Domain satisfies all RFC 1035 lexical constraints and regex.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: '#6366f1', fontWeight: '600' }}>S1 (VALIDATION)</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--status-error)' }}>SYNTAX_INVALID</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '600' }}>S0 (INPUT)</td>
                  <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-body)' }}>Domain syntax invalid (e.g. consecutive dots, boundary hyphens). Resets to S0.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--teal-accent)', fontWeight: '600' }}>S2 (DNS_QUERY)</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--status-success)' }}>DNS_COMPLETE</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '600' }}>S3 (RESULT) [F]</td>
                  <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-body)' }}>OS resolver completes query for all 6 record types. Reaches accepting state.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--teal-accent)', fontWeight: '600' }}>S2 (DNS_QUERY)</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--status-error)' }}>DNS_ERROR</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '600' }}>S3 (RESULT) [F]</td>
                  <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-body)' }}>DNS returns NXDOMAIN or SERVFAIL (accurately treated as a valid result state).</td>
                </tr>
                <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '600' }}>S3 (RESULT)</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>RESET</td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '600' }}>S0 (INPUT)</td>
                  <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-body)' }}>User resets workbench to initiate a subsequent query cycle.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '1.25rem', marginBottom: '0.45rem' }}>
            C. RFC 1035 Regular Expression Grammar
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
            Domain names must conform to the formal regular expression:
          </p>
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--primary)',
              wordBreak: 'break-all',
            }}
          >
            /^(?!-)[A-Za-z0-9-]{'{'}1,63{'}'}(?&lt;!-)(\.(?!-)[A-Za-z0-9-]{'{'}1,63{'}'}(?&lt;!-))*\.[A-Za-z]{'{'}2,{'}'}$/
          </div>
        </div>

        {/* Section 2: Computer Networks (CN) */}
        <div className="glass-panel" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: 'var(--teal-light)', color: 'var(--teal-accent)' }}>
              <Network size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
                2. Computer Networks (CN) Integration
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--teal-accent)', fontFamily: 'var(--font-mono)' }}>
                DNS Protocol Architecture, Resource Records & Disambiguation
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '1rem' }}>
            The Domain Name System is a hierarchical, distributed database specified in RFC 1034 and RFC 1035. Rather than implementing an unverified custom recursive resolver, this platform interfaces directly with the host operating system's configured stub resolver via Node.js native <code>node:dns/promises</code>.
          </p>

          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
            A. Six Core Resource Record (RR) Types Supported
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-body)' }}>
            <li><strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>• A:</strong> 32-bit IPv4 address mapping (RFC 1035).</li>
            <li><strong style={{ color: '#6366f1', fontFamily: 'var(--font-mono)' }}>• AAAA:</strong> 128-bit IPv6 address mapping (RFC 3596).</li>
            <li><strong style={{ color: '#d97706', fontFamily: 'var(--font-mono)' }}>• MX:</strong> Mail delivery hostnames with integer priority weighting (RFC 5321).</li>
            <li><strong style={{ color: 'var(--teal-accent)', fontFamily: 'var(--font-mono)' }}>• NS:</strong> Authoritative name servers responsible for the domain zone.</li>
            <li><strong style={{ color: '#ec4899', fontFamily: 'var(--font-mono)' }}>• CNAME:</strong> Canonical name alias pointing to the canonical host.</li>
            <li><strong style={{ color: '#8b5cf6', fontFamily: 'var(--font-mono)' }}>• TXT:</strong> Arbitrary text records used for SPF, DKIM, and ownership verification.</li>
          </ul>

          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
            B. Error Taxonomy: NXDOMAIN vs. ENODATA
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.85rem',
              marginTop: '0.65rem',
            }}
          >
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.85rem 1rem', borderRadius: '6px' }}>
              <h4 style={{ color: 'var(--status-error)', fontSize: '0.85rem', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                NXDOMAIN (ENOTFOUND)
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                RCODE 3. The queried domain name does not exist in the authoritative zone hierarchy. The domain is unregistered or deleted.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.85rem 1rem', borderRadius: '6px' }}>
              <h4 style={{ color: 'var(--status-warning)', fontSize: '0.85rem', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                NODATA / ENODATA
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                RCODE 0 with an empty answer section. The domain exists and is active, but the queried record type (e.g. CNAME at apex or IPv6 AAAA) is not published.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Full Stack Web Development (FSWD) */}
        <div className="glass-panel" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Cpu size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
                3. Full Stack Web Development (FSWD) Integration
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                MERN Architecture: React 18, Node.js, Express, MongoDB
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '1rem' }}>
            The system applies modern full-stack web development principles:
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-body)' }}>
            <li>
              <strong style={{ color: 'var(--text-main)' }}>• RESTful API Endpoints:</strong> Clean HTTP interface adhering to JSON standards (<code>POST /api/dns/lookup</code>, <code>GET /api/dns/history</code>, <code>DELETE /api/dns/history/:id</code>, <code>GET /api/health</code>).
            </li>
            <li>
              <strong style={{ color: 'var(--text-main)' }}>• Sliding-Window Rate Limiting:</strong> In-memory sliding window limiter restricting requests per IP to mitigate query flooding attacks.
            </li>
            <li>
              <strong style={{ color: 'var(--text-main)' }}>• Non-blocking Graceful Degradation:</strong> Resilient MongoDB lifecycle with explicit offline state messaging—ensuring DNS lookups function in real-time even if database service is disconnected.
            </li>
            <li>
              <strong style={{ color: 'var(--text-main)' }}>• Modular UI Architecture:</strong> Single Page Application built on React 18 and Vite, with accessible typography, responsive grid layouts, and clean component separation.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
