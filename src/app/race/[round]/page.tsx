export default function RaceDetailPage({ params }: { params: { round: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Race Detail — Round {params.round}</h1>
      <p className="text-f1-muted">Coming in Phase 4</p>
      <div className="rounded-xl bg-f1-surface border border-f1-border p-6">
        <p className="text-f1-muted text-sm">
          Circuit map, qualifying results, race results, and your predictions for this race will appear here.
        </p>
      </div>
    </div>
  );
}
