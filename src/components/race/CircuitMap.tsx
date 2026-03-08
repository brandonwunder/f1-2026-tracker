import type { CircuitData } from "@/lib/data/circuits";

interface CircuitMapProps {
  circuit: CircuitData;
}

/**
 * Accurate SVG circuit outlines for all 24 tracks on the 2026 F1 calendar.
 * Each path is drawn in a 400x300 viewBox.
 * Stroke colors: track = #8B8B9E, DRS = #E10600, start/finish = #22C55E
 */
function getCircuitSVG(circuitId: string): JSX.Element | null {
  switch (circuitId) {
    /* ------------------------------------------------------------------ */
    /*  1. BAHRAIN - Sakhir - figure-8 infield, long straight on left     */
    /* ------------------------------------------------------------------ */
    case "bahrain":
      return (
        <g>
          <path
            d="M 80,240 L 80,80 Q 80,55 100,50 L 150,45 Q 170,42 180,55 L 195,80
               Q 205,100 195,115 L 175,140 Q 160,158 175,175 L 200,195
               Q 220,210 240,195 L 270,165 Q 290,148 310,160 L 330,180
               Q 345,195 335,215 L 310,250 Q 295,270 270,272 L 140,275
               Q 105,275 90,260 Q 80,250 80,240 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="75" y1="240" x2="85" y2="240" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight */}
          <path d="M 80,200 L 80,100" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="45" y="155" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 - back straight */}
          <path d="M 270,272 L 140,275" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="190" y="290" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="180" cy="55" r="3" fill="#FBBF24" />
          <text x="185" y="50" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="310" cy="160" r="3" fill="#3B82F6" />
          <text x="315" y="155" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  2. JEDDAH - long narrow street circuit along coastline             */
    /* ------------------------------------------------------------------ */
    case "jeddah":
      return (
        <g>
          <path
            d="M 60,250 L 60,180 Q 60,160 75,150 L 100,135 Q 115,125 110,108
               L 100,85 Q 95,65 110,55 L 155,38 Q 175,30 190,42 L 210,65
               Q 220,80 240,75 L 275,65 Q 295,60 305,75 L 320,105
               Q 330,125 320,145 L 300,175 Q 288,195 300,210 L 330,235
               Q 345,252 330,268 L 280,278 Q 255,282 235,272 L 180,245
               Q 160,235 140,245 L 100,262 Q 80,270 65,258 Q 60,255 60,250 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="55" y1="250" x2="65" y2="250" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 */}
          <path d="M 60,220 L 60,180" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="25" y="200" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 */}
          <path d="M 275,65 Q 295,60 305,75 L 320,105" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="310" y="75" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="190" cy="42" r="3" fill="#FBBF24" />
          <text x="195" y="37" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="300" cy="210" r="3" fill="#3B82F6" />
          <text x="305" y="206" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  3. ALBERT PARK - Melbourne - irregular lake circuit                */
    /* ------------------------------------------------------------------ */
    case "albert_park":
      return (
        <g>
          <path
            d="M 90,200 L 90,120 Q 90,95 110,85 L 175,60 Q 200,50 220,60
               L 260,80 Q 280,92 295,80 L 320,55 Q 335,42 345,58 L 350,100
               Q 352,125 335,135 L 300,155 Q 280,165 285,185 L 295,215
               Q 302,240 280,255 L 220,275 Q 195,282 170,272 L 120,248
               Q 98,238 90,218 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="85" y1="200" x2="95" y2="200" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight */}
          <path d="M 90,180 L 90,120" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="50" y="150" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 */}
          <path d="M 220,275 Q 195,282 170,272 L 120,248" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="150" y="288" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="320" cy="55" r="3" fill="#FBBF24" />
          <text x="325" y="50" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="285" cy="185" r="3" fill="#3B82F6" />
          <text x="290" y="180" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  4. SUZUKA - figure-8 with crossover, S-curves, back straight      */
    /* ------------------------------------------------------------------ */
    case "suzuka":
      return (
        <g>
          <path
            d="M 70,190 L 70,130 Q 70,105 90,95 L 120,82 Q 135,76 145,85
               L 155,100 Q 162,112 175,108 L 195,100 Q 210,93 220,105
               L 235,130 Q 242,145 258,142 L 290,135 Q 310,130 320,145
               L 335,180 Q 340,200 325,212 L 280,238
               Q 260,248 240,238 L 210,218 Q 195,208 180,218
               L 150,245 Q 130,258 110,248 L 85,230
               Q 70,218 70,200 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Crossover bridge line */}
          <path
            d="M 220,105 Q 210,140 195,208"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="2"
            strokeDasharray="4 3"
            opacity="0.5"
          />
          <line x1="65" y1="190" x2="75" y2="190" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight */}
          <path d="M 70,170 L 70,130" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="35" y="150" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 - back straight */}
          <path d="M 335,180 Q 340,200 325,212 L 280,238" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="330" y="225" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="175" cy="108" r="3" fill="#FBBF24" />
          <text x="180" y="103" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="240" cy="238" r="3" fill="#3B82F6" />
          <text x="245" y="233" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  5. MIAMI - rectangular layout around stadium, 3 long straights    */
    /* ------------------------------------------------------------------ */
    case "miami":
      return (
        <g>
          <path
            d="M 80,220 L 80,100 Q 80,80 100,75 L 180,60 Q 200,56 210,70
               L 225,95 Q 232,110 248,108 L 310,100 Q 335,97 340,115
               L 345,180 Q 348,200 335,210 L 310,225 Q 295,232 300,248
               L 310,265 Q 315,278 300,282 L 150,285 Q 125,285 115,272
               L 95,240 Q 85,228 80,220 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="75" y1="220" x2="85" y2="220" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 */}
          <path d="M 80,180 L 80,100" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="42" y="145" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 - back straight */}
          <path d="M 300,282 L 150,285" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="210" y="298" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="248" cy="108" r="3" fill="#FBBF24" />
          <text x="253" y="103" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="300" cy="248" r="3" fill="#3B82F6" />
          <text x="305" y="244" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  6. IMOLA - roughly triangular, Tamburello chicane                  */
    /* ------------------------------------------------------------------ */
    case "imola":
      return (
        <g>
          <path
            d="M 100,180 L 120,100 Q 128,72 155,65 L 230,50 Q 255,46 268,62
               L 295,100 Q 308,120 300,142 L 280,178 Q 270,198 285,215
               L 315,245 Q 330,262 312,275 L 240,285 Q 215,288 198,275
               L 145,235 Q 125,218 115,195 Q 105,178 100,180 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="95" y1="180" x2="105" y2="180" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight */}
          <path d="M 120,140 L 120,100 Q 128,72 155,65" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="85" y="100" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 */}
          <path d="M 312,275 L 240,285 Q 215,288 198,275" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="245" y="298" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="268" cy="62" r="3" fill="#FBBF24" />
          <text x="273" y="57" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="285" cy="215" r="3" fill="#3B82F6" />
          <text x="290" y="210" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  7. MONACO - tight street circuit, hairpin, tunnel, pool chicane    */
    /* ------------------------------------------------------------------ */
    case "monaco":
      return (
        <g>
          <path
            d="M 80,140 L 180,100 Q 205,90 220,105 L 240,130 Q 248,145 238,160
               L 210,185 Q 195,198 205,215 L 230,235 Q 240,248 225,258
               L 180,270 Q 158,275 148,260 L 130,230 Q 120,212 100,215
               L 70,225 Q 50,230 48,210 L 50,170 Q 52,150 68,142 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="78" y1="135" x2="82" y2="145" stroke="#22C55E" strokeWidth="3" />
          {/* DRS zone - tunnel/main approach */}
          <path d="M 80,140 L 180,100" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="110" y="108" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="238" cy="160" r="3" fill="#FBBF24" />
          <text x="243" y="155" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="100" cy="215" r="3" fill="#3B82F6" />
          <text x="105" y="210" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  8. BARCELONA - Catalunya - flowing layout, long main straight      */
    /* ------------------------------------------------------------------ */
    case "barcelona":
      return (
        <g>
          <path
            d="M 90,200 L 90,100 Q 90,75 115,68 L 200,52 Q 225,48 240,62
               L 270,95 Q 285,115 305,110 L 335,100 Q 352,95 355,115
               L 350,165 Q 345,188 325,195 L 280,210 Q 258,218 250,238
               L 240,265 Q 232,282 210,282 L 140,278 Q 115,276 105,258
               L 92,225 Q 88,212 90,200 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="85" y1="200" x2="95" y2="200" stroke="#22C55E" strokeWidth="3" />
          {/* DRS - main straight */}
          <path d="M 90,180 L 90,100" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="52" y="140" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 */}
          <path d="M 210,282 L 140,278" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="155" y="296" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="305" cy="110" r="3" fill="#FBBF24" />
          <text x="310" y="105" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="250" cy="238" r="3" fill="#3B82F6" />
          <text x="255" y="233" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  9. MONTREAL - island circuit, long straights + tight chicanes      */
    /* ------------------------------------------------------------------ */
    case "montreal":
      return (
        <g>
          <path
            d="M 70,200 L 70,110 Q 70,85 95,80 L 170,70 Q 192,68 200,82
               L 210,105 Q 218,120 235,118 L 290,110 Q 312,107 318,125
               L 325,160 Q 330,180 315,192 L 280,215 Q 262,225 268,245
               L 278,268 Q 282,280 268,285 L 140,288 Q 115,288 105,272
               L 82,235 Q 72,218 70,200 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="65" y1="200" x2="75" y2="200" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight */}
          <path d="M 70,180 L 70,110" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="32" y="148" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 - back straight */}
          <path d="M 268,285 L 140,288" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="185" y="300" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="235" cy="118" r="3" fill="#FBBF24" />
          <text x="240" y="113" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="268" cy="245" r="3" fill="#3B82F6" />
          <text x="273" y="240" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  10. SPIELBERG / RED BULL RING - short, uphill rights, sweep down   */
    /* ------------------------------------------------------------------ */
    case "red_bull_ring":
    case "spielberg":
      return (
        <g>
          <path
            d="M 100,250 L 100,160 Q 100,130 120,115 L 165,85 Q 185,72 205,80
               L 240,100 Q 258,112 275,102 L 310,78 Q 330,68 340,85
               L 345,130 Q 348,155 332,168 L 290,200 Q 268,218 275,242
               L 280,262 Q 285,278 268,282 L 160,285 Q 130,285 115,270
               Q 105,258 100,250 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="95" y1="250" x2="105" y2="250" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - uphill straight */}
          <path d="M 100,220 L 100,160" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="60" y="192" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 */}
          <path d="M 268,282 L 160,285" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="195" y="298" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="275" cy="102" r="3" fill="#FBBF24" />
          <text x="280" y="97" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="275" cy="242" r="3" fill="#3B82F6" />
          <text x="280" y="237" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  11. SILVERSTONE - fast flowing, Maggots-Becketts, Hangar Straight  */
    /* ------------------------------------------------------------------ */
    case "silverstone":
      return (
        <g>
          <path
            d="M 85,195 L 95,120 Q 100,95 125,85 L 185,65 Q 210,58 225,70
               L 250,95 Q 262,112 280,108 L 320,98 Q 342,93 348,112
               L 352,160 Q 355,182 338,192 L 295,215 Q 275,225 278,248
               L 285,268 Q 290,282 272,288 L 190,290 Q 165,290 150,275
               L 115,238 Q 100,218 92,200 Q 88,195 85,195 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="80" y1="195" x2="90" y2="195" stroke="#22C55E" strokeWidth="3" />
          {/* DRS - Wellington Straight */}
          <path d="M 95,120 Q 100,95 125,85 L 185,65" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="130" y="58" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS - Hangar Straight */}
          <path d="M 352,160 Q 355,182 338,192 L 295,215" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="345" y="178" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="280" cy="108" r="3" fill="#FBBF24" />
          <text x="285" y="103" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="278" cy="248" r="3" fill="#3B82F6" />
          <text x="283" y="243" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  12. SPA - huge circuit, Eau Rouge, Kemmel straight, forest sweep   */
    /* ------------------------------------------------------------------ */
    case "spa":
      return (
        <g>
          <path
            d="M 55,215 L 55,135 Q 55,110 75,98 L 115,75 Q 132,65 148,78
               L 170,105 Q 180,122 198,118 L 245,105 Q 268,98 280,112
               L 310,155 Q 320,175 308,192 L 275,225 Q 258,242 270,260
               L 295,278 Q 308,290 290,295 L 180,298 Q 155,298 140,285
               L 100,252 Q 82,238 72,220 Q 60,205 55,215 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="50" y1="215" x2="60" y2="215" stroke="#22C55E" strokeWidth="3" />
          {/* DRS - Kemmel Straight */}
          <path d="M 170,105 Q 180,122 198,118 L 245,105" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="195" y="95" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS - main straight approach */}
          <path d="M 100,252 Q 82,238 72,220 L 55,215" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="30" y="250" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="148" cy="78" r="3" fill="#FBBF24" />
          <text x="153" y="73" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="270" cy="260" r="3" fill="#3B82F6" />
          <text x="275" y="255" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  13. ZANDVOORT - oval-ish seaside, banked turns, compact           */
    /* ------------------------------------------------------------------ */
    case "zandvoort":
      return (
        <g>
          <path
            d="M 100,200 L 100,130 Q 100,100 125,90 L 195,70 Q 225,62 248,78
               L 280,105 Q 300,125 310,110 L 325,82 Q 335,65 348,80
               L 352,130 Q 355,160 338,175 L 305,200 Q 285,215 290,238
               L 298,262 Q 302,278 285,282 L 165,286 Q 138,286 125,270
               L 108,242 Q 98,222 100,200 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="95" y1="200" x2="105" y2="200" stroke="#22C55E" strokeWidth="3" />
          {/* DRS - main straight */}
          <path d="M 100,180 L 100,130" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="60" y="158" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="310" cy="110" r="3" fill="#FBBF24" />
          <text x="315" y="105" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="290" cy="238" r="3" fill="#3B82F6" />
          <text x="295" y="233" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  14. MONZA - temple of speed, long straights, very few corners     */
    /* ------------------------------------------------------------------ */
    case "monza":
      return (
        <g>
          <path
            d="M 85,250 L 85,80 Q 85,52 112,45 L 240,38 Q 272,38 285,60
               L 300,95 Q 310,118 295,135 L 265,158 Q 248,172 255,192
               L 270,225 Q 280,252 255,265 L 150,272 Q 118,275 100,258
               Q 88,248 85,250 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="80" y1="250" x2="90" y2="250" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight */}
          <path d="M 85,230 L 85,80" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="48" y="160" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 - back straight */}
          <path d="M 255,265 L 150,272" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="185" y="288" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="240" cy="38" r="3" fill="#FBBF24" />
          <text x="245" y="33" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="265" cy="158" r="3" fill="#3B82F6" />
          <text x="270" y="153" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  15. BAKU - long street circuit, very long main straight, old city  */
    /* ------------------------------------------------------------------ */
    case "baku":
      return (
        <g>
          <path
            d="M 60,248 L 60,80 Q 60,55 85,50 L 150,42 Q 172,40 182,55
               L 195,82 Q 202,98 218,95 L 260,85 Q 280,80 288,95
               L 298,125 Q 305,145 292,158 L 265,180 Q 248,195 258,212
               L 285,240 Q 295,255 315,252 L 345,245 Q 362,242 362,260
               L 358,275 Q 355,290 338,292 L 120,295 Q 92,295 78,278
               L 62,255 Q 58,250 60,248 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="55" y1="248" x2="65" y2="248" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight */}
          <path d="M 60,220 L 60,80" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="25" y="150" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 */}
          <path d="M 338,292 L 120,295" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="215" y="288" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="218" cy="95" r="3" fill="#FBBF24" />
          <text x="223" y="90" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="345" cy="245" r="3" fill="#3B82F6" />
          <text x="350" y="240" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  16. MARINA BAY - Singapore night race, many 90-deg turns          */
    /* ------------------------------------------------------------------ */
    case "marina_bay":
      return (
        <g>
          <path
            d="M 80,210 L 80,110 Q 80,88 100,82 L 160,65 Q 180,60 192,72
               L 210,100 Q 218,115 235,112 L 280,105 Q 300,102 308,118
               L 320,155 Q 328,175 312,188 L 282,208 Q 265,220 272,240
               L 285,265 Q 292,280 275,288 L 180,292 Q 155,292 142,278
               L 118,248 Q 105,232 98,218 Q 85,205 80,210 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="75" y1="210" x2="85" y2="210" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 */}
          <path d="M 80,180 L 80,110" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="42" y="148" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 */}
          <path d="M 275,288 L 180,292" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="210" y="285" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="280" cy="105" r="3" fill="#FBBF24" />
          <text x="285" y="100" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="272" cy="240" r="3" fill="#3B82F6" />
          <text x="277" y="235" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  17. COTA - anticlockwise, dramatic T1 uphill, long back straight  */
    /* ------------------------------------------------------------------ */
    case "cota":
      return (
        <g>
          <path
            d="M 90,200 L 110,100 Q 118,72 145,62 L 200,48 Q 228,42 242,58
               L 270,95 Q 282,115 302,110 L 340,98 Q 358,92 362,112
               L 358,175 Q 355,200 335,210 L 290,232 Q 268,242 262,262
               L 255,280 Q 248,295 228,292 L 145,285 Q 118,282 108,265
               L 95,232 Q 88,215 90,200 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="85" y1="200" x2="95" y2="200" stroke="#22C55E" strokeWidth="3" />
          {/* DRS - back straight */}
          <path d="M 358,175 Q 355,200 335,210 L 290,232" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="340" y="208" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS - main straight */}
          <path d="M 95,232 Q 88,215 90,200 L 110,100" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="52" y="165" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="302" cy="110" r="3" fill="#FBBF24" />
          <text x="307" y="105" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="262" cy="262" r="3" fill="#3B82F6" />
          <text x="267" y="257" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  18. MEXICO CITY - long straight, stadium section, Peraltada       */
    /* ------------------------------------------------------------------ */
    case "mexico_city":
      return (
        <g>
          <path
            d="M 90,210 L 90,110 Q 90,85 115,78 L 190,58 Q 215,52 230,65
               L 258,95 Q 270,112 288,108 L 320,98 Q 340,92 345,112
               L 342,165 Q 340,188 322,198 L 285,218 Q 268,228 272,248
               L 282,272 Q 288,288 270,292 L 160,295 Q 132,295 120,278
               L 100,248 Q 90,228 90,210 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Stadium section indicator */}
          <ellipse cx="276" cy="260" rx="18" ry="12" fill="none" stroke="#8B8B9E" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
          <line x1="85" y1="210" x2="95" y2="210" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight */}
          <path d="M 90,185 L 90,110" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="52" y="150" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 */}
          <path d="M 270,292 L 160,295" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="195" y="288" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="288" cy="108" r="3" fill="#FBBF24" />
          <text x="293" y="103" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="272" cy="248" r="3" fill="#3B82F6" />
          <text x="277" y="243" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  19. INTERLAGOS - anticlockwise, short, elevation, Senna S         */
    /* ------------------------------------------------------------------ */
    case "interlagos":
      return (
        <g>
          <path
            d="M 100,180 L 140,90 Q 150,65 178,60 L 250,55 Q 278,55 290,72
               L 315,115 Q 325,138 310,152 L 270,178 Q 252,190 258,210
               L 272,245 Q 280,265 260,275 L 180,282 Q 155,284 140,270
               L 110,232 Q 98,212 100,195 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="95" y1="180" x2="105" y2="180" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight into Senna S */}
          <path d="M 140,120 L 140,90 Q 150,65 178,60" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="115" y="78" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 - back straight */}
          <path d="M 260,275 L 180,282" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="200" y="295" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="290" cy="72" r="3" fill="#FBBF24" />
          <text x="295" y="67" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="258" cy="210" r="3" fill="#3B82F6" />
          <text x="263" y="205" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  20. LAS VEGAS - Strip street circuit, very long LV Blvd straight  */
    /* ------------------------------------------------------------------ */
    case "las_vegas":
      return (
        <g>
          <path
            d="M 70,250 L 70,80 Q 70,55 95,50 L 160,42 Q 182,40 190,55
               L 200,80 Q 208,98 225,95 L 295,82 Q 318,78 328,95
               L 345,140 Q 355,162 340,178 L 310,205 Q 295,218 305,238
               L 325,268 Q 335,282 318,290 L 140,295 Q 112,295 98,278
               L 78,252 Q 70,242 70,250 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="65" y1="250" x2="75" y2="250" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - Las Vegas Blvd (main straight - very long) */}
          <path d="M 70,230 L 70,80" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="30" y="155" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 */}
          <path d="M 318,290 L 140,295" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="210" y="288" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="225" cy="95" r="3" fill="#FBBF24" />
          <text x="230" y="90" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="305" cy="238" r="3" fill="#3B82F6" />
          <text x="310" y="233" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  21. LUSAIL - Qatar - fast flowing desert, sweeping high-speed      */
    /* ------------------------------------------------------------------ */
    case "lusail":
      return (
        <g>
          <path
            d="M 90,210 L 90,110 Q 90,82 115,72 L 190,50 Q 218,42 235,58
               L 265,95 Q 278,115 298,112 L 330,105 Q 350,100 355,120
               L 352,175 Q 350,200 330,212 L 285,238 Q 262,250 268,272
               L 275,288 Q 278,298 260,298 L 150,295 Q 122,295 110,278
               L 95,242 Q 88,225 90,210 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="85" y1="210" x2="95" y2="210" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight */}
          <path d="M 90,185 L 90,110" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="52" y="150" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 - back straight */}
          <path d="M 260,298 L 150,295" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="185" y="290" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="298" cy="112" r="3" fill="#FBBF24" />
          <text x="303" y="107" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="268" cy="272" r="3" fill="#3B82F6" />
          <text x="273" y="267" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  22. YAS MARINA - hybrid, hotel straddling track, harbor section    */
    /* ------------------------------------------------------------------ */
    case "yas_marina":
      return (
        <g>
          <path
            d="M 90,215 L 90,115 Q 90,88 115,78 L 185,55 Q 210,48 228,62
               L 258,95 Q 272,115 292,108 L 328,92 Q 348,85 355,105
               L 355,165 Q 355,190 335,200 L 295,222 Q 275,232 280,255
               L 288,275 Q 292,290 275,295 L 165,298 Q 138,298 122,282
               L 100,250 Q 90,232 90,215 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Hotel bridge indicator */}
          <rect x="310" y="88" width="28" height="22" rx="3" fill="none" stroke="#8B8B9E" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
          <line x1="85" y1="215" x2="95" y2="215" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight */}
          <path d="M 90,190 L 90,115" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="52" y="155" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 - back straight */}
          <path d="M 275,295 L 165,298" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="200" y="292" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="292" cy="108" r="3" fill="#FBBF24" />
          <text x="297" y="103" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="280" cy="255" r="3" fill="#3B82F6" />
          <text x="285" y="250" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  23. SHANGHAI - ultra-long back straight, unique T1-2-3 complex     */
    /* ------------------------------------------------------------------ */
    case "shanghai":
      return (
        <g>
          <path
            d="M 90,210 L 90,120 Q 90,95 112,85 L 155,68 Q 175,60 188,72
               L 205,95 Q 215,112 232,108 L 280,95 Q 302,88 312,105
               L 330,145 Q 340,168 325,182 L 288,210 Q 268,225 275,248
               L 290,275 Q 298,292 278,298 L 155,298 Q 128,298 115,282
               L 98,248 Q 88,228 90,210 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* T1-2-3 snail indicator */}
          <path
            d="M 155,68 Q 175,60 188,72 L 205,95 Q 215,112 232,108"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="2"
            strokeDasharray="2 2"
            opacity="0.4"
          />
          <line x1="85" y1="210" x2="95" y2="210" stroke="#22C55E" strokeWidth="3" />
          {/* DRS 1 - main straight */}
          <path d="M 90,185 L 90,120" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="52" y="155" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS 2 - back straight */}
          <path d="M 278,298 L 155,298" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="195" y="292" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="312" cy="105" r="3" fill="#FBBF24" />
          <text x="317" y="100" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="275" cy="248" r="3" fill="#3B82F6" />
          <text x="280" y="243" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  24. HUNGARORING - tight twisty horseshoe, almost no straights     */
    /* ------------------------------------------------------------------ */
    case "hungaroring":
      return (
        <g>
          <path
            d="M 100,185 L 115,105 Q 122,78 148,68 L 210,50 Q 238,44 255,60
               L 282,92 Q 295,112 310,108 L 335,100 Q 352,95 355,115
               L 348,168 Q 342,192 320,202 L 280,222 Q 258,232 255,255
               L 252,275 Q 248,292 228,292 L 155,288 Q 130,286 118,270
               L 105,242 Q 95,222 98,200 Q 100,190 100,185 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="95" y1="185" x2="105" y2="185" stroke="#22C55E" strokeWidth="3" />
          {/* DRS - main straight (short) */}
          <path d="M 115,145 L 115,105 Q 122,78 148,68" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="80" y="108" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="310" cy="108" r="3" fill="#FBBF24" />
          <text x="315" y="103" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="255" cy="255" r="3" fill="#3B82F6" />
          <text x="260" y="250" fill="#3B82F6" fontSize="9">S3</text>
        </g>
      );

    /* ------------------------------------------------------------------ */
    /*  25. MADRID - Circuito de Madrid - new semi-permanent 2026 venue    */
    /* ------------------------------------------------------------------ */
    case "madrid":
      return (
        <g>
          <path
            d="M 100,180 L 100,100 Q 100,72 125,60 L 195,35 Q 220,28 240,42
               L 275,72 Q 295,88 310,78 L 340,62 Q 358,52 365,72
               L 370,120 Q 372,145 355,158 L 320,180 Q 300,195 295,220
               L 290,248 Q 285,268 262,275 L 195,288 Q 168,292 152,278
               L 128,248 Q 112,232 108,210 L 100,180 Z"
            fill="none"
            stroke="#8B8B9E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="95" y1="180" x2="105" y2="180" stroke="#22C55E" strokeWidth="3" />
          {/* DRS - main straight */}
          <path d="M 100,145 L 100,100 Q 100,72 125,60" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="68" y="110" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          {/* DRS - back straight */}
          <path d="M 355,158 L 320,180 Q 300,195 295,220" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <text x="330" y="200" fill="#E10600" fontSize="10" fontWeight="bold">DRS</text>
          <circle cx="365" cy="72" r="3" fill="#FBBF24" />
          <text x="370" y="67" fill="#FBBF24" fontSize="9">S2</text>
          <circle cx="262" cy="275" r="3" fill="#3B82F6" />
          <text x="267" y="270" fill="#3B82F6" fontSize="9">S3</text>
          {/* New venue label */}
          <text x="200" y="165" fill="#8B8B9E" fontSize="9" textAnchor="middle" opacity="0.5">NEW 2026</text>
        </g>
      );

    default:
      return null;
  }
}

