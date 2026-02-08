import type { ParsedJA4 } from "./types";

const TLS_VERSIONS: Record<string, string> = {
  "10": "TLS 1.0",
  "11": "TLS 1.1",
  "12": "TLS 1.2",
  "13": "TLS 1.3",
  "00": "Unknown",
};

const ALPN_VALUES: Record<string, string> = {
  h1: "HTTP/1.1",
  h2: "HTTP/2",
  h3: "HTTP/3 (QUIC)",
  "00": "No ALPN",
};

export function parseJA4(fingerprint: string): ParsedJA4 | null {
  // JA4 format: [q|t]13d1516h2_hash1_hash2
  // Section A: protocol(1) + tls(2) + sni(1) + ciphers(2) + extensions(2) + alpn(2)
  const match = fingerprint.match(
    /^([tq])(\d{2})([di])(\d{2})(\d{2})([a-z0-9]{2})_/
  );
  if (!match) return null;

  const [, proto, tls, sni, ciphers, extensions, alpn] = match;

  return {
    protocol: proto === "t" ? "TCP" : "QUIC",
    tlsVersion: TLS_VERSIONS[tls] || `TLS (${tls})`,
    sni: sni === "d" ? "Domain (SNI present)" : "IP (no SNI)",
    cipherCount: `${parseInt(ciphers, 10)} cipher suites`,
    extensionCount: `${parseInt(extensions, 10)} extensions`,
    alpn: ALPN_VALUES[alpn] || alpn,
  };
}
