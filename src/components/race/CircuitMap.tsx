import type { CircuitData } from "@/lib/data/circuits";

interface CircuitMapProps {
  circuit: CircuitData;
}

/**
 * Simplified SVG circuit outlines for iconic tracks.
 * Each path is drawn in a 400x300 viewBox.
 * Stroke colors: track = f1-muted, DRS = f1-red, start/finish = green-500
 */
function getCircuitSVG(circuitId: string): JSX.Element | null {
  switch (circuitId) {
    case "monaco":
      return (
        <g>
          {/* Track outline */}
          <path
            d="M 80,60 L 200,40 Q 230,40 240,60 L 260,100 Q 270,130 250,140 L 200,150 Q 180,155 170,170 L 160,200 Q 155,220 170,230 L 280,240 Q 310,245 320,220 L 330,160 Q 335,130 320,110 L 300,80 Q 290,60 270,55 L 240,60"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Start/finish line */}
          <line x1="80" y1="55" x2="80" y2="65" stroke="#22C55E" strokeWidth="3" />
          {/* DRS zone - main straight */}
          <path
            d="M 80,60 L 200,40"
            fill="none"
            stroke="#E10600"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* DRS label */}
          <text x="130" y="35" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* Sector markers */}
          <circle cx="240" cy="60" r="3" fill="#FBBF24" />
          <text x="245" y="55" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="170" cy="170" r="3" fill="#3B82F6" />
          <text x="175" y="165" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    case "monza":
      return (
        <g>
          {/* Track outline - temple of speed */}
          <path
            d="M 100,250 L 100,80 Q 100,50 130,45 L 250,40 Q 290,40 300,70 L 310,120 Q 315,140 300,150 L 260,165 Q 240,175 245,195 L 260,230 Q 270,260 240,270 L 140,270 Q 110,270 100,250 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Start/finish line */}
          <line x1="95" y1="250" x2="105" y2="250" stroke="#22C55E" strokeWidth="3" />
          {/* DRS zone 1 - main straight */}
          <path
            d="M 100,250 L 100,80"
            fill="none"
            stroke="#E10600"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <text x="60" y="170" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS zone 2 */}
          <path
            d="M 260,230 Q 270,260 240,270 L 140,270"
            fill="none"
            stroke="#E10600"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <text x="180" y="285" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* Sector markers */}
          <circle cx="250" cy="40" r="3" fill="#FBBF24" />
          <text x="255" y="36" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="260" cy="165" r="3" fill="#3B82F6" />
          <text x="265" y="162" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    case "silverstone":
      return (
        <g>
          {/* Track outline */}
          <path
            d="M 100,180 L 130,100 Q 140,75 165,70 L 240,65 Q 265,65 275,80 L 310,140 Q 320,165 300,180 L 270,200 Q 250,215 260,235 L 280,255 Q 290,270 275,280 L 200,285 Q 170,285 155,270 L 120,230 Q 105,210 100,180 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Start/finish */}
          <line x1="95" y1="180" x2="105" y2="180" stroke="#22C55E" strokeWidth="3" />
          {/* DRS - Wellington Straight */}
          <path
            d="M 130,100 Q 140,75 165,70 L 240,65"
            fill="none"
            stroke="#E10600"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <text x="170" y="55" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS - Hangar Straight */}
          <path
            d="M 310,140 Q 320,165 300,180 L 270,200"
            fill="none"
            stroke="#E10600"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <text x="310" y="165" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* Sector markers */}
          <circle cx="275" cy="80" r="3" fill="#FBBF24" />
          <text x="280" y="76" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="260" cy="235" r="3" fill="#3B82F6" />
          <text x="265" y="231" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    case "spa":
      return (
        <g>
          {/* Track outline - Spa-Francorchamps */}
          <path
            d="M 80,200 L 80,120 Q 80,90 100,80 L 160,55 Q 180,48 195,60 L 220,90 Q 230,105 250,100 L 310,80 Q 335,73 340,95 L 340,160 Q 340,185 320,190 L 260,200 Q 235,205 225,225 L 210,260 Q 200,280 175,275 L 110,255 Q 85,248 80,225 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Start/finish */}
          <line x1="75" y1="200" x2="85" y2="200" stroke="#22C55E" strokeWidth="3" />
          {/* DRS - Kemmel Straight */}
          <path
            d="M 195,60 L 220,90 Q 230,105 250,100 L 310,80"
            fill="none"
            stroke="#E10600"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <text x="240" y="65" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS - main straight approach */}
          <path
            d="M 110,255 Q 85,248 80,225 L 80,200"
            fill="none"
            stroke="#E10600"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <text x="50" y="235" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* Sector markers */}
          <circle cx="160" cy="55" r="3" fill="#FBBF24" />
          <text x="165" y="50" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="260" cy="200" r="3" fill="#3B82F6" />
          <text x="265" y="196" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    case "cota":
      return (
        <g>
          {/* Track outline - COTA */}
          <path
            d="M 100,200 L 120,100 Q 125,75 150,68 L 200,60 Q 225,58 235,75 L 260,120 Q 270,145 290,140 L 320,130 Q 340,125 340,145 L 335,200 Q 330,230 305,240 L 240,255 Q 210,260 200,245 L 180,215 Q 170,195 150,200 L 110,210 Q 95,215 100,200 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Start/finish */}
          <line x1="95" y1="200" x2="105" y2="200" stroke="#22C55E" strokeWidth="3" />
          {/* DRS zone - back straight */}
          <path
            d="M 335,200 Q 330,230 305,240 L 240,255"
            fill="none"
            stroke="#E10600"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <text x="290" y="255" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS zone - main straight */}
          <path
            d="M 110,210 Q 95,215 100,200 L 120,100"
            fill="none"
            stroke="#E10600"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <text x="60" y="160" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* Sector markers */}
          <circle cx="235" cy="75" r="3" fill="#FBBF24" />
          <text x="240" y="71" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="290" cy="140" r="3" fill="#3B82F6" />
          <text x="295" y="136" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    default:
      return null;
  }
}

