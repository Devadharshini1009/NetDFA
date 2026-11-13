import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, AlertCircle, CheckCircle, RefreshCw, Terminal, Clock, ShieldCheck, Database, FileCode } from 'lucide-react';
import { lookupDomainApi } from '../services/api';
import { validateClientDomain } from '../utils/domainValidator';
import { DfaVisualizer } from '../components/DfaVisualizer';
import { RecordCard } from '../components/RecordCard';
import { StatusBadge } from '../components/StatusBadge';

export const Workbench = () => {
  const [searchParams] = useSearchParams();
  const [domainInput, setDomainInput] = useState('');
  const [clientError, setClientError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  // Real-time DFA state tracking
  const [dfaState, setDfaState] = useState({ code: 'S0', name: 'INPUT', label: 'S0 – INPUT' });
  const [dfaTransitions, setDfaTransitions] = useState([]);

  // Check URL query parameters
  useEffect(() => {
    const queryDomain = searchParams.get('domain');
    if (queryDomain) {
      setDomainInput(queryDomain);
      executeLookup(queryDomain);
    }
  }, [searchParams]);

  // Real-time client-side validation as user types
  const handleInputChange = (e) => {
    const val = e.target.value;
    setDomainInput(val);
    setApiError(null);

    if (val.trim()) {
      const valRes = validateClientDomain(val);
      if (!valRes.isValid) {
        setClientError(valRes.error);
      } else {
        setClientError(null);
      }
    } else {
      setClientError(null);
    }
  };

  const executeLookup = async (targetDomain) => {
    const domainToQuery = (targetDomain || domainInput).trim();
    if (!domainToQuery) {
      setClientError('Domain name cannot be empty. Please enter a valid domain (e.g. google.com).');
      return;
    }

    // Client-side pre-validation
    const clientCheck = validateClientDomain(domainToQuery);
    if (!clientCheck.isValid) {
      setClientError(clientCheck.error);
      // Client-side simulated rejection transition S0 -> S1 -> S0
      setDfaState({ code: 'S0', name: 'INPUT', label: 'S0 – INPUT' });
      setDfaTransitions([
        { step: 1, fromState: null, toState: 'S0', symbol: 'INITIALIZE', description: 'DFA initialized at S0', timestamp: new Date().toISOString() },
        { step: 2, fromState: 'S0', toState: 'S1', symbol: 'SUBMIT_DOMAIN', description: 'Domain submitted for syntax check', timestamp: new Date().toISOString() },
        { step: 3, fromState: 'S1', toState: 'S0', symbol: 'SYNTAX_INVALID', description: `Validation failed: ${clientCheck.error}`, timestamp: new Date().toISOString() },
      ]);
      return;
    }

    setLoading(true);
    setClientError(null);
    setApiError(null);
    setLookupResult(null);

    // Initial visual state transition S0 -> S1 -> S2 while awaiting response
    setDfaState({ code: 'S2', name: 'DNS_QUERY', label: 'S2 – DNS_QUERY' });
    setDfaTransitions([
      { step: 1, fromState: null, toState: 'S0', symbol: 'INITIALIZE', description: 'DFA initialized at S0', timestamp: new Date().toISOString() },
      { step: 2, fromState: 'S0', toState: 'S1', symbol: 'SUBMIT_DOMAIN', description: 'Domain submitted', timestamp: new Date().toISOString() },
      { step: 3, fromState: 'S1', toState: 'S2', symbol: 'SYNTAX_VALID', description: 'Syntax valid; querying OS resolver...', timestamp: new Date().toISOString() },
    ]);

    try {
      const data = await lookupDomainApi(domainToQuery);
      setLookupResult(data);

      if (data.currentState) {
        setDfaState(data.currentState);
      }
      if (data.dfaTransitions) {
        setDfaTransitions(data.dfaTransitions);
      }
    } catch (err) {
      setApiError(err.message || 'Lookup failed unexpectedly.');
      setDfaState({ code: 'S0', name: 'INPUT', label: 'S0 – INPUT' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLookup(domainInput);
  };

  const handleReset = () => {
    setDomainInput('');
    setLookupResult(null);
    setClientError(null);
    setApiError(null);
    setShowRawJson(false);
    setDfaState({ code: 'S0', name: 'INPUT', label: 'S0 – INPUT' });
    setDfaTransitions([]);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
          DNS Lookup & Automata Workbench
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Execute RFC 1035 regular expression validation and query 6 DNS resource record types through native operating system resolver.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '0.05em' }}>
              TARGET DOMAIN NAME
            </label>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  flex: 1,
                  minWidth: '280px',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(3, 7, 18, 0.7)',
                  border: `1px solid ${
                    clientError || apiError
                      ? 'var(--border-error)'
                      : domainInput && !clientError
                      ? 'var(--border-active)'
                      : 'var(--border-subtle)'
                  }`,
                  borderRadius: '8px',
                  padding: '0 0.75rem',
                  transition: 'border-color 0.2s',
                }}
              >
                <Search size={18} color={clientError ? 'var(--status-error)' : 'var(--cyan-accent)'} />
                <input
                  type="text"
                  placeholder="e.g. google.com, amazon.in, example.org..."
                  value={domainInput}
                  onChange={handleInputChange}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: '0.75rem',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                />
                {domainInput && (
                  <button
                    type="button"
                    onClick={() => setDomainInput('')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || Boolean(clientError)}
                className="btn btn-primary"
                style={{ minWidth: '160px' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Validate & Lookup</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="btn btn-outline"
                style={{ padding: '0.75rem 1rem' }}
                title="Reset Workbench"
              >
                <RefreshCw size={15} />
                <span>Reset</span>
              </button>
            </div>

            {/* Validation Feedback Banner */}
            {clientError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid var(--border-error)',
                  borderRadius: '6px',
                  color: '#f43f5e',
                  fontSize: '0.85rem',
                }}
              >
                <AlertCircle size={16} />
                <span><strong>Syntax Validation Error:</strong> {clientError}</span>
              </div>
            )}

            {apiError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid var(--border-error)',
                  borderRadius: '6px',
                  color: '#f43f5e',
                  fontSize: '0.85rem',
                }}
              >
                <AlertCircle size={16} />
                <span><strong>API Error:</strong> {apiError}</span>
              </div>
            )}

            {domainInput && !clientError && !apiError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#10b981' }}>
                <CheckCircle size={14} />
                <span>Domain syntax satisfies RFC 1035 & Chomsky Type-3 regular grammar constraints.</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* DFA Real-Time State Controller Visualization */}
      <DfaVisualizer currentState={dfaState} transitions={dfaTransitions} />

      {/* Lookup Results Display */}
      {lookupResult && (
        <div style={{ marginTop: '2rem' }}>
          {/* Result Telemetry Header Bar */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              borderLeft: '4px solid var(--cyan-accent)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                  {lookupResult.domain}
                </h2>
                <StatusBadge status={lookupResult.dnsStatus} />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {lookupResult.statusMessage}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Clock size={16} color="var(--blue-accent)" />
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontWeight: '700' }}>
                  {lookupResult.executionTimeMs} ms
                </span>
                <span style={{ fontSize: '0.75rem' }}>latency</span>
              </div>

              <button
                className="btn btn-outline"
                onClick={() => setShowRawJson(!showRawJson)}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                <FileCode size={14} />
                <span>{showRawJson ? 'Hide JSON' : 'Raw JSON'}</span>
              </button>
            </div>
          </div>

          {/* DB Warning if Offline */}
          {lookupResult.dbWarning && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '8px',
                color: '#f59e0b',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
              }}
            >
              <Database size={16} />
              <span>{lookupResult.dbWarning}</span>
            </div>
          )}

          {/* Raw JSON View */}
          {showRawJson && (
            <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
              <pre
                style={{
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--cyan-accent)',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  background: 'rgba(3, 7, 18, 0.8)',
                  padding: '1rem',
                  borderRadius: '6px',
                }}
              >
                {JSON.stringify(lookupResult, null, 2)}
              </pre>
            </div>
          )}

          {/* DNS 6 Core Record Cards Grid */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            DNS RESOURCE RECORDS (RESOLVED VIA OS STUB RESOLVER)
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {['A', 'AAAA', 'MX', 'NS', 'CNAME', 'TXT'].map((type) => {
              const recordData = lookupResult.records?.[type];
              const errorInfo = lookupResult.unavailableRecords?.find((u) => u.type === type);
              return <RecordCard key={type} type={type} data={recordData} errorInfo={errorInfo} />;
            })}
          </div>

          {/* Unavailable Records Analysis Section */}
          {lookupResult.unavailableRecords && lookupResult.unavailableRecords.length > 0 && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                RECORD DISAMBIGUATION & UNAVAILABLE RR ANALYSIS
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                In accordance with RFC 1035, the absence of a specific record type does not imply domain non-existence. Below is the granular resolver taxonomy for unpublished records:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {lookupResult.unavailableRecords.map((unav, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      background: 'rgba(3, 7, 18, 0.5)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: '700', color: 'var(--blue-accent)' }}>{unav.type}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{unav.reason}</span>
                    </div>
                    <span
                      style={{
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        background: 'rgba(244, 63, 94, 0.1)',
                        color: '#f43f5e',
                        fontSize: '0.75rem',
                      }}
                    >
                      {unav.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
