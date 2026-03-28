import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';
import ToastContainer from '@/components/Toast';

export const metadata: Metadata = {
  title: 'OpenClaw Mission Control',
  description: 'Autonomous Agent Ecosystem Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="skip-link"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            zIndex: 9999,
          }}
          onFocus={(e) => {
            e.currentTarget.style.position = 'fixed';
            e.currentTarget.style.left = '1rem';
            e.currentTarget.style.top = '1rem';
            e.currentTarget.style.width = 'auto';
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.padding = '0.75rem 1rem';
            e.currentTarget.style.background = 'var(--accent-blue)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderRadius = '8px';
            e.currentTarget.style.fontWeight = '600';
            e.currentTarget.style.zIndex = '9999';
          }}
          onBlur={(e) => {
            e.currentTarget.style.position = 'absolute';
            e.currentTarget.style.left = '-9999px';
            e.currentTarget.style.width = '1px';
            e.currentTarget.style.height = '1px';
          }}
        >
          Skip to main content
        </a>
        <AuthProvider>
          <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Sidebar />
            <main id="main-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
              {children}
            </main>
          </div>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
