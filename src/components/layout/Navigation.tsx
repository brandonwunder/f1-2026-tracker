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
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-[#0A0A12]/95 backdrop-blur-xl border-b border-f1-red/20 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-f1-red rounded-full" />
          <span className="font-orbitron text-lg font-bold tracking-tight">
            <span className="text-f1-red">F1</span>
            <span className="text-white/80 ml-1">2026</span>
          </span>
        </div>
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
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <nav
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-300 ease-out',
          'bg-[#08080E]/98 backdrop-blur-xl border-r border-f1-border',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header — F1 broadcast style */}
        <div className="relative h-16 px-6 flex items-center border-b border-f1-border overflow-hidden">
          {/* Red accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-f1-red to-transparent" />
          <div className="absolute inset-0 carbon-fiber opacity-40" />

          <div className="relative flex items-center gap-3">
            <div className="w-2 h-10 bg-f1-red rounded-sm shadow-[0_0_12px_rgba(225,6,0,0.5)]" />
            <div>
              <span className="font-orbitron text-2xl font-black tracking-tight">
                <span className="text-f1-red">F1</span>
                <span className="text-white/90 ml-1.5">2026</span>
              </span>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div className="relative flex-1 py-6 px-3 space-y-1">
          {/* Active background */}
          {activeIndex >= 0 && (
            <motion.div
              className="absolute left-3 right-3 h-11 rounded-lg"
              layoutId="nav-active"
              style={{
                top: `${24 + activeIndex * 48}px`,
                background: 'linear-gradient(90deg, rgba(225, 6, 0, 0.15), rgba(225, 6, 0, 0.05))',
                borderLeft: '3px solid #E10600',
                boxShadow: '0 0 20px rgba(225, 6, 0, 0.1)',
              }}
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
                  'relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all z-10',
                  active
                    ? 'text-white'
                    : 'text-f1-muted hover:text-white hover:bg-white/[0.03]'
                )}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'text-f1-red' : ''}
                />
                <span className="tracking-wide uppercase text-xs">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="nav-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-f1-red shadow-[0_0_8px_rgba(225,6,0,0.6)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="relative px-6 py-4 border-t border-f1-border overflow-hidden">
          <div className="absolute inset-0 carbon-fiber opacity-30" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-f1-red/50 to-transparent" />
          <p className="relative text-xs text-white/60 font-semibold tracking-wider uppercase">
            Brycen&apos;s Tracker
          </p>
          <p className="relative text-[10px] text-f1-muted/50 mt-0.5 font-mono">
            2026 SEASON
          </p>
        </div>
      </nav>
    </>
  );
}
