'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Flag,
  Users,
  Trophy,
  Target,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/components/ui/cn';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Races', href: '/calendar', icon: Flag },
  { label: 'Drivers', href: '/drivers', icon: Users },
  { label: 'Standings', href: '/standings', icon: Trophy },
  { label: 'Predictions', href: '/predictions', icon: Target },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const activeIndex = NAV_ITEMS.findIndex((item) => isActive(item.href));

  return (
    <>
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-f1-surface/90 backdrop-blur-lg border-b border-f1-border lg:hidden">
        <span className="font-orbitron text-xl font-bold text-f1-red tracking-tight">
          F1 2026
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-white hover:text-f1-red transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar / Mobile drawer */}
      <nav
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-f1-surface/95 backdrop-blur-xl border-r border-f1-border flex flex-col transition-transform duration-300 ease-out',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header with checkered pattern */}
        <div className="relative flex items-center h-16 px-6 border-b border-f1-border overflow-hidden">
          <div className="absolute inset-0 checkered-pattern opacity-30" />
          <div className="relative flex items-center gap-2">
            <div className="w-2 h-8 bg-f1-red rounded-full" />
            <span className="font-orbitron text-2xl font-bold text-f1-red tracking-tight">
              F1 2026
            </span>
          </div>
        </div>

        <div className="relative flex-1 py-4 px-3 space-y-1">
          {/* Animated active indicator */}
          {activeIndex >= 0 && (
            <motion.div
              className="absolute left-3 right-3 h-10 rounded-lg bg-f1-red/10 border border-f1-red/20"
              layoutId="nav-active"
              style={{ top: `${16 + activeIndex * 44}px` }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors z-10',
                  active
                    ? 'text-f1-red'
                    : 'text-f1-muted hover:text-white hover:bg-f1-surface-hover'
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {item.label}
                {active && (
                  <motion.div
                    layoutId="nav-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-f1-red"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="relative px-6 py-4 border-t border-f1-border overflow-hidden">
          <div className="absolute inset-0 checkered-pattern opacity-20" />
          <p className="relative text-xs text-f1-muted font-medium">
            Brycen&apos;s F1 Tracker
          </p>
          <p className="relative text-[10px] text-f1-muted/50 mt-0.5">
            2026 Season
          </p>
        </div>
      </nav>
    </>
  );
}
