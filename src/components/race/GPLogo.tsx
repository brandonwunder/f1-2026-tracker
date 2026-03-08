"use client";

import { useState } from "react";

// F1 official race event images from the Formula 1 CDN
const GP_IMAGE_SLUGS: Record<string, string> = {
  "Australian Grand Prix": "australia",
  "Chinese Grand Prix": "china",
  "Japanese Grand Prix": "japan",
  "Bahrain Grand Prix": "bahrain",
  "Saudi Arabian Grand Prix": "saudi-arabia",
  "Miami Grand Prix": "miami",
  "Canadian Grand Prix": "canada",
  "Monaco Grand Prix": "monaco",
  "Barcelona Grand Prix": "spain",
  "Austrian Grand Prix": "austria",
  "British Grand Prix": "great-britain",
  "Belgian Grand Prix": "belgium",
  "Hungarian Grand Prix": "hungary",
  "Dutch Grand Prix": "netherlands",
  "Italian Grand Prix": "italy",
  "Madrid Grand Prix": "spain",
  "Azerbaijan Grand Prix": "azerbaijan",
  "Singapore Grand Prix": "singapore",
  "United States Grand Prix": "united-states",
  "Mexico City Grand Prix": "mexico",
  "Brazilian Grand Prix": "brazil",
  "Las Vegas Grand Prix": "las-vegas",
  "Qatar Grand Prix": "qatar",
  "Abu Dhabi Grand Prix": "abu-dhabi",
};

function getGPImageUrl(raceName: string): string | null {
  const slug = GP_IMAGE_SLUGS[raceName];
  if (!slug) return null;
  return `https://media.formula1.com/image/upload/f_auto,c_limit,w_288,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/${slug}`;
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
