'use client';
import { useCallback, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { API } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { showToast } from '@/components/Toast';
import { Server, Brain, Activity, Code2, ListTodo } from 'lucide-react';

export default function Dashboard() {
  const { data: agents, updateData: setAgents } = useApi<{ [key: string]: any }>('/api/agents');
  const { data: systemInfo } = useApi<any>('/api/system/health');
  const { data: tasks, updateData: setTasks } = useApi<any[]>('/api/tasks');

  const fetchAgentsAndTasks = useCallback(async () => {
    try {
      const [_agents, _tasks] = await Promise.all([
        API.get('/api/agents'),
        API.get('/api/tasks')
      ]);
      setAgents(_agents);
      setTasks(_tasks);
    } catch(e: any) {
      showToast('error', 'Failed to refresh data. Check your connection.');
    }
  }, [setAgents, setTasks]);

  const { connected } = useWebSocket((msg) => {
    if (msg.type === 'task_queue_updated' || msg.type === 'log_updated') {
      fetchAgentsAndTasks();
    }
  });

  const getAgentIcon = (name: string) => {
    if (name.includes('orchestrator')) return <Server size={24} />;
    if (name.includes('memory')) return <Brain size={24} />;
    if (name.includes('coder')) return <Code2 size={24} />;
    return <Activity size={24} />;
  };

  const pendingCount = tasks?.filter(t => t.status === 'pending').length || 0;
  const runningCount = tasks?.filter(t => t.status === 'in_progress').length || 0;
  const doneCount = tasks?.filter(t => t.status === 'completed').length || 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Overview</h2>
          <p style={{ color: 'var(--text-secondary)' }}>System status and agent health</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            width: '8px', height: '8px', borderRadius: '50%',
            background: connected ? 'var(--accent-green)' : 'var(--accent-red)',
            boxShadow: connected ? '0 0 10px var(--accent-green)' : '0 0 10px var(--accent-red)'
          }}></div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {connected ? 'Realtime Connected' : 'Connecting...'}
          </span>
        </div>
      </header>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <MetricCard label="Tasks Pending" value={pendingCount} />
        <MetricCard label="Tasks Running" value={runningCount} color="var(--accent-purple)" />
        <MetricCard label="Tasks Completed" value={doneCount} color="var(--accent-green)" />
        <MetricCard label="Active Agents" value={agents ? Object.values(agents).filter((a: any) => a.status === 'active').length : 0} color="var(--accent-blue)" />
      </div>

      {/* Agents Grid */}
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Agent Fleet</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {agents && Object.entries(agents).map(([id, info]) => (
            <div key={id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                color: info.status === 'active' ? 'var(--accent-blue)' : 'var(--text-tertiary)'
              }}>
                {getAgentIcon(id)}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 600, textTransform: 'capitalize' }}>{id.replace('_', ' ')}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {info.pid ? `PID: ${info.pid}` : 'Process not found'}
                </div>
              </div>
              <StatusBadge status={info.status as any} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color = 'var(--text-primary)' }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, color }}>
        {value}
      </div>
    </div>
  );
}
