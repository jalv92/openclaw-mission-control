'use client';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const bgColor = {
    error: 'rgba(255, 69, 58, 0.95)',
    success: 'rgba(48, 209, 88, 0.95)',
    info: 'rgba(10, 132, 255, 0.95)',
  }[toast.type];

  const Icon = toast.type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        background: bgColor,
        color: 'white',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        fontSize: '0.9rem',
        fontWeight: 500,
        transform: isVisible ? 'translateX(0)' : 'translateX(120%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
      }}
    >
      <Icon size={18} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        aria-label="Dismiss notification"
        style={{
          padding: '0.25rem',
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Toast container and hook
let toastListeners: ((toasts: ToastMessage[]) => void)[] = [];
let toasts: ToastMessage[] = [];

function notifyListeners() {
  toastListeners.forEach(listener => listener([...toasts]));
}

export function showToast(type: ToastType, message: string) {
  const id = Math.random().toString(36).substring(7);
  toasts = [...toasts, { id, type, message }];
  notifyListeners();
}

export default function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastMessage[]) => setCurrentToasts(newToasts);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  const dismissToast = (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    notifyListeners();
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 9999,
      }}
    >
      {currentToasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}
