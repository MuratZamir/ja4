import Link from "next/link";
import type { RelatedFingerprint } from "@/lib/types";

function formatType(type: string): string {
  return type.toUpperCase().replace("JA4", "JA4");
}

export default function RelatedFingerprintCards({
  fingerprints,
}: {
  fingerprints: RelatedFingerprint[];
}) {
  if (fingerprints.length === 0) return null;

  // Show top 6 for the bottom cards section
  const top = fingerprints.slice(0, 6);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">
        Related Fingerprints
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {top.map((fp) => (
          <Link
            key={`${fp.type}:${fp.hash}`}
            href={`/search/${encodeURIComponent(fp.hash)}`}
            className="group rounded-xl border border-border bg-bg-card p-5 transition-all hover:border-accent-orange/40 hover:bg-bg-card-hover"
          >
            <div className="flex items-start justify-between">
              <p className="text-2xl font-bold text-text-primary">
                {fp.count.toLocaleString()}
              </p>
              <span className="rounded bg-accent-orange/20 px-2 py-0.5 text-xs font-bold uppercase text-accent-orange">
                {formatType(fp.type)}
              </span>
            </div>
            <p className="mt-2 truncate font-mono text-sm text-text-secondary group-hover:text-text-primary">
              {fp.hash}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
