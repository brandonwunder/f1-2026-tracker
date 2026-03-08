import type { CircuitData } from "@/lib/data/circuits";

interface CircuitInfoProps {
  circuit: CircuitData;
}

export default function CircuitInfo({ circuit }: CircuitInfoProps) {
  const typeLabel =
    circuit.type === "street"
      ? "Street Circuit"
      : circuit.type === "semi-permanent"
      ? "Semi-Permanent"
      : "Permanent Circuit";

  return (
    <div className="rounded-xl bg-f1-surface border border-f1-border p-5">
      <h3 className="text-lg font-bold mb-4">Circuit Information</h3>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {/* Location */}
        <div>
          <span className="text-f1-muted block text-xs uppercase tracking-wider mb-0.5">
            Location
          </span>
          <span className="font-medium">{circuit.location}</span>
        </div>

        {/* Circuit Type */}
        <div>
          <span className="text-f1-muted block text-xs uppercase tracking-wider mb-0.5">
            Circuit Type
          </span>
          <span className="font-medium">{typeLabel}</span>
        </div>

        {/* Track Length */}
        <div>
          <span className="text-f1-muted block text-xs uppercase tracking-wider mb-0.5">
            Track Length
          </span>
          <span className="font-medium">{circuit.lengthKm.toFixed(3)} km</span>
        </div>

        {/* Number of Turns */}
        <div>
          <span className="text-f1-muted block text-xs uppercase tracking-wider mb-0.5">
            Turns
          </span>
          <span className="font-medium">{circuit.turns}</span>
        </div>

        {/* First GP */}
        <div>
          <span className="text-f1-muted block text-xs uppercase tracking-wider mb-0.5">
            First Grand Prix
          </span>
          <span className="font-medium">{circuit.firstGP}</span>
        </div>

        {/* Lap Record */}
        <div>
          <span className="text-f1-muted block text-xs uppercase tracking-wider mb-0.5">
            Lap Record
          </span>
          <span className="font-medium">
            {circuit.lapRecord.time}
          </span>
          <span className="text-f1-muted block text-xs">
            {circuit.lapRecord.driver} ({circuit.lapRecord.year})
          </span>
        </div>
      </div>

      {/* Overtaking Spots */}
      <div className="mt-4 pt-4 border-t border-f1-border">
        <span className="text-f1-muted block text-xs uppercase tracking-wider mb-2">
          Key Overtaking Spots
        </span>
        <ul className="space-y-1">
          {circuit.overtakingSpots.map((spot) => (
            <li key={spot} className="text-sm flex items-start gap-2">
              <span className="text-f1-red mt-0.5 shrink-0">&#9656;</span>
              <span>{spot}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
