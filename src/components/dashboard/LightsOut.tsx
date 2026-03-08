'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LightsOutProps {
  children: ReactNode;
}

export default function LightsOut({ children }: LightsOutProps) {
  const [phase, setPhase] = useState<'idle' | 'sequence' | 'out' | 'done'>('idle');
  const [litCount, setLitCount] = useState(0);

  const skipSequence = useCallback(() => {
    setPhase('done');
    try {
      sessionStorage.setItem('f1-lights-seen', '1');
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('f1-lights-seen') === '1') {
        setPhase('done');
        return;
      }
    } catch {}

    // Start the light sequence
    setPhase('sequence');

    // Light up each of 5 lights with 400ms delay
    const lightTimers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 5; i++) {
      lightTimers.push(
        setTimeout(() => setLitCount(i), i * 400)
      );
    }

    // After all 5 lit (5*400=2000ms) + 600ms pause = 2600ms, go dark
    const outTimer = setTimeout(() => {
      setPhase('out');
    }, 2600);

    // After lights out, show content (200ms for the out animation)
    const doneTimer = setTimeout(() => {
      setPhase('done');
      try {
        sessionStorage.setItem('f1-lights-seen', '1');
      } catch {}
    }, 3200);

    return () => {
      lightTimers.forEach(clearTimeout);
      clearTimeout(outTimer);
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

  return (
    <>
      {/* Dark overlay with lights */}
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-f1-dark"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={skipSequence}
        >
            {/* Title */}
            <motion.p
              className="font-orbitron text-f1-muted text-sm uppercase tracking-[0.3em] mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Lights Out and Away We Go
            </motion.p>

            {/* 5 red light circles */}
            <div className="flex items-center gap-4 sm:gap-6">
              {Array.from({ length: 5 }).map((_, i) => {
                const isLit = phase === 'sequence' && litCount > i;
                const isOut = phase === 'out';

                return (
                  <motion.div
                    key={i}
                    className="relative"
                    initial={{ scale: 0.8, opacity: 0.3 }}
                    animate={{
                      scale: isLit && !isOut ? 1 : 0.8,
                      opacity: isOut ? 0.1 : isLit ? 1 : 0.3,
                    }}
                    transition={{
                      duration: isOut ? 0.2 : 0.3,
                      ease: 'easeOut',
                    }}
                  >
                    {/* Outer glow */}
                    <div
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-f1-border flex items-center justify-center"
                      style={{
                        backgroundColor: isLit && !isOut ? '#E10600' : '#1F1F2B',
                        boxShadow:
                          isLit && !isOut
                            ? '0 0 30px 10px rgba(225, 6, 0, 0.6), 0 0 60px 20px rgba(225, 6, 0, 0.3)'
                            : 'none',
                        transition: isOut ? 'all 0.2s ease-in' : 'all 0.3s ease-out',
                      }}
                    >
                      {/* Inner bright core */}
                      <div
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                        style={{
                          backgroundColor: isLit && !isOut ? '#ff4444' : '#2E2E3E',
                          boxShadow:
                            isLit && !isOut
                              ? '0 0 15px 5px rgba(255, 68, 68, 0.5)'
                              : 'none',
                          transition: isOut ? 'all 0.2s ease-in' : 'all 0.3s ease-out',
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Skip hint */}
            <motion.p
              className="font-orbitron text-f1-muted/40 text-xs mt-10 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              Click to skip
            </motion.p>
          </motion.div>
      </AnimatePresence>
    </>
  );
}
