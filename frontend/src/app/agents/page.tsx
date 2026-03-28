'use client';
import { useApi } from '@/hooks/useApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useCallback, useState } from 'react';
import { API } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { Server, Code2, Brain, Eye, Shield, Search, ChevronDown, ChevronUp, Zap } from 'lucide-react';

const AGENT_META: Record<string, { icon: React.ReactNode; desc: string; onDemand?: boolean }> = {
  orchestrator:    { icon: <Server size={20} />, desc: 'Cerebro CTO. Lee la cola de tareas, hace triage con el Consejo de Planners y delega al Coder Agent.' },
  coder_agent:     { icon: <Code2 size={20} />,  desc: '⚡ On-Demand — Se activa cuando el Orchestrator le asigna una tarea. Genera código usando qwen2.5-coder:14b → Gemini → Claude según dificultad.', onDemand: true },
  research_agent:  { icon: <Search size={20} />, desc: 'Investiga en internet usando DuckDuckGo + Gemini. Guarda contexto en memoria para el Coder Agent.' },
  memory_keeper:   { icon: <Brain size={20} />,  desc: 'Escanea outputs del Coder Agent, logs de todos los agentes y resultados de Research. Escribe en memoria diaria cada 30 min.' },
  ollama_watcher:  { icon: <Eye size={20} />,    desc: 'Vigila Ollama cada 60s. Reinicia si cae, alerta si faltan modelos requeridos.' },
  github_guardian: { icon: <Shield size={20} />, desc: 'Vigila el workspace cada 10 min. Auto-commit y push de cambios. Detecta proyectos nuevos y los sube a GitHub.' },
};

export default function AgentsPage() {
  const { data: agents, updateData: setAgents, isLoading } = useApi<Record<string, any>>('/api/agents');
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [agentLogs, setAgentLogs] = useState<Record<string, string[]>>({});

  const refreshAgents = useCallback(async () => {
    try { setAgents(await API.get('/api/agents')); } catch (e) {}
  }, [setAgents]);

  useWebSocket((msg) => {
    if (msg.type === 'log_updated') refreshAgents();
  });

  const toggleExpand = async (agentId: string) => {
    if (expandedAgent === agentId) {
      setExpandedAgent(null);
      return;
    }
    setExpandedAgent(agentId);
    if (!agentLogs[agentId]) {
      try {
        const res = await API.get(`/api/agents/${agentId}/log?lines=80`);
        setAgentLogs(prev => ({ ...prev, [agentId]: res.log || [] }));
      } catch (e) {}
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Agent Fleet</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor running processes and view live agent logs</p>
      </header>

      {isLoading && <div style={{ color: 'var(--text-secondary)' }}>Scanning processes...</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {agents && Object.entries(agents).map(([id, info]) => {
          const meta = AGENT_META[id] || { icon: <Server size={20} />, desc: 'Unknown agent.' };
          const isExpanded = expandedAgent === id;
          return (
            <div key={id} className="glass-panel" style={{ overflow: 'hidden' }}>
              <div
                onClick={() => toggleExpand(id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem',
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
              >
                <div style={{
                  padding: '0.75rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  color: info.status === 'active' ? 'var(--accent-blue)' : info.status === 'on-demand' ? 'var(--accent-blue)' : 'var(--text-tertiary)'
                }}>
                  {meta.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.25rem' }}>
                    {id.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{meta.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <StatusBadge status={info.status as any} />
                  {info.pid && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>PID {info.pid}</span>}
                  {isExpanded ? <ChevronUp size={16} color="var(--text-secondary)" /> : <ChevronDown size={16} color="var(--text-secondary)" />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '1rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {(agentLogs[id] || []).length === 0
                      ? <div>No log entries found.</div>
                      : (agentLogs[id] || []).map((line, i) => {
                          let color = 'var(--text-secondary)';
                          if (line.includes('[ERROR]')) color = 'var(--accent-red)';
                          else if (line.includes('[WARNING]')) color = 'var(--accent-orange)';
                          else if (line.includes('[SUCCESS]') || line.includes('✅')) color = 'var(--accent-green)';
                          return <div key={i} style={{ color, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{line}</div>;
                        })
                    }
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
