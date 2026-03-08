import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDriverProfile, getAllDriverProfiles } from '@/lib/data/driver-profiles';
import { TEAMS } from '@/lib/constants/teams';
import { getDriverCountryFlag } from '@/lib/utils/drivers';
import DriverProfileClient from './DriverProfileClient';

// Generate static params for all drivers
export function generateStaticParams() {
  return getAllDriverProfiles().map((driver) => ({
    driverId: driver.driverId,
  }));
}

export function generateMetadata({ params }: { params: { driverId: string } }) {
  const profile = getDriverProfile(params.driverId);
  if (!profile) return { title: 'Driver Not Found' };
  return {
    title: `${profile.firstName} ${profile.lastName} | F1 2026 Tracker`,
    description: profile.knownFor,
  };
}

export default function DriverProfilePage({
  params,
}: {
  params: { driverId: string };
}) {
  const profile = getDriverProfile(params.driverId);

  if (!profile) {
    notFound();
  }

  const team = TEAMS[profile.teamId];
  const teamColor = team?.color ?? '#666666';
  const teamName = team?.name ?? 'Unknown Team';
  const flag = getDriverCountryFlag(profile.nationality);

  const firstName = profile.firstName.replace(/\s+/g, '');
  const lastName = profile.lastName.replace(/\s+/g, '');
  const imageUrl = `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2025Drivers/${firstName}${lastName}.jpg`;

  const stats = profile.careerStats;

  const statCards = [
    { label: 'Championships', value: stats.championships, icon: 'trophy' },
    { label: 'Race Wins', value: stats.wins, icon: 'flag' },
    { label: 'Podiums', value: stats.podiums, icon: 'medal' },
    { label: 'Pole Positions', value: stats.poles, icon: 'zap' },
    { label: 'Fastest Laps', value: stats.fastestLaps, icon: 'timer' },
    { label: 'Race Starts', value: stats.raceStarts, icon: 'play' },
    { label: 'Career Points', value: stats.points, icon: 'star' },
  ];

  return (
    <DriverProfileClient
      profile={profile}
      teamColor={teamColor}
      teamName={teamName}
      flag={flag}
      imageUrl={imageUrl}
      statCards={statCards}
    />
  );
}
