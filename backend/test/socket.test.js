// Socket.IO handshake authentication, using the real socket module and a real client.
import { test, mock, before, after } from "node:test";
import assert from "node:assert/strict";
import { io as connect } from "socket.io-client";

const here = (path) => new URL(path, import.meta.url).href;
const A = { _id: "a".repeat(24), clerkId: "clerk_a" };

process.env.CLERK_SECRET_KEY = "sk_test_placeholder";
process.env.FRONTEND_URL = "http://localhost:5173";

mock.module("@clerk/backend", {
  namedExports: {
    verifyToken: async (token) => {
      if (token === "valid-a") return { sub: "clerk_a" };
      if (token === "valid-unsynced") return { sub: "clerk_unsynced" };
      if (token === "no-sub") return {};
      throw new Error("bad token");
    },
  },
});
mock.module(here("../src/models/user.model.js"), {
  defaultExport: { findOne: ({ clerkId }) => ({ select: async () => (clerkId === A.clerkId ? { _id: A._id } : null) }) },
});

let server;
let url;

before(async () => {
  ({ server } = await import("../src/lib/socket.js"));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  url = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.closeAllConnections?.();
  return new Promise((resolve) => server.close(resolve));
});

function attempt(auth) {
  return new Promise((resolve) => {
    const socket = connect(url, { auth, reconnection: false, transports: ["websocket"] });
    socket.on("connect_error", (error) => { socket.close(); resolve({ ok: false, message: error.message }); });
    socket.on("getOnlineUsers", (ids) => { socket.close(); resolve({ ok: true, ids }); });
  });
}

test("handshake without a token is refused", async () => {
  assert.deepEqual(await attempt({}), { ok: false, message: "Unauthorized" });
});

test("handshake with an invalid token is refused", async () => {
  assert.deepEqual(await attempt({ token: "forged" }), { ok: false, message: "Unauthorized" });
});

test("a verified token without a subject is refused", async () => {
  assert.equal((await attempt({ token: "no-sub" })).ok, false);
});

test("a verified token for a user whose profile is not synced is refused", async () => {
  const result = await attempt({ token: "valid-unsynced" });
  assert.equal(result.ok, false);
  assert.match(result.message, /not synced/);
});

test("a verified, synced user connects and appears in the online list", async () => {
  const result = await attempt({ token: "valid-a" });
  assert.equal(result.ok, true);
  assert.deepEqual(result.ids, [A._id]);
});
