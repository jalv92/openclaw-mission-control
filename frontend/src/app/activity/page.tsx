'use client';
import { useApi } from '@/hooks/useApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useCallback, useEffect, useRef, useState } from 'react';
import { API } from '@/lib/api';

export default function ActivityPage() {
  const [logsList, setLogsList] = useState<string[]>([]);
  const [selectedLog, setSelectedLog] = useState<string>('orchestrator.log');
  const [logContent, setLogContent] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchLogsList = useCallback(async () => {
    try {
      const res = await API.get('/api/logs');
      setLogsList(res.files || []);
      if (!selectedLog && res.files && res.files.length > 0) {
        setSelectedLog(res.files[0]);
      }
    } catch(e) {}
  }, [selectedLog]);

  const fetchLogContent = useCallback(async () => {
    if (!selectedLog) return;
    try {
      const res = await API.get(`/api/logs/${selectedLog}?lines=200`);
      if (res.content) {
        setLogContent(res.content);
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      }
    } catch(e) {}
  }, [selectedLog]);

  useEffect(() => {
    fetchLogsList();
  }, [fetchLogsList]);

  useEffect(() => {
    fetchLogContent();
  }, [fetchLogContent, selectedLog]);

  useWebSocket((msg) => {
    if (msg.type === 'log_updated') {
      if (msg.file === selectedLog) {
        fetchLogContent();
      }
      if (!logsList.includes(msg.file)) {
        fetchLogsList();
      }
    }
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Activity Feed</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Live tails of all OpenClaw agents</p>
      </header>

      <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Source</h3>
          {logsList.map(fn => (
            <button key={fn} 
              onClick={() => setSelectedLog(fn)}
              style={{
                textAlign: 'left',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: selectedLog === fn ? 'var(--bg-tertiary)' : 'transparent',
                color: selectedLog === fn ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'background 0.2s',
                border: '1px solid transparent',
                borderColor: selectedLog === fn ? 'var(--border-color)' : 'transparent'
              }}>
              {fn}
            </button>
          ))}
        </div>

        <div className="glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, 
            height: '2rem', background: 'linear-gradient(to bottom, var(--bg-glass), transparent)',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', pointerEvents: 'none'
          }} />
          
          <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {logContent.length === 0 ? (
              <div style={{ margin: 'auto' }}>No logs fetched.</div>
            ) : (
              logContent.map((line, idx) => {
                let color = 'white';
                if (line.includes('[INFO]')) color = 'var(--text-secondary)';
                if (line.includes('[ERROR]')) color = 'var(--accent-red)';
                if (line.includes('[WARNING]')) color = 'var(--accent-orange)';
                if (line.includes('[SUCCESS]')) color = 'var(--accent-green)';
                return <div key={idx} style={{ color, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{line}</div>;
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
