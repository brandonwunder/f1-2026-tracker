import { getRaceResults, getQualifyingResults } from "@/lib/api/jolpica";
import { CALENDAR_2026 } from "@/lib/data/calendar-fallback";
import { getCircuitByName } from "@/lib/data/circuits";
import { formatRaceDateLong, getCountryFlag } from "@/lib/utils/dates";
import CircuitInfo from "@/components/race/CircuitInfo";
import CircuitMap from "@/components/race/CircuitMap";
import QualifyingResults from "@/components/race/QualifyingResults";
import RaceResults from "@/components/race/RaceResults";
import PredictionPanel from "@/components/predictions/PredictionPanel";
import Link from "next/link";

interface RaceDetailPageProps {
  params: Promise<{ round: string }>;
}

export default async function RaceDetailPage({ params }: RaceDetailPageProps) {
  const { round } = await params;
  const roundNum = parseInt(round, 10);

  // Find the race in the calendar
  const raceInfo = CALENDAR_2026.find((r) => r.round === roundNum);

  if (!raceInfo) {
    return (
      <div className="space-y-4">
        <Link
          href="/calendar"
          className="text-f1-muted hover:text-white text-sm inline-flex items-center gap-1 transition-colors"
        >
          &larr; Back to Calendar
        </Link>
        <div className="rounded-xl bg-f1-surface border border-f1-border p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Race Not Found</h1>
          <p className="text-f1-muted">Round {round} does not exist in the 2026 calendar.</p>
        </div>
      </div>
    );
  }

  // Fetch race results and qualifying in parallel
  const [raceData, qualifyingData] = await Promise.all([
    getRaceResults(roundNum),
    getQualifyingResults(roundNum),
  ]);

  const circuitData = getCircuitByName(raceInfo.circuitName);
  const flag = getCountryFlag(raceInfo.country);

  // Compute qualifying date (day before race, same time)
  const qualifyingDateISO = (() => {
    const raceDate = new Date(`${raceInfo.date}T${raceInfo.time ?? "14:00:00Z"}`);
    raceDate.setDate(raceDate.getDate() - 1);
    return raceDate.toISOString();
  })();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back navigation */}
      <Link
        href="/calendar"
        className="text-f1-muted hover:text-white text-sm inline-flex items-center gap-1 transition-colors"
      >
        &larr; Back to Calendar
      </Link>

      {/* Race header */}
      <div className="rounded-xl bg-f1-surface border border-f1-border p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-f1-muted text-sm font-medium">
                Round {raceInfo.round}
              </span>
              <span className="text-f1-border">|</span>
              <span className="text-f1-muted text-sm">
                {formatRaceDateLong(raceInfo.date)}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {flag} {raceInfo.raceName}
            </h1>
            <p className="text-f1-muted mt-1">
              {raceInfo.circuitName} &middot; {raceInfo.locality}, {raceInfo.country}
            </p>
          </div>
          {/* Round badge */}
          <div className="shrink-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-f1-dark border border-f1-border">
              <span className="text-f1-muted text-xs uppercase tracking-wider">Round</span>
              <span className="text-2xl font-bold text-f1-red">{raceInfo.round}</span>
              <span className="text-f1-muted text-xs">/ 24</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Circuit info and map */}
        <div className="lg:col-span-1 space-y-6">
          {circuitData && <CircuitInfo circuit={circuitData} />}
          {circuitData && <CircuitMap circuit={circuitData} />}

          {/* Prediction panel */}
          <PredictionPanel
            round={roundNum}
            qualifyingDateISO={qualifyingDateISO}
            raceResults={raceData?.Results ?? null}
          />
        </div>

        {/* Right column - Results */}
        <div className="lg:col-span-2 space-y-6">
          <QualifyingResults results={qualifyingData?.QualifyingResults ?? []} />
          <RaceResults results={raceData?.Results ?? []} />
        </div>
      </div>

      {/* Navigation between rounds */}
      <div className="flex justify-between items-center pt-4 border-t border-f1-border">
        {roundNum > 1 ? (
          <Link
            href={`/race/${roundNum - 1}`}
            className="text-sm text-f1-muted hover:text-white transition-colors inline-flex items-center gap-1"
          >
            &larr; Round {roundNum - 1}
          </Link>
        ) : (
          <div />
        )}
        {roundNum < 24 ? (
          <Link
            href={`/race/${roundNum + 1}`}
            className="text-sm text-f1-muted hover:text-white transition-colors inline-flex items-center gap-1"
          >
            Round {roundNum + 1} &rarr;
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
