'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, ListTodo, Activity, Server, Brain, FileText, FileCode2, Settings, Menu, X } from 'lucide-react';

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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger button - fixed position */}
      <button
        className="sidebar-hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="sidebar-nav"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav
        id="sidebar-nav"
        className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}
        aria-label="Main navigation"
      >
        <div style={{ padding: '0 0.5rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Mission Control
          </h1>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', marginTop: '0.25rem' }}>OpenClaw V3</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {MENU_ITEMS.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'background 0.2s, color 0.2s',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent-blue)' : 'currentColor'} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', padding: '1rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          System Online · {new Date().toLocaleTimeString()}
        </div>
      </nav>

      <style>{`
        .sidebar-hamburger {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1001;
          padding: 0.5rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          cursor: pointer;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 999;
        }

        .sidebar {
          width: 260px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          height: 100vh;
          position: sticky;
          top: 0;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .sidebar-hamburger {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .sidebar-overlay {
            display: block;
          }

          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .sidebar.sidebar-open {
            transform: translateX(0);
          }

          main {
            padding-top: 4rem !important;
            padding-left: 1rem !important;
          }
        }
      `}</style>
    </>
  );
}
