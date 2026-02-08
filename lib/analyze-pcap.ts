import { execFile } from "child_process";
import { writeFile, readFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

const JA4_SCRIPT_PATH =
  process.env.JA4_SCRIPT_PATH || "../ja4-github-repo/python/ja4.py";

// pcap: 0xd4c3b2a1 (LE) or 0xa1b2c3d4 (BE)
// pcapng: block type 0x0a0d0d0a
const PCAP_MAGIC_LE = 0xd4c3b2a1;
const PCAP_MAGIC_BE = 0xa1b2c3d4;
const PCAPNG_MAGIC = 0x0a0d0d0a;

function validateMagicBytes(buffer: Buffer): void {
  if (buffer.length < 4) {
    throw new Error("File too small to be a valid capture file");
  }
  const magic = buffer.readUInt32BE(0);
  if (magic !== PCAP_MAGIC_LE && magic !== PCAP_MAGIC_BE && magic !== PCAPNG_MAGIC) {
    throw new Error("Invalid file: not a pcap or pcapng file");
  }
}

export async function analyzePcap(buffer: Buffer): Promise<object[]> {
  validateMagicBytes(buffer);

  const id = randomUUID();
  const tmpFile = join(tmpdir(), `${id}.pcap`);
  const outFile = join(tmpdir(), `${id}.json`);

  try {
    await writeFile(tmpFile, buffer);

    await new Promise<void>((resolve, reject) => {
      execFile(
        "python3",
        [JA4_SCRIPT_PATH, tmpFile, "-J", "-f", outFile],
        { timeout: 60_000, maxBuffer: 10 * 1024 * 1024 },
        (error, _stdout, stderr) => {
          if (error) {
            reject(new Error(stderr || error.message));
          } else {
            resolve();
          }
        }
      );
    });

    const json = await readFile(outFile, "utf-8");
    const results = JSON.parse(json);
    return Array.isArray(results) ? results : [results];
  } finally {
    await Promise.all([
      unlink(tmpFile).catch(() => {}),
      unlink(outFile).catch(() => {}),
    ]);
  }
}
