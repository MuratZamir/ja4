"use client";

import { useState, useRef, useCallback } from "react";
import PcapResults from "./PcapResults";

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_EXTENSIONS = [".pcap", ".pcapng"];

type State =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "results"; data: Record<string, unknown>[] }
  | { status: "error"; message: string };

function validateFile(file: File): string | null {
  const name = file.name.toLowerCase();
  if (!ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return "Only .pcap and .pcapng files are accepted.";
  }
  if (file.size > MAX_SIZE) {
    return "File too large (max 50 MB).";
  }
  return null;
}

export default function PcapDropZone() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setState({ status: "error", message: validationError });
      return;
    }

    setState({ status: "uploading" });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setState({ status: "error", message: json.error || "Analysis failed" });
        return;
      }

      setState({ status: "results", data: json });
    } catch {
      setState({ status: "error", message: "Network error — could not reach the server." });
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) upload(file);
      e.target.value = "";
    },
    [upload]
  );

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
          dragOver
            ? "border-accent-orange bg-accent-orange/5"
            : "border-border hover:border-border-light"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pcap,.pcapng"
          onChange={handleFileChange}
          className="hidden"
        />

        {state.status === "uploading" ? (
          <>
            <svg
              className="h-8 w-8 animate-spin text-accent-orange"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-sm text-text-secondary">Analyzing capture file...</p>
          </>
        ) : (
          <>
            <svg
              className="h-8 w-8 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-text-secondary">
              Drag &amp; drop a <span className="text-text-primary">.pcap</span> or{" "}
              <span className="text-text-primary">.pcapng</span> file, or{" "}
              <span className="text-accent-orange">click to browse</span>
            </p>
            <p className="text-xs text-text-muted">Max 50 MB</p>
          </>
        )}
      </div>

      {/* Error */}
      {state.status === "error" && (
        <div className="rounded-xl border border-risk-red/30 bg-risk-red/10 px-5 py-3 text-sm text-risk-red">
          {state.message}
        </div>
      )}

      {/* Results */}
      {state.status === "results" && <PcapResults results={state.data} />}
    </div>
  );
}
