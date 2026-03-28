'use client';
import { useApi } from '@/hooks/useApi';
import { useCallback, useState } from 'react';
import { API } from '@/lib/api';
import { FileText, Calendar } from 'lucide-react';

export default function MemoryPage() {
  const { data: memData, isLoading } = useApi<{ files: string[] }>('/api/memory');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);

  const loadMemory = useCallback(async (dateStr: string) => {
    setSelectedFile(dateStr);
    setLoadingContent(true);
    try {
      const res = await API.get(`/api/memory/${dateStr}`);
      setContent(res.content || '');
    } catch (e) {
      setContent('Could not load memory file.');
    } finally {
      setLoadingContent(false);
    }
  }, []);

  const files = memData?.files || [];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem' }}>
      <header>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Memory Explorer</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Browse OpenClaw's daily and long-term memory logs</p>
      </header>

      <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' }}>
        {/* File list */}
        <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
            <Calendar size={16} color="var(--accent-blue)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Memory Files</span>
          </div>
          {isLoading && <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading...</div>}
          {files.length === 0 && !isLoading && (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No memory files found.</div>
          )}
          {files.map(file => {
            const dateStr = file.replace('.md', '');
            const isSelected = selectedFile === dateStr;
            return (
              <button
                key={file}
                onClick={() => loadMemory(dateStr)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'left',
                  background: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: `1px solid ${isSelected ? 'var(--border-color)' : 'transparent'}`,
                  transition: 'all 0.2s',
                }}
              >
                <FileText size={16} color={isSelected ? 'var(--accent-blue)' : 'currentColor'} />
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{dateStr}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {!selectedFile && (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <Brain size={48} style={{ margin: '0 auto 1rem' }} />
              <p>Select a memory file to view its contents</p>
            </div>
          )}
          {selectedFile && (
            <>
              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontWeight: 600 }}>{selectedFile}</h3>
              </div>
              {loadingContent
                ? <div style={{ color: 'var(--text-secondary)' }}>Loading content...</div>
                : <div style={{ overflowY: 'auto', flex: 1, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                    {content}
                  </div>
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Brain({ size, style }: { size: number; style?: any }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={style}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14" />
    </svg>
  );
}
