import express from "express";
import cors from "cors";

import "dotenv/config";

import fs from "fs";
import path from "path";

import { clerkMiddleware } from "@clerk/express";
import mongoose from "mongoose";

import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

const PORT = Number(process.env.PORT || 3001);
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:5173";

const publicDir = path.join(process.cwd(), "public");

// it's important that you don't parse the webhook event data, it should be in the raw format
app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhook);

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL.split(",").map((origin) => origin.trim()), credentials: true }));

app.get("/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  const clerkConfigured = Boolean(process.env.CLERK_SECRET_KEY);
  res.status(databaseConnected ? 200 : 503).json({
    ok: databaseConnected,
    service: "nook-api",
    database: databaseConnected ? "connected" : "disconnected",
    authentication: clerkConfigured ? "configured" : "missing CLERK_SECRET_KEY",
    ...(databaseConnected ? {} : { setup: "Set MONGO_URI in backend/.env and start MongoDB." }),
  });
});

if (!process.env.CLERK_SECRET_KEY) {
  console.warn("CLERK_SECRET_KEY is missing. Set it in backend/.env; authentication routes will not be available.");
} else {
  app.use(clerkMiddleware());
}

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// if the public directory exists, serve the static files
// this is for the production build
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

server.listen(PORT, async () => {
  console.log("Server is up and running on PORT:", PORT);

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing. API health will report the database as disconnected until backend/.env is configured.");
  } else {
    await connectDB();
  }

  if (process.env.NODE_ENV === "production") job.start();
});
