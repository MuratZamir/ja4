import Link from "next/link";
import type { RelatedFingerprint } from "@/lib/types";

export default function TopRelatedFingerprints({
  fingerprints,
}: {
  fingerprints: RelatedFingerprint[];
}) {
  if (fingerprints.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-text-primary">
        Top Related Fingerprints
      </h2>
      <div className="space-y-1">
        {fingerprints.slice(0, 15).map((fp) => (
          <Link
            key={`${fp.type}:${fp.hash}`}
            href={`/search/${encodeURIComponent(fp.hash)}`}
            className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-bg-card-hover"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="shrink-0 text-xs font-bold uppercase text-accent-orange">
                {fp.type.replace("ja4", "JA4").replace("JA4s", "JA4S").replace("JA4h", "JA4H").replace("JA4t", "JA4T").replace("JA4x", "JA4X")}:
              </span>
              <span className="truncate font-mono text-sm text-text-secondary">
                {fp.hash}
              </span>
            </div>
            <span className="ml-3 shrink-0 text-sm font-medium text-text-primary">
              {fp.count.toLocaleString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
