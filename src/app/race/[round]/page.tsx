import { getRaceResults, getQualifyingResults } from "@/lib/api/jolpica";
import { CALENDAR_2026 } from "@/lib/data/calendar-fallback";
import { getCircuitByName } from "@/lib/data/circuits";
import { formatRaceDateLong, getCountryFlag } from "@/lib/utils/dates";
import CircuitInfo from "@/components/race/CircuitInfo";
import CircuitMap from "@/components/race/CircuitMap";
import QualifyingResults from "@/components/race/QualifyingResults";
import RaceResults from "@/components/race/RaceResults";
import RaceStatusBanner from "@/components/race/RaceStatusBanner";
import PredictionPanel from "@/components/predictions/PredictionPanel";
import Link from "next/link";
import { PageTransition } from "@/components/ui/MotionWrappers";

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
    <PageTransition>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Back navigation */}
        <Link
          href="/calendar"
          className="text-f1-muted hover:text-f1-red text-sm font-semibold inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider"
        >
          &larr; Back to Calendar
        </Link>

        {/* Race header — broadcast style */}
        <div className="relative rounded-xl glass-card border border-f1-border overflow-hidden">
          {/* Racing stripe top */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-f1-red to-transparent" />
          {/* Carbon fiber texture */}
          <div className="absolute inset-0 carbon-fiber opacity-30 pointer-events-none" />

          <div className="relative p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-f1-red bg-f1-red/10 px-2 py-0.5 rounded border border-f1-red/20">
                    Round {raceInfo.round}
                  </span>
                  <span className="text-f1-muted text-xs font-medium tracking-wide">
                    {formatRaceDateLong(raceInfo.date)}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  <span className="text-3xl md:text-4xl mr-2">{flag}</span>
                  {raceInfo.raceName}
                </h1>
                <p className="text-f1-muted text-sm mt-1 font-medium">
                  {raceInfo.circuitName} &middot; {raceInfo.locality}, {raceInfo.country}
                </p>
              </div>
              {/* Round badge — broadcast style */}
              <div className="shrink-0">
                <div className="relative inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-f1-dark/80 border border-f1-border overflow-hidden">
                  <div className="absolute inset-0 carbon-fiber opacity-40 pointer-events-none" />
                  <div className="relative flex items-baseline gap-1.5">
                    <span className="text-[10px] text-f1-muted uppercase tracking-widest font-semibold">Round</span>
                    <span className="text-3xl font-black text-f1-red font-orbitron">{raceInfo.round}</span>
                    <span className="text-f1-muted text-xs font-medium">/ 24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom broadcast divider */}
          <div className="broadcast-divider" />
        </div>

        {/* Race weekend status banner */}
        <RaceStatusBanner
          raceDate={raceInfo.date}
          raceTime={raceInfo.time ?? "14:00:00Z"}
          hasQualifying={(qualifyingData?.QualifyingResults?.length ?? 0) > 0}
          hasRaceResults={(raceData?.Results?.length ?? 0) > 0}
        />

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
        <div className="relative flex justify-between items-center pt-4">
          <div className="absolute top-0 left-0 right-0 broadcast-divider" />
          {roundNum > 1 ? (
            <Link
              href={`/race/${roundNum - 1}`}
              className="text-sm text-f1-muted hover:text-f1-red transition-colors inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider"
            >
              &larr; Round {roundNum - 1}
            </Link>
          ) : (
            <div />
          )}
          {roundNum < 24 ? (
            <Link
              href={`/race/${roundNum + 1}`}
              className="text-sm text-f1-muted hover:text-f1-red transition-colors inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider"
            >
              Round {roundNum + 1} &rarr;
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
