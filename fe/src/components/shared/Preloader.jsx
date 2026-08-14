import React, { useEffect, useRef, useState, useContext } from 'react';
import { useStore } from '../../store';

// Reset otomatis setiap kali browser memuat ULANG file JS ini (hard reload / F5).
// TIDAK reset saat pindah mode Store <-> Admin, karena itu murni perubahan
// state React di dalam SPA — file JS-nya sendiri tidak dimuat ulang.
let hasShownPreloader = false;

export default function Preloader() {
  const { updateState } = useStore();

  // Keputusan "apakah instance komponen INI yang harus menjalankan animasi" diambil
  // SEKALI saat render pertama, lalu disimpan di useRef (bukan langsung dibaca di
  // dalam useEffect). Ini penting: React StrictMode (mode development) memanggil
  // body komponen & efeknya 2x untuk mendeteksi side-effect yang tidak aman. Kalau
  // keputusan "sudah pernah tampil atau belum" dicek ulang di setiap pemanggilan
  // efek, percobaan ke-2 akan melihat variabel modul sudah keburu diubah oleh
  // percobaan ke-1 — sehingga tidak ada timer yang sempat menyala sampai selesai
  // (itu penyebab preloader macet permanen sebelumnya). useRef tidak ikut "di-reset"
  // antar pemanggilan ganda ini, jadi keputusannya konsisten di kedua percobaan.
  const shouldAnimateRef = useRef(null);
  if (shouldAnimateRef.current === null) {
    shouldAnimateRef.current = !hasShownPreloader;
    hasShownPreloader = true;
  }
  const shouldAnimate = shouldAnimateRef.current;

  const [visible, setVisible] = useState(shouldAnimate);
  const [fadeOut, setFadeOut] = useState(!shouldAnimate);

  useEffect(() => {
    if (!shouldAnimate) {
      // Instance ini bukan yang "pertama" (misal komponen sempat re-mount karena
      // pindah mode) — tidak perlu animasi apapun, cukup tandai app sudah siap.
      updateState({ appReady: true });
      return;
    }

    const t1 = setTimeout(() => setFadeOut(true), 900);
    const t2 = setTimeout(() => updateState({ appReady: true }), 900);
    const t3 = setTimeout(() => setVisible(false), 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [shouldAnimate]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes preloaderPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.92); opacity: 0.7; }
        }
        .preloader-logo { animation: preloaderPulse 1.1s ease-in-out infinite; }
      `}</style>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#14110D',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'opacity 0.4s ease',
          opacity: fadeOut ? 0 : 1,
          pointerEvents: fadeOut ? 'none' : 'auto'
        }}
      >
        <img src="/assets/logo-white.png" alt="Aircooled Syndicate" className="preloader-logo" style={{ height: '64px' }} />
      </div>
    </>
  );
}
