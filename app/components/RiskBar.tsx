export default function RiskBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-3 w-full overflow-hidden rounded-full">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #22c55e, #eab308 50%, #ef4444)",
          }}
        />
        <div
          className="absolute top-0 h-full bg-bg-card/60"
          style={{ left: `${score}%`, width: `${100 - score}%` }}
        />
        <div
          className="absolute top-0 h-full w-1 -translate-x-1/2 rounded-full bg-white shadow"
          style={{ left: `${score}%` }}
        />
      </div>
      <span className="shrink-0 text-sm font-semibold text-text-primary">
        {score}%
      </span>
    </div>
  );
}
