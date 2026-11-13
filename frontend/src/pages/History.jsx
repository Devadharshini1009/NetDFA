import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Trash2, Eye, Database, AlertTriangle, RefreshCw, Clock, ArrowRight, X } from 'lucide-react';
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
      setHistoryList(prev => prev.filter(item => item._id !== id));
      if (selectedItem?._id === id) setSelectedItem(null);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
            DNS Lookup Audit History
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Chronological audit log of domain lookups, execution times, and DFA transitions stored in MongoDB.
          </p>
        </div>

        <button
          onClick={loadHistory}
          disabled={loading}
          className="btn btn-outline"
          style={{ padding: '0.5rem 1rem' }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Database Connection Error Banner */}
      {dbError && (
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderLeft: '5px solid #f43f5e',
            background: 'rgba(244, 63, 94, 0.08)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Database size={24} color="#f43f5e" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#f43f5e' }}>
                {dbError.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.5' }}>
                {dbError.message}
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>Troubleshooting Tip:</strong> Ensure MongoDB is running locally (<code>mongod</code> or service <code>MongoDB</code>) or provide a valid <code>MONGODB_URI</code> in <code>backend/.env</code>. Real-time DNS lookups on the Workbench remain functional.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Table / Content */}
      {!dbError && (
        <>
          {loading ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--cyan-accent)' }} />
              <div>Fetching history from MongoDB...</div>
            </div>
          ) : historyList.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <HistoryIcon size={36} color="var(--text-subtle)" style={{ margin: '0 auto 1rem', display: 'block' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>No Lookup History Found</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                You have not executed any DNS lookups yet, or the database collection is empty.
              </p>
              <button
                onClick={() => navigate('/workbench')}
                className="btn btn-primary"
                style={{ marginTop: '1.25rem' }}
              >
                Go to Workbench
              </button>
            </div>
          ) : (
            <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(3, 7, 18, 0.6)' }}>
                      <th style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontWeight: '700' }}>DOMAIN</th>
                      <th style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontWeight: '700' }}>STATUS</th>
                      <th style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontWeight: '700' }}>EXECUTION TIME</th>
                      <th style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontWeight: '700' }}>TIMESTAMP</th>
                      <th style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
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
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--cyan-accent)' }}>
                          {item.domain}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <StatusBadge status={item.dnsStatus} />
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                          {item.executionTimeMs} ms
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              className="btn btn-outline"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                              title="View Details"
                            >
                              <Eye size={13} />
                              <span>Details</span>
                            </button>

                            <button
                              onClick={(e) => handleDelete(item._id, e)}
                              disabled={deletingId === item._id}
                              className="btn btn-outline"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                              title="Delete Record"
                            >
                              <Trash2 size={13} />
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

      {/* Lookup Detail Modal */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(8px)',
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
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              position: 'relative',
              border: '1px solid var(--border-active)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--cyan-accent)' }}>
                {selectedItem.domain}
              </h2>
              <StatusBadge status={selectedItem.dnsStatus} />
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <div>Latency: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{selectedItem.executionTimeMs} ms</strong></div>
              <div>Logged: <strong style={{ color: 'var(--text-main)' }}>{new Date(selectedItem.createdAt).toLocaleString()}</strong></div>
            </div>

            {/* DFA History in Detail */}
            <DfaVisualizer
              currentState={{ code: 'S3', label: 'S3 – RESULT', isAccepting: true }}
              transitions={selectedItem.dfaTransitions || []}
            />

            {/* Records */}
            <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '1.5rem 0 1rem', color: 'var(--text-main)' }}>
              PERSISTED DNS RESOURCE RECORDS
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {['A', 'AAAA', 'MX', 'NS', 'CNAME', 'TXT'].map((type) => {
                const data = selectedItem.records?.[type];
                const errorInfo = selectedItem.unavailableRecords?.find((u) => u.type === type);
                return <RecordCard key={type} type={type} data={data} errorInfo={errorInfo} />;
              })}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  navigate(`/workbench?domain=${selectedItem.domain}`);
                  setSelectedItem(null);
                }}
                className="btn btn-primary"
              >
                <span>Rerun in Workbench</span>
                <ArrowRight size={15} />
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
