'use client';

export type AgentStatus = 'active' | 'idle' | 'offline' | 'on-demand' | 'done' | 'pending' | 'failed' | 'running' | 'triaging';

export default function StatusBadge({ status, label }: { status: AgentStatus; label?: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    active:     { bg: 'rgba(48, 209, 88, 0.2)',   text: 'var(--accent-green)'  },
    done:       { bg: 'rgba(48, 209, 88, 0.2)',   text: 'var(--accent-green)'  },
    idle:       { bg: 'rgba(10, 132, 255, 0.2)',  text: 'var(--accent-blue)'   },
    pending:    { bg: 'rgba(10, 132, 255, 0.2)',  text: 'var(--accent-blue)'   },
    'on-demand':{ bg: 'rgba(10, 132, 255, 0.15)', text: 'var(--accent-blue)'   },
    triaging:   { bg: 'rgba(255, 159, 10, 0.2)',  text: 'var(--accent-orange)' },
    running:    { bg: 'rgba(191, 90, 242, 0.2)',  text: 'var(--accent-purple)' },
    offline:    { bg: 'rgba(255, 69, 58, 0.2)',   text: 'var(--accent-red)'    },
    failed:     { bg: 'rgba(255, 69, 58, 0.2)',   text: 'var(--accent-red)'    },
  };

  const style = styles[status] || styles.offline;
  const displayLabel = label || status;

  // On-demand usa icono diferente (rayo en vez de circulo)
  const dot = status === 'on-demand'
    ? <span style={{ fontSize: '0.65rem' }}>⚡</span>
    : <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.text, display: 'inline-block', boxShadow: `0 0 8px ${style.text}` }} />;

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
      textTransform: 'uppercase',
      whiteSpace: 'nowrap'
    }}>
      {dot}
      {displayLabel}
    </span>
  );
}
