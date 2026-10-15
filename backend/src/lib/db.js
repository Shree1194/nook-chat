import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) throw new Error("MONGO_URI is required. Set it in backend/.env (see backend/.env.example). Use a MongoDB connection string such as mongodb://127.0.0.1:27017/nook_chat.");

    const conn = await mongoose.connect(mongoUri);

    console.log("MongoDB connected", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    return false;
  }
}
