import { test } from "node:test";
import assert from "node:assert/strict";
import { detectMedia } from "../src/lib/fileType.js";

const pad = (bytes) => Buffer.concat([Buffer.from(bytes), Buffer.alloc(16)]);

test("detects supported image and video signatures", () => {
  assert.equal(detectMedia(pad([0xff, 0xd8, 0xff, 0xe0]))?.mime, "image/jpeg");
  assert.equal(detectMedia(pad([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))?.mime, "image/png");
  assert.equal(detectMedia(pad(Buffer.from("GIF89a")))?.mime, "image/gif");
  assert.equal(detectMedia(Buffer.concat([Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBPVP8 "), Buffer.alloc(4)]))?.mime, "image/webp");
  assert.equal(detectMedia(Buffer.concat([Buffer.alloc(4), Buffer.from("ftypisom"), Buffer.alloc(4)]))?.kind, "video");
  assert.equal(detectMedia(Buffer.concat([Buffer.alloc(4), Buffer.from("ftypqt  "), Buffer.alloc(4)]))?.mime, "video/quicktime");
  assert.equal(detectMedia(pad([0x1a, 0x45, 0xdf, 0xa3]))?.mime, "video/webm");
});

test("returns null for scripts, SVG, PDFs, executables, empty and non-buffer input", () => {
  for (const sample of ["<svg onload=alert(1)>", "<html></html>", "%PDF-1.7 padding.....", "MZ\x90\x00 padding......."]) {
    assert.equal(detectMedia(Buffer.from(sample.padEnd(20))), null, sample);
  }
  assert.equal(detectMedia(Buffer.alloc(0)), null);
  assert.equal(detectMedia("not a buffer"), null);
});
