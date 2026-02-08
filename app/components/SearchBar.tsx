"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Suggestion } from "@/lib/types";

export default function SearchBar({
  initialValue = "",
  compact = false,
}: {
  initialValue?: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchSuggestions = useCallback(async (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `/api/suggestions?q=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 150);
  };

  const navigate = (fingerprint: string) => {
    setShowSuggestions(false);
    router.push(`/search/${encodeURIComponent(fingerprint)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        navigate(suggestions[selectedIndex].hash);
      } else if (query.trim()) {
        navigate(query.trim());
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${compact ? "w-full max-w-xl" : "w-full max-w-2xl"}`}>
      <div
        className={`flex items-center gap-3 rounded-full border border-border bg-bg-card px-5 ${
          compact ? "h-10" : "h-14"
        } transition-colors focus-within:border-accent-orange`}
      >
        <svg
          className="h-5 w-5 shrink-0 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search JA4+ fingerprint hash..."
          className={`w-full bg-transparent font-mono outline-none placeholder:text-text-muted ${
            compact ? "text-sm" : "text-base"
          }`}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-bg-card shadow-2xl">
          {suggestions.map((s, i) => (
            <button
              key={s.hash}
              onClick={() => navigate(s.hash)}
              className={`flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-bg-card-hover ${
                i === selectedIndex ? "bg-bg-card-hover" : ""
              }`}
            >
              <span className="truncate font-mono text-sm text-text-primary">
                {s.hash}
              </span>
              <span className="ml-3 shrink-0 rounded bg-accent-orange/20 px-2 py-0.5 text-xs font-medium uppercase text-accent-orange">
                {s.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
