'use client';
import { useApi } from '@/hooks/useApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useCallback, useState } from 'react';
import { API } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';

export default function TasksPage() {
  const { data: tasks, updateData: setTasks, isLoading } = useApi<any[]>('/api/tasks');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const refreshTasks = useCallback(async () => {
    try {
      const ts = await API.get('/api/tasks');
      setTasks(ts);
    } catch (e) {}
  }, [setTasks]);

  useWebSocket((msg) => {
    if (msg.type === 'task_queue_updated') {
      refreshTasks();
    }
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim()) return;
    try {
      await API.post('/api/tasks', { desc: newTaskDesc.trim(), status: 'pending', level: 1, task_type: 'single_script' });
      setNewTaskDesc('');
      refreshTasks();
    } catch(e) {}
  };

  const columns = ['pending', 'triaging', 'in_progress', 'completed', 'failed'];

  const getTasksByStatus = (status: string) => {
    if (!tasks) return [];
    return tasks.filter(t => {
      if (status === 'in_progress' && t.status === 'running') return true;
      return t.status === status;
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Task Board</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and monitor the orchestrator queue</p>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleAddTask} className="glass-panel" style={{ display: 'flex', flex: 1, padding: '0.75rem', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Add new task for OpenClaw..."
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
          />
          <button type="submit" style={{ background: 'var(--accent-blue)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
            Queue Task
          </button>
        </form>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Tasks...</div>
      ) : (
        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', flex: 1, paddingBottom: '1rem' }}>
          {columns.map(col => (
            <div key={col} style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {col.replace('_', ' ')}
                </h3>
                <span className="glass-panel" style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem' }}>
                  {getTasksByStatus(col).length}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                {getTasksByStatus(col).map(task => (
                  <div key={task.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <StatusBadge status={task.status} />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Lvl {task.level}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.4, color: 'var(--text-primary)' }}>
                      {task.desc}
                    </p>
                    {task.agent && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Handling: <strong style={{ color: 'var(--text-primary)' }}>{task.agent}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
