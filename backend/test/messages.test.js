// Regression tests for REST authorization, recipient validation, profile privacy and
// upload validation. External services (Clerk, MongoDB, ImageKit, Socket.IO) are replaced
// with in-memory fakes; the real routes, middleware and controllers run unchanged.
import { test, mock, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";

const A = { _id: "a".repeat(24), clerkId: "clerk_a", email: "a@example.test", fullName: "Alice", profilePic: "a.png" };
const B = { _id: "b".repeat(24), clerkId: "clerk_b", email: "b@example.test", fullName: "Bob", profilePic: "b.png" };
const C = { _id: "c".repeat(24), clerkId: "clerk_c", email: "c@example.test", fullName: "Cara", profilePic: "c.png" };
const users = [A, B, C];

const savedMessages = [];
const emitted = [];
const uploads = [];
const aggregatePipelines = [];
const state = { imageKitConfigured: true, online: {} };

const pick = (doc, fields) => Object.fromEntries(fields.split(/\s+/).filter((f) => f in doc).map((f) => [f, doc[f]]));
const here = (path) => new URL(path, import.meta.url).href;

mock.module("@clerk/express", {
  namedExports: { getAuth: (req) => ({ userId: req.headers["x-test-clerk-id"] || null }) },
});
mock.module(here("../src/models/user.model.js"), {
  defaultExport: {
    findOne: async ({ clerkId }) => users.find((u) => u.clerkId === clerkId) || null,
    exists: async ({ _id }) => (users.some((u) => u._id === _id) ? { _id } : null),
    find: (filter) => ({
      select: async (fields) => users.filter((u) => u._id !== String(filter._id.$ne)).map((u) => pick(u, fields)),
    }),
  },
});
mock.module(here("../src/models/message.model.js"), {
  defaultExport: class FakeMessage {
    constructor(data) { Object.assign(this, data); }
    async save() { savedMessages.push({ ...this }); }
    static async aggregate(pipeline) { aggregatePipelines.push(pipeline); return []; }
    static find() { return { sort: async () => [] }; }
  },
});
mock.module(here("../src/lib/socket.js"), {
  namedExports: {
    io: { to: (socketId) => ({ emit: (event, payload) => emitted.push({ socketId, event, payload }) }) },
    getReceiverSocketId: (id) => state.online[id],
  },
});
mock.module(here("../src/lib/imagekit.js"), {
  namedExports: {
    hasImageKitConfig: () => state.imageKitConfigured,
    uploadChatMedia: async (file) => { uploads.push(file); return `https://ik.example.test/${file.originalname}`; },
  },
});

let server;
let base;

before(async () => {
  const { default: messageRoutes } = await import("../src/routes/message.route.js");
  const { default: authRoutes } = await import("../src/routes/auth.route.js");
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  app.use("/api/messages", messageRoutes);
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});

after(() => new Promise((resolve) => server.close(resolve)));

const asAlice = { "x-test-clerk-id": "clerk_a" };
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d, 0x49, 0x48, 0x44, 0x52]);
const MP4 = Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from("ftypisom"), Buffer.alloc(8)]);

function resetFakes() {
  savedMessages.length = 0; emitted.length = 0; uploads.length = 0; aggregatePipelines.length = 0;
  state.imageKitConfigured = true; state.online = {};
}

