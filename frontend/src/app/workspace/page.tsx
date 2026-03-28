'use client';
import { useApi } from '@/hooks/useApi';
import { useCallback, useState } from 'react';
import { API } from '@/lib/api';
import { Folder, FolderOpen, FileText, ChevronRight } from 'lucide-react';

interface TreeNode {
  name: string;
  path: string;
  is_dir: boolean;
  children?: TreeNode[];
}

function TreeItem({ node, depth = 0, onSelect }: { node: TreeNode; depth?: number; onSelect: (path: string) => void }) {
  const [open, setOpen] = useState(depth === 0 ? true : false);

  const toggle = () => {
    if (node.is_dir) setOpen(p => !p);
    else onSelect(node.path);
  };

  const ext = node.name.split('.').pop() || '';
  const isCode = ['py', 'ts', 'tsx', 'js', 'json', 'md', 'txt', 'yaml', 'toml'].includes(ext);

  return (
    <div>
      <div
        onClick={toggle}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 0.5rem',
          paddingLeft: `${0.5 + depth * 1.25}rem`,
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          color: node.is_dir ? 'var(--text-primary)' : (isCode ? 'var(--text-secondary)' : 'var(--text-tertiary)'),
          transition: 'background 0.15s',
          fontSize: '0.85rem',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {node.is_dir ? (
          <>
            <ChevronRight size={14} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
            {open ? <FolderOpen size={15} color="var(--accent-orange)" style={{ flexShrink: 0 }} /> : <Folder size={15} color="var(--accent-orange)" style={{ flexShrink: 0 }} />}
          </>
        ) : (
          <>
            <span style={{ width: 14, flexShrink: 0 }} />
            <FileText size={15} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
          </>
        )}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</span>
      </div>
      {node.is_dir && open && node.children?.map(child => (
        <TreeItem key={child.path} node={child} depth={depth + 1} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function WorkspacePage() {
  const { data: treeData, isLoading } = useApi<{ tree: TreeNode[] }>('/api/workspace/tree');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState(false);

  const loadFile = useCallback(async (path: string) => {
    setSelectedPath(path);
    setLoadingFile(true);
    try {
      const res = await API.get(`/api/workspace/file?file_path=${encodeURIComponent(path)}`);
      setFileContent(res.content || '');
    } catch (e) {
      setFileContent('Could not load file.');
    } finally {
      setLoadingFile(false);
    }
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem' }}>
      <header>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Workspace Explorer</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Browse and inspect OpenClaw workspace files</p>
      </header>

      <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' }}>
        {/* Tree */}
        <div className="glass-panel" style={{ width: '300px', overflowY: 'auto', padding: '1rem' }}>
          {isLoading && <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading workspace...</div>}
          {treeData?.tree?.map(node => (
            <TreeItem key={node.path} node={node} depth={0} onSelect={loadFile} />
          ))}
        </div>

        {/* File viewer */}
        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selectedPath && (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p>Select a file to view its contents</p>
            </div>
          )}
          {selectedPath && (
            <>
              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-blue)' }}>
                {selectedPath}
              </div>
              {loadingFile
                ? <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
                : <div style={{ overflowY: 'auto', flex: 1, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                    {fileContent}
                  </div>
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
}
