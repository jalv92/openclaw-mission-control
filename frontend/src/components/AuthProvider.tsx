'use client';
import { useState, useEffect } from 'react';

const CORRECT_TOKEN = 'openclaw-mc-token';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mc_token');
    // Solo aceptar si es exactamente el token correcto
    if (token === CORRECT_TOKEN) {
      setIsAuthenticated(true);
    } else if (token) {
      // Token viejo/incorrecto guardado -> limpiar
      localStorage.removeItem('mc_token');
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tokenInput.trim();
    if (trimmed === CORRECT_TOKEN) {
      localStorage.setItem('mc_token', trimmed);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Token incorrecto. Usa: openclaw-mc-token');
    }
  };

  if (loading) return null;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
      <form onSubmit={handleLogin} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '340px' }}>
        <h2 style={{ color: 'var(--text-primary)', textAlign: 'center', marginBottom: '0.5rem' }}>🗓️ Mission Control</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>OpenClaw Autonomous Agent Ecosystem</p>
        <input
          type="password"
          value={tokenInput}
          onChange={(e) => { setTokenInput(e.target.value); setError(''); }}
          placeholder="Access Token"
          autoFocus
          style={{ padding: '0.75rem', borderRadius: '8px', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border-color)'}`, background: 'var(--bg-secondary)', color: 'white', outline: 'none' }}
        />
        {error && (
          <p style={{ color: 'var(--accent-red)', fontSize: '0.8rem', margin: 0 }}>{error}</p>
        )}
        <button type="submit" style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--accent-blue)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          Connect
        </button>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textAlign: 'center', margin: 0 }}>
          Token: <code style={{ color: 'var(--accent-green)' }}>openclaw-mc-token</code>
        </p>
      </form>
    </div>
  );
}