function sendJson(id, body, headers = asAlice) {
  return fetch(`${base}/messages/send/${id}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function sendFile(id, bytes, declaredType, name = "file.bin") {
  const form = new FormData();
  form.append("media", new Blob([bytes], { type: declaredType }), name);
  return fetch(`${base}/messages/send/${id}`, { method: "POST", headers: asAlice, body: form });
}

// ---- access control -------------------------------------------------------

test("every messaging and auth route rejects requests without a Clerk session", async () => {
  resetFakes();
  const routes = [
    ["GET", "/messages/users"],
    ["GET", "/messages/conversations"],
    ["GET", `/messages/${B._id}`],
    ["POST", `/messages/send/${B._id}`],
    ["GET", "/auth/check"],
  ];
  for (const [method, path] of routes) {
    const res = await fetch(base + path, { method });
    assert.equal(res.status, 401, `${method} ${path}`);
  }
  assert.equal(savedMessages.length, 0);
});

test("a valid Clerk session without a synced profile gets 404, not data", async () => {
  const res = await fetch(`${base}/messages/users`, { headers: { "x-test-clerk-id": "clerk_unknown" } });
  assert.equal(res.status, 404);
});

// ---- profile privacy ------------------------------------------------------

test("user list returns only public profile fields and excludes the caller", async () => {
  const res = await fetch(`${base}/messages/users`, { headers: asAlice });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(body.map((u) => u._id).sort(), [B._id, C._id]);
  for (const user of body) {
    assert.deepEqual(Object.keys(user).sort(), ["_id", "fullName", "profilePic"]);
    assert.equal("email" in user, false);
    assert.equal("clerkId" in user, false);
  }
});

test("conversation list pipeline ends with a public-fields-only projection", async () => {
  resetFakes();
  const res = await fetch(`${base}/messages/conversations`, { headers: asAlice });
  assert.equal(res.status, 200);
  const last = aggregatePipelines[0].at(-1);
  assert.deepEqual(last, { $project: { _id: 1, fullName: 1, profilePic: 1 } });
});

// ---- recipient validation -------------------------------------------------

test("sending to a malformed recipient ID is rejected with 400 and stores nothing", async () => {
  resetFakes();
  for (const id of ["not-an-id", "123456789012", "z".repeat(24), "%7B%24ne%7D"]) {
    const res = await sendJson(id, { text: "hi" });
    assert.equal(res.status, 400, id);
  }
  assert.equal(savedMessages.length, 0);
});

test("sending to a well-formed but unknown recipient returns 404 and stores nothing", async () => {
  resetFakes();
  const res = await sendJson("f".repeat(24), { text: "hi" });
  assert.equal(res.status, 404);
  assert.equal(savedMessages.length, 0);
});

test("a user cannot message themselves", async () => {
  resetFakes();
  const res = await sendJson(A._id, { text: "note to self" });
  assert.equal(res.status, 400);
  assert.equal(savedMessages.length, 0);
});

test("fetching a thread with a malformed ID returns 400", async () => {
  const res = await fetch(`${base}/messages/not-an-id`, { headers: asAlice });
  assert.equal(res.status, 400);
});

test("empty, non-string and oversized text is rejected", async () => {
  resetFakes();
  assert.equal((await sendJson(B._id, {})).status, 400);
  assert.equal((await sendJson(B._id, { text: "   " })).status, 400);
  assert.equal((await sendJson(B._id, { text: { $ne: "" } })).status, 400);
  assert.equal((await sendJson(B._id, { text: "x".repeat(2001) })).status, 400);
  assert.equal(savedMessages.length, 0);
});

test("a valid message is saved with the authenticated sender and pushed to an online recipient", async () => {
  resetFakes();
  state.online[B._id] = "socket-b";
  const res = await sendJson(B._id, { text: "  hello  ", senderId: C._id });
  assert.equal(res.status, 201);
  assert.equal(savedMessages.length, 1);
  assert.equal(savedMessages[0].senderId, A._id, "sender comes from the session, not the request body");
  assert.equal(savedMessages[0].receiverId, B._id);
  assert.equal(savedMessages[0].text, "hello");
  assert.deepEqual(emitted.map((e) => [e.socketId, e.event]), [["socket-b", "newMessage"]]);
});

test("an offline recipient still gets the message stored, with no socket push", async () => {
  resetFakes();
  const res = await sendJson(B._id, { text: "later" });
  assert.equal(res.status, 201);
  assert.equal(savedMessages.length, 1);
  assert.equal(emitted.length, 0);
});

// ---- upload validation ----------------------------------------------------

test("a PNG upload is accepted, uploaded under its detected type and saved as an image", async () => {
  resetFakes();
  const res = await sendFile(B._id, PNG, "image/png", "photo.png");
  assert.equal(res.status, 201);
  assert.equal(uploads.length, 1);
  assert.equal(uploads[0].mimetype, "image/png");
  assert.match(savedMessages[0].image, /^https:\/\/ik\.example\.test\//);
  assert.equal(savedMessages[0].video, undefined);
});

test("an MP4 upload is accepted and saved as a video", async () => {
  resetFakes();
  const res = await sendFile(B._id, MP4, "video/mp4", "clip.mp4");
  assert.equal(res.status, 201);
  assert.match(savedMessages[0].video, /^https:\/\/ik\.example\.test\//);
  assert.equal(savedMessages[0].image, undefined);
});

test("HTML or script content declared as an image is rejected before any upload", async () => {
  resetFakes();
  const html = Buffer.from("<html><script>alert(1)</script></html>");
  const res = await sendFile(B._id, html, "image/png", "evil.png");
  assert.equal(res.status, 400);
  assert.equal(uploads.length, 0);
  assert.equal(savedMessages.length, 0);
});

test("SVG is rejected even when declared as an image", async () => {
  resetFakes();
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>');
  const res = await sendFile(B._id, svg, "image/svg+xml", "x.svg");
  assert.equal(res.status, 400);
  assert.equal(uploads.length, 0);
});

test("an image declared as video (type mismatch) is rejected", async () => {
  resetFakes();
  const res = await sendFile(B._id, PNG, "video/mp4", "sneaky.mp4");
  assert.equal(res.status, 400);
  assert.equal(uploads.length, 0);
});

test("a non-media declared type is rejected by the upload filter", async () => {
  resetFakes();
  const res = await sendFile(B._id, PNG, "application/pdf", "doc.pdf");
  assert.equal(res.status, 400);
  assert.equal(uploads.length, 0);
});

test("an upload to an unknown recipient is rejected before the file is sent to ImageKit", async () => {
  resetFakes();
  const res = await sendFile("f".repeat(24), PNG, "image/png", "photo.png");
  assert.equal(res.status, 404);
  assert.equal(uploads.length, 0);
});

test("a file over 25 MB returns 413", async () => {
  resetFakes();
  const big = Buffer.concat([PNG, Buffer.alloc(25 * 1024 * 1024)]);
  const res = await sendFile(B._id, big, "image/png", "big.png");
  assert.equal(res.status, 413);
  assert.equal(uploads.length, 0);
});

test("attachments return 503 when ImageKit is not configured", async () => {
  resetFakes();
  state.imageKitConfigured = false;
  const res = await sendFile(B._id, PNG, "image/png", "photo.png");
  assert.equal(res.status, 503);
  assert.equal(savedMessages.length, 0);
});
