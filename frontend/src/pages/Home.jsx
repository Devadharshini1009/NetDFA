import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Network, Cpu, GitBranch, ArrowRight, Activity, Clock, CheckCircle2 } from 'lucide-react';
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
        // Silently handle if DB is offline on initial load
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
  const successfulLookups = historyData.filter(h => h.dnsStatus === 'SUCCESS' || h.dnsStatus === 'PARTIAL').length;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <div
        className="glass-panel"
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '2.5rem',
          border: '1px solid rgba(0, 245, 212, 0.2)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(0, 245, 212, 0.1)',
            border: '1px solid rgba(0, 245, 212, 0.3)',
            color: 'var(--cyan-accent)',
            fontSize: '0.8rem',
            fontWeight: '700',
            fontFamily: 'var(--font-mono)',
            marginBottom: '1.25rem',
          }}
        >
          <Activity size={14} />
          <span>INTERDISCIPLINARY CAPSTONE PROJECT</span>
        </div>

        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
            maxWidth: '850px',
            margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #ffffff 40%, var(--cyan-accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Domain Name Validation & DNS Lookup Platform
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            maxWidth: '700px',
            margin: '0 auto 2rem',
            lineHeight: '1.6',
          }}
        >
          An end-to-end distributed system demonstrating formal lexical grammar analysis via Chomsky Type-3 regular expressions, state machine execution through a 4-state Deterministic Finite Automaton (DFA), and parallel DNS resource resolution.
        </p>

        {/* Quick Search Form */}
        <form
          onSubmit={handleQuickSubmit}
          style={{
            display: 'flex',
            maxWidth: '600px',
            margin: '0 auto',
            gap: '0.75rem',
            background: 'rgba(3, 7, 18, 0.8)',
            padding: '0.5rem',
            borderRadius: '12px',
            border: '1px solid var(--border-active)',
            boxShadow: '0 8px 30px rgba(0, 245, 212, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', color: 'var(--cyan-accent)' }}>
            <Search size={20} />
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
              fontSize: '1rem',
              fontFamily: 'var(--font-mono)',
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
            <span>Analyze</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Sample clickables */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', alignSelf: 'center' }}>Try samples:</span>
          {['google.com', 'amazon.in', 'example.org', 'cloudflare.com'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => navigate(`/workbench?domain=${sample}`)}
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--blue-accent)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.2rem 0.5rem',
                cursor: 'pointer',
              }}
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Counter & Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--cyan-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>TOTAL LOOKUPS LOGGED</span>
            <Clock size={18} color="var(--cyan-accent)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
            {totalLookups > 0 ? totalLookups : '0'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
            Historical queries recorded in MongoDB
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--blue-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>SUCCESSFUL RESOLUTIONS</span>
            <CheckCircle2 size={18} color="var(--blue-accent)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--blue-accent)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
            {successfulLookups > 0 ? successfulLookups : '0'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
            Authoritative DNS answers received
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #818cf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>SUPPORTED RR TYPES</span>
            <Network size={18} color="#818cf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#818cf8', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
            6 Records
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
            A, AAAA, MX, NS, CNAME, TXT in parallel
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>DFA CONTROLLER</span>
            <GitBranch size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
            4 States
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
            Deterministic transition tracking
          </div>
        </div>
      </div>

      {/* Academic Disciplines Grid */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main)', letterSpacing: '0.05em' }}>
        THREE-PILLAR CURRICULUM INTEGRATION
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(0, 245, 212, 0.1)', border: '1px solid var(--border-active)' }}>
              <Cpu size={22} color="var(--cyan-accent)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>Full Stack Web Dev (FSWD)</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)' }}>React 18 + Node + Express + Mongo</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Modern asynchronous REST API gateway built on Express.js with rate limiting, centralized error handling, and robust database persistence in MongoDB with Mongoose ODM. Reactive, cybersecurity-themed UI built with Vite and React hooks.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <Network size={22} color="var(--blue-accent)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>Computer Networks (CN)</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--blue-accent)', fontFamily: 'var(--font-mono)' }}>Native OS Stub Resolver</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            High-performance asynchronous querying of 6 Resource Record (RR) types via Node.js native <code>node:dns/promises</code>. Accurately disambiguates non-existent domains (NXDOMAIN / ENOTFOUND) from missing RR types (ENODATA), measuring precise latency in milliseconds.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(129, 140, 248, 0.1)', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
              <GitBranch size={22} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>Automata Theory (FLAT)</h3>
              <span style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>Deterministic Finite Automaton M</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Formally defined 5-tuple DFA <code>M = (Q, Σ, δ, q0, F)</code> controlling state lifecycle across input, validation, DNS query, and result synthesis. Strict transition table rejection protects against illegal state mutations with real-time UI telemetry.
          </p>
        </div>
      </div>

      {/* Recent Searches Section */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--blue-accent)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>RECENT DOMAIN LOOKUPS</h3>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          >
            <span>View All History</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Loading recent lookups...
          </div>
        ) : historyData.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.85rem', fontStyle: 'italic' }}>
            No searches recorded yet. Try entering a domain above to initialize telemetry!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {historyData.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/workbench?domain=${item.domain}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(3, 7, 18, 0.5)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--blue-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--cyan-accent)', fontSize: '0.95rem' }}>
                    {item.domain}
                  </span>
                  <StatusBadge status={item.dnsStatus} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                  <span>{item.executionTimeMs} ms</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <ArrowRight size={14} color="var(--blue-accent)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
