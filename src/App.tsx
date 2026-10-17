/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Heart, Volume2 } from 'lucide-react';
import { soundManager } from './utils/audioEngine';
import { AudioPlayer } from './components/AudioPlayer';
import { FloatingHearts } from './components/FloatingHearts';

// High-fidelity background image matching the user's uploaded illustration
import logoArtBg from './assets/images/samory_logo_art_1792249381436.jpg';

export default function App() {
  // Autoplay notification state
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Initialize and attempt background music autoplay
  const startAudio = useCallback(async () => {
    try {
      const success = await soundManager.start();
      if (!success) {
        setAutoplayBlocked(true);
      } else {
        setAutoplayBlocked(false);
      }
    } catch {
      setAutoplayBlocked(true);
    }
  }, []);

  useEffect(() => {
    // Attempt automatic playback on initial visit
    startAudio();

    // Fallback: unlock audio on first user touch / click anywhere on screen
    const handleFirstGesture = () => {
      setHasInteracted(true);
      soundManager.start();
      setAutoplayBlocked(false);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [startAudio]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between font-modern-sans bg-[#FAF7F2] text-[#3D291D] select-none">
      {/* =========================================================================
          BACKGROUND LAYER (With Gentle Blur Effect)
          ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Background Image Container */}
        <div
          className="absolute inset-0 w-full h-full animate-soft-breathe"
          style={{ transform: 'scale(1.05)' }}
        >
          <img
            src={logoArtBg}
            alt="Samory Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'blur(5px)' }}
          />
        </div>

        {/* Soft Warm Scrim Overlay for Typographic Legibility */}
        <div className="absolute inset-0 bg-[#FAF7F2]/25" />

        {/* Ambient Subtle Vignette */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#FAF7F2]/10 to-[#3D291D]/25 pointer-events-none" />

        {/* Floating Delicate Golden Memory Sparkles */}
        <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-amber-400/40 blur-[1px] animate-gentle-float" />
        <div
          className="absolute top-1/3 right-1/5 w-1.5 h-1.5 rounded-full bg-amber-300/50 blur-[1px] animate-gentle-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-amber-500/30 blur-[1px] animate-gentle-float"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Floating Hearts Animation Layer */}
      <FloatingHearts />

      {/* Top spacer (all toolbars removed) */}
      <div className="w-full h-12 relative z-10 pointer-events-none" />

      {/* =========================================================================
          MAIN CENTERPIECE
          "dòng chữ SAMORY SAVE YOUR MEMORY hiển thị chính giữa màn hình với
          phông chữ hiện đại và thanh lịch"
          ========================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
        {/* Delicate Motif (Twin polaroids silhouette, star sparkles & hearts) */}
        <div className="mb-4 sm:mb-6 flex flex-col items-center animate-gentle-float">
          <div className="relative mb-2">
            <div className="flex items-center justify-center gap-3 text-[#B38054] mb-1">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="w-1 h-1 rounded-full bg-[#B38054]" />
              <Sparkles className="w-3 h-3 animate-pulse" style={{ animationDelay: '500ms' }} />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[#8B5A3C]">
              <Heart className="w-3 h-3 fill-[#8B5A3C]/70" />
              <Heart className="w-3.5 h-3.5 fill-[#8B5A3C]" />
            </div>
          </div>
        </div>

        {/* PRIMARY BRAND TITLE: SAMORY */}
        <div className="relative mb-3 sm:mb-4">
          <h1 className="font-editorial text-6xl sm:text-8xl md:text-9xl font-normal tracking-[0.04em] text-[#1A0C04] leading-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] select-none hover:scale-[1.02] transition-transform duration-500">
            SAMORY
          </h1>
        </div>

        {/* Elegant Ribbon / Divider Flourish */}
        <div className="flex items-center justify-center gap-4 mb-4 sm:mb-5 w-48 sm:w-64 max-w-full">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#8B5A3C]/40 to-[#8B5A3C]/70" />
          <div className="flex items-center gap-1 text-[#8B5A3C]">
            <Heart className="w-2.5 h-2.5 fill-[#8B5A3C]" />
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#8B5A3C]/40 to-[#8B5A3C]/70" />
        </div>

        {/* SUBTITLE: SAVE YOUR MEMORY */}
        <div className="relative">
          <h2 className="font-cinzel text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[0.38em] sm:tracking-[0.45em] text-[#1A0C04] uppercase text-wrap-balance drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] pl-[0.38em]">
            SAVE YOUR MEMORY
          </h2>
        </div>

        {/* Warm Poetic Note */}
        <p className="mt-4 sm:mt-5 max-w-md text-xs sm:text-sm text-[#241208] font-editorial italic font-medium tracking-wide leading-relaxed px-4 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
          "Nơi từng khoảnh khắc được nâng niu và cất giữ vẹn nguyên cùng thời gian."
        </p>
      </main>

      {/* =========================================================================
          AUDIO PLAYER ONLY
          ========================================================================= */}
      <footer className="relative z-20 w-full px-6 py-6 flex items-center justify-start">
        <AudioPlayer onInteract={() => setHasInteracted(true)} />
      </footer>

      {/* =========================================================================
          AUTOPLAY NOTIFICATION TOAST
          Appears gracefully if browser security blocks unmuted autoplay
          ========================================================================= */}
      {autoplayBlocked && !hasInteracted && (
        <div
          onClick={() => {
            setHasInteracted(true);
            soundManager.start();
            setAutoplayBlocked(false);
          }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 cursor-pointer animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-900/85 backdrop-blur-md text-amber-100 border border-amber-400/30 shadow-2xl hover:scale-105 transition-all text-xs">
            <Volume2 className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>Nhấp vào màn hình để lắng nghe nhạc nền nhẹ nhàng</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
