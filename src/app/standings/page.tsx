import { getDriverStandings, getConstructorStandings } from '@/lib/api/jolpica';
import DriverStandings from '@/components/standings/DriverStandings';
import ConstructorStandings from '@/components/standings/ConstructorStandings';
import { PageTransition } from '@/components/ui/MotionWrappers';
import PageBackground from '@/components/ui/PageBackground';

export default async function StandingsPage() {
  const [driverStandings, constructorStandings] = await Promise.all([
    getDriverStandings(),
    getConstructorStandings(),
  ]);

  return (
    <>
    <PageBackground page="standings" />
    <PageTransition>
      <div className="space-y-8">
        {/* Page header — broadcast style */}
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-f1-red rounded-full shadow-[0_0_12px_rgba(225,6,0,0.4)]" />
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            <span className="text-f1-red">CHAMPIONSHIP</span> STANDINGS
          </h1>
          <p className="text-f1-muted text-sm mt-1 font-medium tracking-wide uppercase">
            2026 Season Leaderboard
          </p>
        </div>
        <div className="broadcast-divider" />

        {/* Driver Championship */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-black uppercase tracking-wide text-white">
            Driver Championship
          </h2>
          <DriverStandings standings={driverStandings} />
        </section>

        {/* Constructor Championship */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-black uppercase tracking-wide text-white">
            Constructor Championship
          </h2>
          <ConstructorStandings
            standings={constructorStandings}
            driverStandings={driverStandings}
          />
        </section>
      </div>
    </PageTransition>
    </>
  );
}
