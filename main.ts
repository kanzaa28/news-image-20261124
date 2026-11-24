// news-image-20261124 entry program.
//
// The entry is a pre-drawn front page (entry.png, 1024x1024) summing up
// Tuesday 24 November 2026. This program does not draw anything: it
// verifies the shipped PNG is a whole, well-formed PNG inside the
// competition limits, then publishes it to $MAKEFUN_OUTPUT_DIR/entry.png.
//
// Verification performed before copying:
//   1. PNG signature (the 8 magic bytes)
//   2. IHDR present first, width and height each <= 1024
//   3. Every chunk walked in order, each chunk's CRC32 recomputed and
//      compared, until the IEND chunk is reached (a truncated or corrupt
//      file fails here instead of being published); at least one IDAT
//      chunk must be present, so the file carries real image data
//   4. Total file size <= 1 MiB (1048576 bytes)
//
// The copy is byte-for-byte, so both grader runs write identical bytes.

import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1048576;
const MAX_DIM = 1024;

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// CRC-32 (IEEE 802.3) table, built once at startup.
const CRC_TABLE: number[] = (() => {
  const table: number[] = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function fail(message: string): never {
  throw new Error(`entry.png failed verification: ${message}`);
}

function verifyPng(bytes: Buffer): { width: number; height: number } {
  if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    fail("bad PNG signature");
  }
  if (bytes.length > MAX_BYTES) {
    fail(`file is ${bytes.length} bytes, over the 1 MiB limit`);
  }

  let offset = 8;
  let seenIhdr = false;
  let seenIdat = false;
  let seenIend = false;
  let width = 0;
  let height = 0;

  while (offset + 8 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("latin1", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const crcEnd = dataEnd + 4;
    if (crcEnd > bytes.length) {
      fail(`chunk ${type} runs past the end of the file`);
    }
    const storedCrc = bytes.readUInt32BE(dataEnd);
    const actualCrc = crc32(
      Buffer.concat([bytes.subarray(offset + 4, offset + 8), bytes.subarray(dataStart, dataEnd)]),
    );
    if (storedCrc !== actualCrc) {
      fail(`chunk ${type} has a bad CRC (stored ${storedCrc}, computed ${actualCrc})`);
    }

    if (!seenIhdr) {
      if (type !== "IHDR") fail("first chunk is not IHDR");
      width = bytes.readUInt32BE(dataStart);
      height = bytes.readUInt32BE(dataStart + 4);
      if (width === 0 || height === 0 || width > MAX_DIM || height > MAX_DIM) {
        fail(`dimensions ${width}x${height} exceed the 1024x1024 limit`);
      }
      seenIhdr = true;
    }
    if (type === "IDAT") {
      if (length === 0) fail("empty IDAT chunk");
      seenIdat = true;
    }
    if (type === "IEND") {
      seenIend = true;
      if (crcEnd !== bytes.length) {
        fail("trailing bytes after IEND");
      }
      break;
    }
    offset = crcEnd;
  }

  if (!seenIhdr) fail("no IHDR chunk found");
  if (!seenIdat) fail("no IDAT chunk found; file carries no image data");
  if (!seenIend) fail("no IEND chunk found; file is truncated");
  return { width, height };
}

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const src = join(here, "entry.png");
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const dest = join(outDir, "entry.png");

  const bytes = readFileSync(src);
  const { width, height } = verifyPng(bytes);

  mkdirSync(outDir, { recursive: true });
  copyFileSync(src, dest);

  // Confirm what landed on disk matches the verified bytes exactly.
  const written = statSync(dest).size;
  if (written !== bytes.length) {
    fail(`wrote ${written} bytes but verified ${bytes.length}`);
  }
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  console.log(`entry.png verified: ${width}x${height}, ${bytes.length} bytes, sha256 ${sha256}`);
  console.log(`published to ${dest}`);
}

main();
