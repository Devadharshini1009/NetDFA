import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, AlertCircle, CheckCircle, RefreshCw, Clock, ShieldCheck, Database, Code, ArrowRight } from 'lucide-react';
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
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          DNS Lookup & Automata Workbench
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Validate domain syntax against RFC 1035 and resolve 6 core DNS resource record types through the native OS stub resolver.
        </p>
      </div>

      {/* Lookup Form Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#ffffff' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Target Domain Name
            </label>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  flex: 1,
                  minWidth: '280px',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  border: `1px solid ${
                    clientError || apiError
                      ? 'var(--status-error)'
                      : domainInput && !clientError
                      ? 'var(--primary)'
                      : 'var(--border-subtle)'
                  }`,
                  borderRadius: '6px',
                  padding: '0 0.75rem',
                  transition: 'border-color 0.15s',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Search size={16} color={clientError ? 'var(--status-error)' : 'var(--text-muted)'} />
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
                    padding: '0.65rem 0.5rem',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
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
                      fontSize: '0.85rem',
                      padding: '0.2rem',
                    }}
                    title="Clear input"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || Boolean(clientError)}
                className="btn btn-primary"
                style={{ minWidth: '150px' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
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
                style={{ padding: '0.55rem 0.85rem' }}
                title="Reset Workbench"
              >
                <RefreshCw size={14} />
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
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--status-error-bg)',
                  border: '1px solid var(--status-error-border)',
                  borderRadius: '6px',
                  color: 'var(--status-error)',
                  fontSize: '0.8rem',
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span><strong>Syntax Error:</strong> {clientError}</span>
              </div>
            )}

            {apiError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--status-error-bg)',
                  border: '1px solid var(--status-error-border)',
                  borderRadius: '6px',
                  color: 'var(--status-error)',
                  fontSize: '0.8rem',
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span><strong>API Error:</strong> {apiError}</span>
              </div>
            )}

            {domainInput && !clientError && !apiError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--status-success)' }}>
                <CheckCircle size={13} />
                <span>Domain syntax satisfies RFC 1035 & Chomsky Type-3 regular grammar constraints.</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* DFA Real-Time State Controller Visualization */}
      <DfaVisualizer currentState={dfaState} transitions={dfaTransitions} />

      {/* Lookup Results Section */}
      {lookupResult && (
        <div style={{ marginTop: '1.75rem' }}>
          {/* Result Telemetry Header Bar */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem 1.5rem',
              marginBottom: '1.25rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: '#ffffff',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                  {lookupResult.domain}
                </h2>
                <StatusBadge status={lookupResult.dnsStatus} />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {lookupResult.statusMessage}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.65rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--text-body)',
                }}
              >
                <Clock size={14} color="var(--primary)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-main)' }}>
                  {lookupResult.executionTimeMs} ms
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>latency</span>
              </div>

              <button
                className="btn btn-outline"
                onClick={() => setShowRawJson(!showRawJson)}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              >
                <Code size={13} />
                <span>{showRawJson ? 'Hide JSON' : 'Raw JSON'}</span>
              </button>
            </div>
          </div>

          {/* Offline Database Warning Banner */}
          {lookupResult.dbWarning && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--status-warning-bg)',
                border: '1px solid var(--status-warning-border)',
                borderRadius: '6px',
                color: 'var(--status-warning)',
                fontSize: '0.8rem',
                marginBottom: '1.25rem',
              }}
            >
              <Database size={15} style={{ flexShrink: 0 }} />
              <span>{lookupResult.dbWarning}</span>
            </div>
          )}

          {/* Collapsible Raw JSON Viewer */}
          {showRawJson && (
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.25rem', backgroundColor: '#ffffff' }}>
              <pre
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-main)',
                  maxHeight: '280px',
                  overflowY: 'auto',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.85rem',
                  borderRadius: '6px',
                }}
              >
                {JSON.stringify(lookupResult, null, 2)}
              </pre>
            </div>
          )}

          {/* DNS 6 Core Record Cards Grid */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.85rem' }}>
              DNS Resource Records (OS Resolver Answers)
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1rem',
              }}
            >
              {['A', 'AAAA', 'MX', 'NS', 'CNAME', 'TXT'].map((type) => {
                const recordData = lookupResult.records?.[type];
                const errorInfo = lookupResult.unavailableRecords?.find((u) => u.type === type);
                return <RecordCard key={type} type={type} data={recordData} errorInfo={errorInfo} />;
              })}
            </div>
          </div>

          {/* Unavailable Records Analysis Section */}
          {lookupResult.unavailableRecords && lookupResult.unavailableRecords.length > 0 && (
            <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', backgroundColor: '#ffffff' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                Record Disambiguation & Unpublished Types
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                In accordance with RFC 1035, the absence of a specific record type does not indicate domain non-existence. Below is the diagnostic breakdown:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {lookupResult.unavailableRecords.map((unav, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '5px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{unav.type}</span>
                      <span style={{ color: 'var(--text-body)' }}>{unav.reason}</span>
                    </div>
                    <span
                      style={{
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        backgroundColor: '#f1f5f9',
                        color: 'var(--text-muted)',
                        fontSize: '0.7rem',
                        fontWeight: '600',
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
