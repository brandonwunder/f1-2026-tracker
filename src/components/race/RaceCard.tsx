import Link from "next/link";
import {
  formatRaceDate,
  getCountryFlag,
  type RaceStatus,
} from "@/lib/utils/dates";

interface RaceCardProps {
  round: string;
  raceName: string;
  circuitName: string;
  country: string;
  locality: string;
  date: string;
  status: RaceStatus;
}

export default function RaceCard({
  round,
  raceName,
  circuitName,
  country,
  locality,
  date,
  status,
}: RaceCardProps) {
  const flag = getCountryFlag(country);
  const formattedDate = formatRaceDate(date);

  const isPast = status === "past";
  const isNext = status === "next";

  return (
    <Link
      href={`/race/${round}`}
      className={`
        group relative block rounded-xl bg-f1-surface border p-4
        transition-all duration-200 hover:bg-f1-surface-hover hover:scale-[1.02]
        ${isNext ? "border-f1-red ring-2 ring-f1-red/40" : "border-f1-border"}
        ${isPast ? "opacity-70" : ""}
      `}
    >
      {/* Next race badge */}
      {isNext && (
        <span className="absolute -top-2.5 left-4 bg-f1-red text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
          Next Race
        </span>
      )}

      {/* Past race checkmark */}
      {isPast && (
        <span className="absolute top-3 right-3 text-green-500 text-sm" title="Completed">
          &#10003;
        </span>
      )}

      {/* Round number */}
      <div className="text-f1-muted text-xs font-medium uppercase tracking-wider mb-2">
        Round {round}
      </div>

      {/* Country flag + race name */}
      <div className="flex items-start gap-2 mb-1">
        <span className="text-2xl leading-none mt-0.5">{flag}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm leading-tight truncate">
            {raceName}
          </h3>
          <p className="text-f1-muted text-xs mt-0.5 truncate">
            {circuitName}
          </p>
        </div>
      </div>

      {/* Date and locality */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-f1-border">
        <span className="text-xs text-f1-muted">{locality}</span>
        <span className={`text-xs font-medium ${isNext ? "text-f1-red" : "text-f1-muted"}`}>
          {formattedDate}
        </span>
      </div>
    </Link>
  );
}
