import { TEAM_LIST } from '@/lib/constants/teams';

export default function DriversPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Drivers</h1>
      <p className="text-f1-muted">Coming in Phase 5</p>
      <div className="rounded-xl bg-f1-surface border border-f1-border p-6 space-y-4">
        <p className="text-f1-muted text-sm">
          Driver trading cards with headshots, stats, and team colors will appear here.
        </p>
        <div className="space-y-2">
          <p className="text-xs text-f1-muted uppercase tracking-wider">Team Colors Preview</p>
          <div className="flex flex-wrap gap-2">
            {TEAM_LIST.map((team) => (
              <div
                key={team.id}
                className="flex items-center gap-2 rounded-lg bg-f1-dark px-3 py-2 border-l-4"
                style={{ borderColor: team.color }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <span className="text-xs text-white">{team.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
