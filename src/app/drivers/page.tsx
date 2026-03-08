import { getDriverStandings } from '@/lib/api';
import DriverGrid from '@/components/drivers/DriverGrid';
import { PageTransition } from '@/components/ui/MotionWrappers';

export default async function DriversPage() {
  const standings = await getDriverStandings();

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Drivers</h1>
          <p className="text-f1-muted text-sm mt-1">
            2026 Formula One driver lineup and championship standings
          </p>
        </div>

        {standings.length > 0 ? (
          <DriverGrid standings={standings} />
        ) : (
          <div className="rounded-xl bg-f1-surface border border-f1-border p-8 text-center">
            <p className="text-f1-muted">
              Driver standings data is not yet available for the current season.
            </p>
            <p className="text-f1-muted text-sm mt-2">
              Check back once the season has started and results are in.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
