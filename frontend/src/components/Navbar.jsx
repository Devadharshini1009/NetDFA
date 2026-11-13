import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Network, Activity, History, BookOpen, Database } from 'lucide-react';
import { fetchHealthApi } from '../services/api';

export const Navbar = () => {
  const [health, setHealth] = useState({ status: 'CHECKING', database: { connected: false } });

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

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(0, 245, 212, 0.2), rgba(56, 189, 248, 0.2))',
              border: '1px solid var(--border-active)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={22} color="var(--cyan-accent)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.05em', color: 'var(--text-main)' }}>
                Net<span style={{ color: 'var(--cyan-accent)' }}>DFA</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.35rem',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--blue-accent)',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                }}
              >
                v1.0
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              DNS Resolver & Automata Engine
            </div>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <NavLink
            to="/"
            className={({ isActive }) => `btn ${isActive ? 'btn-secondary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
          >
            <Activity size={15} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/workbench"
            className={({ isActive }) => `btn ${isActive ? 'btn-secondary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
          >
            <Network size={15} />
            <span>Workbench</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => `btn ${isActive ? 'btn-secondary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
          >
            <History size={15} />
            <span>History</span>
          </NavLink>

          <NavLink
            to="/theory"
            className={({ isActive }) => `btn ${isActive ? 'btn-secondary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
          >
            <BookOpen size={15} />
            <span>Theory (FLAT/CN)</span>
          </NavLink>
        </nav>

        {/* System Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            title={isDbOk ? 'MongoDB Connected' : 'MongoDB Offline (Read/Write disabled)'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              background: 'rgba(11, 19, 43, 0.6)',
              border: `1px solid ${isDbOk ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
              color: isDbOk ? '#10b981' : '#f59e0b',
            }}
          >
            <Database size={13} />
            <span>DB: {isDbOk ? 'Online' : 'Offline'}</span>
          </div>

          <div
            title={`Backend Server: ${isServerOk ? 'Online' : 'Offline'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              background: 'rgba(11, 19, 43, 0.6)',
              border: `1px solid ${isServerOk ? 'rgba(0, 245, 212, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
              color: isServerOk ? 'var(--cyan-accent)' : '#f43f5e',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isServerOk ? 'var(--cyan-accent)' : '#f43f5e',
                boxShadow: isServerOk ? '0 0 8px var(--cyan-accent)' : 'none',
              }}
            />
            <span>API: {isServerOk ? '5000' : 'Down'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
