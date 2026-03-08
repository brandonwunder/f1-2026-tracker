import { getDriverStandings, getConstructorStandings } from '@/lib/api/jolpica';
import DriverStandings from '@/components/standings/DriverStandings';
import ConstructorStandings from '@/components/standings/ConstructorStandings';

export default async function StandingsPage() {
  const [driverStandings, constructorStandings] = await Promise.all([
    getDriverStandings(),
    getConstructorStandings(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold">Championship Standings</h1>

      {/* Driver Championship */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold text-f1-muted">
          Driver Championship
        </h2>
        <DriverStandings standings={driverStandings} />
      </section>

      {/* Constructor Championship */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold text-f1-muted">
          Constructor Championship
        </h2>
        <ConstructorStandings
          standings={constructorStandings}
          driverStandings={driverStandings}
        />
      </section>
    </div>
  );
}
