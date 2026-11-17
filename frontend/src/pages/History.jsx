import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Trash2, Eye, Database, RefreshCw, Clock, ArrowRight, X } from 'lucide-react';
import { fetchHistoryApi, deleteHistoryItemApi } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { RecordCard } from '../components/RecordCard';
import { DfaVisualizer } from '../components/DfaVisualizer';

export const History = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const loadHistory = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const res = await fetchHistoryApi(100);
      setHistoryList(res.data || []);
    } catch (err) {
      if (err.status === 503 || err.message?.includes('Database Unavailable') || err.message?.includes('disconnected')) {
        setDbError({
          title: 'Database Disconnected',
          message: 'MongoDB is currently unavailable or disconnected. Query history cannot be persisted or retrieved until the database connection is restored.',
        });
      } else {
        setDbError({
          title: 'Connection Error',
          message: err.message || 'Unable to connect to the backend API service.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this lookup audit record?')) return;

    setDeletingId(id);
    try {
      await deleteHistoryItemApi(id);
      setHistoryList((prev) => prev.filter((item) => item._id !== id));
      if (selectedItem?._id === id) setSelectedItem(null);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            DNS Lookup Audit History
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Chronological audit log of domain lookups, execution times, and DFA transitions persisted in MongoDB.
          </p>
        </div>

        <button
          onClick={loadHistory}
          disabled={loading}
          className="btn btn-outline"
          style={{ padding: '0.45rem 0.85rem' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Database Connection Error Banner */}
      {dbError && (
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            backgroundColor: 'var(--status-warning-bg)',
            border: '1px solid var(--status-warning-border)',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Database size={20} color="var(--status-warning)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--status-warning)' }}>
                {dbError.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginTop: '0.25rem', lineHeight: '1.5' }}>
                {dbError.message}
              </p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <strong>Troubleshooting:</strong> Ensure MongoDB service is running or check <code>MONGODB_URI</code> in <code>backend/.env</code>. Real-time DNS lookups on the Workbench remain fully functional.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Content */}
      {!dbError && (
        <>
          {loading ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', color: 'var(--text-muted)' }}>
              <RefreshCw size={22} className="animate-spin" style={{ margin: '0 auto 0.75rem', display: 'block', color: 'var(--primary)' }} />
              <div style={{ fontSize: '0.85rem' }}>Fetching records from MongoDB...</div>
            </div>
          ) : historyList.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <HistoryIcon size={32} color="var(--text-subtle)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>No Historical Lookups Found</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                You have not executed any DNS lookups yet, or the database collection is empty.
              </p>
              <button
                onClick={() => navigate('/workbench')}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Go to Workbench
              </button>
            </div>
          ) : (
            <div className="glass-panel" style={{ overflow: 'hidden', backgroundColor: '#ffffff' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Domain
                      </th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Resolution Status
                      </th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Latency
                      </th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Timestamp
                      </th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyList.map((item) => (
                      <tr
                        key={item._id}
                        onClick={() => setSelectedItem(item)}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-main)' }}>
                          {item.domain}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <StatusBadge status={item.dnsStatus} />
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-body)' }}>
                          {item.executionTimeMs} ms
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              className="btn btn-outline"
                              style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                              title="Inspect Details"
                            >
                              <Eye size={12} />
                              <span>Details</span>
                            </button>

                            <button
                              onClick={(e) => handleDelete(item._id, e)}
                              disabled={deletingId === item._id}
                              className="btn btn-danger"
                              style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                              title="Delete Record"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Lookup Detail Modal Dialog */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '850px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              padding: '1.75rem',
              position: 'relative',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-medium)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.35rem',
                borderRadius: '4px',
              }}
              title="Close modal"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                {selectedItem.domain}
              </h2>
              <StatusBadge status={selectedItem.dnsStatus} />
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              <div>Latency: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{selectedItem.executionTimeMs} ms</strong></div>
              <div>Timestamp: <strong style={{ color: 'var(--text-main)' }}>{new Date(selectedItem.createdAt).toLocaleString()}</strong></div>
            </div>

            {/* DFA History Audit Component */}
            <DfaVisualizer
              currentState={{ code: 'S3', label: 'S3 – RESULT', isAccepting: true }}
              transitions={selectedItem.dfaTransitions || []}
            />

            {/* Persisted Records */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '1.25rem 0 0.85rem', color: 'var(--text-main)' }}>
              Persisted Resource Records
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
              {['A', 'AAAA', 'MX', 'NS', 'CNAME', 'TXT'].map((type) => {
                const data = selectedItem.records?.[type];
                const errorInfo = selectedItem.unavailableRecords?.find((u) => u.type === type);
                return <RecordCard key={type} type={type} data={data} errorInfo={errorInfo} />;
              })}
            </div>

            {/* Actions */}
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                onClick={() => {
                  navigate(`/workbench?domain=${selectedItem.domain}`);
                  setSelectedItem(null);
                }}
                className="btn btn-primary"
              >
                <span>Rerun in Workbench</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
