import { db } from "./database";
import type { AggregatedResult, Suggestion } from "./types";

export function searchFingerprint(
  fingerprint: string
): AggregatedResult | null {
  return db.search(fingerprint);
}

export function getSuggestions(prefix: string): Suggestion[] {
  return db.getSuggestions(prefix);
}

export function getTotalRecords(): number {
  return db.getTotalRecords();
}
