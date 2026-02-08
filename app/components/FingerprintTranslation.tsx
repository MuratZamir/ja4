"use client";

import { useState } from "react";
import type { ParsedJA4 } from "@/lib/types";

export default function FingerprintTranslation({
  parsed,
}: {
  parsed: ParsedJA4;
}) {
  const [open, setOpen] = useState(false);

  const fields = [
    { label: "Protocol", value: parsed.protocol },
    { label: "TLS Version", value: parsed.tlsVersion },
    { label: "SNI", value: parsed.sni },
    { label: "Cipher Suites", value: parsed.cipherCount },
    { label: "Extensions", value: parsed.extensionCount },
    { label: "ALPN", value: parsed.alpn },
  ];

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-light hover:text-text-primary"
      >
        JA4 Fingerprint Example Translation
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-border bg-bg-card p-4 sm:grid-cols-3 md:grid-cols-6">
          {fields.map((f) => (
            <div key={f.label}>
              <p className="text-xs font-medium uppercase text-text-muted">
                {f.label}
              </p>
              <p className="mt-1 text-sm font-medium text-text-primary">
                {f.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
