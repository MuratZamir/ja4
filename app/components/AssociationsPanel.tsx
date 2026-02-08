"use client";

import { useState } from "react";
import type { AggregatedResult } from "@/lib/types";

function AssocRow({
  label,
  items,
  showUnknown,
}: {
  label: string;
  items: { value: string; count: number }[];
  showUnknown: boolean;
}) {
  const filtered = showUnknown
    ? items
    : items.filter(
        (i) => i.value.toLowerCase() !== "none" && i.value.toLowerCase() !== ""
      );
  if (filtered.length === 0) return null;

  return (
    <div className="border-t border-border px-4 py-3">
      <p className="text-sm font-medium text-text-muted">{label}</p>
      <div className="mt-1 space-y-0.5">
        {filtered.slice(0, 5).map((item) => (
          <p key={item.value} className="text-sm text-text-primary">
            {item.value}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AssociationsPanel({
  result,
}: {
  result: AggregatedResult;
}) {
  const [showUnknown, setShowUnknown] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-bg-card">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Associations
        </h2>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          Show Unknown
          <button
            onClick={() => setShowUnknown(!showUnknown)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              showUnknown ? "bg-accent-orange" : "bg-border-light"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                showUnknown ? "translate-x-4" : ""
              }`}
            />
          </button>
        </label>
      </div>

      <AssocRow label="Application" items={result.applications} showUnknown={showUnknown} />
      <AssocRow label="Library" items={result.libraries} showUnknown={showUnknown} />
      <AssocRow label="Device" items={result.devices} showUnknown={showUnknown} />
      <AssocRow label="Operating System" items={result.operatingSystems} showUnknown={showUnknown} />
      <AssocRow label="User Agent String" items={result.userAgents.slice(0, 5)} showUnknown={showUnknown} />
      <AssocRow label="Certificate Authority" items={result.certificateAuthorities} showUnknown={showUnknown} />

      <div className="border-t border-border px-4 py-3">
        <p className="text-sm font-medium text-text-muted">Observation Count</p>
        <p className="mt-1 text-sm text-text-primary">
          {result.matchCount.toLocaleString()}
        </p>
      </div>

      <div className="border-t border-border px-4 py-3">
        <p className="text-sm font-medium text-text-muted">Verified</p>
        <div className="mt-1 space-y-0.5">
          {result.verifiedValues.map((v) => (
            <p key={String(v)} className="text-sm text-text-primary">
              {String(v)}
            </p>
          ))}
        </div>
      </div>

      {result.notes.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-sm font-medium text-text-muted">Notes</p>
          <div className="mt-1 space-y-0.5">
            {result.notes.map((n) => (
              <p key={n} className="text-sm text-text-primary">
                {n}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
