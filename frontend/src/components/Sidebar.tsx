'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListTodo, Activity, Server, Brain, FileText, FileCode2, Settings } from 'lucide-react';

const MENU_ITEMS = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/agents', label: 'Agents', icon: Server },
  { href: '/activity', label: 'Activity Feed', icon: Activity },
  { href: '/memory', label: 'Memory', icon: Brain },
  { href: '/workspace', label: 'Workspace', icon: FileCode2 },
  { href: '/logs', label: 'Logs', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div style={{ padding: '0 0.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Mission Control
        </h1>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', marginTop: '0.25rem' }}>OpenClaw V3</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {MENU_ITEMS.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: isActive ? 'var(--bg-tertiary)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'background 0.2s, color 0.2s',
              fontWeight: isActive ? 500 : 400
            }}>
              <Icon size={18} color={isActive ? 'var(--accent-blue)' : 'currentColor'} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '1rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
        System Online · {new Date().toLocaleTimeString()}
      </div>
    </aside>
  );
}
