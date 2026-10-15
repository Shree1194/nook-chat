import express from "express";
import http from "http";
import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const allowedOrigin = (process.env.FRONTEND_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

const io = new Server(server, { cors: { origin: allowedOrigin, credentials: true } });

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// online users map = { userId: socketId }
const userSocketMap = {};

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!token || !secretKey) {
    next(new Error("Unauthorized"));
    return;
  }

  try {
    const claims = await verifyToken(token, { secretKey });
    if (!claims.sub) {
      next(new Error("Unauthorized"));
      return;
    }

    const user = await User.findOne({ clerkId: claims.sub }).select("_id");
    if (!user) {
      next(new Error("User profile is not synced yet"));
      return;
    }

    socket.data.userId = String(user._id);
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;

  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() sends event to everyone - broadcast
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on is used to listen for events
  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId] === socket.id) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io, getReceiverSocketId };
