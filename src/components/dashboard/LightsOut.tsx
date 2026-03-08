'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LightsOutProps {
  children: ReactNode;
}

/**
 * Speed lines that streak across the screen for the "lights out" moment.
 */
function SpeedLines({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => {
        const top = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const width = 30 + Math.random() * 70;
        return (
          <motion.div
            key={i}
            className="absolute h-[1px]"
            style={{
              top: `${top}%`,
              left: '-10%',
              width: `${width}%`,
              background: `linear-gradient(90deg, transparent, ${i % 3 === 0 ? 'rgba(225,6,0,0.6)' : 'rgba(255,255,255,0.15)'}, transparent)`,
            }}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 0.4 + Math.random() * 0.3,
              delay,
              ease: 'easeIn',
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * Animated tachometer/rev counter that builds up during the light sequence.
 */
function RevCounter({ litCount, phase }: { litCount: number; phase: string }) {
  const rpm = phase === 'out' ? 0 : litCount * 3200;
  const maxRpm = 16000;
  const angle = (rpm / maxRpm) * 240 - 120; // -120 to +120 degree sweep

  return (
    <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 w-32 h-16 sm:w-40 sm:h-20 overflow-hidden opacity-30">
      {/* Arc background */}
      <svg viewBox="0 0 200 100" className="w-full h-full">
        {/* Track */}
        <path
          d="M 20 95 A 80 80 0 0 1 180 95"
          fill="none"
          stroke="#2A2A3A"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Fill */}
        <motion.path
          d="M 20 95 A 80 80 0 0 1 180 95"
          fill="none"
          stroke="#E10600"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: rpm / maxRpm }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        {/* Needle */}
        <motion.line
          x1="100"
          y1="95"
          x2="100"
          y2="25"
          stroke="#E10600"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transformOrigin: '100px 95px' }}
          animate={{ rotate: angle }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        {/* Center dot */}
        <circle cx="100" cy="95" r="4" fill="#E10600" />
      </svg>
      {/* RPM text */}
      <motion.p
        className="absolute bottom-0 left-1/2 -translate-x-1/2 font-orbitron text-[10px] sm:text-xs text-f1-red/60 tracking-widest"
        animate={{ opacity: phase === 'out' ? 0 : 1 }}
      >
        {rpm.toLocaleString()} RPM
      </motion.p>
    </div>
  );
}

export default function LightsOut({ children }: LightsOutProps) {
  const [phase, setPhase] = useState<'idle' | 'sequence' | 'out' | 'reveal' | 'done'>('idle');
  const [litCount, setLitCount] = useState(0);

  const skipSequence = useCallback(() => {
    setPhase('done');
  }, []);

  useEffect(() => {
    // Always play the intro on every page load

    // Start the light sequence
    setPhase('sequence');

    // Light up each of 5 lights with 500ms delay (more tension)
    const lightTimers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 5; i++) {
      lightTimers.push(
        setTimeout(() => setLitCount(i), i * 500)
      );
    }

    // After all 5 lit (5*500=2500ms) + 800ms suspense pause = 3300ms
    const outTimer = setTimeout(() => {
      setPhase('out');
    }, 3300);

    // Reveal phase — text animation
    const revealTimer = setTimeout(() => {
      setPhase('reveal');
    }, 3600);

    // Done
    const doneTimer = setTimeout(() => {
      setPhase('done');
      try {
        sessionStorage.setItem('f1-lights-seen', '1');
      } catch {}
    }, 5000);

    return () => {
      lightTimers.forEach(clearTimeout);
      clearTimeout(outTimer);
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    );
  }

  const isOut = phase === 'out' || phase === 'reveal';
  const isReveal = phase === 'reveal';

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-f1-dark overflow-hidden cursor-pointer"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={skipSequence}
        >
          {/* Background grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(225,6,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(225,6,0,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Animated red glow that builds with each light */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: isOut
                ? 'radial-gradient(ellipse at center, rgba(225,6,0,0) 0%, rgba(10,10,18,1) 50%)'
                : `radial-gradient(ellipse at center, rgba(225,6,0,${litCount * 0.04}) 0%, rgba(10,10,18,1) 70%)`,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Speed lines on lights out */}
          <SpeedLines active={isOut && !isReveal} />

          {/* Racing stripe flash on lights out */}
          {isOut && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: 'linear-gradient(90deg, transparent, #E10600, transparent)' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          )}

          {/* "RACE COMMAND" header */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isReveal ? 0 : 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="font-orbitron text-[10px] sm:text-xs text-f1-muted/40 uppercase tracking-[0.4em] mb-2">
              2026 Formula One Season
            </p>
            <h1 className="font-orbitron text-2xl sm:text-3xl font-black tracking-tight">
              <span className="text-f1-red">RACE</span>{' '}
              <span className="text-white/80">COMMAND</span>
            </h1>
          </motion.div>

          {/* 5 red light panels — F1 starting lights style */}
          <div className="flex items-center gap-3 sm:gap-5 relative">
            {/* Metal housing bar */}
            <div className="absolute -inset-x-6 -inset-y-4 rounded-2xl border border-f1-border/30 bg-[#0D0D16]/80" />

            {Array.from({ length: 5 }).map((_, i) => {
              const isLit = phase === 'sequence' && litCount > i;

              return (
                <motion.div
                  key={i}
                  className="relative z-10"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{
                    scale: isLit && !isOut ? [1, 1.08, 1] : isOut ? 0.7 : 0.85,
                    opacity: isOut ? 0.08 : isLit ? 1 : 0.25,
                  }}
                  transition={{
                    duration: isOut ? 0.15 : 0.35,
                    ease: isOut ? 'easeIn' : 'easeOut',
                  }}
                >
                  {/* Outer housing */}
                  <div
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: '#0D0D16',
                      border: `3px solid ${isLit && !isOut ? '#E10600' : '#1F1F2B'}`,
                      boxShadow: isLit && !isOut
                        ? `0 0 40px 15px rgba(225, 6, 0, 0.5), 0 0 80px 30px rgba(225, 6, 0, 0.2), inset 0 0 20px rgba(225, 6, 0, 0.3)`
                        : 'inset 0 2px 6px rgba(0,0,0,0.5)',
                      transition: isOut ? 'all 0.15s ease-in' : 'all 0.35s ease-out',
                    }}
                  >
                    {/* Light bulb */}
                    <div
                      className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
                      style={{
                        background: isLit && !isOut
                          ? 'radial-gradient(circle, #ff6b6b 0%, #E10600 50%, #8b0000 100%)'
                          : 'radial-gradient(circle, #2A2A3A 0%, #1A1A28 100%)',
                        boxShadow: isLit && !isOut
                          ? '0 0 20px 8px rgba(255, 68, 68, 0.6), inset 0 -3px 6px rgba(139, 0, 0, 0.5)'
                          : 'inset 0 2px 4px rgba(0,0,0,0.3)',
                        transition: isOut ? 'all 0.15s ease-in' : 'all 0.35s ease-out',
                      }}
                    />
                  </div>

                  {/* Light number */}
                  <p
                    className="text-center mt-2 font-orbitron text-[10px] tracking-wider"
                    style={{
                      color: isLit && !isOut ? '#E10600' : '#2A2A3A',
                      transition: 'color 0.3s',
                    }}
                  >
                    {i + 1}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* "LIGHTS OUT AND AWAY WE GO" reveal */}
          <AnimatePresence>
            {isReveal && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Dramatic red flash */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ background: 'radial-gradient(ellipse at center, rgba(225,6,0,0.3), transparent 70%)' }}
                />

                {/* Main text */}
                <motion.div
                  className="relative text-center"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.p
                    className="font-orbitron text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight"
                    initial={{ letterSpacing: '0.3em', opacity: 0 }}
                    animate={{ letterSpacing: '-0.02em', opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <span className="text-f1-red">LIGHTS</span> OUT
                  </motion.p>
                  <motion.div
                    className="h-[2px] bg-gradient-to-r from-transparent via-f1-red to-transparent my-3"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  />
                  <motion.p
                    className="font-orbitron text-lg sm:text-2xl md:text-3xl font-bold text-white/70 tracking-wider"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    AND AWAY WE GO
                  </motion.p>
                </motion.div>

                {/* Horizontal speed lines */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const top = 10 + (i / 12) * 80;
                    return (
                      <motion.div
                        key={i}
                        className="absolute h-[1px]"
                        style={{
                          top: `${top}%`,
                          left: 0,
                          right: 0,
                          background: `linear-gradient(90deg, transparent 0%, rgba(225,6,0,${0.05 + Math.random() * 0.1}) 30%, transparent 70%)`,
                        }}
                        initial={{ x: i % 2 === 0 ? '-100%' : '100%' }}
                        animate={{ x: i % 2 === 0 ? '100%' : '-100%' }}
                        transition={{ duration: 0.8, delay: 0.1 + i * 0.04, ease: 'easeOut' }}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rev counter */}
          <RevCounter litCount={litCount} phase={phase} />

          {/* Skip hint */}
          <motion.p
            className="absolute bottom-4 font-orbitron text-f1-muted/30 text-[10px] uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: isReveal ? 0 : 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            Tap to skip
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
