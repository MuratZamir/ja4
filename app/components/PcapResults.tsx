"use client";

import Link from "next/link";

interface StreamResult {
  [key: string]: unknown;
}

const FINGERPRINT_KEYS = [
  "JA4",
  "JA4S",
  "JA4H",
  "JA4X",
  "JA4T",
  "JA4TS",
  "JA4TScan",
  "JA4L",
  "JA4LS",
  "JA4SSH",
];

export default function PcapResults({ results }: { results: StreamResult[] }) {
  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-card p-6 text-center text-text-secondary">
        No streams found in this capture file.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">
        {results.length} stream{results.length !== 1 ? "s" : ""} analyzed
      </h2>
      <div className="space-y-3">
        {results.map((stream, i) => (
          <StreamCard key={i} stream={stream} index={i} />
        ))}
      </div>
    </div>
  );
}

function StreamCard({ stream, index }: { stream: StreamResult; index: number }) {
  const src = stream.src as string | undefined;
  const dst = stream.dst as string | undefined;
  const srcPort = stream.src_port as string | number | undefined;
  const dstPort = stream.dst_port as string | number | undefined;

  const fingerprints = FINGERPRINT_KEYS.filter(
    (key) => stream[key] && stream[key] !== ""
  );

  return (
    <div className="rounded-xl border border-border bg-bg-card p-5 transition-colors hover:border-border-light">
      <div className="mb-3 flex items-center gap-3">
        <span className="rounded bg-accent-orange/20 px-2 py-0.5 text-xs font-medium text-accent-orange">
          Stream {index}
        </span>
        {src && dst && (
          <span className="font-mono text-sm text-text-secondary">
            {src}
            {srcPort ? `:${srcPort}` : ""}{" "}
            <span className="text-text-muted">&rarr;</span>{" "}
            {dst}
            {dstPort ? `:${dstPort}` : ""}
          </span>
        )}
      </div>

      {fingerprints.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {fingerprints.map((key) => (
            <div key={key} className="flex items-baseline gap-2">
              <span className="shrink-0 text-xs font-medium uppercase text-text-muted">
                {key}
              </span>
              <Link
                href={`/search/${encodeURIComponent(String(stream[key]))}`}
                className="truncate font-mono text-sm text-accent-blue transition-colors hover:text-accent-orange"
              >
                {String(stream[key])}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted">
          No JA4+ fingerprints extracted for this stream.
        </p>
      )}
    </div>
  );
}
