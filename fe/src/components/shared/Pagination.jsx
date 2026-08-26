import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const btnStyle = (active) => ({
    background: active ? '#14110D' : '#fff',
    color: active ? '#F2EEE4' : '#14110D',
    border: '1px solid #14110D',
    cursor: 'pointer',
    fontFamily: "'Space Mono', monospace",
    fontSize: '12px',
    fontWeight: 700,
    padding: '6px 10px',
    minWidth: '32px',
    textAlign: 'center'
  });

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', justifyContent: 'flex-end', marginTop: '16px' }}>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} style={btnStyle(false)}>
        ‹
      </button>
      {start > 1 && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', padding: '0 4px' }}>...</span>}
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)} style={btnStyle(p === currentPage)}>
          {p}
        </button>
      ))}
      {end < totalPages && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', padding: '0 4px' }}>...</span>}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} style={btnStyle(false)}>
        ›
      </button>
    </div>
  );
}
