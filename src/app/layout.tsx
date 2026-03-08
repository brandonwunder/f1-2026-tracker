import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/Navigation';

const inter = Inter({ subsets: ['latin'] });
const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Brycen's F1 2026 Tracker",
  description: 'Track the 2026 Formula One season — races, drivers, standings, and predictions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${orbitron.variable}`}>
      <body className={`${inter.className} bg-f1-dark text-white min-h-screen selection:bg-f1-red/30 selection:text-white`}>
        <Navigation />
        <main className="pt-16 lg:pt-0 lg:ml-64 min-h-screen">
          <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
