import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Globe, Activity, Network, History, BookOpen, Database, Menu, X } from 'lucide-react';
import { fetchHealthApi } from '../services/api';

export const Navbar = () => {
  const [health, setHealth] = useState({ status: 'CHECKING', database: { connected: false } });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      const data = await fetchHealthApi();
      if (isMounted) setHealth(data);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const isServerOk = health.status === 'OK';
  const isDbOk = health.database?.connected;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <Activity size={16} /> },
    { to: '/workbench', label: 'Workbench', icon: <Network size={16} /> },
    { to: '/history', label: 'History', icon: <History size={16} /> },
    { to: '/theory', label: 'Theory', icon: <BookOpen size={16} /> },
  ];

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Brand */}
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <Globe size={19} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: '700',
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                }}
              >
                Net<span style={{ color: 'var(--primary)' }}>DFA</span>
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  padding: '0.1rem 0.4rem',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                v1.0
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1' }}>
              DNS & Automata Platform
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.35rem',
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'btn btn-secondary' : 'btn btn-outline'
              }
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.875rem',
                border: 'none',
                boxShadow: 'none',
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* System Health Indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          {/* DB Badge */}
          <div
            title={isDbOk ? 'MongoDB Connected' : 'MongoDB Disconnected'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.55rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: '500',
              backgroundColor: isDbOk ? '#ecfdf5' : '#fffbeb',
              border: `1px solid ${isDbOk ? '#a7f3d0' : '#fde68a'}`,
              color: isDbOk ? '#059669' : '#d97706',
            }}
          >
            <Database size={12} />
            <span style={{ display: 'none' }} className="status-label">DB: </span>
            <span>{isDbOk ? 'DB Online' : 'DB Offline'}</span>
          </div>

          {/* API Badge */}
          <div
            title={`Backend Service: ${isServerOk ? 'Operational' : 'Offline'}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.55rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: '500',
              backgroundColor: isServerOk ? '#f0f9ff' : '#fef2f2',
              border: `1px solid ${isServerOk ? '#bae6fd' : '#fecaca'}`,
              color: isServerOk ? '#0284c7' : '#dc2626',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isServerOk ? '#0284c7' : '#dc2626',
              }}
            />
            <span>{isServerOk ? 'API Ready' : 'API Down'}</span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              padding: '0.4rem 0.55rem',
              border: '1px solid var(--border-subtle)',
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border-subtle)',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? 'btn btn-secondary' : 'btn btn-outline'
              }
              style={{
                justifyContent: 'flex-start',
                padding: '0.6rem 0.85rem',
                border: 'none',
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}

      {/* Style for responsive navbar display */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          header button[aria-label="Toggle Navigation"] {
            display: none !important;
          }
          .status-label {
            display: inline !important;
          }
        }
      `}</style>
    </header>
  );
};
