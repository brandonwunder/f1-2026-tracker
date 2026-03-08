'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/components/ui/cn';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: '🏠' },
  { label: 'Races', href: '/calendar', icon: '🏁' },
  { label: 'Drivers', href: '/drivers', icon: '🏎️' },
  { label: 'Standings', href: '/standings', icon: '🏆' },
  { label: 'Predictions', href: '/predictions', icon: '🎯' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-f1-surface border-b border-f1-border lg:hidden">
        <span className="text-xl font-bold text-f1-red tracking-tight">F1 2026</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-white hover:text-f1-red transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar / Mobile drawer */}
      <nav
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-f1-surface border-r border-f1-border flex flex-col transition-transform duration-200',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center h-16 px-6 border-b border-f1-border">
          <span className="text-2xl font-bold text-f1-red tracking-tight">F1 2026</span>
        </div>

        <div className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-f1-red/10 text-f1-red'
                  : 'text-f1-muted hover:text-white hover:bg-f1-surface-hover'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-f1-border">
          <p className="text-xs text-f1-muted">Brycen&apos;s F1 Tracker</p>
        </div>
      </nav>
    </>
  );
}
