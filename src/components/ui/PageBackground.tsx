'use client';

/**
 * Fixed background image overlay for pages.
 * Uses Unsplash source images for high-quality racing photography.
 */

const BACKGROUNDS: Record<string, string> = {
  // Dashboard — F1 car on track, dramatic angle
  dashboard: 'https://images.unsplash.com/photo-1532906619279-a4b7267faa72?w=1920&q=80',
  // Drivers — pit lane / helmets vibe
  drivers: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920&q=80',
  // Calendar — aerial track shot
  calendar: 'https://images.unsplash.com/photo-1504817343863-5092a923803e?w=1920&q=80',
  // Standings — podium / trophy feel
  standings: 'https://images.unsplash.com/photo-1541889413-d34ae41278b3?w=1920&q=80',
  // Predictions — data / strategy vibe
  predictions: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1920&q=80',
};

// Circuit-specific backgrounds for race detail pages
const CIRCUIT_BACKGROUNDS: Record<string, string> = {
  'Albert Park': 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=1920&q=80',
  'Shanghai': 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1920&q=80',
  'Suzuka': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1920&q=80',
  'Jeddah': 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1920&q=80',
  'Miami': 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1920&q=80',
  'Monaco': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920&q=80',
  'Barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80',
  'Montreal': 'https://images.unsplash.com/photo-1519178614-68673b201f36?w=1920&q=80',
  'Silverstone': 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=1920&q=80',
  'Spa': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1920&q=80',
  'Monza': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1920&q=80',
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&q=80',
  'Austin': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1920&q=80',
  'Mexico': 'https://images.unsplash.com/photo-1518659526054-190340b32735?w=1920&q=80',
  'Sao Paulo': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1920&q=80',
  'Las Vegas': 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=1920&q=80',
  'Abu Dhabi': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
};

interface PageBackgroundProps {
  page?: keyof typeof BACKGROUNDS;
  circuitLocality?: string;
}

export default function PageBackground({ page, circuitLocality }: PageBackgroundProps) {
  let imageUrl = '';

  if (circuitLocality) {
    // Try to find a matching circuit background
    const match = Object.entries(CIRCUIT_BACKGROUNDS).find(([key]) =>
      circuitLocality.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(circuitLocality.toLowerCase())
    );
    imageUrl = match?.[1] ?? BACKGROUNDS.dashboard;
  } else if (page) {
    imageUrl = BACKGROUNDS[page] ?? '';
  }

  if (!imageUrl) return null;

  return (
    <>
      {/* Background image — fixed, very faded */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url(${imageUrl})`,
          opacity: 0.07,
          zIndex: -2,
        }}
      />
      {/* Gradient overlay to darken bottom */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(10,10,18,0.2) 0%, rgba(10,10,18,0.6) 30%, rgba(10,10,18,0.95) 70%)',
          zIndex: -1,
        }}
      />
    </>
  );
}
