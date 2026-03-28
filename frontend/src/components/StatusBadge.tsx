'use client';

export default function StatusBadge({ status, label }: { status: 'active' | 'idle' | 'offline' | 'done' | 'pending' | 'failed' | 'running' | 'triaging'; label?: string }) {
  const styles: any = {
    active: { bg: 'rgba(48, 209, 88, 0.2)', text: 'var(--accent-green)' },
    done: { bg: 'rgba(48, 209, 88, 0.2)', text: 'var(--accent-green)' },
    idle: { bg: 'rgba(10, 132, 255, 0.2)', text: 'var(--accent-blue)' },
    pending: { bg: 'rgba(10, 132, 255, 0.2)', text: 'var(--accent-blue)' },
    triaging: { bg: 'rgba(255, 159, 10, 0.2)', text: 'var(--accent-orange)' },
    running: { bg: 'rgba(191, 90, 242, 0.2)', text: 'var(--accent-purple)' },
    offline: { bg: 'rgba(255, 69, 58, 0.2)', text: 'var(--accent-red)' },
    failed: { bg: 'rgba(255, 69, 58, 0.2)', text: 'var(--accent-red)' },
  };

  const style = styles[status] || styles.offline;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.15rem 0.6rem',
      borderRadius: '999px',
      background: style.bg,
      color: style.text,
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase'
    }}>
      <span style={{ 
        width: '6px', height: '6px', borderRadius: '50%', background: style.text,
        boxShadow: `0 0 8px ${style.text}` 
      }}></span>
      {label || status}
    </span>
  );
}
