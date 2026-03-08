import Link from "next/link";
import { getCountryFlag, formatRaceDateLong } from "@/lib/utils/dates";
import CountdownTimer from "@/components/race/CountdownTimer";

interface NextRaceWidgetProps {
  round: string;
  raceName: string;
  circuitName: string;
  country: string;
  locality: string;
  date: string;
  time?: string;
}

export default function NextRaceWidget({
  round,
  raceName,
  circuitName,
  country,
  locality,
  date,
  time,
}: NextRaceWidgetProps) {
  const flag = getCountryFlag(country);
  const formattedDate = formatRaceDateLong(date);
  const targetDate = time ? `${date}T${time}` : `${date}T14:00:00Z`;

  return (
    <Link
      href={`/race/${round}`}
      className="group block rounded-xl bg-f1-surface border border-f1-red/30 p-6 transition-all duration-200 hover:border-f1-red/60 hover:bg-f1-surface-hover"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-f1-red text-xs font-bold uppercase tracking-wider">
          Up Next &mdash; Round {round}
        </span>
        <span className="text-xs text-f1-muted group-hover:text-white transition-colors">
          View details &rarr;
        </span>
      </div>

      {/* Race info */}
      <div className="flex items-start gap-3 mb-5">
        <span className="text-4xl leading-none">{flag}</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-white leading-tight">
            {raceName}
          </h2>
          <p className="text-f1-muted text-sm mt-1">{circuitName}</p>
          <p className="text-f1-muted text-sm">
            {locality} &middot; {formattedDate}
          </p>
        </div>
      </div>

      {/* Countdown */}
      <CountdownTimer targetDate={targetDate} raceName={raceName} />
    </Link>
  );
}
