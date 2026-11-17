import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Network, Cpu, GitBranch, Clock, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import { fetchHistoryApi } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const Home = () => {
  const [quickDomain, setQuickDomain] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const res = await fetchHistoryApi(5);
        if (res?.data) {
          setHistoryData(res.data);
        }
      } catch (err) {
        // Handled silently if DB is offline on initial load
      } finally {
        setLoading(false);
      }
    };
    loadRecent();
  }, []);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickDomain.trim()) {
      navigate(`/workbench?domain=${encodeURIComponent(quickDomain.trim())}`);
    }
  };

  const totalLookups = historyData.length;
  const successfulLookups = historyData.filter(
    (h) => h.dnsStatus === 'SUCCESS' || h.dnsStatus === 'PARTIAL'
  ).length;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      {/* Hero Section */}
      <div
        className="glass-panel"
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            color: 'var(--primary)',
            fontSize: '0.75rem',
            fontWeight: '600',
            fontFamily: 'var(--font-mono)',
            marginBottom: '1rem',
          }}
        >
          <ShieldCheck size={14} />
          <span>INTERDISCIPLINARY CAPSTONE PROJECT</span>
        </div>

        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            maxWidth: '780px',
            margin: '0 auto 0.75rem',
            letterSpacing: '-0.025em',
            lineHeight: '1.2',
          }}
        >
          Domain Name Validation & DNS Inspection Platform
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            maxWidth: '650px',
            margin: '0 auto 2rem',
            lineHeight: '1.6',
          }}
        >
          A minimalist, production-grade DNS tool combining RFC 1035 lexical verification, a formal 4-state Deterministic Finite Automaton (DFA), and native OS stub resolver queries.
        </p>

        {/* Clean Hero Search Input */}
        <form
          onSubmit={handleQuickSubmit}
          style={{
            display: 'flex',
            maxWidth: '560px',
            margin: '0 auto',
            gap: '0.5rem',
            backgroundColor: '#ffffff',
            padding: '0.35rem',
            borderRadius: '8px',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '0.65rem',
              color: 'var(--text-muted)',
            }}
          >
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Enter domain (e.g. google.com, amazon.in, example.org)..."
            value={quickDomain}
            onChange={(e) => setQuickDomain(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.5rem 0.25rem',
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem' }}>
            <span>Lookup</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Quick Sample Links */}
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Sample queries:</span>
          {['google.com', 'amazon.in', 'example.org', 'cloudflare.com'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => navigate(`/workbench?domain=${sample}`)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                color: 'var(--primary)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.15rem 0.45rem',
                cursor: 'pointer',
              }}
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Historical Queries
            </span>
            <Clock size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
            {totalLookups}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>
            Audited in persistence database
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Resolutions
            </span>
            <CheckCircle2 size={16} color="var(--status-success)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
            {successfulLookups}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>
            Authoritative DNS answers
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Resource Records
            </span>
            <Network size={16} color="var(--teal-accent)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
            6 Types
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>
            A, AAAA, MX, NS, CNAME, TXT
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              DFA Automaton
            </span>
            <GitBranch size={16} color="#6366f1" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
            4 States
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>
            Deterministic state transitions
          </div>
        </div>
      </div>

      {/* Academic Highlights Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.85rem' }}>
          Core Academic Foundations
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* Card 1: FSWD */}
          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Cpu size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Full Stack Web Development</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>React 18 + Node.js + Express + MongoDB</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: '1.55' }}>
              REST API architecture with rate limiting, centralized error handling, and robust persistence with non-blocking offline database degradation.
            </p>
          </div>

          {/* Card 2: Computer Networks */}
          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: 'var(--teal-light)', color: 'var(--teal-accent)' }}>
                <Network size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Computer Networks</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Native OS Stub Resolver</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: '1.55' }}>
              Parallel query execution via Node.js <code>node:dns/promises</code>. Accurately distinguishes non-existent domains (NXDOMAIN) from unpublished records (ENODATA).
            </p>
          </div>

          {/* Card 3: Automata Theory */}
          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: '#eef2ff', color: '#6366f1' }}>
                <GitBranch size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Formal Languages & Automata</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Deterministic Finite Automaton M</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: '1.55' }}>
              5-tuple DFA <code>M = (Q, Σ, δ, q0, F)</code> controlling state transitions from input to validation, DNS resolution, and accepting result synthesis.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Lookups Section */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Recent Lookups
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Latest queries processed through the system
            </p>
          </div>

          <button
            onClick={() => navigate('/history')}
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
          >
            <span>View All</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Loading recent lookups...
          </div>
        ) : historyData.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
            No recent searches logged yet. Enter a domain above to perform your first query.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {historyData.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/workbench?domain=${item.domain}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    {item.domain}
                  </span>
                  <StatusBadge status={item.dnsStatus} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{item.executionTimeMs} ms</span>
                  <span style={{ display: 'none' }} className="date-span">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <ArrowRight size={14} color="var(--primary)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .date-span {
            display: inline !important;
          }
        }
      `}</style>
    </div>
  );
};
