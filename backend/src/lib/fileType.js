// Identifies uploads by their leading bytes instead of trusting the client-declared
// MIME type. Only formats the chat UI can display are accepted. SVG is deliberately
// excluded because it can carry script.

const ascii = (buf, start, end) => buf.subarray(start, end).toString("latin1");

export function detectMedia(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { kind: "image", mime: "image/jpeg", ext: "jpg" };
  }
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { kind: "image", mime: "image/png", ext: "png" };
  }
  if (ascii(buffer, 0, 6) === "GIF87a" || ascii(buffer, 0, 6) === "GIF89a") {
    return { kind: "image", mime: "image/gif", ext: "gif" };
  }
  if (ascii(buffer, 0, 4) === "RIFF" && ascii(buffer, 8, 12) === "WEBP") {
    return { kind: "image", mime: "image/webp", ext: "webp" };
  }
  if (ascii(buffer, 4, 8) === "ftyp") {
    const brand = ascii(buffer, 8, 12);
    if (brand === "qt  ") return { kind: "video", mime: "video/quicktime", ext: "mov" };
    if (/^(avif|avis)$/.test(brand)) return { kind: "image", mime: "image/avif", ext: "avif" };
    if (/^(heic|heix|mif1|msf1)$/.test(brand)) return null; // not displayable in most browsers
    return { kind: "video", mime: "video/mp4", ext: "mp4" };
  }
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return { kind: "video", mime: "video/webm", ext: "webm" };
  }
  return null;
}
