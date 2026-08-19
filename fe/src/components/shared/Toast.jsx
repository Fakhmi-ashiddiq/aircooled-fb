import React, { useEffect } from 'react';
import { useStore } from '../../store';

export default function Toast() {
  const { state, updateState } = useStore();
  const { toast } = state;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        updateState({ toast: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, updateState]);

  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: '#14110D',
        color: '#F2C015',
        padding: '16px 24px',
        fontFamily: "'Space Mono', monospace",
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        zIndex: 9999,
        border: '2px solid #F2C015',
        boxShadow: '4px 4px 0 rgba(20,17,13,0.3)',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      {toast.message}
    </div>
  );
}
