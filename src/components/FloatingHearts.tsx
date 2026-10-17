import React, { useState, useEffect, useCallback } from 'react';

interface ClickHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  dx: number;
  rot: number;
}

// 20 ambient floating hearts with staggered timings
const AMBIENT_HEARTS = [
  { id: 1, left: 6, size: 14, duration: 11, delay: 0.5, color: '#8B5A3C', opacity: 0.6 },
  { id: 2, left: 14, size: 20, duration: 14, delay: 3.2, color: '#B38054', opacity: 0.5 },
  { id: 3, left: 22, size: 11, duration: 10, delay: 1.1, color: '#D49B80', opacity: 0.55 },
  { id: 4, left: 29, size: 24, duration: 16, delay: 4.8, color: '#8B5A3C', opacity: 0.45 },
  { id: 5, left: 37, size: 13, duration: 12, delay: 2.3, color: '#A56847', opacity: 0.5 },
  { id: 6, left: 45, size: 18, duration: 15, delay: 6.1, color: '#B38054', opacity: 0.6 },
  { id: 7, left: 52, size: 12, duration: 9, delay: 1.8, color: '#D49B80', opacity: 0.5 },
  { id: 8, left: 58, size: 22, duration: 13, delay: 5.4, color: '#8B5A3C', opacity: 0.45 },
  { id: 9, left: 66, size: 15, duration: 11.5, delay: 2.9, color: '#C88A58', opacity: 0.55 },
  { id: 10, left: 74, size: 20, duration: 14.5, delay: 7.0, color: '#B38054', opacity: 0.5 },
  { id: 11, left: 81, size: 12, duration: 10.5, delay: 3.8, color: '#D49B80', opacity: 0.6 },
  { id: 12, left: 89, size: 23, duration: 15, delay: 1.4, color: '#8B5A3C', opacity: 0.45 },
  { id: 13, left: 95, size: 14, duration: 12.5, delay: 4.2, color: '#A56847', opacity: 0.5 },
  { id: 14, left: 10, size: 16, duration: 13.5, delay: 8.5, color: '#C88A58', opacity: 0.5 },
  { id: 15, left: 32, size: 10, duration: 9.5, delay: 6.7, color: '#D49B80', opacity: 0.6 },
  { id: 16, left: 48, size: 25, duration: 17, delay: 9.2, color: '#8B5A3C', opacity: 0.4 },
  { id: 17, left: 62, size: 13, duration: 11, delay: 8.1, color: '#B38054', opacity: 0.55 },
  { id: 18, left: 79, size: 17, duration: 13, delay: 10.3, color: '#A56847', opacity: 0.5 },
  { id: 19, left: 86, size: 11, duration: 10, delay: 7.7, color: '#D49B80', opacity: 0.6 },
  { id: 20, left: 92, size: 19, duration: 14, delay: 11.0, color: '#8B5A3C', opacity: 0.45 },
];

const HEART_COLORS = ['#8B5A3C', '#B38054', '#D49B80', '#A56847', '#C88A58'];

export const FloatingHearts: React.FC = () => {
  const [clickHearts, setClickHearts] = useState<ClickHeart[]>([]);

  // Spawn mini hearts when user clicks anywhere on the screen
  const handleClick = useCallback((e: MouseEvent | TouchEvent) => {
    // Avoid triggering if target is inside an interactive button/input
    const target = e.target as HTMLElement | null;
    if (target?.closest('button') || target?.closest('input') || target?.closest('a')) {
      return;
    }

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    if (!clientX && !clientY) return;

    const count = 3;
    const newItems: ClickHeart[] = [];
    const baseId = Date.now();

    for (let i = 0; i < count; i++) {
      newItems.push({
        id: baseId + i + Math.random(),
        x: clientX + (Math.random() * 24 - 12),
        y: clientY + (Math.random() * 16 - 8),
        size: Math.floor(Math.random() * 12) + 14,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        dx: (Math.random() * 48 - 24),
        rot: Math.random() * 40 - 20,
      });
    }

    setClickHearts((prev) => [...prev.slice(-18), ...newItems]);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleClick, { passive: true });
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleClick);
    };
  }, [handleClick]);

  // Clean up completed click hearts after animation finishes
  useEffect(() => {
    if (clickHearts.length === 0) return;
    const timer = setTimeout(() => {
      setClickHearts((prev) => prev.slice(3));
    }, 1600);
    return () => clearTimeout(timer);
  }, [clickHearts]);

  return (
    <div className="fixed inset-0 pointer-events-none z-15 overflow-hidden select-none" aria-hidden="true">
      {/* Ambient Rising Hearts */}
      {AMBIENT_HEARTS.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-heart"
          style={{
            left: `${heart.left}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            opacity: heart.opacity,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill={heart.color}
            className="w-full h-full drop-shadow-[0_1px_3px_rgba(139,90,60,0.25)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}

      {/* Interactive Click/Tap Burst Hearts */}
      {clickHearts.map((item) => (
        <div
          key={item.id}
          className="absolute animate-click-heart"
          style={
            {
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: `${item.size}px`,
              height: `${item.size}px`,
              '--dx': `${item.dx}px`,
              '--rot': `${item.rot}deg`,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill={item.color}
            className="w-full h-full drop-shadow-[0_2px_6px_rgba(139,90,60,0.35)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};
