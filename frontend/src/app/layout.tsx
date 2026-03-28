import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';
import ToastContainer from '@/components/Toast';
import SkipLink from '@/components/SkipLink';

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
        <SkipLink />
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
