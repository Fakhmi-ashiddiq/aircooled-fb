import React from 'react';

export default function PingDot({ color = '#F2C015', size = 8 }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size, flex: 'none' }}>
      <style>{`
        @keyframes pingDotAnim {
          0% { transform: scale(1); opacity: 0.7; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
      <span
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: color, animation: 'pingDotAnim 1.4s cubic-bezier(0,0,0.2,1) infinite'
        }}
      />
      <span style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: color, display: 'block' }} />
    </span>
  );
}