export interface RawRecord {
  application: string | null;
  library: string | null;
  device: string | null;
  os: string | null;
  user_agent_string: string | null;
  certificate_authority: string | null;
  verified: boolean;
  notes: string | null;
  ja4_fingerprint: string | null;
  ja4_fingerprint_string: string | null;
  ja4s_fingerprint: string | null;
  ja4h_fingerprint: string | null;
  ja4x_fingerprint: string | null;
  ja4t_fingerprint: string | null;
  ja4ts_fingerprint: string | null;
  ja4tscan_fingerprint: string | null;
}

export type FingerprintType =
  | "ja4"
  | "ja4s"
  | "ja4h"
  | "ja4x"
  | "ja4t"
  | "ja4ts"
  | "ja4tscan";

export interface CountedItem {
  value: string;
  count: number;
}

export interface RelatedFingerprint {
  type: FingerprintType;
  hash: string;
  count: number;
}

export interface AggregatedResult {
  fingerprint: string;
  fingerprintType: FingerprintType;
  matchCount: number;
  totalRecords: number;
  applications: CountedItem[];
  libraries: CountedItem[];
  devices: CountedItem[];
  operatingSystems: CountedItem[];
  userAgents: CountedItem[];
  certificateAuthorities: CountedItem[];
  notes: string[];
  verifiedValues: boolean[];
  relatedFingerprints: RelatedFingerprint[];
  fingerprintString: string | null;
  riskScore: number;
}

export interface ParsedJA4 {
  protocol: string;
  tlsVersion: string;
  sni: string;
  cipherCount: string;
  extensionCount: string;
  alpn: string;
}

export interface Suggestion {
  hash: string;
  type: FingerprintType;
}