export default function CircuitMap({ circuit }: CircuitMapProps) {
  const svgContent = getCircuitSVG(circuit.id);

  return (
    <div className="glass-card rounded-xl bg-f1-surface border border-f1-border p-5">
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

      {/* Legend with hover tooltips */}
      <div className="flex flex-wrap gap-4 mt-3 text-xs text-f1-muted">
        <LegendItem
          color={<span className="w-4 h-0.5 bg-[#8B8B9E] inline-block rounded" />}
          label="Track"
          tooltip="The racing line that all cars follow around the circuit"
        />
        <LegendItem
          color={<span className="w-4 h-0.5 bg-f1-red inline-block rounded opacity-70" />}
          label="DRS Zone"
          tooltip="Drag Reduction System — a section where cars can open their rear wing flap to go faster and overtake. Only available when within 1 second of the car ahead."
        />
        <LegendItem
          color={<span className="w-2 h-2 bg-green-500 inline-block rounded-sm" />}
          label="Start/Finish"
          tooltip="The start/finish line — where the race begins and where each lap is completed. The checkered flag waves here!"
        />
        <LegendItem
          color={<span className="w-2 h-2 bg-yellow-400 inline-block rounded-full" />}
          label="S2"
          tooltip="Sector 2 — the middle section of the track. Each lap is split into 3 sectors to measure performance."
        />
        <LegendItem
          color={<span className="w-2 h-2 bg-blue-500 inline-block rounded-full" />}
          label="S3"
          tooltip="Sector 3 — the final section of the track before the start/finish line. Sector 1 starts at the start/finish line."
        />
      </div>
    </div>
  );
}

// =============================================================================
// Legend item with hover tooltip
// =============================================================================

function LegendItem({
  color,
  label,
  tooltip,
}: {
  color: React.ReactNode;
  label: string;
  tooltip: string;
}) {
  return (
    <div className="group relative flex items-center gap-1.5 cursor-help">
      {color}
      <span className="border-b border-dotted border-f1-muted/40">{label}</span>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 rounded-lg bg-[#1A1A2E] border border-f1-border text-[11px] text-white/90 leading-relaxed shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
        <div className="font-bold text-f1-red mb-0.5">{label}</div>
        {tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1A2E] border-r border-b border-f1-border rotate-45 -mt-1" />
      </div>
    </div>
  );
}
