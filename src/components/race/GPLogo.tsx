"use client";

import { useState } from "react";

// F1 official race header images from the Formula 1 CDN
// Uses the 16x9 Racehub header format with proper country names
const GP_IMAGE_SLUGS: Record<string, string> = {
  "Australian Grand Prix": "Australia",
  "Chinese Grand Prix": "China",
  "Japanese Grand Prix": "Japan",
  "Bahrain Grand Prix": "Bahrain",
  "Saudi Arabian Grand Prix": "Saudi%20Arabia",
  "Miami Grand Prix": "Miami",
  "Canadian Grand Prix": "Canada",
  "Monaco Grand Prix": "Monaco",
  "Barcelona Grand Prix": "Spain",
  "Austrian Grand Prix": "Austria",
  "British Grand Prix": "Great%20Britain",
  "Belgian Grand Prix": "Belgium",
  "Hungarian Grand Prix": "Hungary",
  "Dutch Grand Prix": "Netherlands",
  "Italian Grand Prix": "Italy",
  "Madrid Grand Prix": "Spain",
  "Azerbaijan Grand Prix": "Azerbaijan",
  "Singapore Grand Prix": "Singapore",
  "United States Grand Prix": "USA",
  "Mexico City Grand Prix": "Mexico",
  "Brazilian Grand Prix": "Brazil",
  "Las Vegas Grand Prix": "Las%20Vegas",
  "Qatar Grand Prix": "Qatar",
  "Abu Dhabi Grand Prix": "Abu%20Dhabi",
};

function getGPImageUrl(raceName: string): string | null {
  const slug = GP_IMAGE_SLUGS[raceName];
  if (!slug) return null;
  return `https://media.formula1.com/image/upload/f_auto,c_limit,w_288,q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/${slug}`;
}

interface GPLogoProps {
  raceName: string;
  fallbackFlag: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-16",
};

export default function GPLogo({ raceName, fallbackFlag, size = "sm" }: GPLogoProps) {
  const gpImageUrl = getGPImageUrl(raceName);
  const [imgError, setImgError] = useState(false);

  if (!gpImageUrl || imgError) {
    return <span className={size === "lg" ? "text-4xl" : size === "md" ? "text-3xl" : "text-2xl"}>{fallbackFlag}</span>;
  }

  return (
    <div className={`${SIZES[size]} rounded-lg overflow-hidden border border-f1-border/50 shrink-0 bg-f1-dark`}>
      <img
        src={gpImageUrl}
        alt={raceName}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
        loading="lazy"
      />
    </div>
  );
}
