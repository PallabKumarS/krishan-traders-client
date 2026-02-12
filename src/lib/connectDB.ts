/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.USE_DATABASE === "local"
    ? process.env.MONGODB_URI_LOCAL!
    : process.env.MONGODB_URI_PROD!;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
