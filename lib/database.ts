import { readFileSync } from "fs";
import { join } from "path";
import type {
  RawRecord,
  FingerprintType,
  AggregatedResult,
  CountedItem,
  RelatedFingerprint,
  Suggestion,
} from "./types";

const FINGERPRINT_FIELDS: { field: keyof RawRecord; type: FingerprintType }[] =
  [
    { field: "ja4_fingerprint", type: "ja4" },
    { field: "ja4s_fingerprint", type: "ja4s" },
    { field: "ja4h_fingerprint", type: "ja4h" },
    { field: "ja4x_fingerprint", type: "ja4x" },
    { field: "ja4t_fingerprint", type: "ja4t" },
    { field: "ja4ts_fingerprint", type: "ja4ts" },
    { field: "ja4tscan_fingerprint", type: "ja4tscan" },
  ];

const ATTACK_TOOLS = [
  "nmap",
  "metasploit",
  "cobalt",
  "mimikatz",
  "burp",
  "sqlmap",
  "hydra",
  "nikto",
  "masscan",
  "zmap",
  "gobuster",
  "dirbuster",
  "hashcat",
  "john",
  "responder",
  "empire",
  "sliver",
  "havoc",
  "covenant",
  "brute",
];

class Database {
  private records: RawRecord[] = [];
  private indexes: Map<FingerprintType, Map<string, number[]>> = new Map();
  private allFingerprints: Map<string, FingerprintType> = new Map();
  private loaded = false;

  private load() {
    if (this.loaded) return;

    const filePath = join(process.cwd(), "database.json");
    const raw = readFileSync(filePath, "utf-8");
    this.records = JSON.parse(raw) as RawRecord[];

    for (const { type } of FINGERPRINT_FIELDS) {
      this.indexes.set(type, new Map());
    }

    for (let i = 0; i < this.records.length; i++) {
      const record = this.records[i];
      for (const { field, type } of FINGERPRINT_FIELDS) {
        const value = record[field] as string | null;
        if (value) {
          const index = this.indexes.get(type)!;
          const existing = index.get(value);
          if (existing) {
            existing.push(i);
          } else {
            index.set(value, [i]);
          }
          if (!this.allFingerprints.has(value)) {
            this.allFingerprints.set(value, type);
          }
        }
      }
    }

    this.loaded = true;
    console.log(
      `Database loaded: ${this.records.length} records, ${this.allFingerprints.size} unique fingerprints`
    );
  }

  detectType(fingerprint: string): FingerprintType | null {
    this.load();

    for (const { type } of FINGERPRINT_FIELDS) {
      const index = this.indexes.get(type)!;
      if (index.has(fingerprint)) return type;
    }

    // Regex-based fallback detection
    // JA4: t13d1516h2_8daaf6152771_02713d6af862
    if (/^[tq]\d{2}[di]\d{4}[h0]\d_[a-f0-9]{12}_[a-f0-9]{12}$/.test(fingerprint))
      return "ja4";
    // JA4H: ge11cn20enus_60ca1bd65281_ac95b44401d9_8df6a44f726c
    if (/^[a-z]{2}\d{2}[a-z]{2}\d+[a-z]*_[a-f0-9]{12}_[a-f0-9]{12}_[a-f0-9]{12}$/.test(fingerprint))
      return "ja4h";
    // JA4T: 64240_2-1-3-1-1-4_1460_8
    if (/^\d+_[\d-]+_\d+_\d+$/.test(fingerprint)) return "ja4t";
    // JA4S: t130200_1301_a56c5b993250
    if (/^[tq]\d{6}_[a-f0-9]{4}_[a-f0-9]{12}$/.test(fingerprint)) return "ja4s";
    // JA4X: 3 sections of hex separated by underscores
    if (/^[a-f0-9]{12}_[a-f0-9]{12}_[a-f0-9]{12}$/.test(fingerprint))
      return "ja4x";

    return null;
  }

