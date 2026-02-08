# How the Analysis Works

1. **Upload** — your `.pcap` file hits the `/api/analyze` endpoint
2. `lib/analyze-pcap.ts` writes it to a temp file and shells out to:
   ```bash
   python3 ja4.py <pcap> -J -f <output.json>
   ```
   This is the upstream [JA4+ tool](https://github.com/FoxIO-LLC/ja4) from the `ja4-github-repo/python/` directory.
3. `ja4.py` internally runs **tshark** (`tshark -r <pcap> -T ek -n`) to convert the pcap into per-packet JSON, then processes each packet.

## Why So Few Streams?

There are several layers of filtering that dramatically reduce the count:

**Layer 1 — Protocol filter:** Only packets with TLS, QUIC, HTTP/HTTP2, SSH, or OCSP layers are processed. Plain TCP, UDP, DNS, ARP, ICMP, etc. are all skipped entirely.

**Layer 2 — Stream grouping:** Packets are grouped by their TCP/UDP stream number (a 5-tuple: src IP, dst IP, src port, dst port, protocol). Hundreds of packets belonging to the same TCP connection become one stream entry.

**Layer 3 — Fingerprint requirement:** The `printout()` function in `ja4.py` discards any stream that doesn't have a JA4 fingerprint. A JA4 fingerprint is only generated when the stream contains a TLS ClientHello (handshake type 1). So:

- Server-initiated TLS → no ClientHello → discarded
- Incomplete handshakes → discarded
- Non-TLS streams → discarded

**Layer 4 — Deduplication:** The cache system records only the first occurrence of key fields per stream, so retransmissions don't create extra entries.

## In Short

```
Your PCAP: ~thousands of packets
     ↓  protocol filter (TLS/QUIC/HTTP/SSH only)
     ↓  group by stream (5-tuple)
     ↓  require TLS ClientHello for JA4 fingerprint
     ↓  discard streams without fingerprints
Result: streams with JA4+ fingerprints
```
