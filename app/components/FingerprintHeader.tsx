import type { AggregatedResult, ParsedJA4 } from "@/lib/types";
import RiskBar from "./RiskBar";
import FingerprintTranslation from "./FingerprintTranslation";

export default function FingerprintHeader({
  result,
  parsed,
}: {
  result: AggregatedResult;
  parsed: ParsedJA4 | null;
}) {
  return (
    <div className="space-y-4">
      <h1 className="font-mono text-2xl font-bold text-text-primary md:text-3xl">
        {result.fingerprint}
      </h1>

      {parsed && <FingerprintTranslation parsed={parsed} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-accent-orange">
            Matches Found
          </p>
          <p className="mt-1 text-2xl font-bold">
            {result.matchCount.toLocaleString()}
          </p>
          <p className="text-xs text-text-muted">
            of {result.totalRecords.toLocaleString()} total records
          </p>
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-accent-orange">
            Last Identified
          </p>
          <p className="mt-1 text-2xl font-bold">Just Now</p>
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-accent-orange">
            Risk
          </p>
          <div className="mt-2">
            <RiskBar score={result.riskScore} />
          </div>
        </div>
      </div>
    </div>
  );
}