  search(fingerprint: string): AggregatedResult | null {
    this.load();

    const type = this.detectType(fingerprint);
    if (!type) return null;

    const index = this.indexes.get(type)!;
    const recordIndices = index.get(fingerprint);
    if (!recordIndices || recordIndices.length === 0) return null;

    const appCount = new Map<string, number>();
    const libCount = new Map<string, number>();
    const devCount = new Map<string, number>();
    const osCount = new Map<string, number>();
    const uaCount = new Map<string, number>();
    const caCount = new Map<string, number>();
    const notesSet = new Set<string>();
    const verifiedSet = new Set<boolean>();
    const relatedMap = new Map<string, { type: FingerprintType; count: number }>();
    let fingerprintString: string | null = null;

    for (const idx of recordIndices) {
      const rec = this.records[idx];

      increment(appCount, rec.application);
      increment(libCount, rec.library);
      increment(devCount, rec.device);
      increment(osCount, rec.os);
      increment(uaCount, rec.user_agent_string);
      increment(caCount, rec.certificate_authority);

      if (rec.notes) notesSet.add(rec.notes);
      verifiedSet.add(rec.verified);

      if (rec.ja4_fingerprint_string && !fingerprintString) {
        fingerprintString = rec.ja4_fingerprint_string;
      }

      // Collect related fingerprints (other fingerprint types on the same record)
      for (const { field, type: ft } of FINGERPRINT_FIELDS) {
        if (ft === type) continue;
        const val = rec[field] as string | null;
        if (val) {
          const key = `${ft}:${val}`;
          const existing = relatedMap.get(key);
          if (existing) {
            existing.count++;
          } else {
            relatedMap.set(key, { type: ft, count: 1 });
          }
        }
      }
    }

    const relatedFingerprints: RelatedFingerprint[] = Array.from(
      relatedMap.entries()
    )
      .map(([key, val]) => ({
        type: val.type,
        hash: key.split(":").slice(1).join(":"),
        count: val.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    const riskScore = this.calculateRisk(
      recordIndices.length,
      verifiedSet,
      appCount,
      uaCount
    );

    return {
      fingerprint,
      fingerprintType: type,
      matchCount: recordIndices.length,
      totalRecords: this.records.length,
      applications: toSorted(appCount),
      libraries: toSorted(libCount),
      devices: toSorted(devCount),
      operatingSystems: toSorted(osCount),
      userAgents: toSorted(uaCount),
      certificateAuthorities: toSorted(caCount),
      notes: Array.from(notesSet),
      verifiedValues: Array.from(verifiedSet),
      relatedFingerprints,
      fingerprintString,
      riskScore,
    };
  }

  private calculateRisk(
    matchCount: number,
    verifiedSet: Set<boolean>,
    appCount: Map<string, number>,
    uaCount: Map<string, number>
  ): number {
    let risk = 0;

    if (!verifiedSet.has(true)) risk += 10;

    const appNames = Array.from(appCount.keys())
      .join(" ")
      .toLowerCase();
    if (ATTACK_TOOLS.some((tool) => appNames.includes(tool))) risk += 40;

    if (matchCount <= 5) risk += 15;
    if (uaCount.size === 0) risk += 15;

    return Math.min(risk, 100);
  }

  getSuggestions(prefix: string): Suggestion[] {
    this.load();
    const results: Suggestion[] = [];
    const lower = prefix.toLowerCase();

    for (const [hash, type] of this.allFingerprints) {
      if (hash.toLowerCase().startsWith(lower)) {
        results.push({ hash, type });
        if (results.length >= 10) break;
      }
    }

    return results;
  }

  getTotalRecords(): number {
    this.load();
    return this.records.length;
  }
}

function increment(map: Map<string, number>, value: string | null) {
  if (!value) return;
  map.set(value, (map.get(value) || 0) + 1);
}

function toSorted(map: Map<string, number>): CountedItem[] {
  return Array.from(map.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);
}

// Singleton
const globalDb = globalThis as unknown as { __ja4db?: Database };
if (!globalDb.__ja4db) {
  globalDb.__ja4db = new Database();
}
export const db: Database = globalDb.__ja4db;