export default function CircuitMap({ circuit }: CircuitMapProps) {
  const svgContent = getCircuitSVG(circuit.id);

  return (
    <div className="rounded-xl bg-f1-surface border border-f1-border p-5">
      <h3 className="text-lg font-bold mb-3">Circuit Map</h3>

      <div className="relative bg-f1-dark rounded-lg overflow-hidden">
        {svgContent ? (
          <svg
            viewBox="0 0 400 300"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circuit name */}
            <text x="200" y="20" fill="#8B8B9E" fontSize="11" textAnchor="middle" fontWeight="600">
              {circuit.name}
            </text>
            {svgContent}
            {/* Start/finish label */}
            <text x="200" y="295" fill="#22C55E" fontSize="9" textAnchor="middle">
              &#9632; Start / Finish
            </text>
          </svg>
        ) : (
          /* Generic placeholder for circuits without SVG */
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <svg
              viewBox="0 0 100 100"
              className="w-20 h-20 mb-3 opacity-30"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Generic track icon */}
              <ellipse
                cx="50"
                cy="50"
                rx="40"
                ry="30"
                fill="none"
                stroke="#8B8B9E"
                strokeWidth="4"
                strokeDasharray="8 4"
              />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#8B8B9E" strokeWidth="2" />
              <line x1="50" y1="20" x2="50" y2="15" stroke="#22C55E" strokeWidth="3" />
            </svg>
            <span className="text-f1-muted text-sm font-medium">{circuit.name}</span>
            <span className="text-f1-muted text-xs mt-1">
              {circuit.lengthKm.toFixed(3)} km &middot; {circuit.turns} turns
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 text-xs text-f1-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#8B8B9E] inline-block rounded" />
          <span>Track</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-f1-red inline-block rounded opacity-70" />
          <span>DRS Zone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 inline-block rounded-sm" />
          <span>Start/Finish</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-yellow-400 inline-block rounded-full" />
          <span>S2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-blue-500 inline-block rounded-full" />
          <span>S3</span>
        </div>
      </div>
    </div>
  );
}
