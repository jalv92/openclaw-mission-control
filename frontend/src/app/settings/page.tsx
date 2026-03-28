'use client';
import { useState, useEffect } from 'react';
import { API } from '@/lib/api';
import { Save, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [token, setToken] = useState('');
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    setApiUrl(localStorage.getItem('mc_api_url') || 'http://localhost:8000');
    setToken(localStorage.getItem('mc_token') || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('mc_api_url', apiUrl);
    localStorage.setItem('mc_token', token);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTestResult('Testing...');
    try {
      // Temporarily update to test
      const savedUrl = localStorage.getItem('mc_api_url');
      const savedToken = localStorage.getItem('mc_token');
      localStorage.setItem('mc_api_url', apiUrl);
      localStorage.setItem('mc_token', token);
      await API.get('/api/tasks');
      setTestResult('✅ Connection successful!');
      // Restore if test was for preview only
    } catch (e: any) {
      setTestResult(`❌ Failed: ${e.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mc_token');
    window.location.reload();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '640px' }}>
      <header>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Configure the connection to your local OpenClaw backend</p>
      </header>

      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Backend Connection</h3>
        
        <InputField label="API URL" value={apiUrl} onChange={setApiUrl} placeholder="https://your-tunnel.trycloudflare.com" help="Your Cloudflare tunnel URL or http://localhost:8000 for local." />
        <InputField label="Access Token" value={token} onChange={setToken} placeholder="Your MC token" type="password" help="The MC_TOKEN set when starting the backend server." />
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)', background: saved ? 'var(--accent-green)' : 'var(--accent-blue)', color: 'white', fontWeight: 600, transition: 'background 0.2s' }}>
            <Save size={16} />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
          <button onClick={handleTest} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontWeight: 600, border: '1px solid var(--border-color)' }}>
            Test Connection
          </button>
        </div>
        {testResult && (
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            {testResult}
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Session</h3>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,69,58,0.15)', color: 'var(--accent-red)', fontWeight: 600, border: '1px solid rgba(255,69,58,0.3)' }}>
          <RotateCcw size={16} />
          Logout (Clear Token)
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Cloudflare Tunnel Setup</h3>
        <p>To expose your local backend to Netlify, run:</p>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', margin: '0.75rem 0', color: 'var(--accent-green)' }}>
          cloudflared tunnel --url http://localhost:8000
        </div>
        <p>Copy the generated <code style={{ color: 'var(--accent-blue)' }}>trycloudflare.com</code> URL and paste it as the API URL above. Then set it as <code style={{ color: 'var(--accent-blue)' }}>NEXT_PUBLIC_API_URL</code> in your Netlify environment variables.</p>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text', help }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', outline: 'none', fontSize: '0.9rem', fontFamily: type === 'password' ? 'var(--font-mono)' : 'var(--font-sans)' }}
      />
      {help && <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{help}</p>}
    </div>
  );
}
